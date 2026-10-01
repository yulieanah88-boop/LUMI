import { ThemeConfig } from '../../types';
import { GAME_QUESTIONS } from '../quizQuestions';
import { HOTS_QUESTIONS } from '../hotsQuestions';
import { ACHIEVEMENT_BADGES } from '../achievementBadges';
import { SUMBER_BELAJAR, GLOSARIUM_EKONOMI } from '../appData';
import { TUJUAN_PEMBELAJARAN, CAPAIAN_PEMBELAJARAN, PERTANYAAN_PEMANTIK, MATERI_BAB } from '../learningContent';

export const DAHULU_KINI_NANTI_THEME: ThemeConfig = {
  id: 'dahulu_kini_nanti',
  judulTema: 'Dahulu, Kini, dan Nanti',
  subJudul: 'Perjalanan Waktu & Perkembangan Kehidupan Manusia',
  mataPelajaran: 'IPAS (Ilmu Pengetahuan Alam dan Sosial)',
  fase: 'Fase B',
  kelas: 'Kelas III SD',
  emojiMaskot: '🕰️',
  sapaanLumi: 'Halo Sobat Cilik! Yuk bersama Lumi menjelajahi mesin waktu, melihat masa kakek nenek, masa kini, dan impian masa depan!',
  deskripsiSingkat: 'Menjelajahi perubahan alat transportasi, komunikasi, peralatan rumah, dan permainan anak dari masa lalu hingga masa depan.',
  palet: {
    id: 'rose',
    name: 'Mawar & Senja Pastel',
    primary: 'rose',
    primaryHex: '#f43f5e',
    secondaryHex: '#fb7185',
    accentHex: '#f59e0b',
    bgGradient: 'from-rose-50/70 via-pink-50/50 to-amber-50/70',
    cardBorder: 'border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-700',
  },
  tujuanPembelajaran: TUJUAN_PEMBELAJARAN,
  capaianPembelajaran: CAPAIAN_PEMBELAJARAN,
  belajar: {
    pertanyaanPemantik: PERTANYAAN_PEMANTIK.map((p) => ({
      ...p,
      imageEmoji: p.id === 1 ? '📜 📱' : '🪵 ⚡',
      narasiText: `${p.title}. ${p.scenario} ${p.question}`,
    })),
    materiBab: MATERI_BAB.map((m) => ({
      ...m,
      narasiText: `${m.title}. ${m.summary} ${m.points.map((pt) => `${pt.title}: ${pt.desc}`).join(' ')}`,
    })),
    videoSummary: {
      title: 'Perjalanan Mesin Waktu 3 Babak',
      stages: [
        {
          stageName: 'Babak 1: Zaman Dahulu',
          years: 'Tahun 1920-1960',
          desc: 'Kehidupan alami serba tradisional: delman kuda, lampu minyak teplok, dan surat pos kertas.',
          icon: '🐎',
        },
        {
          stageName: 'Babak 2: Masa Kini',
          years: 'Tahun 2026',
          desc: 'Era serba cepat: smartphone pintar, panggilan video, mobil listrik, dan kereta cepat Whoosh.',
          icon: '⚡',
        },
        {
          stageName: 'Babak 3: Masa Nanti',
          years: 'Tahun 2060+',
          desc: 'Impian masa depan: mobil terbang ramah lingkungan, komunikasi hologram 3D, dan kota hijau nol emisi.',
          icon: '🛸',
        },
      ],
    },
  },
  bermain: {
    simulation: {
      type: 'mesin_waktu',
      title: 'Simulasi Mesin Waktu Interaktif',
      badge: 'Penjelajahan 3 Era Waktu',
      description: 'Geser penunjuk waktu untuk melihat perbandingan alat transportasi, komunikasi, dapur, dan mainan di zaman dahulu, masa kini, dan masa depan.',
    },
    games: GAME_QUESTIONS,
  },
  berlatih: {
    questions: HOTS_QUESTIONS,
  },
  refleksi: {
    prompt: 'Bagaimana perasaanmu setelah menjelajahi waktu bersama Lumi hari ini?',
    emojiOptions: [
      { emoji: '🤩', label: 'Sangat Paham & Antusias', desc: 'Materi sangat jelas, seru, dan mudah dimengerti!' },
      { emoji: '😊', label: 'Mengerti & Senang', desc: 'Cukup paham dan menyukai berbagai contoh perubahannya.' },
      { emoji: '🤔', label: 'Masih Butuh Latihan', desc: 'Perlu membaca kembali beberapa perbandingan alat kuno.' },
      { emoji: '😴', label: 'Merasa Menantang', desc: 'Perlu bimbingan tambahan dari Bapak/Ibu Guru.' },
    ],
    favoriteOptions: [
      'Tujuan & Pemantik Bergambar (Menu Belajar)',
      'Simulasi Mesin Waktu Interaktif (Menu Bermain)',
      'Tantangan Game 5 Format (Menu Bermain)',
      '10 Soal Asesmen HOTS (Menu Berlatih)',
      'Unduh Piagam Prestasi Belajar',
    ],
    commitmentPrompt: 'Tuliskan satu hal yang paling kamu syukuri dari kemajuan teknologi saat ini dan bagaimana caramu membatasi penggunaan gawai dengan bijak:',
  },
  sumberBelajar: SUMBER_BELAJAR,
  glosarium: GLOSARIUM_EKONOMI,
  sertifikat: {
    appreciationText: 'Atas keberhasilan menuntaskan seluruh petualangan pembelajaran mesin waktu:',
    themeTitleOnCert: 'IPAS KELAS III SD: DAHULU, KINI, DAN NANTI',
    subText: 'Materi Perkembangan Teknologi, Transportasi, Komunikasi, dan Tradisi Kurikulum Merdeka',
  },
  badges: ACHIEVEMENT_BADGES,
};
