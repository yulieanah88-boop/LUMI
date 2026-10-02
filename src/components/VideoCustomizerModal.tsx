import React, { useState } from 'react';
import { X, Video, Youtube, Link as LinkIcon, Check, RotateCcw, Sparkles, HelpCircle, ExternalLink } from 'lucide-react';
import { sound } from '../utils/audio';

interface VideoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideoUrl: string;
  onSaveVideoUrl: (url: string) => void;
  themeTitle: string;
  recommendedUrl?: string;
  recommendedTitle?: string;
}

export const VideoCustomizerModal: React.FC<VideoCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentVideoUrl,
  onSaveVideoUrl,
  themeTitle,
  recommendedUrl = 'https://www.youtube.com/watch?v=kYv9Nkj2XqE',
  recommendedTitle = 'Video Edukasi Kurikulum Merdeka',
}) => {
  const [inputUrl, setInputUrl] = useState(currentVideoUrl);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCorrect();
    onSaveVideoUrl(inputUrl.trim());
    onClose();
  };

  const handleUseRecommended = () => {
    sound.playClick();
    setInputUrl(recommendedUrl);
    setErrorMsg('');
  };

  const handleResetToAnimation = () => {
    sound.playClick();
    setInputUrl('');
    onSaveVideoUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-rose-200 overflow-hidden my-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-display leading-tight">
                Atur / Masukkan Video Pembelajaran
              </h3>
              <p className="text-xs text-rose-100">
                Tema: {themeTitle}
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
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-rose-600" />
              <span>Tautan / Link Video (YouTube, Google Drive, atau MP4):</span>
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Contoh: https://www.youtube.com/watch?v=..."
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Kamu bisa menyalin (copy) link video dari <strong>YouTube</strong>, video di <strong>Google Drive</strong> (pastikan akses link disetel ke "Siapa saja yang memiliki link"), atau direct file <strong>.mp4</strong>.
            </p>
          </div>

          {/* Quick preset recommendations */}
          <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Rekomendasi Video Terverifikasi:</span>
              </span>
              <button
                type="button"
                onClick={handleUseRecommended}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
              >
                Gunakan Ini
              </button>
            </div>
            <p className="text-xs text-slate-700 font-medium line-clamp-1">
              {recommendedTitle}
            </p>
            <span className="text-[10px] text-slate-400 font-mono block truncate">
              {recommendedUrl}
            </span>
          </div>

          {/* Help box */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Keuntungan Menggunakan Video Asli:</span>
            </div>
            <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-slate-500">
              <li>Video berjalan otomatis dan langsung bisa ditonton tanpa harus memencet babak berkali-kali.</li>
              <li>Memiliki tombol kendali lengkap: jeda (pause), layar penuh (fullscreen), dan pengatur volume.</li>
              <li>Dapat diganti kapan saja atau di-reset kembali ke Teater Animasi Lumi.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleResetToAnimation}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Gunakan Teater Animasi Bawaan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan Video</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
