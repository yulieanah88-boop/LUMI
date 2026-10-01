import { AchievementBadge } from '../types';

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-belajar',
    section: 'belajar',
    title: 'Penjelajah Waktu Cilik',
    nickname: 'Pemberani Sejarah',
    icon: '🕰️',
    color: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-300 hover:border-rose-400',
    bgGradient: 'bg-rose-50',
    description: 'Berhasil mempelajari perjalanan waktu manusia, alat transportasi, komunikasi, dan permainan anak dari zaman kakek-nenek hingga sekarang.',
    requirement: 'Buka dan baca materi atau tonton teater video pada Menu Belajar.',
    quote: '"Masa lalu memberi pelajaran, masa kini kita syukuri!"'
  },
  {
    id: 'badge-bermain',
    section: 'bermain',
    title: 'Pakar Mesin Waktu',
    nickname: 'Jagoan Game IPAS',
    icon: '🛸',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-300 hover:border-amber-400',
    bgGradient: 'bg-amber-50',
    description: 'Mampu mengoperasikan simulasi mesin waktu 3 era dan menuntaskan 5 format tantangan game edukasi.',
    requirement: 'Eksplorasi mesin waktu dan selesaikan kuis tantangan pada Menu Bermain.',
    quote: '"Belajar sambil bermain membuat otak kita cerdas dan ceria!"'
  },
  {
    id: 'badge-berlatih',
    section: 'berlatih',
    title: 'Cendekiawan Hebat',
    nickname: 'Bintang Asesmen HOTS',
    icon: '🌟',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-300 hover:border-emerald-400',
    bgGradient: 'bg-emerald-50',
    description: 'Menyelesaikan 10 soal asesmen HOTS kontekstual dengan kemampuan berpikir kritis tingkat tinggi.',
    requirement: 'Kerjakan dan kirimkan jawaban 10 soal asesmen pada Menu Berlatih.',
    quote: '"Pantang menyerah memecahkan tantangan berpikir!"'
  },
  {
    id: 'badge-refleksi',
    section: 'refleksi',
    title: 'Sahabat Bijak Masa Depan',
    nickname: 'Penjaga Bumi Asri',
    icon: '💖',
    color: 'from-sky-500 to-blue-500',
    borderColor: 'border-sky-300 hover:border-sky-400',
    bgGradient: 'bg-sky-50',
    description: 'Mengenali perasaan diri dengan emoji serta memiliki komitmen bijak memanfaatkan teknologi sehari-hari.',
    requirement: 'Isi dan simpan formulir refleksi diri pada Menu Refleksi.',
    quote: '"Teknologi hebat ada di tangan anak yang berhati mulia!"'
  },
  {
    id: 'badge-grandmaster',
    section: 'grand_master',
    title: 'Master Bintang Waktu',
    nickname: 'Juara Umum IPAS 3 SD',
    icon: '👑',
    color: 'from-amber-500 via-yellow-400 to-orange-500',
    borderColor: 'border-yellow-400 hover:border-amber-500',
    bgGradient: 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100',
    description: 'Pencapaian sempurna 100%! Seluruh 4 aktivitas petualangan Dahulu, Kini, dan Nanti telah tuntas dikuasai.',
    requirement: 'Selesaikan seluruh 4 menu: Belajar, Bermain, Berlatih, dan Refleksi.',
    quote: '"Generasi hebat siap memimpin masa depan Indonesia!"'
  }
];
