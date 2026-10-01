import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Shield,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { getAllThemes, deleteCustomTheme } from '../data/themes';
import { sound } from '../utils/audio';

interface ThemeSelectScreenProps {
  currentThemeId: string;
  onSelectTheme: (theme: ThemeConfig) => void;
  onOpenGenerator: () => void;
  onBackToWelcome?: () => void;
}

export const ThemeSelectScreen: React.FC<ThemeSelectScreenProps> = ({
  currentThemeId,
  onSelectTheme,
  onOpenGenerator,
  onBackToWelcome,
}) => {
  const [themes, setThemes] = useState<ThemeConfig[]>(getAllThemes());

  const handleSelect = (theme: ThemeConfig) => {
    sound.playMenuClick();
    sound.playWhoosh();
    onSelectTheme(theme);
  };

  const handleDelete = (e: React.MouseEvent, themeId: string, themeTitle: string) => {
    e.stopPropagation();
    sound.playClick();
    if (window.confirm(`Yakin ingin menghapus tema kustom "${themeTitle}"?`)) {
      deleteCustomTheme(themeId);
      setThemes(getAllThemes());
      sound.playCorrect();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/70 via-sky-50/50 to-amber-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between select-none relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/3 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 mb-6 z-10">
        <div className="flex items-center gap-3">
          {onBackToWelcome && (
            <button
              onClick={() => {
                sound.playClick();
                onBackToWelcome();
              }}
              onMouseEnter={() => sound.playHover()}
              className="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Kembali</span>
            </button>
          )}

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Layers className="w-3 h-3 text-rose-600" />
              <span>Sistem Multi-Tema Kurikulum Merdeka</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
              Pilih Tema Pembelajaran
            </h1>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenGenerator();
          }}
          onMouseEnter={() => sound.playHover()}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Buat Tema Guru ✨</span>
        </button>
      </header>

      {/* Main Grid of Theme Cards */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center my-2 z-10">
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Pilihlah tema pembelajaran di bawah ini. Tema yang kamu pilih akan langsung diterapkan, dan kamu bisa meninjau serta menekan tombol <strong>"Mulai Belajar"</strong> di halaman depan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {themes.map((theme) => {
            const isSelected = theme.id === currentThemeId;
            return (
              <div
                key={theme.id}
                onClick={() => handleSelect(theme)}
                onMouseEnter={() => sound.playHover()}
                className={`group relative bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-98 ${
                  isSelected
                    ? 'border-rose-400 ring-4 ring-rose-200/80 shadow-rose-100'
                    : 'border-slate-200 hover:border-rose-300'
                }`}
              >
                {/* Active selection badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tema Aktif</span>
                  </div>
                )}

                {/* Delete button for custom themes */}
                {theme.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, theme.id, theme.judulTema)}
                    title="Hapus tema kustom ini"
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition cursor-pointer z-20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div>
                  {/* Mascot & Subject Tags */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-100 to-amber-100 border border-rose-200 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                      {theme.emojiMaskot}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {theme.fase} · {theme.kelas}
                        </span>
                        {theme.isCustom && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Mode Guru ✨
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-rose-600 block mt-0.5">
                        {theme.mataPelajaran}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-slate-800 font-display leading-snug group-hover:text-rose-600 transition-colors">
                    {theme.judulTema}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                    {theme.subJudul}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                    {theme.deskripsiSingkat}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                    <span>10 Soal HOTS + 5 Game</span>
                  </span>
                  <span className={`font-bold transition-transform flex items-center gap-1 ${isSelected ? 'text-rose-600' : 'text-slate-700 group-hover:text-rose-600'}`}>
                    <span>{isSelected ? 'Sudah Dipilih ✓' : 'Pilih Tema Ini'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}

          {/* Action Card: Buat Tema Sendiri */}
          <div
            onClick={() => {
              sound.playClick();
              onOpenGenerator();
            }}
            onMouseEnter={() => sound.playHover()}
            className="group bg-gradient-to-br from-amber-50/90 via-rose-50/70 to-pink-50/90 rounded-3xl p-6 border-2 border-dashed border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between text-center items-center active:scale-98 min-h-[220px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform mb-3">
              <Plus className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase mb-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Generator AI Guru</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-display">
                Buat Tema Sendiri
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                Ketik topik pembelajaran apa saja. AI Gemini akan merancang modul, 5 game, dan 10 soal asesmen HOTS lengkap!
              </p>
            </div>
            <button
              type="button"
              className="mt-3 px-4 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
            >
              <span>Mulai Rancang Tema</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-5xl mx-auto text-center pt-4 z-10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Setiap tema memiliki lencana, simulasi, leaderboard, dan piagam kelulusan tersendiri.</span>
        <span className="font-semibold text-rose-500">Multimedia Pembelajaran Interaktif (MPI) Kurikulum Merdeka</span>
      </footer>
    </div>
  );
};
