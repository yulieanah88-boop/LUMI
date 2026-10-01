import React from 'react';
import { LucideIcon } from 'lucide-react';
import { sound } from '../utils/audio';

interface LoveMenuCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  emoji: string;
  themeColor: 'rose' | 'amber' | 'emerald' | 'sky' | 'violet' | 'fuchsia' | 'gold';
  badge?: string;
  onClick: () => void;
  isWide?: boolean;
}

export const LoveMenuCard: React.FC<LoveMenuCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  emoji,
  themeColor,
  badge,
  onClick,
  isWide = false
}) => {
  const colorMap = {
    rose: {
      bg: 'bg-rose-50 hover:bg-rose-100/80',
      border: 'border-rose-200 hover:border-rose-400',
      shadow: 'shadow-rose-100 hover:shadow-rose-200',
      heartBg: 'from-rose-500 to-pink-500',
      text: 'text-rose-900',
      badge: 'bg-rose-500 text-white'
    },
    amber: {
      bg: 'bg-amber-50 hover:bg-amber-100/80',
      border: 'border-amber-200 hover:border-amber-400',
      shadow: 'shadow-amber-100 hover:shadow-amber-200',
      heartBg: 'from-amber-500 to-orange-500',
      text: 'text-amber-950',
      badge: 'bg-amber-500 text-white'
    },
    emerald: {
      bg: 'bg-emerald-50 hover:bg-emerald-100/80',
      border: 'border-emerald-200 hover:border-emerald-400',
      shadow: 'shadow-emerald-100 hover:shadow-emerald-200',
      heartBg: 'from-emerald-500 to-teal-500',
      text: 'text-emerald-950',
      badge: 'bg-emerald-600 text-white'
    },
    sky: {
      bg: 'bg-sky-50 hover:bg-sky-100/80',
      border: 'border-sky-200 hover:border-sky-400',
      shadow: 'shadow-sky-100 hover:shadow-sky-200',
      heartBg: 'from-sky-500 to-blue-500',
      text: 'text-sky-950',
      badge: 'bg-sky-500 text-white'
    },
    violet: {
      bg: 'bg-violet-50 hover:bg-violet-100/80',
      border: 'border-violet-200 hover:border-violet-400',
      shadow: 'shadow-violet-100 hover:shadow-violet-200',
      heartBg: 'from-violet-500 to-purple-600',
      text: 'text-violet-950',
      badge: 'bg-violet-600 text-white'
    },
    fuchsia: {
      bg: 'bg-pink-50 hover:bg-pink-100/80',
      border: 'border-pink-200 hover:border-pink-400',
      shadow: 'shadow-pink-100 hover:shadow-pink-200',
      heartBg: 'from-pink-500 to-rose-600',
      text: 'text-pink-950',
      badge: 'bg-pink-500 text-white'
    },
    gold: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100/90 hover:to-yellow-100/90',
      border: 'border-amber-300 hover:border-amber-500',
      shadow: 'shadow-amber-200 hover:shadow-amber-300',
      heartBg: 'from-amber-500 via-yellow-500 to-orange-500',
      text: 'text-amber-950',
      badge: 'bg-amber-600 text-white'
    }
  };

  const scheme = colorMap[themeColor];

  const handleClick = () => {
    sound.playMenuClick();
    sound.playWhoosh();
    onClick();
  };

  const handleMouseEnter = () => {
    sound.playHover();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`group relative text-left p-4 sm:p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1.5 active:translate-y-0 flex flex-col justify-between overflow-hidden ${
        scheme.bg
      } ${scheme.border} ${scheme.shadow} ${isWide ? 'w-full max-w-xl mx-auto' : 'w-full'}`}
    >
      {/* Decorative Heart Watermark in Background */}
      <svg
        className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 pointer-events-none fill-current text-slate-700"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* Top section: Heart Icon & Badge */}
      <div className="flex items-center justify-between w-full mb-3 z-10">
        {/* Heart shaped icon wrapper */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center filter drop-shadow-sm group-hover:scale-110 transition-transform">
          {/* SVG Heart shape as icon container */}
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
          >
            <defs>
              <linearGradient id={`grad-${themeColor}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="text-white" stopColor="currentColor" />
                <stop offset="100%" className="text-slate-100" stopColor="currentColor" />
              </linearGradient>
            </defs>
            <path
              className={`fill-gradient bg-gradient-to-tr ${scheme.heartBg}`}
              fill="url(#heart-grad)"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {badge && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider ${scheme.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Title & Subtitle */}
      <div className="z-10 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{emoji}</span>
          <h3 className={`text-lg sm:text-xl font-bold font-display ${scheme.text}`}>
            {title}
          </h3>
        </div>
        <p className="text-xs text-slate-600 mt-1 font-medium line-clamp-2 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Bottom CTA hint */}
      <div className="z-10 mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-slate-800">
        <span>Buka Menu</span>
        <span className="group-hover:translate-x-1 transition-transform">➔</span>
      </div>
    </button>
  );
};
