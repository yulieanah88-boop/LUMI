import React from 'react';
import { X, CheckCircle2, Lock, Sparkles, Award } from 'lucide-react';
import { AchievementBadge, ActiveScreen } from '../types';
import { sound } from '../utils/audio';

interface BadgeDetailModalProps {
  badge: AchievementBadge | null;
  isUnlocked: boolean;
  onClose: () => void;
  onNavigate?: (screen: ActiveScreen) => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  isUnlocked,
  onClose,
  onNavigate,
}) => {
  if (!badge) return null;

  const targetScreenMap: { [key: string]: ActiveScreen } = {
    belajar: 'belajar',
    bermain: 'bermain',
    berlatih: 'berlatih',
    refleksi: 'refleksi',
  };

  const handleGoToTask = () => {
    sound.playClick();
    onClose();
    if (badge.section !== 'grand_master' && onNavigate) {
      onNavigate(targetScreenMap[badge.section]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-rose-100 overflow-hidden text-center animate-in zoom-in-95">
        {/* Header Ribbon */}
        <div
          className={`p-6 text-white bg-gradient-to-r ${badge.color} relative flex flex-col items-center justify-center`}
        >
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge Icon Circle */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white/60 mb-2 transition-transform hover:scale-105 ${
              isUnlocked ? 'bg-white/25 animate-pulse-subtle' : 'bg-slate-800/40 grayscale'
            }`}
          >
            {badge.icon}
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-white/90 bg-black/15 px-3 py-0.5 rounded-full">
            {badge.nickname}
          </span>
          <h3 className="text-xl font-extrabold font-display mt-1 text-white drop-shadow-xs">
            {badge.title}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5 text-xs text-slate-600">
          {/* Status Badge */}
          <div className="flex justify-center">
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lencana Telah Berhasil Terbuka!</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-full border border-slate-200">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Lencana Masih Terkunci</span>
              </span>
            )}
          </div>

          <p className="text-slate-700 leading-relaxed font-medium">
            {badge.description}
          </p>

          {/* How to unlock box */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left">
            <span className="font-bold text-slate-700 block text-[11px] mb-0.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Syarat Membuka Lencana:</span>
            </span>
            <p className="text-[11px] text-slate-600">{badge.requirement}</p>
          </div>

          {/* Quote */}
          <div className="p-2.5 bg-rose-50/50 rounded-xl text-[11px] italic text-rose-800 font-medium border border-rose-100">
            {badge.quote}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          {!isUnlocked && badge.section !== 'grand_master' ? (
            <button
              onClick={handleGoToTask}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Buka Menu &amp; Raih Lencana</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex-1 py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
