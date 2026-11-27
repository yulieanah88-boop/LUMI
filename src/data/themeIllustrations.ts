import transportasiImg from '../assets/images/transportasi_tiga_era_1795747862701.jpg';
import komunikasiImg from '../assets/images/komunikasi_dulu_kini_1795747862952.jpg';
import rumahPermainanImg from '../assets/images/rumah_permainan_anak_1795747864117.jpg';
import tubuhkuPrivasiImg from '../assets/images/tubuhku_privasi_sehat_1795747864312.jpg';
import lampuSentuhanImg from '../assets/images/lampu_sentuhan_aman_1795747865278.jpg';
import { ThemeVisualScene, VisualSceneCategory } from '../types/theme';

export const BUILTIN_ILLUSTRATIONS = {
  transportasi: transportasiImg,
  komunikasi: komunikasiImg,
  rumahPermainan: rumahPermainanImg,
  tubuhkuPrivasi: tubuhkuPrivasiImg,
  lampuSentuhan: lampuSentuhanImg,
} as const;

const VALID_SCENE_CATEGORIES: VisualSceneCategory[] = [
  'transport_tech',
  'communication',
  'home_tradition',
  'body_safety',
  'nature_ecosystem',
  'space_planet',
  'water_weather',
  'science_energy',
  'civics_culture',
  'math_general',
];

export function detectVisualSceneCategory(text: string): VisualSceneCategory {
  const lower = text.toLowerCase();

  if (
    /seksual|pubertas|reproduksi|tubuh|pribadi|privasi|sentuhan|pelecehan|aman|kebersihan diri|organ tubuh|pakaian dalam/.test(
      lower
    )
  ) {
    return 'body_safety';
  }
  if (
    /tata surya|planet|matahari|bulan|bintang|antariksa|galaksi|orbit|astronomi|gerhana/.test(
      lower
    )
  ) {
    return 'space_planet';
  }
  if (
    /daur air|siklus air|hujan|cuaca|iklim|awan|sungai|laut|banjir|kekeringan|musim/.test(
      lower
    )
  ) {
    return 'water_weather';
  }
  if (
    /ekosistem|sawah|hutan|hewan|tumbuhan|rantai makanan|fotosintesis|lingkungan|alam|padi|keanekaragaman|sampah|daur ulang/.test(
      lower
    )
  ) {
    return 'nature_ecosystem';
  }
  if (
    /energi|listrik|magnet|gaya|gerak|cahaya|bunyi|kalor|panas|sains|eksperimen|surya|panel/.test(
      lower
    )
  ) {
    return 'science_energy';
  }
  if (
    /transportasi|kendaraan|delman|kereta|mobil|pesawat|perahu|teknologi/.test(
      lower
    )
  ) {
    return 'transport_tech';
  }
  if (
    /komunikasi|surat|telepon|kentongan|internet|berita|pesan|media/.test(lower)
  ) {
    return 'communication';
  }
  if (
    /permainan|tradisional|egrang|congklak|rumah|dapur|setrika|lampu/.test(lower)
  ) {
    return 'home_tradition';
  }
  if (
    /pancasila|budaya|kerajaan|sejarah|nusantara|gotong royong|adat|keberagaman|hak dan kewajiban|profesi|ekonomi|pasar|uang/.test(
      lower
    )
  ) {
    return 'civics_culture';
  }
  if (
    /matematika|pecahan|bangun datar|bangun ruang|perkalian|pembagian|luas|keliling|bilangan|jam|pengukuran/.test(
      lower
    )
  ) {
    return 'math_general';
  }

  return 'civics_culture';
}

export interface ResolvedChapterVisual {
  imageUrl?: string;
  imageAlt: string;
  caption: string;
  visualScene: ThemeVisualScene;
}

