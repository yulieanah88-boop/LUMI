import React from 'react';
import { Sparkles, Award, ArrowRight } from 'lucide-react';
import { AchievementBadge } from '../types';
import { sound } from '../utils/audio';

interface BadgeUnlockedToastProps {
  badge: AchievementBadge | null;
  onClose: () => void;
}

export const BadgeUnlockedToast: React.FC<BadgeUnlockedToastProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border-4 border-amber-300 p-6 text-center animate-in zoom-in-95 relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Confetti icon badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold uppercase tracking-wider border border-amber-300 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Lencana Baru Terbuka!</span>
          </div>

          {/* Huge Animated Badge Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-white flex items-center justify-center text-5xl shadow-xl ring-4 ring-amber-200 animate-pulse-subtle">
            {badge.icon}
          </div>

          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
              {badge.nickname}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-0.5">
              {badge.title}
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {badge.description}
          </p>

          <p className="text-[11px] italic text-rose-700 font-semibold">
            {badge.quote}
          </p>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Award className="w-4 h-4" />
            <span>Koleksi Lencana Saya!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
