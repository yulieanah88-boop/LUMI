// Web Audio API based Sound Synthesizer for MPI Lumi
// Completely self-contained: no external audio dependencies that can fail!
// Features cheerful, professional, educational generative backsound music

type AudioStateListener = () => void;
export type BacksoundTheme = 'ceria' | 'lofi' | 'petualangan';

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Backsound Engine State
  private isBacksoundPlaying: boolean = false;
  private isBacksoundEnabled: boolean = true;
  private backsoundTheme: BacksoundTheme = 'ceria';
  private backsoundVolume: number = 0.25; // 0.0 to 1.0 (default 0.25 is balanced & pleasant)
  private isDucked: boolean = false; // Ducking during speech or video
  private schedulerTimerId: number | null = null;
  private nextNoteTime: number = 0;
  private currentSubBeat: number = 0;
  private backsoundMasterGain: GainNode | null = null;
  private backsoundCompressor: DynamicsCompressorNode | null = null;

  // Hover SFX throttle
  private lastHoverTime: number = 0;

  // Subscribers for state changes
  private listeners: Set<AudioStateListener> = new Set();

  constructor() {
    try {
      const savedMute = localStorage.getItem('mpi_lumi_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedBacksound = localStorage.getItem('mpi_lumi_backsound');
      if (savedBacksound !== null) {
        this.isBacksoundEnabled = savedBacksound === 'true';
      }
      const savedTheme = localStorage.getItem('mpi_lumi_backsound_theme') as BacksoundTheme;
      if (savedTheme && ['ceria', 'lofi', 'petualangan'].includes(savedTheme)) {
        this.backsoundTheme = savedTheme;
      }
      const savedVol = localStorage.getItem('mpi_lumi_backsound_volume');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.backsoundVolume = parsed;
        }
      }
    } catch {
      // Ignore localStorage restrictions
    }
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch {
        // Ignore subscriber errors
      }
    });
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('mpi_lumi_muted', String(muted));
    } catch {
      // Ignore
    }

    if (muted) {
      if (this.isBacksoundPlaying) {
        this.stopBacksound();
      }
    } else {
      if (this.isBacksoundEnabled && !this.isBacksoundPlaying) {
        this.startBacksound();
      }
    }
    this.notify();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // ==========================================
  // BACKSOUND CONTROL APIS
  // ==========================================

  public getBacksoundPlaying(): boolean {
    return this.isBacksoundPlaying;
  }

  public getBacksoundEnabled(): boolean {
    return this.isBacksoundEnabled;
  }

  public setBacksoundEnabled(enabled: boolean) {
    this.isBacksoundEnabled = enabled;
    try {
      localStorage.setItem('mpi_lumi_backsound', String(enabled));
    } catch {
      // Ignore
    }

    if (enabled && !this.isBacksoundPlaying && !this.isMuted) {
      this.startBacksound();
    } else if (!enabled && this.isBacksoundPlaying) {
      this.stopBacksound();
    }
    this.notify();
  }

  public toggleBacksound(): boolean {
    const nextState = !this.isBacksoundEnabled;
    this.setBacksoundEnabled(nextState);
    return nextState;
  }

  // Backward-compatibility aliases
  public getBgmPlaying(): boolean {
    return this.isBacksoundPlaying;
  }

  public toggleBGM(): boolean {
    return this.toggleBacksound();
  }

  public startBGM() {
    this.startBacksound();
  }

  public stopBGM() {
    this.stopBacksound();
  }

  public getAmbientPlaying(): boolean {
    return this.isBacksoundPlaying;
  }

  public getAmbientEnabled(): boolean {
    return this.isBacksoundEnabled;
  }

  public setAmbientEnabled(enabled: boolean) {
    this.setBacksoundEnabled(enabled);
  }

  public toggleAmbient(): boolean {
    return this.toggleBacksound();
  }

  public startAmbient() {
    this.startBacksound();
  }

  public stopAmbient() {
    this.stopBacksound();
  }

  public getBacksoundVolume(): number {
    return this.backsoundVolume;
  }

  public setBacksoundVolume(vol: number) {
    this.backsoundVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('mpi_lumi_backsound_volume', String(this.backsoundVolume));
    } catch {
      // Ignore
    }

    if (this.backsoundMasterGain && this.ctx) {
      const targetGain = this.isDucked ? this.backsoundVolume * 0.22 : this.backsoundVolume;
      try {
        const now = this.ctx.currentTime;
        this.backsoundMasterGain.gain.setValueAtTime(this.backsoundMasterGain.gain.value, now);
        this.backsoundMasterGain.gain.exponentialRampToValueAtTime(
          Math.max(0.0001, targetGain),
          now + 0.2
        );
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  public getBacksoundTheme(): BacksoundTheme {
    return this.backsoundTheme;
  }

  public setBacksoundTheme(theme: BacksoundTheme, autoPlay: boolean = false) {
    this.backsoundTheme = theme;
    try {
      localStorage.setItem('mpi_lumi_backsound_theme', theme);
    } catch {
      // Ignore
    }

    if (autoPlay || this.isBacksoundPlaying) {
      if (this.isMuted) {
        this.isMuted = false;
        try {
          localStorage.setItem('mpi_lumi_muted', 'false');
        } catch {
          // Ignore
        }
      }
      this.isBacksoundEnabled = true;
      try {
        localStorage.setItem('mpi_lumi_backsound', 'true');
      } catch {
        // Ignore
      }
      this.stopBacksound();
      this.startBacksound();
    }
    this.notify();
  }

  public duckBacksound(duck: boolean) {
    this.isDucked = duck;
    if (this.backsoundMasterGain && this.ctx && this.isBacksoundPlaying && !this.isMuted) {
      try {
        const now = this.ctx.currentTime;
        const targetGain = duck ? this.backsoundVolume * 0.22 : this.backsoundVolume;
        this.backsoundMasterGain.gain.setValueAtTime(this.backsoundMasterGain.gain.value, now);
        this.backsoundMasterGain.gain.exponentialRampToValueAtTime(
          Math.max(0.0001, targetGain),
          now + 0.35
        );
      } catch {
        // Ignore
      }
    }
  }

  // ==========================================
  // BACKSOUND MUSIC SCHEDULER & SYNTHESIZER
  // ==========================================

  public startBacksound() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.isMuted) {
      this.isMuted = false;
      try {
        localStorage.setItem('mpi_lumi_muted', 'false');
      } catch {
        // Ignore
      }
    }
    this.isBacksoundEnabled = true;

    if (this.backsoundVolume < 0.05) {
      this.backsoundVolume = 0.25;
    }

    if (this.isBacksoundPlaying) return;

    this.isBacksoundPlaying = true;
    this.notify();

    try {
      // 1. Studio-grade Dynamics Compressor for smooth, professional warmth
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      compressor.knee.setValueAtTime(25, this.ctx.currentTime);
      compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
      compressor.attack.setValueAtTime(0.015, this.ctx.currentTime);
      compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
      compressor.connect(this.ctx.destination);
      this.backsoundCompressor = compressor;

      // 2. Master Gain for Backsound with smooth fade-in
      const masterGain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, this.isDucked ? this.backsoundVolume * 0.22 : this.backsoundVolume),
        now + 0.9
      );
      masterGain.connect(compressor);
      this.backsoundMasterGain = masterGain;

      // 3. Lookahead scheduling loop
      this.currentSubBeat = 0;
      this.nextNoteTime = now + 0.05;

      const scheduleLookahead = () => {
        if (!this.ctx || !this.isBacksoundPlaying || this.isMuted) return;

        // Schedule notes up to 140ms into the future
        while (this.nextNoteTime < this.ctx.currentTime + 0.16) {
          this.scheduleSubBeat(this.currentSubBeat, this.nextNoteTime, masterGain);

          const subBeatDuration = this.getSubBeatDuration();
          this.nextNoteTime += subBeatDuration;
          this.currentSubBeat = (this.currentSubBeat + 1) % 32; // 32 sub-beats = 4 bars
        }
      };

      scheduleLookahead();
      this.schedulerTimerId = window.setInterval(scheduleLookahead, 45);
    } catch {
      this.isBacksoundPlaying = false;
      this.notify();
    }
  }

  public stopBacksound() {
    this.isBacksoundPlaying = false;
    this.notify();

    if (this.schedulerTimerId !== null) {
      clearInterval(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }

    if (this.backsoundMasterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.backsoundMasterGain.gain.setValueAtTime(this.backsoundMasterGain.gain.value, now);
        this.backsoundMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      } catch {
        // Ignore
      }
    }

    setTimeout(() => {
      this.backsoundMasterGain = null;
      this.backsoundCompressor = null;
    }, 450);
  }

  private getSubBeatDuration(): number {
    switch (this.backsoundTheme) {
      case 'lofi':
        // 82 BPM -> beat = 0.7317s -> 8th sub-beat = 0.3658s
        return 0.3658;
      case 'petualangan':
        // 116 BPM -> beat = 0.5172s -> 8th sub-beat = 0.2586s
        return 0.2586;
      case 'ceria':
      default:
        // 106 BPM -> upbeat, joyful walking tempo -> sub-beat = 0.283s
        return 0.283;
    }
  }

  // Schedule musical notes at exact hardware audio time
  private scheduleSubBeat(subBeat: number, time: number, masterGain: GainNode) {
    if (!this.ctx) return;

    if (this.backsoundTheme === 'ceria') {
      this.playCeriaSubBeat(subBeat, time, masterGain);
    } else if (this.backsoundTheme === 'lofi') {
      this.playLofiSubBeat(subBeat, time, masterGain);
    } else {
      this.playPetualanganSubBeat(subBeat, time, masterGain);
    }
  }

  // =========================================================================
  // THEME 1: CERIA BELAJAR (Joyful, Playful & Professional Educational Music)
  // Key: C Major / G / Am / F (The classic uplifting, joyful learning melody)
  // =========================================================================
  private playCeriaSubBeat(subBeat: number, time: number, masterGain: GainNode) {
    const bar = Math.floor(subBeat / 8);
    const beatInBar = subBeat % 8;

    // 1. Acoustic Strummed Chords (Downbeats)
    if (beatInBar === 0) {
      if (bar === 0) {
        // Bar 1: C Major 9 (C3, G3, B3, D4, E4)
        this.playAcousticStrum([130.81, 196.0, 246.94, 293.66, 329.63], time, 2.1, 0.085, masterGain);
        this.playAcousticBass(65.41, time, 0.5, 0.18, masterGain); // C2
      } else if (bar === 1) {
        // Bar 2: G Major (B2, D3, G3, B3, D4)
        this.playAcousticStrum([123.47, 146.83, 196.0, 246.94, 293.66], time, 2.1, 0.085, masterGain);
        this.playAcousticBass(98.0, time, 0.5, 0.18, masterGain); // G2
      } else if (bar === 2) {
        // Bar 3: A Minor 7 (A2, E3, G3, C4, E4)
        this.playAcousticStrum([110.0, 164.81, 196.0, 261.63, 329.63], time, 2.1, 0.085, masterGain);
        this.playAcousticBass(55.0, time, 0.5, 0.18, masterGain); // A1
      } else {
        // Bar 4: F Major add9 (F2, C3, G3, A3, C4)
        this.playAcousticStrum([87.31, 130.81, 196.0, 220.0, 261.63], time, 2.1, 0.085, masterGain);
        this.playAcousticBass(43.65, time, 0.5, 0.18, masterGain); // F1
      }
    } else if (beatInBar === 4) {
      // Secondary bouncy bass on beat 3
      const syncopatedBass = [98.0, 73.42, 82.41, 65.41]; // G2, D2, E2, C2
      this.playAcousticBass(syncopatedBass[bar], time, 0.38, 0.14, masterGain);
    } else if (beatInBar === 6) {
      // Light bass walk-up on 8th note
      const walkBass = [110.0, 87.31, 73.42, 58.27];
      this.playAcousticBass(walkBass[bar], time, 0.25, 0.09, masterGain);
    }

    // 2. Playful Percussion (Gentle Woodblock on 2 & 4, Soft Shaker on 8ths)
    if (subBeat % 2 === 0) {
      this.playShaker(time, 0.022, masterGain);
    }
    if (beatInBar === 2 || beatInBar === 6) {
      // Soft woodblock tap on beats 2 and 4 for happy bounce
      this.playWoodblock(time, 0.038, masterGain);
    }

    // 3. Cheerful, Hummable Educational Melody (Marimba / Glockenspiel)
    // Notes: C4=261.63, D4=293.66, E4=329.63, G4=392.0, A4=440.0, B4=493.88, C5=523.25, D5=587.33, E5=659.25
    const melodyMap: { [sb: number]: { f: number; d: number } } = {
      // Bar 1: Bright opening phrase
      0: { f: 392.0, d: 0.28 }, // G4
      2: { f: 329.63, d: 0.24 }, // E4
      3: { f: 392.0, d: 0.24 }, // G4
      4: { f: 523.25, d: 0.38 }, // C5 (joyful jump!)
      6: { f: 440.0, d: 0.28 }, // A4

      // Bar 2: Answering motif
      8: { f: 392.0, d: 0.28 }, // G4
      10: { f: 329.63, d: 0.24 }, // E4
      11: { f: 349.23, d: 0.24 }, // F4
      12: { f: 392.0, d: 0.35 }, // G4
      14: { f: 293.66, d: 0.28 }, // D4

      // Bar 3: Climactic uplifting line
      16: { f: 440.0, d: 0.28 }, // A4
      18: { f: 523.25, d: 0.24 }, // C5
      19: { f: 587.33, d: 0.24 }, // D5
      20: { f: 659.25, d: 0.42 }, // E5 (brightest high note!)
      22: { f: 587.33, d: 0.28 }, // D5

      // Bar 4: Sweet resolution
      24: { f: 523.25, d: 0.28 }, // C5
      26: { f: 440.0, d: 0.24 }, // A4
      27: { f: 392.0, d: 0.24 }, // G4
      28: { f: 329.63, d: 0.32 }, // E4
      30: { f: 261.63, d: 0.45 }, // C4 (home note)
    };

    if (melodyMap[subBeat]) {
      const note = melodyMap[subBeat];
      this.playMarimba(note.f, time, note.d, 0.15, masterGain);
    }
  }

  // =========================================================================
  // THEME 2: PETUALANGAN WAKTU (Clockwork Explorer, Inspiring & Dynamic)
  // =========================================================================
  private playPetualanganSubBeat(subBeat: number, time: number, masterGain: GainNode) {
    const bar = Math.floor(subBeat / 8);
    const beatInBar = subBeat % 8;

    if (beatInBar === 0) {
      // Progress: G -> D -> Em -> C (Inspiring Explorer)
      const advChords = [
        [196.0, 246.94, 293.66, 392.0], // G
        [146.83, 220.0, 293.66, 369.99], // D
        [164.81, 196.0, 246.94, 329.63], // Em
        [130.81, 164.81, 196.0, 261.63], // C
      ];
      this.playAcousticStrum(advChords[bar], time, 1.9, 0.08, masterGain);
      const advBass = [98.0, 73.42, 82.41, 65.41];
      this.playAcousticBass(advBass[bar], time, 0.45, 0.18, masterGain);
    }

    // Steady clockwork pulse
    this.playShaker(time, subBeat % 2 === 0 ? 0.026 : 0.014, masterGain);

    // Arpeggio motif (Glockenspiel)
    const arpNotes = [
      [392.0, 493.88, 587.33, 493.88, 392.0, 493.88, 587.33, 659.25], // G bar
      [293.66, 369.99, 440.0, 369.99, 293.66, 369.99, 440.0, 493.88], // D bar
      [329.63, 392.0, 493.88, 392.0, 329.63, 392.0, 493.88, 587.33], // Em bar
      [261.63, 329.63, 392.0, 523.25, 493.88, 392.0, 329.63, 293.66], // C bar
    ];

    const freq = arpNotes[bar][beatInBar];
    if (freq) {
      this.playMarimba(freq, time, 0.22, 0.11, masterGain);
    }
  }

  // =========================================================================
  // THEME 3: LOFI SANTAI (Warm Rhodes Piano, Tranquil Study Focus)
  // =========================================================================
  private playLofiSubBeat(subBeat: number, time: number, masterGain: GainNode) {
    const bar = Math.floor(subBeat / 8);
    const beatInBar = subBeat % 8;

    if (beatInBar === 0) {
      // Progression: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
      const lofiChords = [
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [164.81, 196.0, 246.94, 293.66], // Em7
        [146.83, 174.61, 220.0, 261.63], // Dm7
        [130.81, 164.81, 196.0, 246.94], // Cmaj7
      ];
      const lofiBass = [87.31, 82.41, 73.42, 65.41];

      this.playAcousticStrum(lofiChords[bar], time, 2.7, 0.075, masterGain);
      this.playAcousticBass(lofiBass[bar], time, 0.65, 0.15, masterGain);
    }

    // Soft chime sparkle
    const lofiSparkle: { [sb: number]: number } = {
      2: 523.25,
      5: 440.0,
      10: 493.88,
      13: 392.0,
      18: 440.0,
      21: 349.23,
      26: 392.0,
      29: 261.63,
    };

    if (lofiSparkle[subBeat]) {
      this.playMarimba(lofiSparkle[subBeat], time, 0.45, 0.09, masterGain);
    }
  }

  // ==========================================
  // SYNTHESIZER VOICES & PHYSICAL MODELING
  // ==========================================

  // Voice 1: Marimba / Kalimba / Glockenspiel (Rich multi-harmonic wooden percussion)
  private playMarimba(freq: number, time: number, duration: number, gainVal: number, destination: GainNode) {
    if (!this.ctx) return;

    try {
      const oscFundamental = this.ctx.createOscillator();
      const oscOvertone = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm acoustic lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(3200, freq * 3.5), time);

      // Fundamental sine wave
      oscFundamental.type = 'sine';
      oscFundamental.frequency.setValueAtTime(freq, time);

      // 4th harmonic (wooden marimba characteristic)
      oscOvertone.type = 'triangle';
      oscOvertone.frequency.setValueAtTime(freq * 3.98, time);

      // Fast percussive attack, organic smooth decay
      gainNode.gain.setValueAtTime(0.0001, time);
      gainNode.gain.exponentialRampToValueAtTime(gainVal, time + 0.006);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      oscFundamental.connect(gainNode);
      oscOvertone.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(destination);

      oscFundamental.start(time);
      oscOvertone.start(time);
      oscFundamental.stop(time + duration + 0.03);
      oscOvertone.stop(time + duration + 0.03);
    } catch {
      // Ignore
    }
  }

  // Voice 2: Acoustic Strummed Chords (Warm ukulele / piano strum with humanized stagger)
  private playAcousticStrum(frequencies: number[], time: number, duration: number, gainVal: number, destination: GainNode) {
    if (!this.ctx) return;

    try {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, time);
      filter.Q.setValueAtTime(1.2, time);

      // Stagger each note slightly by 18ms for that natural acoustic guitar/ukulele strum feeling!
      frequencies.forEach((freq, idx) => {
        const noteTime = time + idx * 0.018;
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        noteGain.gain.setValueAtTime(0.0001, noteTime);
        noteGain.gain.linearRampToValueAtTime(gainVal / frequencies.length * 1.8, noteTime + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

        osc.connect(noteGain);
        noteGain.connect(filter);

        osc.start(noteTime);
        osc.stop(noteTime + duration + 0.05);
      });

      filter.connect(destination);
    } catch {
      // Ignore
    }
  }

  // Voice 3: Acoustic Bouncy Bass (Warm, resonant round bassline)
  private playAcousticBass(freq: number, time: number, duration: number, gainVal: number, destination: GainNode) {
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(freq, time);

      gainNode.gain.setValueAtTime(0.0001, time);
      gainNode.gain.exponentialRampToValueAtTime(gainVal, time + 0.012);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gainNode);
      oscSub.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(destination);

      osc.start(time);
      oscSub.start(time);
      osc.stop(time + duration + 0.02);
      oscSub.stop(time + duration + 0.02);
    } catch {
      // Ignore
    }
  }

  // Voice 4: Woodblock / Rimshot Tap (Cheerful educational percussion)
  private playWoodblock(time: number, gainVal: number, destination: GainNode) {
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, time);
      osc.frequency.exponentialRampToValueAtTime(440, time + 0.028);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(gainVal, time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(time);
      osc.stop(time + 0.04);
    } catch {
      // Ignore
    }
  }

  // Voice 5: Organic Shaker (Soft high-frequency rhythmic brush)
  private playShaker(time: number, gainVal: number, destination: GainNode) {
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gainNode = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, time);
      osc.frequency.exponentialRampToValueAtTime(800, time + 0.025);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(950, time);

      gainNode.gain.setValueAtTime(0.0001, time);
      gainNode.gain.exponentialRampToValueAtTime(gainVal, time + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.028);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(destination);

      osc.start(time);
      osc.stop(time + 0.032);
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // SOUND EFFECTS (SFX)
  // ==========================================

  // onHover: Soft, crystal chime sound for buttons & love menu cards
  public playHover() {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastHoverTime < 70) return;
    this.lastHoverTime = now;

    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1174, this.ctx.currentTime + 0.06); // A5 -> D6

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, this.ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Ignore
    }
  }

  // onClick: Juicy, rounded button click sound
  public playMenuClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(960, t + 0.04);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // Ignore
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Ignore
    }
  }

  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25]; // C5, E5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = this.ctx!.currentTime + idx * 0.09;
        const endTime = startTime + 0.22;

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // Ignore
    }
  }

  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // Ignore
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const melody = [
        { freq: 523.25, dur: 0.12 }, // C5
        { freq: 659.25, dur: 0.12 }, // E5
        { freq: 783.99, dur: 0.12 }, // G5
        { freq: 1046.5, dur: 0.35 }, // C6
      ];

      let t = this.ctx.currentTime;
      melody.forEach((note) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.value = note.freq;

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + note.dur);
        t += note.dur + 0.04;
      });
    } catch {
      // Ignore
    }
  }

  public playWhoosh() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Ignore
    }
  }

  public playTick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignore
    }
  }

  public playTimeUp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [440, 349.23, 293.66]; // A4, F4, D4
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = this.ctx!.currentTime + idx * 0.14;
        const endTime = startTime + 0.3;

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundSystem();