export function resolveRelevantIllustration(params: {
  explicitImageUrl?: string;
  explicitImageAlt?: string;
  explicitCaption?: string;
  explicitVisualScene?: Partial<ThemeVisualScene>;
  themeId?: string;
  themeTitle?: string;
  subject?: string;
  chapterId?: string;
  chapterTitle: string;
  chapterSummary?: string;
  chapterPoints?: { title: string; desc: string; emoji?: string }[];
  chapterIndex?: number;
}): ResolvedChapterVisual {
  const {
    explicitImageUrl,
    explicitImageAlt,
    explicitCaption,
    explicitVisualScene,
    themeId,
    themeTitle = '',
    subject = '',
    chapterId = '',
    chapterTitle,
    chapterSummary = '',
    chapterPoints = [],
    chapterIndex = 0,
  } = params;

  const combinedText = `${themeTitle} ${subject} ${chapterId} ${chapterTitle} ${chapterSummary} ${chapterPoints
    .map((p) => p.title)
    .join(' ')}`;

  const detectedCategory =
    explicitVisualScene?.sceneCategory &&
    VALID_SCENE_CATEGORIES.includes(explicitVisualScene.sceneCategory)
      ? explicitVisualScene.sceneCategory
      : detectVisualSceneCategory(combinedText);

  let matchedImageUrl = explicitImageUrl;

  // Match built-in themes or closely related custom themes (e.g. body safety / puberty / transport / communication)
  if (!matchedImageUrl) {
    const lower = combinedText.toLowerCase();
    if (themeId === 'tubuhku_berharga' || detectedCategory === 'body_safety') {
      if (
        /sentuhan|lampu|tolak|pergi|ceritakan|rahasia|bahaya|melindungi|berani/.test(
          lower
        ) ||
        chapterIndex % 2 === 1
      ) {
        matchedImageUrl = lampuSentuhanImg;
      } else {
        matchedImageUrl = tubuhkuPrivasiImg;
      }
    } else if (themeId === 'dahulu_kini_nanti') {
      if (/komunikasi|surat/.test(lower)) matchedImageUrl = komunikasiImg;
      else if (/permainan|rumah|setrika/.test(lower)) matchedImageUrl = rumahPermainanImg;
      else matchedImageUrl = transportasiImg;
    } else if (/transportasi|delman|kereta|mobil terbang/.test(lower)) {
      matchedImageUrl = transportasiImg;
    } else if (/komunikasi|surat pos|kentongan|video call/.test(lower)) {
      matchedImageUrl = komunikasiImg;
    } else if (/permainan tradisional|peralatan rumah|permainan anak|congklak|egrang|setrika arang/.test(lower)) {
      matchedImageUrl = rumahPermainanImg;
    }
  }

  const defaultIconByCategory: Record<VisualSceneCategory, { main: string; subs: string[] }> = {
    nature_ecosystem: { main: '🌾', subs: ['☀️', '🐛', '🐦', '💧'] },
    space_planet: { main: '🪐', subs: ['☀️', '🌍', '🚀', '✨'] },
    water_weather: { main: '🌧️', subs: ['☀️', '☁️', '🌊', '🌱'] },
    science_energy: { main: '⚡', subs: ['☀️', '💡', '🔋', '🌿'] },
    body_safety: { main: '🛡️', subs: ['🧼', '🚦', '🗣️', '💖'] },
    transport_tech: { main: '🚄', subs: ['🐎', '🚗', '🛸', '🌍'] },
    communication: { main: '📱', subs: ['📜', '💬', '🌐', '🎧'] },
    home_tradition: { main: '🏡', subs: ['🪁', '💡', '🎲', '🤝'] },
    civics_culture: { main: '🏫', subs: ['🇮🇩', '🤝', '📚', '🌟'] },
    math_general: { main: '📐', subs: ['🔢', '🟦', '⚖️', '📊'] },
  };

  const pointEmojis = chapterPoints
    .map((p) => p.emoji?.trim())
    .filter((e): e is string => Boolean(e));

  const fallbackIcons = defaultIconByCategory[detectedCategory];
  const caption =
    explicitCaption ||
    explicitVisualScene?.caption ||
    `Ilustrasi visual materi "${chapterTitle}" pada tema ${themeTitle || 'pembelajaran'}.`;

  const visualScene: ThemeVisualScene = {
    sceneCategory: detectedCategory,
    sceneTitle: explicitVisualScene?.sceneTitle || chapterTitle,
    mainIcon: explicitVisualScene?.mainIcon || pointEmojis[0] || fallbackIcons.main,
    subIcons:
      explicitVisualScene?.subIcons && explicitVisualScene.subIcons.length > 0
        ? explicitVisualScene.subIcons.slice(0, 4)
        : pointEmojis.length >= 2
        ? pointEmojis.slice(0, 4)
        : fallbackIcons.subs,
    caption,
  };

  return {
    imageUrl: matchedImageUrl,
    imageAlt: explicitImageAlt || `Ilustrasi ${chapterTitle} - ${themeTitle}`,
    caption,
    visualScene,
  };
}
