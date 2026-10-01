// Web Speech API Text-to-Speech Helper for MPI Lumi IPAS SD Kelas 3

type SpeechListener = (speakingId: string | null) => void;

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private isVoiceLoaded: boolean = false;
  private currentId: string | null = null;
  private currentOnEnd: (() => void) | null = null;
  private listeners: Set<SpeechListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize Indonesian voices: 'id-ID', 'id_ID', or names containing 'indonesia'
    const idVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('id') ||
        v.name.toLowerCase().includes('indonesia') ||
        v.lang.startsWith('id')
    );
    if (idVoice) {
      this.indonesianVoice = idVoice;
    }
    this.isVoiceLoaded = true;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener(this.currentId);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.currentId));
  }

  public getCurrentId(): string | null {
    return this.currentId;
  }

  public speak(
    text: string,
    id: string = 'global',
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (!this.synth) return;

    // If already speaking this ID, toggle it off
    if (this.currentId === id && this.synth.speaking) {
      this.stop();
      return;
    }

    // Stop any ongoing speech
    this.stop();

    // Clean up emojis and weird symbols that might read out awkwardly for 3rd graders
    const cleanText = text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[➔➜➝•·#*~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.92; // Slightly gentler pace for grade 3 primary school students
    utterance.pitch = 1.05; // Friendly and warm pitch

    if (this.indonesianVoice) {
      utterance.voice = this.indonesianVoice;
    }

    this.currentId = id;
    this.currentOnEnd = onEnd || null;
    this.notify();

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      this.cleanup();
      onEnd?.();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        onError?.();
      }
      this.cleanup();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  private cleanup() {
    this.currentUtterance = null;
    this.currentId = null;
    this.currentOnEnd = null;
    this.notify();
  }

  public stop() {
    if (this.synth) {
      const cb = this.currentOnEnd;
      this.synth.cancel();
      this.currentUtterance = null;
      this.currentId = null;
      this.currentOnEnd = null;
      this.notify();
      cb?.();
    }
  }

  public isSpeaking(id?: string): boolean {
    if (!this.synth || !this.synth.speaking) return false;
    if (id !== undefined) {
      return this.currentId === id;
    }
    return true;
  }
}

export const speech = new SpeechService();
