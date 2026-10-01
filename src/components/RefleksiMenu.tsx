import React, { useState } from 'react';
import { ArrowLeft, Send, Sparkles, CheckCircle2, Shield, Heart } from 'lucide-react';
import { ReflectionData, ThemeConfig } from '../types';
import { sound } from '../utils/audio';

interface RefleksiMenuProps {
  onBack: () => void;
  savedReflection: ReflectionData | null;
  onSaveReflection: (data: ReflectionData) => void;
  theme?: ThemeConfig;
}

export const RefleksiMenu: React.FC<RefleksiMenuProps> = ({
  onBack,
  savedReflection,
  onSaveReflection,
  theme,
}) => {
  const defaultEmojiOptions = [
    { emoji: '🤩', label: 'Sangat Paham & Antusias', desc: 'Materi sangat jelas, seru, dan mudah dimengerti!' },
    { emoji: '😊', label: 'Mengerti & Senang', desc: 'Cukup paham dan menyukai berbagai contohnya.' },
    { emoji: '🤔', label: 'Masih Butuh Latihan', desc: 'Perlu membaca kembali beberapa konsep penting.' },
    { emoji: '😴', label: 'Merasa Menantang', desc: 'Perlu bimbingan tambahan dari Bapak/Ibu Guru.' },
  ];

  const defaultFavoriteOptions = [
    'Tujuan & Pemantik Bergambar (Menu Belajar)',
    'Simulasi Interaktif (Menu Bermain)',
    'Tantangan Game 5 Format (Menu Bermain)',
    '10 Soal Asesmen HOTS (Menu Berlatih)',
    'Unduh Piagam Prestasi Belajar',
  ];

  const emojiOptions = theme?.refleksi?.emojiOptions || defaultEmojiOptions;
  const favoriteOptions = theme?.refleksi?.favoriteOptions || defaultFavoriteOptions;

  const [selectedEmoji, setSelectedEmoji] = useState(savedReflection?.emoji || emojiOptions[0]?.emoji || '🤩');
  const [moodText, setMoodText] = useState(savedReflection?.moodText || emojiOptions[0]?.label || 'Sangat Paham & Antusias');
  const [favoriteMenu, setFavoriteMenu] = useState(savedReflection?.favoriteMenu || favoriteOptions[0] || 'Simulasi Interaktif');
  const [applicationText, setApplicationText] = useState(
    savedReflection?.applicationText || ''
  );
  const [trustedAdultsText, setTrustedAdultsText] = useState('');
  const [isSaved, setIsSaved] = useState(!!savedReflection);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCorrect();
    sound.playFanfare();

    let fullText = applicationText.trim();
    if (trustedAdultsText.trim()) {
      fullText += ` [Orang Dewasa Tepercaya: ${trustedAdultsText.trim()}]`;
    }

    onSaveReflection({
      emoji: selectedEmoji,
      moodText,
      favoriteMenu,
      applicationText: fullText || 'Saya bertekad menerapkan ilmu yang telah dipelajari dengan bijak dan berani menjaga diri.',
      submittedAt: new Date().toISOString(),
    });

    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-sky-200 text-xs font-bold text-sky-800 hover:bg-sky-50 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-display flex items-center gap-2">
              <span>🤔 Menu Refleksi Pembelajaran</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto flex-1 my-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Refleksi Individu Peserta Didik
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2 font-display">
              {theme?.refleksi?.prompt || 'Apa yang Kamu Rasakan & Pelajari Hari Ini?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Luangkan waktu sejenak untuk mengenali perasaan dan pemahamanmu setelah mempelajari materi <strong>{theme?.judulTema || 'pembelajaran'}</strong>.
            </p>
          </div>

          {isSaved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Refleksi Tersimpan!</strong> Terima kasih atas kejujuran dan semangat belajarmu. Jawabanmu tersimpan rapi untuk evaluasi diri.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Emoji Emosi Belajar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Pilih Emoji yang Paling Menggambarkan Perasaanmu Saat Belajar Materi Ini:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {emojiOptions.map((opt) => (
                  <button
                    key={opt.emoji}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedEmoji(opt.emoji);
                      setMoodText(opt.label);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                      selectedEmoji === opt.emoji
                        ? 'bg-sky-50 border-sky-500 shadow-sm scale-105'
                        : 'bg-slate-50 border-slate-200 hover:bg-sky-50/50'
                    }`}
                  >
                    <span className="text-4xl mb-1.5">{opt.emoji}</span>
                    <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 mt-1 leading-tight">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Menu Favorit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Bagian Aktivitas Mana yang Paling Menarik &amp; Bermanfaat Bagimu?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {favoriteOptions.map((fav) => (
                  <button
                    key={fav}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setFavoriteMenu(fav);
                    }}
                    className={`text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                      favoriteMenu === fav
                        ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{fav}</span>
                    {favoriteMenu === fav && (
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 ml-1.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra: Trusted Adults prompt if present (e.g. Tubuhku Berharga) */}
            {theme?.refleksi?.trustedAdultsPrompt && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>{theme.refleksi.trustedAdultsPrompt}</span>
                </label>
                <input
                  type="text"
                  value={trustedAdultsText}
                  onChange={(e) => setTrustedAdultsText(e.target.value)}
                  placeholder="Contoh: 1. Ibu Rani, 2. Ayah Budi, 3. Bu Guru Yulianah"
                  className="w-full p-3 bg-white border border-emerald-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            )}

            {/* 3. Hikmah & Penerapan Sehari-hari */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. {theme?.refleksi?.commitmentPrompt || 'Tuliskan komitmen atau sikap baik yang akan kamu terapkan:'}
              </label>
              <textarea
                rows={3}
                value={applicationText}
                onChange={(e) => setApplicationText(e.target.value)}
                placeholder="Tuliskan komitmenmu di sini..."
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Simpan Refleksi Diri</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
        <span>MPI Lumi • Refleksi Diri Murid</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Kurikulum Merdeka {theme?.fase || 'Fase B'}</span>
        </span>
      </footer>
    </div>
  );
};
