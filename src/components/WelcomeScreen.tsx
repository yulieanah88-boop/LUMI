import React from 'react';
import { Play, Sparkles, Heart, HelpCircle, Layers } from 'lucide-react';
import { sound } from '../utils/audio';
import { AudioToggle } from './AudioToggle';
import { ThemeConfig } from '../types';

interface WelcomeScreenProps {
  theme?: ThemeConfig;
  onStart: () => void;
  onOpenPromptGuide: () => void;
  onSelectTheme?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  theme,
  onStart,
  onOpenPromptGuide,
  onSelectTheme,
}) => {
  const handleStartClick = () => {
    sound.initContext();
    if (sound.getBacksoundEnabled() && !sound.getMuted() && !sound.getBacksoundPlaying()) {
      sound.startBacksound();
    }
    sound.playMenuClick();
    sound.playWhoosh();
    onStart();
  };

  const title = theme?.judulTema || 'Dahulu, Kini, dan Nanti';
  const subtitle = theme?.subJudul || 'Perjalanan Waktu & Perkembangan Kehidupan Manusia';
  const subjectAndGrade = theme
    ? `${theme.mataPelajaran} • ${theme.kelas} • Kurikulum Merdeka`
    : 'Ilmu Pengetahuan Alam dan Sosial (IPAS) SD Kelas III • Kurikulum Merdeka';

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-radial from-rose-100 via-pink-50 to-amber-50 relative overflow-hidden select-none">
      {/* Decorative Floating Hearts & Elements */}
      <div className="absolute top-10 left-10 text-rose-300 opacity-40 animate-float pointer-events-none">
        <Heart className="w-12 h-12 fill-rose-200" />
      </div>
      <div className="absolute top-24 right-16 text-pink-300 opacity-50 animate-bounce pointer-events-none">
        <Heart className="w-8 h-8 fill-pink-200" />
      </div>
      <div className="absolute bottom-20 left-16 text-amber-300 opacity-40 animate-pulse pointer-events-none">
        <Sparkles className="w-10 h-10" />
      </div>
      <div className="absolute bottom-28 right-20 text-rose-400 opacity-30 animate-float pointer-events-none">
        <Heart className="w-14 h-14 fill-rose-300" />
      </div>

      {/* Top Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold tracking-wider uppercase text-rose-700 bg-white/80 px-3 py-1 rounded-full border border-rose-200 shadow-xs">
            Model Desain MPI Lumi • Multi-Tema Edition
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AudioToggle />

          <button
            onClick={() => {
              sound.playClick();
              onOpenPromptGuide();
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-1.5 text-xs text-rose-700 bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-rose-200 shadow-xs transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Panduan &amp; Prompt Guru</span>
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="w-full max-w-3xl flex flex-col items-center text-center my-auto z-10 py-6">
        {/* Active Theme Selector / Indicator Pill */}
        <div className="flex items-center justify-center gap-2 mb-3.5 flex-wrap">
          <div className="inline-flex items-center gap-2 bg-white/95 px-4 py-1.5 rounded-full border border-rose-200 shadow-xs text-xs text-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tema Aktif:</span>
            <span className="text-base">{theme?.emojiMaskot || '✨'}</span>
            <span className="text-rose-700 font-extrabold text-xs sm:text-sm">{title}</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
              {theme?.kelas || 'Kelas 3 SD'}
            </span>
          </div>

          {onSelectTheme && (
            <button
              onClick={() => {
                sound.playClick();
                onSelectTheme();
              }}
              onMouseEnter={() => sound.playHover()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ganti Tema 🔄</span>
            </button>
          )}
        </div>

        {/* Title Badges */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white px-4 py-1.5 rounded-full shadow-md text-xs sm:text-sm font-semibold mb-2">
          <span className="text-base">{theme?.emojiMaskot || '✨'}</span>
          <span>MULTIMEDIA PEMBELAJARAN INTERAKTIF (MPI)</span>
        </div>

        {/* Main Title - Dynamic based on active theme */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight font-display drop-shadow-xs">
          {title}
        </h1>

        <p className="mt-2 text-sm sm:text-base lg:text-lg text-rose-600 font-bold max-w-2xl">
          {subtitle}
        </p>

        <p className="mt-1 text-xs sm:text-sm text-slate-600 font-semibold max-w-xl">
          {subjectAndGrade}
        </p>

        {/* Sapaan Lumi */}
        {theme?.sapaanLumi && (
          <div className="mt-4 p-3.5 bg-white/90 border border-rose-200 rounded-2xl max-w-xl text-xs sm:text-sm text-slate-700 shadow-2xs italic flex items-center gap-3">
            <span className="text-2xl shrink-0">{theme?.emojiMaskot || '✨'}</span>
            <span>"{theme.sapaanLumi}"</span>
          </div>
        )}

        {/* Interactive Feature Highlights */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 my-6 w-full max-w-lg">
          <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl mb-1">📖</span>
            <span className="font-bold text-xs sm:text-sm text-slate-800">Materi &amp; Cerita</span>
            <span className="text-[10px] text-slate-500">Eksplorasi Kontekstual</span>
          </div>
          <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center text-center scale-105 ring-2 ring-rose-400">
            <span className="text-2xl mb-1">🎮</span>
            <span className="font-bold text-xs sm:text-sm text-rose-700">Simulasi &amp; Game</span>
            <span className="text-[10px] text-rose-500">5 Format Kuis Seru</span>
          </div>
          <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl mb-1">🏆</span>
            <span className="font-bold text-xs sm:text-sm text-slate-800">E-Sertifikat</span>
            <span className="text-[10px] text-slate-500">Piagam Hasil Belajar</span>
          </div>
        </div>

        {/* Big Start Button (MULAI BELAJAR / START) */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleStartClick}
            onMouseEnter={() => sound.playHover()}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-lg sm:text-xl rounded-full shadow-lg shadow-rose-400/40 hover:shadow-xl hover:shadow-rose-400/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-pulse-subtle"
          >
            <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
            <span>MULAI BELAJAR (START)</span>
          </button>
          <span className="text-xs text-slate-500">
            Klik tombol di atas untuk masuk ke pembelajaran tema ini, atau klik tombol "Ganti Tema" untuk memilih topik lain.
          </span>
        </div>
      </main>

      {/* Footer credits */}
      <footer className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 z-10 py-2 border-t border-rose-200/60">
        <span className="flex items-center gap-1 font-medium">
          Didesain dengan <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" /> oleh Yulianah, S.Pd.
        </span>
        <span className="text-[11px] text-slate-400">
          Sistem Multi-Tema Kurikulum Merdeka • Audio Synthesizer Mandiri
        </span>
      </footer>
    </div>
  );
};
