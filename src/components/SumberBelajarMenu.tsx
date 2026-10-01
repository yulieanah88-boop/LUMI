import React from 'react';
import { ArrowLeft, BookOpen, ExternalLink, Bookmark, HelpCircle, Shield, Phone } from 'lucide-react';
import { SUMBER_BELAJAR, GLOSARIUM_EKONOMI } from '../data/appData';
import { ThemeConfig } from '../types';
import { sound } from '../utils/audio';

interface SumberBelajarMenuProps {
  onBack: () => void;
  theme?: ThemeConfig;
}

export const SumberBelajarMenu: React.FC<SumberBelajarMenuProps> = ({ onBack, theme }) => {
  const sumberList = theme?.sumberBelajar || SUMBER_BELAJAR;
  const glosariumList = theme?.glosarium || GLOSARIUM_EKONOMI;

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4 pb-4 border-b border-violet-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-violet-200 text-xs font-bold text-violet-800 hover:bg-violet-50 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-display flex items-center gap-2">
              <span>📚 Menu Sumber Belajar &amp; Referensi</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto flex-1 my-4 space-y-6">
        {/* Helplines note if sensitivity note present */}
        {theme?.sensitivityNote && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold font-display text-base sm:text-lg">
              <Shield className="w-5 h-5 text-rose-600" />
              <span>Pusat Bantuan &amp; Kontak Perlindungan Anak Resmi</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-700">
              Jika kamu atau temanmu membutuhkan bantuan atau perlindungan dari situasi yang tidak aman, kamu bisa menghubungi saluran resmi berikut tanpa dipungut biaya:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {theme.sensitivityNote.helplines.map((hl, i) => (
                <div key={i} className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-800 block">{hl.name}</span>
                  <div className="flex items-center gap-1 text-sm font-black text-rose-600 mt-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{hl.contact}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{hl.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official References Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-violet-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-bold text-slate-800 font-display">
              Daftar Referensi: {theme?.judulTema || 'IPAS Kelas III SD'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Materi dalam aplikasi MPI Lumi ini disusun dan diselaraskan secara akurat berdasarkan buku pedoman dan kurikulum resmi Kemendikbudristek RI:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {sumberList.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 hover:bg-violet-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-violet-700 bg-white px-2.5 py-0.5 rounded-full border border-violet-200">
                      {item.type} ({item.year})
                    </span>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-600 hover:text-violet-800 flex items-center gap-1 text-[11px] font-medium"
                      >
                        <span>Kunjungi</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Penulis / Lembaga: {item.author}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glosarium Istilah Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-violet-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-800 font-display">
              Glosarium Istilah Penting: {theme?.judulTema || 'Materi Pembelajaran'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {glosariumList.map((g, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-colors"
              >
                <div className="text-xs font-extrabold text-violet-800 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  <span>{g.term}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {g.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
        <span>MPI Lumi • Sumber Belajar Terpercaya</span>
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
          <span>Kemendikbudristek RI • Kurikulum Merdeka</span>
        </span>
      </footer>
    </div>
  );
};
