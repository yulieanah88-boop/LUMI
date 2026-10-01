import React from 'react';
import { CheckCircle2, Circle, Sparkles, Award } from 'lucide-react';
import { SectionProgress, ActiveScreen, ThemeConfig } from '../types';
import { sound } from '../utils/audio';

interface StudentProgressBarProps {
  progress: SectionProgress;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenCertificate: () => void;
  theme?: ThemeConfig;
}

export const StudentProgressBar: React.FC<StudentProgressBarProps> = ({
  progress,
  onNavigate,
  onOpenCertificate,
  theme,
}) => {
  const steps = [
    {
      id: 'belajar' as const,
      label: 'Belajar',
      emoji: '📖',
      subtitle: 'Materi & Cerita',
      completed: progress.belajar,
      targetScreen: 'belajar' as ActiveScreen,
      color: 'rose',
    },
    {
      id: 'bermain' as const,
      label: 'Bermain',
      emoji: '🎮',
      subtitle: theme?.bermain?.simulation?.badge ? theme.bermain.simulation.badge.split('·')[0].trim() : 'Simulasi & Game',
      completed: progress.bermain,
      targetScreen: 'bermain' as ActiveScreen,
      color: 'amber',
    },
    {
      id: 'berlatih' as const,
      label: 'Berlatih',
      emoji: '✍️',
      subtitle: '10 Soal Asesmen',
      completed: progress.berlatih,
      targetScreen: 'berlatih' as ActiveScreen,
      color: 'emerald',
    },
    {
      id: 'refleksi' as const,
      label: 'Refleksi',
      emoji: '🤔',
      subtitle: 'Refleksi Diri',
      completed: progress.refleksi,
      targetScreen: 'refleksi' as ActiveScreen,
      color: 'sky',
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  // Motivational message based on current progress
  const getMotivationalMessage = () => {
    if (percentage === 100) {
      return {
        text: 'Hore! Luar biasa! Seluruh 4 aktivitas telah kamu selesaikan 100%! Piagam Penghargaan siap diunduh! 🏆',
        badgeColor: 'text-amber-800 bg-amber-100 border-amber-300',
      };
    }
    if (percentage >= 75) {
      return {
        text: 'Hebat sekali! Tinggal 1 aktivitas lagi untuk menyelesaikan seluruh petualangan belajar! 🌟',
        badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-300',
      };
    }
    if (percentage >= 50) {
      return {
        text: 'Keren! Separuh perjalanan sudah tuntas! Terus semangat melanjutkan ke aktivitas berikutnya! 🚀',
        badgeColor: 'text-sky-800 bg-sky-100 border-sky-300',
      };
    }
    if (percentage >= 25) {
      return {
        text: 'Awal yang sangat bagus! Kamu sudah menyelesaikan 1 aktivitas! Yuk lanjutkan petualanganmu! 🎈',
        badgeColor: 'text-rose-800 bg-rose-100 border-rose-300',
      };
    }
    return {
      text: 'Ayo mulai petualangan waktu! Selesaikan 4 menu di bawah untuk meraih Piagam Bintang! 🧭',
      badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
    };
  };

  const message = getMotivationalMessage();

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-md mb-6 transition-all">
      {/* Top Header: Title & Numeric Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-100" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-800 font-display flex items-center gap-1.5">
              <span>Progres Petualangan Belajarmu</span>
              {percentage === 100 && (
                <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-bold animate-bounce">
                  Tuntas 100%!
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500">
              Lacak ketuntasan 4 aktivitas utama (Belajar, Bermain, Berlatih, Refleksi)
            </p>
          </div>
        </div>

        {/* Completion Counter & Percentage */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Selesai:</span>{' '}
            <span className="text-sm font-extrabold text-slate-800">
              {completedCount} <span className="text-xs font-normal text-slate-400">/ 4</span>
            </span>
          </div>

          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-sm px-3 py-1 rounded-xl shadow-xs font-mono min-w-[58px] text-center">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Track */}
      <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 mb-4">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-xs"
          style={{ width: `${Math.max(percentage, 4)}%` }}
        />
      </div>

      {/* 4 Interactive Milestone Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {steps.map((step, idx) => {
          return (
            <button
              key={step.id}
              onClick={() => {
                sound.playMenuClick();
                onNavigate(step.targetScreen);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                step.completed
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs hover:bg-emerald-100/80'
                  : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl sm:text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  {step.emoji}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold opacity-60 font-mono">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {step.subtitle}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 ml-1.5">
                {step.completed ? (
                  <div
                    className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs"
                    title="Aktivitas Telah Selesai!"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                ) : (
                  <div
                    className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center group-hover:bg-rose-100 group-hover:text-rose-500 transition-colors"
                    title="Klik untuk Mulai"
                  >
                    <Circle className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Motivational Bottom Bar */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className={`p-2 px-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${message.badgeColor}`}>
          <span className="text-base shrink-0">
            {percentage === 100 ? '🎉' : percentage >= 50 ? '🌟' : '💡'}
          </span>
          <span className="leading-snug">{message.text}</span>
        </div>

        {percentage === 100 && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenCertificate();
            }}
            onMouseEnter={() => sound.playHover()}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Unduh Piagam</span>
          </button>
        )}
      </div>
    </div>
  );
};
