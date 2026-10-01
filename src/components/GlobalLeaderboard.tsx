import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  ArrowRight,
  User,
  Star,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StudentInfo, LeaderboardEntry, ActiveScreen } from '../types';
import { getLeaderboardData } from '../utils/leaderboard';
import { sound } from '../utils/audio';

interface GlobalLeaderboardProps {
  currentStudent: StudentInfo;
  currentHotsScore: number | null;
  onNavigate: (screen: ActiveScreen) => void;
  developerAvatarUrl?: string;
  themeId?: string;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  currentStudent,
  currentHotsScore,
  onNavigate,
  developerAvatarUrl,
  themeId = 'dahulu_kini_nanti',
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  useEffect(() => {
    const data = getLeaderboardData(themeId, currentStudent, currentHotsScore);
    setEntries(data);
  }, [themeId, currentStudent, currentHotsScore]);

  // Top 5 entries
  const top5 = entries.slice(0, 5);

  // Find user rank in entire leaderboard
  const userRankIndex = entries.findIndex(
    (e) =>
      e.isCurrentUser ||
      (e.name.toLowerCase() === currentStudent.name.toLowerCase() &&
        e.className === currentStudent.className)
  );
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : null;
  const isUserInTop5 = userRank !== null && userRank <= 5;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />,
          emoji: '🥇',
          bg: 'bg-gradient-to-r from-amber-50 to-yellow-50/90 border-amber-300 ring-2 ring-amber-200/80',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xs',
          rankColor: 'text-amber-700',
          label: 'Juara 1',
        };
      case 2:
        return {
          icon: <Medal className="w-4 h-4 text-slate-400 fill-slate-300" />,
          emoji: '🥈',
          bg: 'bg-gradient-to-r from-slate-50 to-slate-100/80 border-slate-300',
          badgeBg: 'bg-slate-500 text-white shadow-xs',
          rankColor: 'text-slate-700',
          label: 'Juara 2',
        };
      case 3:
        return {
          icon: <Medal className="w-4 h-4 text-amber-700 fill-amber-600" />,
          emoji: '🥉',
          bg: 'bg-gradient-to-r from-orange-50 to-amber-50/80 border-amber-300/80',
          badgeBg: 'bg-amber-700 text-white shadow-xs',
          rankColor: 'text-amber-900',
          label: 'Juara 3',
        };
      default:
        return {
          icon: <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-400" />,
          emoji: '🎖️',
          bg: 'bg-white border-slate-200 hover:border-slate-300',
          badgeBg: 'bg-emerald-600 text-white',
          rankColor: 'text-slate-600',
          label: `Top ${rank}`,
        };
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-md mb-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 text-white flex items-center justify-center shadow-md text-xl shrink-0">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display flex items-center gap-1.5">
                <span>Global Leaderboard Asesmen HOTS</span>
              </h3>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>Top 5 Skor Tertinggi</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Peringkat siswa terhebat yang telah menyelesaikan 10 Soal Asesmen HOTS dengan gemilang.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => {
              sound.playMenuClick();
              onNavigate('berlatih');
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            <span>Tantang Dirimu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsExpanded((prev) => !prev);
            }}
            onMouseEnter={() => sound.playHover()}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            title={isExpanded ? 'Ciutkan Peringkat' : 'Buka Peringkat'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      {isExpanded && (
        <div className="space-y-2 animate-in fade-in duration-300">
          {top5.map((entry, idx) => {
            const rank = idx + 1;
            const rankStyle = getRankBadge(rank);
            const isUser =
              entry.isCurrentUser ||
              (entry.name.toLowerCase() === currentStudent.name.toLowerCase() &&
                entry.className === currentStudent.className);

            return (
              <div
                key={entry.id || idx}
                onMouseEnter={() => sound.playHover()}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  rankStyle.bg
                } ${isUser ? 'ring-2 ring-emerald-400 shadow-xs' : 'shadow-2xs'}`}
              >
                {/* Left: Rank & Avatar */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 font-display ${rankStyle.badgeBg}`}
                  >
                    {rank <= 3 ? rankStyle.emoji : rank}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold shrink-0 border ${
                      isUser
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : rank === 1
                        ? 'bg-amber-500 text-white border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {(entry.avatarUrl || (isUser && (currentStudent.avatarUrl || developerAvatarUrl))) ? (
                      <img
                        src={entry.avatarUrl || (isUser ? (currentStudent.avatarUrl || developerAvatarUrl) : undefined)}
                        alt={entry.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      entry.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Name and Class */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                        {entry.name}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-2 py-0.2 rounded-full uppercase tracking-wider animate-pulse-subtle">
                          ★ Kamu
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Kelas {entry.className}</span>
                      {entry.studentNumber && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>Absen #{entry.studentNumber}</span>
                        </>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">{entry.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score & Stars */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Stars Rating */}
                  <div className="hidden sm:flex items-center text-amber-400">
                    {entry.score >= 90 ? (
                      <>
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </>
                    ) : entry.score >= 70 ? (
                      <>
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 text-slate-300" />
                      </>
                    ) : (
                      <>
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 text-slate-300" />
                        <Star className="w-3.5 h-3.5 text-slate-300" />
                      </>
                    )}
                  </div>

                  {/* Score Pill */}
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold font-mono shadow-2xs ${
                        entry.score === 100
                          ? 'bg-emerald-600 text-white'
                          : entry.score >= 80
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {entry.score} <span className="text-[10px] font-sans font-bold">Poin</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Current Student's Standings Footer */}
          <div className="pt-2 mt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            {currentHotsScore !== null ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-slate-600">
                  Skor Terbaikmu:{' '}
                  <strong className="text-emerald-700 font-extrabold">{currentHotsScore} Poin</strong>
                  {userRank ? (
                    <span>
                      {' '}
                      (Peringkat <strong>#{userRank}</strong> dari seluruh siswa)
                    </span>
                  ) : null}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Kamu belum menyelesaikan Asesmen HOTS. Yuk raih skormu dan jadilah bagian dari Juara Top 5!
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playMenuClick();
                onNavigate('berlatih');
              }}
              onMouseEnter={() => sound.playHover()}
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer self-start sm:self-auto flex items-center gap-1"
            >
              <span>{currentHotsScore !== null ? 'Tingkatkan Skor Lagi' : 'Mulai Asesmen Sekarang'}</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
