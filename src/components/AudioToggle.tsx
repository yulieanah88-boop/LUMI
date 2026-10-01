import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, Music, Sliders, X, Check, Sparkles, Play, Pause } from 'lucide-react';
import { sound, BacksoundTheme } from '../utils/audio';

interface AudioToggleProps {
  showAmbientToggle?: boolean;
}

export const AudioToggle: React.FC<AudioToggleProps> = () => {
  const [isPlaying, setIsPlaying] = useState(sound.getBacksoundPlaying());
  const [isEnabled, setIsEnabled] = useState(sound.getBacksoundEnabled());
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [volume, setVolume] = useState(sound.getBacksoundVolume());
  const [theme, setTheme] = useState<BacksoundTheme>(sound.getBacksoundTheme());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = sound.subscribe(() => {
      setIsPlaying(sound.getBacksoundPlaying());
      setIsEnabled(sound.getBacksoundEnabled());
      setIsMuted(sound.getMuted());
      setVolume(sound.getBacksoundVolume());
      setTheme(sound.getBacksoundTheme());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleBacksound = () => {
    sound.initContext();
    sound.playClick();
    if (isMuted) {
      sound.setMuted(false);
    }
    sound.toggleBacksound();
  };

  const handleToggleMute = () => {
    sound.initContext();
    sound.playClick();
    sound.setMuted(!isMuted);
  };

  const handleChangeTheme = (newTheme: BacksoundTheme) => {
    sound.initContext();
    sound.playClick();
    setTheme(newTheme);
    // autoPlay = true so user immediately hears the chosen theme!
    sound.setBacksoundTheme(newTheme, true);
  };

  const handleVolumeChange = (newVol: number) => {
    sound.initContext();
    setVolume(newVol);
    sound.setBacksoundVolume(newVol);
    // If backsound was enabled but paused, start it so user can hear the volume change
    if (sound.getBacksoundEnabled() && !sound.getBacksoundPlaying() && !sound.getMuted()) {
      sound.startBacksound();
    }
  };

  const handleStartMusic = () => {
    sound.initContext();
    sound.playClick();
    sound.startBacksound();
  };

  const handlePauseMusic = () => {
    sound.playClick();
    sound.stopBacksound();
  };

  const themeOptions: {
    id: BacksoundTheme;
    label: string;
    badge: string;
    icon: string;
    desc: string;
  }[] = [
    {
      id: 'ceria',
      label: 'Ceria Belajar (Rekomendasi Utama)',
      badge: 'Favorit Siswa SD',
      icon: '🌟',
      desc: 'Melodi marimba ceria & petikan akord hangat yang membangkitkan semangat belajar anak',
    },
    {
      id: 'petualangan',
      label: 'Petualangan Waktu',
      badge: 'Inspiratif & Dinamis',
      icon: '🚀',
      desc: 'Irama ritmis arpeggio mesin waktu yang seru untuk menemani eksplorasi materi',
    },
    {
      id: 'lofi',
      label: 'Lofi Santai & Tenang',
      badge: 'Fokus Membaca',
      icon: '☕',
      desc: 'Nada piano elektrik yang lembut dan menenangkan, cocok saat membaca teks dan refleksi',
    },
  ];

  return (
    <>
      {/* Mini Bar Controller (In-Header or Floating Button) */}
      <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-rose-200/80 text-xs font-medium text-slate-700 relative z-30">
        {/* Main Backsound Toggle Button */}
        <button
          type="button"
          onClick={handleToggleBacksound}
          onMouseEnter={() => sound.playHover()}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer font-bold select-none active:scale-95 ${
            isPlaying && !isMuted
              ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-xs ring-2 ring-rose-300'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
          title={
            isPlaying && !isMuted
              ? 'Musik Backsound Sedang Berputar (Klik untuk jeda)'
              : 'Nyalakan Musik Backsound Ceria'
          }
        >
          {isPlaying && !isMuted ? (
            /* Animated Equalizer Bars */
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 py-0.5">
              <span
                className="w-1 bg-white rounded-full animate-bounce h-2"
                style={{ animationDuration: '0.6s' }}
              />
              <span
                className="w-1 bg-white rounded-full animate-bounce h-3.5"
                style={{ animationDuration: '0.4s' }}
              />
              <span
                className="w-1 bg-white rounded-full animate-bounce h-2.5"
                style={{ animationDuration: '0.5s' }}
              />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span className="hidden sm:inline">Backsound:</span>
          <span>{isPlaying && !isMuted ? 'On' : 'Off'}</span>
        </button>

        {/* Settings Button: Opens High-Z-Index Full Modal */}
        <button
          type="button"
          onClick={() => {
            sound.initContext();
            sound.playClick();
            setIsSettingsOpen(true);
          }}
          onMouseEnter={() => sound.playHover()}
          className="p-1.5 rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
          title="Buka Pengaturan Musik & Volume Backsound"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Master Mute Button */}
        <button
          type="button"
          onClick={handleToggleMute}
          onMouseEnter={() => sound.playHover()}
          className={`p-1.5 rounded-full transition-colors cursor-pointer active:scale-95 flex items-center justify-center ${
            isMuted
              ? 'text-rose-500 bg-rose-50'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
          }`}
          title={isMuted ? 'Batal Bisu (Aktifkan Suara)' : 'Bisukan Semua Suara'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* FULL MODAL MOUNTED VIA PORTAL DIRECTLY TO DOCUMENT.BODY */}
      {/* This guarantees the modal is on top of ALL MPI elements, never behind anything, and 100% clickable! */}
      {isSettingsOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* 1. Backdrop (Click to close) */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
              onClick={() => {
                sound.playClick();
                setIsSettingsOpen(false);
              }}
              title="Klik di luar untuk menutup"
            />

            {/* 2. Modal Dialog Container (Centered, elevated, independent of parent layout) */}
            <div
              role="dialog"
              aria-modal="true"
              className="relative z-10 bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-rose-300 text-slate-800 my-auto max-h-[92vh] overflow-y-auto pointer-events-auto select-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-800 flex items-center gap-1.5 font-display">
                      <span>Pengaturan Musik Backsound</span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pilih lagu ceria dan atur volume musik sesuai kenyamanan
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsSettingsOpen(false);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  title="Tutup Pengaturan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & Quick Play/Pause Control Card */}
              <div className="p-3.5 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-2xl border border-rose-200/80 mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-xs transition-transform ${
                      isPlaying && !isMuted ? 'bg-rose-500 scale-105 shadow-rose-200' : 'bg-slate-400'
                    }`}
                  >
                    {isPlaying && !isMuted ? (
                      <Music className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Pause className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-800">
                      Status: {isPlaying && !isMuted ? 'Musik Berputar 🎵' : 'Musik Dijeda / Mati'}
                    </div>
                    <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                      <span>
                        Lagu Aktif: {themeOptions.find((t) => t.id === theme)?.label.split('(')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {isPlaying && !isMuted ? (
                  <button
                    type="button"
                    onClick={handlePauseMusic}
                    onMouseEnter={() => sound.playHover()}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Jeda Lagu</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartMusic}
                    onMouseEnter={() => sound.playHover()}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Putar Musik</span>
                  </button>
                )}
              </div>

              {/* Volume Slider & Presets */}
              <div className="mb-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-rose-500" />
                    Kekuatan Volume Backsound:
                  </span>
                  <span className="font-mono font-extrabold text-rose-600 bg-white px-2.5 py-0.5 rounded-lg border border-rose-200 text-xs shadow-2xs">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-between gap-1.5 pt-1">
                  {[
                    { label: 'Lembut (15%)', val: 0.15 },
                    { label: 'Standar (25%)', val: 0.25 },
                    { label: 'Ceria (40%)', val: 0.4 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleVolumeChange(p.val)}
                      onMouseEnter={() => sound.playHover()}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-xl border transition cursor-pointer active:scale-95 ${
                        Math.abs(volume - p.val) < 0.04
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilihan 3 Lagu Ceria & Profesional */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                  Pilih Lagu Backsound Ceria &amp; Profesional:
                </span>

                <div className="space-y-2">
                  {themeOptions.map((opt) => {
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleChangeTheme(opt.id)}
                        onMouseEnter={() => sound.playHover()}
                        className={`w-full text-left p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between relative active:scale-98 ${
                          isSelected
                            ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-200 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-0.5">{opt.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                                {opt.label}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  isSelected
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {opt.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {opt.desc}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 ml-2 shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold px-2 py-1 bg-slate-100 rounded-lg shrink-0 ml-2">
                            Pilih
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Smart Audio Note */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-800 leading-relaxed flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-ping" />
                <span>
                  <strong>Smart Audio:</strong> Musik backsound otomatis mengecil lembut saat komputer
                  membacakan narasi suara (TTS) agar penjelasan materi terdengar jelas.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  onMouseEnter={() => sound.playHover()}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isMuted
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isMuted ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Batal Bisu Suara</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Bisukan Suara</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsSettingsOpen(false);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan &amp; Tutup</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
