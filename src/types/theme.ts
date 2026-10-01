import { GameQuestion, HotsQuestion, AchievementBadge } from './index';

export interface ThemePalette {
  id: string;
  name: string;
  primary: string; // 'rose' | 'amber' | 'emerald' | 'sky' | 'indigo' | 'purple' | 'teal'
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  bgGradient: string;
  cardBorder: string;
  badgeBg: string;
}

export interface ThemeLearningPrompt {
  id: number;
  title: string;
  scenario: string;
  imageCaption: string;
  imageEmoji: string;
  question: string;
  options: { text: string; feedback: string }[];
  narasiText?: string;
}

export interface ThemeLearningChapter {
  id: string;
  title: string;
  badge: string;
  summary: string;
  narasiText: string;
  points: {
    title: string;
    desc: string;
    emoji?: string;
  }[];
  tableData?: {
    price: string;
    qty: string;
    label: string;
  }[];
}

export interface ThemeSimulation {
  type: 'mesin_waktu' | 'lampu_sentuhan' | 'custom_interactive';
  title: string;
  badge: string;
  description: string;
  data?: any;
}

export interface ThemeReference {
  title: string;
  author: string;
  year: string;
  type: string;
  description: string;
  link?: string;
}

export interface ThemeGlossaryItem {
  term: string;
  meaning: string;
}

export interface ThemeCertificateConfig {
  appreciationText: string;
  themeTitleOnCert: string;
  subText?: string;
}

export interface ThemeSensitivityNote {
  title: string;
  summary: string;
  adultGuide: string[];
  helplines: {
    name: string;
    contact: string;
    description: string;
  }[];
}

export interface ThemeConfig {
  id: string;
  judulTema: string;
  subJudul: string;
  mataPelajaran: string;
  fase: string;
  kelas: string;
  emojiMaskot: string;
  sapaanLumi: string;
  deskripsiSingkat: string;
  palet: ThemePalette;
  tujuanPembelajaran: {
    id: number;
    text: string;
    icon: string;
  }[];
  capaianPembelajaran: string;
  belajar: {
    pertanyaanPemantik: ThemeLearningPrompt[];
    materiBab: ThemeLearningChapter[];
    videoSummary?: {
      title: string;
      stages: { stageName: string; years: string; desc: string; icon: string }[];
    };
  };
  bermain: {
    simulation: ThemeSimulation;
    games: GameQuestion[];
  };
  berlatih: {
    questions: HotsQuestion[];
  };
  refleksi: {
    prompt: string;
    emojiOptions?: { emoji: string; label: string; desc: string }[];
    favoriteOptions?: string[];
    commitmentPrompt: string;
    trustedAdultsPrompt?: string;
  };
  sumberBelajar: ThemeReference[];
  glosarium: ThemeGlossaryItem[];
  sertifikat: ThemeCertificateConfig;
  badges: AchievementBadge[];
  isCustom?: boolean;
  sensitivityNote?: ThemeSensitivityNote;
}
