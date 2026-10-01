import React from 'react';
import { X, Heart, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThemeSensitivityNote } from '../types';
import { sound } from '../utils/audio';

interface AdultGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: ThemeSensitivityNote;
}

export const AdultGuideModal: React.FC<AdultGuideModalProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-emerald-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
              👨‍👩‍👧‍👦
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-display">
                {note?.title || 'Catatan untuk Guru & Orang Tua'}
              </h3>
              <p className="text-xs text-emerald-100">
                Panduan mendampingi anak dalam pembelajaran perlindungan diri
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs">
            {note?.summary ||
              'Tema ini dirancang dengan pendekatan psikoedukasi positif. Fokus utama adalah membangun kesadaran hak privasi, kebersihan diri, dan keberanian anak untuk bersuara tanpa rasa takut.'}
          </p>

          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Prinsip Pendampingan Anak:</span>
            </h4>
            <ul className="space-y-2.5">
              {(
                note?.adultGuide || [
                  'Dampingi anak saat belajar: Bangun dialog terbuka tentang siapa saja orang dewasa yang bisa dipercaya di sekitar anak.',
                  'Dengarkan tanpa menghakimi: Jika anak bercerita mengenai hal tidak nyaman, dengarkan dengan tenang dan penuh perhatian.',
                  'Tegaskan bahwa anak tidak bersalah (Zero Victim Blaming): Hindari bertanya yang bernada menyudutkan.',
                  'Hormati batasan privasi anak: Ajarkan anak untuk mengetuk pintu dan berikan contoh menghargai privasi di rumah.',
                ]
              ).map((guide, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{guide}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
