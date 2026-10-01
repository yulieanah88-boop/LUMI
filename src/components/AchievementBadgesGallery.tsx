import React, { useState } from 'react';
import { Award, Lock, Sparkles } from 'lucide-react';
import { SectionProgress, AchievementBadge, ActiveScreen } from '../types';
import { ACHIEVEMENT_BADGES } from '../data/achievementBadges';
import { BadgeDetailModal } from './BadgeDetailModal';
import { sound } from '../utils/audio';

interface AchievementBadgesGalleryProps {
  progress: SectionProgress;
  onNavigate: (screen: ActiveScreen) => void;
  badges?: AchievementBadge[];
}

export const AchievementBadgesGallery: React.FC<AchievementBadgesGalleryProps> = ({
  progress,
  onNavigate,
  badges = ACHIEVEMENT_BADGES,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  const isGrandMasterUnlocked =
    progress.belajar && progress.bermain && progress.berlatih && progress.refleksi;

  const isBadgeUnlocked = (badge: AchievementBadge) => {
    if (badge.section === 'grand_master') {
      return isGrandMasterUnlocked;
    }
    return progress[badge.section];
  };

  const unlockedCount = badges.filter((b) => isBadgeUnlocked(b)).length;

  const handleBadgeClick = (badge: AchievementBadge) => {
    sound.playClick();
    setSelectedBadge(badge);
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-amber-100 shadow-md mb-6">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-xs">
            <Award className="w-4 h-4 text-amber-100" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-800 font-display flex items-center gap-1.5">
              <span>Lencana Prestasi Belajar Murid</span>
              {isGrandMasterUnlocked && (
                <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full animate-bounce">
                  Koleksi Lengkap!
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500">
              Selesaikan setiap menu belajar untuk membuka lencana penghargaan barumu!
            </p>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs text-slate-500 font-medium">Lencana Terbuka:</span>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-2.5 py-0.5 rounded-xl font-mono">
            {unlockedCount} / {badges.length}
          </span>
        </div>
      </div>

      {/* Badges Grid (5 badges: 4 sections + 1 grand master) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        {badges.map((badge) => {
          const unlocked = isBadgeUnlocked(badge);

          return (
            <button
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              onMouseEnter={() => sound.playHover()}
              className={`group relative text-center p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between overflow-hidden ${
                unlocked
                  ? `${badge.bgGradient} ${badge.borderColor} shadow-xs hover:shadow-md hover:-translate-y-1`
                  : 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-70 hover:opacity-100 hover:bg-white'
              }`}
            >
              {/* Grand Master Ribbon */}
              {badge.section === 'grand_master' && (
                <span className="absolute -top-1 -right-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-[9px] font-black text-white px-6 py-0.5 rotate-45 shadow-2xs">
                  VIP
                </span>
              )}

              {/* Icon Container */}
              <div className="relative mb-2 mt-1">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md transition-transform group-hover:scale-110 ${
                    unlocked
                      ? `bg-gradient-to-tr ${badge.color} text-white ring-2 ring-white`
                      : 'bg-slate-200 text-slate-400 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                {/* Status Indicator Icon */}
                <div className="absolute -bottom-1 -right-1">
                  {unlocked ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center shadow-xs">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Badge Title & Nickname */}
              <div className="w-full">
                <span className="text-[10px] font-extrabold uppercase tracking-wide block truncate text-slate-500">
                  {badge.nickname}
                </span>
                <span className={`text-xs font-bold block leading-tight font-display truncate ${
                  unlocked ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  {badge.title}
                </span>
              </div>

              {/* Unlock State Footer */}
              <span
                className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full w-full block truncate ${
                  unlocked
                    ? 'bg-white/80 text-emerald-700 border border-emerald-200 shadow-2xs'
                    : 'bg-slate-200/80 text-slate-500'
                }`}
              >
                {unlocked ? '✓ Terbuka' : '🔒 Terkunci'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Click hint */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Klik lencana mana saja untuk melihat tantangan &amp; keistimewaannya!</span>
        </span>
        <span className="font-semibold text-amber-700">
          {unlockedCount === 5 ? 'Semua Lencana Terkumpul! 🎉' : `Kumpulkan ${5 - unlockedCount} lencana lagi`}
        </span>
      </div>

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        isUnlocked={selectedBadge ? isBadgeUnlocked(selectedBadge) : false}
        onClose={() => setSelectedBadge(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
