import React, { useState } from 'react';
import { Image as ImageIcon, Maximize2, X, Sparkles } from 'lucide-react';
import { ThemeVisualScene, VisualSceneCategory } from '../types/theme';

interface ChapterIllustrationProps {
  imageUrl?: string;
  imageAlt: string;
  caption: string;
  visualScene: ThemeVisualScene;
  points?: { title: string; desc: string; emoji?: string }[];
  compact?: boolean;
}

const SCENE_THEMES: Record<
  VisualSceneCategory,
  { bg: string; skyTop: string; skyBottom: string; hillBack: string; hillFront: string; accent: string; badge: string }
> = {
  nature_ecosystem: {
    bg: 'from-emerald-50 via-lime-50 to-sky-50',
    skyTop: '#bae6fd',
    skyBottom: '#ecfdf5',
    hillBack: '#86efac',
    hillFront: '#22c55e',
    accent: '#f59e0b',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  space_planet: {
    bg: 'from-indigo-950 via-slate-900 to-purple-950',
    skyTop: '#1e1b4b',
    skyBottom: '#312e81',
    hillBack: '#4338ca',
    hillFront: '#4f46e5',
    accent: '#facc15',
    badge: 'bg-indigo-100 text-indigo-900 border-indigo-200',
  },
  water_weather: {
    bg: 'from-sky-50 via-cyan-50 to-teal-50',
    skyTop: '#7dd3fc',
    skyBottom: '#e0f2fe',
    hillBack: '#67e8f9',
    hillFront: '#0ea5e9',
    accent: '#fbbf24',
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  science_energy: {
    bg: 'from-amber-50 via-yellow-50 to-sky-50',
    skyTop: '#fef3c7',
    skyBottom: '#e0f2fe',
    hillBack: '#fde68a',
    hillFront: '#38bdf8',
    accent: '#f59e0b',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  body_safety: {
    bg: 'from-emerald-50 via-teal-50 to-sky-50',
    skyTop: '#d1fae5',
    skyBottom: '#f0fdf4',
    hillBack: '#6ee7b7',
    hillFront: '#10b981',
    accent: '#0284c7',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  transport_tech: {
    bg: 'from-rose-50 via-amber-50 to-sky-50',
    skyTop: '#bae6fd',
    skyBottom: '#fff1f2',
    hillBack: '#fda4af',
    hillFront: '#fb7185',
    accent: '#f59e0b',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  communication: {
    bg: 'from-rose-50 via-pink-50 to-indigo-50',
    skyTop: '#fbcfe8',
    skyBottom: '#eef2ff',
    hillBack: '#f9a8d4',
    hillFront: '#ec4899',
    accent: '#6366f1',
    badge: 'bg-pink-100 text-pink-800 border-pink-200',
  },
  home_tradition: {
    bg: 'from-amber-50 via-orange-50 to-rose-50',
    skyTop: '#fed7aa',
    skyBottom: '#fffbeb',
    hillBack: '#fdba74',
    hillFront: '#f97316',
    accent: '#e11d48',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  civics_culture: {
    bg: 'from-rose-50 via-amber-50 to-emerald-50',
    skyTop: '#fecdd3',
    skyBottom: '#fef3c7',
    hillBack: '#fda4af',
    hillFront: '#f43f5e',
    accent: '#f59e0b',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  math_general: {
    bg: 'from-sky-50 via-indigo-50 to-purple-50',
    skyTop: '#e0e7ff',
    skyBottom: '#f0f9ff',
    hillBack: '#a5b4fc',
    hillFront: '#6366f1',
    accent: '#ec4899',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
};

const SceneBackdropSvg: React.FC<{ scene: ThemeVisualScene; compact?: boolean }> = ({
  scene,
  compact = false,
}) => {
  const palette = SCENE_THEMES[scene.sceneCategory] || SCENE_THEMES.civics_culture;
  const isDarkSpace = scene.sceneCategory === 'space_planet';

  return (
    <div
      className={`relative w-full ${
        compact ? 'min-h-[180px]' : 'aspect-[16/9] min-h-[220px] sm:min-h-[260px]'
      } bg-gradient-to-br ${palette.bg} overflow-hidden flex flex-col justify-between p-4`}
    >
      {/* Bespoke vector backdrop tailored by sceneCategory */}
      <svg
        viewBox="0 0 800 420"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sky-${scene.sceneCategory}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.skyTop} stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette.skyBottom} stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect width="800" height="420" fill={`url(#sky-${scene.sceneCategory})`} />

        {isDarkSpace ? (
          <>
            {/* Stars, orbit rings, and planets */}
            {[
              [80, 70, 2.5],
              [170, 120, 2],
              [260, 55, 3],
              [420, 80, 2],
              [550, 45, 2.8],
              [670, 110, 2.2],
              [740, 65, 3],
              [120, 240, 2],
              [690, 260, 2.5],
            ].map(([cx, cy, r], idx) => (
              <circle key={idx} cx={cx} cy={cy} r={r} fill="#fef08a" opacity="0.85" />
            ))}
            <ellipse
              cx="400"
              cy="220"
              rx="290"
              ry="95"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              strokeDasharray="8 8"
              opacity="0.5"
            />
            <circle cx="150" cy="150" r="46" fill="#facc15" opacity="0.9" />
            <circle cx="645" cy="185" r="34" fill="#38bdf8" opacity="0.88" />
            <ellipse
              cx="645"
              cy="185"
              rx="62"
              ry="14"
              fill="none"
              stroke="#fde68a"
              strokeWidth="4"
              opacity="0.7"
              transform="rotate(-15 645 185)"
            />
          </>
        ) : (
          <>
            {/* Sun / soft sky glow & fluffy clouds */}
            <circle cx="670" cy="88" r="48" fill={palette.accent} opacity="0.32" />
            <circle cx="670" cy="88" r="32" fill={palette.accent} opacity="0.75" />

            <g fill="#ffffff" opacity="0.85">
              <circle cx="135" cy="82" r="24" />
              <circle cx="165" cy="76" r="30" />
              <circle cx="198" cy="84" r="22" />
              <circle cx="445" cy="68" r="20" />
              <circle cx="472" cy="64" r="26" />
              <circle cx="498" cy="70" r="18" />
            </g>

            {/* Layered hills / water / terraced fields */}
            <path
              d="M0 305 Q180 230 390 295 T800 280 L800 420 L0 420 Z"
              fill={palette.hillBack}
              opacity="0.55"
            />
            <path
              d="M0 340 Q240 285 480 335 T800 325 L800 420 L0 420 Z"
              fill={palette.hillFront}
              opacity="0.38"
            />

            {/* Category-specific vector motifs */}
            {scene.sceneCategory === 'nature_ecosystem' && (
              <>
                <path
                  d="M0 365 Q200 345 400 365 T800 355 L800 420 L0 420 Z"
                  fill="#16a34a"
                  opacity="0.25"
                />
                <path d="M560 420 Q590 360 660 350 Q625 390 615 420 Z" fill="#38bdf8" opacity="0.65" />
              </>
            )}

            {scene.sceneCategory === 'water_weather' && (
              <>
                <path
                  d="M0 355 Q160 335 320 355 T640 355 T800 345 L800 420 L0 420 Z"
                  fill="#0284c7"
                  opacity="0.32"
                />
                {[145, 175, 205, 455, 485].map((x, i) => (
                  <line
                    key={i}
                    x1={x}
                    y1="115"
                    x2={x - 10}
                    y2="145"
                    stroke="#0284c7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                ))}
              </>
            )}

            {scene.sceneCategory === 'math_general' && (
              <g opacity="0.24" fill={palette.accent}>
                <rect x="85" y="160" width="60" height="60" rx="12" transform="rotate(-12 85 160)" />
                <polygon points="680,250 740,340 620,340" />
                <circle cx="140" cy="310" r="32" />
              </g>
            )}
          </>
        )}
      </svg>

      {/* Foreground illustrated centerpiece & story badges */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${palette.badge}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ilustrasi Visual Topik</span>
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-2">
        <div
          className={`${
            compact ? 'w-16 h-16 text-4xl' : 'w-20 h-20 sm:w-24 sm:h-24 text-5xl sm:text-6xl'
          } rounded-3xl bg-white/90 backdrop-blur-xs shadow-md border-2 border-white flex items-center justify-center mb-2.5`}
        >
          {scene.mainIcon}
        </div>
        <h4
          className={`font-display font-bold text-sm sm:text-base max-w-md px-3 py-1 rounded-xl ${
            isDarkSpace
              ? 'bg-slate-900/75 text-white border border-indigo-400/40'
              : 'bg-white/90 text-slate-800 border border-white shadow-xs'
          }`}
        >
          {scene.sceneTitle}
        </h4>
      </div>

      {/* Supporting concept icons strip */}
      <div className="relative z-10 flex items-center justify-center gap-2 flex-wrap">
        {scene.subIcons.slice(0, 4).map((icon, idx) => (
          <span
            key={idx}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/90 border border-white shadow-xs flex items-center justify-center text-lg sm:text-xl"
          >
            {icon}
          </span>
        ))}
      </div>
    </div>
  );
};

export const ChapterIllustration: React.FC<ChapterIllustrationProps> = ({
  imageUrl,
  imageAlt,
  caption,
  visualScene,
  points = [],
  compact = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const showRasterImage = Boolean(imageUrl && !imgError);

  return (
    <>
      <figure className="rounded-2xl overflow-hidden border border-rose-200/80 bg-white shadow-xs">
        <div className="relative group">
          {showRasterImage ? (
            <>
              <img
                src={imageUrl}
                alt={imageAlt}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className={`w-full ${
                  compact ? 'h-48 sm:h-52' : 'aspect-[4/3] sm:aspect-[16/10] max-h-[380px]'
                } object-cover bg-slate-100`}
              />
              {!compact && (
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold shadow-sm border border-slate-200/80 flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Perbesar ilustrasi materi"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Perbesar</span>
                </button>
              )}
            </>
          ) : (
            <div>
              <SceneBackdropSvg scene={visualScene} compact={compact} />
              {!compact && points.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50/90 border-t border-slate-100">
                  {points.slice(0, 3).map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white px-2.5 py-2 rounded-xl border border-slate-200/70 text-left"
                    >
                      <span className="text-lg shrink-0">
                        {pt.emoji || visualScene.subIcons[idx] || '📌'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 line-clamp-2">
                        {pt.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <figcaption className="px-3.5 py-2.5 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/60 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
          <ImageIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span className="leading-snug font-medium">{caption}</span>
        </figcaption>
      </figure>

      {/* Lightbox Modal (only when raster image is clicked) */}
      {isZoomOpen && showRasterImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-500" />
                <span>Ilustrasi Materi Belajar</span>
              </span>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                aria-label="Tutup perbesaran gambar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={imageUrl}
              alt={imageAlt}
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain bg-slate-50"
            />
            <div className="px-5 py-3 bg-rose-50/50 text-xs sm:text-sm text-slate-700 font-medium border-t border-slate-100">
              {caption}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
