import React, { useState } from 'react';
import { Copy, Check, X, Sparkles, BookOpen } from 'lucide-react';
import { MPI_PROMPT_TEMPLATE } from '../data/appData';
import { sound } from '../utils/audio';

interface TeacherPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherPromptModal: React.FC<TeacherPromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(MPI_PROMPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-rose-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-display">Prompt Master MPI Lumi Guru IPS</h3>
              <p className="text-xs text-rose-100">Siap salin untuk authoring tool Lumi / AI generator</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-700 text-sm">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Tips untuk Bapak/Ibu Guru:</strong> Prompt di bawah ini telah disesuaikan secara detail dengan struktur kurikulum Merdeka Kelas 7, gaya visual Menu Love khas Lumi, dan 5 tipe kuis interaktif. Anda dapat menyalinnya untuk dokumentasi modul ajar atau diumpankan ke AI/tool authoring lainnya.
            </div>
          </div>

          <div className="relative">
            <pre className="bg-slate-900 text-emerald-300 p-4 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto border border-slate-800">
              {MPI_PROMPT_TEMPLATE}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {copied ? 'Tersalin ke papan klip!' : 'Klik tombol untuk menyalin teks prompt lengkap'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Berhasil Disalin!' : 'Salin Seluruh Prompt'}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-medium cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
