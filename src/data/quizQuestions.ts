import { GameQuestion } from '../types';

export const GAME_QUESTIONS: GameQuestion[] = [
  // 1. Pilihan Ganda (PG)
  {
    id: 'game-pg-1',
    type: 'mc',
    title: 'Tantangan 1: Pilihan Ganda (PG)',
    prompt: 'Pada zaman dahulu sebelum ada listrik, benda apakah yang sering digunakan oleh masyarakat di pedesaan untuk menerangi rumah di malam hari?',
    options: [
      'Lampu minyak tanah (lampu teplok/pelita)',
      'Lampu senter baterai cas',
      'Lampu bohlam LED otomatis',
      'Lampu sorot tenaga surya'
    ],
    correctAnswer: 0,
    explanation: 'Pada zaman dahulu sebelum ada aliran listrik masuk ke desa, masyarakat menggunakan lampu minyak tanah atau lampu teplok/pelita dengan sumbu kain.'
  },
  // 2. Pilihan Ganda Kompleks (Centang lebih dari 1)
  {
    id: 'game-pg-kompleks',
    type: 'complex',
    title: 'Tantangan 2: Pilihan Ganda Kompleks (Pilih 3 Jawaban Tepat)',
    prompt: 'Manakah dari peralatan dan alat transportasi di bawah ini yang merupakan ciri khas kehidupan pada zaman DAHULU? (Pilihlah 3 jawaban yang tepat)',
    options: [
      'Delman yang ditarik oleh kuda',
      'Setrika arang kayu dari besi tebal',
      'Mobil listrik bertenaga baterai',
      'Kentongan bambu di pos ronda',
      'Kereta api cepat Whoosh'
    ],
    correctAnswers: [0, 1, 3], // 0: Delman, 1: Setrika arang, 3: Kentongan bambu
    explanation: 'Delman, setrika arang, dan kentongan bambu adalah alat tradisional zaman dahulu. Sedangkan mobil listrik dan kereta cepat adalah teknologi masa kini.'
  },
  // 3. Menjodohkan (Matching Game)
  {
    id: 'game-matching',
    type: 'matching',
    title: 'Tantangan 3: Menjodohkan Alat Dahulu dengan Penggantinya Masa Kini',
    prompt: 'Pasangkanlah peralatan zaman DAHULU di sebelah kiri dengan alat padanannya di masa KINI di sebelah kanan!',
    pairs: [
      {
        id: 'p1',
        leftText: 'Surat pos kertas dengan perangko',
        rightText: 'Pesan instan WhatsApp / Video Call'
      },
      {
        id: 'p2',
        leftText: 'Perahu kayu dayung manual',
        rightText: 'Kapal feri bermesin diesel modern'
      },
      {
        id: 'p3',
        leftText: 'Tungku masak kayu bakar berdebu',
        rightText: 'Kompor gas & Kompor induksi listrik'
      },
      {
        id: 'p4',
        leftText: 'Permainan Egrang bambu di lapangan',
        rightText: 'Permainan edukatif di gawai pintar'
      }
    ],
    explanation: 'Perkembangan teknologi memudahkan kehidupan kita: surat pos digantikan pesan instan, perahu dayung digantikan kapal bermesin, tungku kayu digantikan kompor listrik, dan mainan tradisional kini ada versi digitalnya!'
  },
  // 4. Isian Singkat
  {
    id: 'game-short-1',
    type: 'short',
    title: 'Tantangan 4: Isian Singkat',
    prompt: 'Alat komunikasi tradisional zaman dahulu yang terbuat dari batang bambu atau kayu berongga dan dipukul untuk mengumpulkan warga atau memberi tanda bahaya disebut dengan alat ... (satu kata).',
    acceptedAnswers: ['kentongan', 'kentungan', 'kentongan bambu'],
    hint: 'Benda berawalan huruf K, sering digantung di pos ronda malam.',
    explanation: 'Kentongan adalah alat komunikasi tradisional Nusantara yang dipukul dengan irama tertentu untuk menyampaikan berita atau peringatan bahaya kepada warga desa.'
  },
  // 5. Menyusun Ulang (Reordering dengan panah naik dan panah turun)
  {
    id: 'game-reorder-1',
    type: 'reorder',
    title: 'Tantangan 5: Menyusun Urutan Perkembangan Alat Transportasi',
    prompt: 'Gunakan tombol Panah Naik (⬆️) dan Panah Turun (⬇️) untuk menyusun urutan perkembangan alat transportasi dari yang PALING DAHULU (Kuno) hingga MASA DEPAN (Nanti)!',
    items: [
      {
        id: 'step-3',
        label: 'Mobil berbahan bakar bensin dan mobil listrik ramah lingkungan (Masa Kini)'
      },
      {
        id: 'step-1',
        label: 'Berjalan kaki dan menunggangi kuda atau memakai gerobak pedati hewan (Zaman Dahulu Awal)'
      },
      {
        id: 'step-4',
        label: 'Mobil terbang otomatis dan kereta kapsul magnet berkecepatan suara (Masa Nanti)'
      },
      {
        id: 'step-2',
        label: 'Kereta api uap batu bara dan sepeda kayuh beroda besar (Zaman Transisi)'
      }
    ],
    correctOrder: ['step-1', 'step-2', 'step-3', 'step-4'],
    explanation: 'Urutan sejarah transportasi: 1) Tenaga hewan/kaki -> 2) Mesin uap & sepeda klasik -> 3) Mobil bensin/listrik masa kini -> 4) Kendaraan terbang masa depan!'
  }
];
