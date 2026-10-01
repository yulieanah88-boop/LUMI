import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sliders,
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Trophy,
  Clock,
  Compass,
  Shield,
  Check,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GAME_QUESTIONS } from '../data/quizQuestions';
import { ReorderItem, MatchingPair, ThemeConfig } from '../types';
import { sound } from '../utils/audio';

interface BermainMenuProps {
  onBack: () => void;
  onGoToBerlatih: () => void;
  onMarkCompleted: () => void;
  isCompleted: boolean;
  theme?: ThemeConfig;
}

export const BermainMenu: React.FC<BermainMenuProps> = ({
  onBack,
  onGoToBerlatih,
  onMarkCompleted,
  isCompleted,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'simulasi' | 'game'>('simulasi');

  // --- State for Mesin Waktu Simulation ---
  const [selectedEra, setSelectedEra] = useState<'dahulu' | 'kini' | 'nanti'>('kini');
  const [selectedCategory, setSelectedCategory] = useState<'transportasi' | 'komunikasi' | 'dapur' | 'mainan'>('transportasi');

  const eraData = {
    dahulu: {
      year: 'Tahun 1920 - 1950',
      title: 'Zaman Dahulu (Masa Lalu Kakek Nenek)',
      themeColor: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
      details: {
        transportasi: {
          icon: '🐎 🚲 ⛵',
          name: 'Delman, Sepeda Onthel, & Perahu Layar Kayu',
          desc: 'Mengandalkan tenaga otot kuda, sapi, dan kayuhan kaki manusia. Perjalanan antardesa butuh waktu seharian, tetapi bebas polusi asap beracun.',
          features: ['Tenaga hewan dan angin', 'Jarak tempuh terbatas', 'Suasana tenang tanpa bising mesin']
        },
        komunikasi: {
          icon: '📜 🕊️ 🪘',
          name: 'Kentongan Bambu, Bedug, & Surat Pos Kertas',
          desc: 'Kabar disampaikan lewat bunyi ketukan kayu kentongan saat ada bahaya atau ronda malam. Surat pos ditulis tangan dan diantar pak pos naik sepeda.',
          features: ['Bunyi kentongan dipahami satu kampung', 'Surat menunggu berminggu-minggu', 'Kertas dengan perangko unik']
        },
        dapur: {
          icon: '🪵 🔥 🏮',
          name: 'Lampu Minyak Teplok & Tungku Kayu Bakar',
          desc: 'Malam hari diterangi api pelita minyak tanah. Memasak di atas tanah liat dengan kayu bakar yang menghasilkan asap harum kayu.',
          features: ['Sumbu api minyak tanah', 'Menjaga bara api kayu', 'Setrika arang kayu berat']
        },
        mainan: {
          icon: '🪁 🤹 🎋',
          name: 'Egrang Bambu, Gasing Kayu, & Gobak Sodor',
          desc: 'Anak-anak berlarian di lapangan tanah lapang bersama puluhan teman tetangga. Tubuh berkeringat sehat dan melatih kekompakan.',
          features: ['Bermain di alam terbuka', 'Bahan alami bambu & kayu', 'Tertawa bersama teman sekampung']
        }
      }
    },
    kini: {
      year: 'Tahun 2026 (Masa Sekarang)',
      title: 'Masa Kini (Era Digital & Listrik Canggih)',
      themeColor: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 border-blue-200 text-blue-900',
      details: {
        transportasi: {
          icon: '🚗 ⚡ 🚄',
          name: 'Mobil Listrik Baterai & Kereta Cepat Whoosh',
          desc: 'Kendaraan beroda empat dengan motor listrik bertenaga baterai tanpa suara dan kereta cepat berkecepatan 350 km/jam.',
          features: ['Hemat energi fosil', 'Bisa melintasi kota dalam hitungan menit', 'Dipandu sensor GPS satelit']
        },
        komunikasi: {
          icon: '📱 💬 📹',
          name: 'Smartphone, Chat WhatsApp, & Video Call',
          desc: 'Pesan teks, foto, suara, dan panggilan video tatap muka terkirim ke belahan dunia lain dalam tempo 1 detik melalui jaringan internet.',
          features: ['Panggilan video langsung', 'Kamera foto jernih', 'Informasi dunia di genggaman tangan']
        },
        dapur: {
          icon: '💡 🍚 🔌',
          name: 'Lampu Bohlam LED & Penanak Nasi Rice Cooker',
          desc: 'Cukup menekan tombol atau menyalakan sakelar dinding. Nasi matang otomatis, ruangan terang benderang hemat listrik tanpa api terbuka.',
          features: ['Praktis & bersih dari asap', 'Otomatis menjaga nasi tetap hangat', 'Lampu sensor gerak pintar']
        },
        mainan: {
          icon: '🎮 🧩 💻',
          name: 'Game Edukasi Tablet & Robot Lego Koding',
          desc: 'Belajar logika matematika, menggambar digital, dan menyusun kepingan robot pintar yang bisa bergerak dengan perintah komputer.',
          features: ['Melatih otak dan kreativitas', 'Grafis warna-warni menarik', 'Perlu dibatasi agar mata tetap sehat']
        }
      }
    },
    nanti: {
      year: 'Tahun 2060 (Masa Depan Impian)',
      title: 'Masa Nanti (Masa Depan Hijau & Teknologi Ramah)',
      themeColor: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      details: {
        transportasi: {
          icon: '🛸 🚀 🌿',
          name: 'Mobil Terbang Tenaga Surya & Taksi Drone',
          desc: 'Kendaraan yang melayang di jalur udara khusus dengan panduan komputer pintar tanpa pengemudi. Bebas macet darat dan nol polusi udara!',
          features: ['Energi matahari 100% murni', 'Navigasi pintar anti-tabrakan', 'Kota hijau tanpa polusi asap']
        },
        komunikasi: {
          icon: '🌐 🕶️ ✨',
          name: 'Komunikasi Hologram 3D & Kacamata Pintar',
          desc: 'Sosok orang yang kita ajak bicara muncul dalam bentuk proyeksi cahaya 3 dimensi seolah berdiri langsung di depan meja kita.',
          features: ['Proyeksi hologram nyata', 'Penerjemah bahasa instan otomatis', 'Kacamata pintar penampil informasi']
        },
        dapur: {
          icon: '🤖 🥗 ☀️',
          name: 'Rumah Pintar Mandiri Energi & Robot Asisten',
          desc: 'Atap rumah menyerap sinar matahari dan air hujan yang disaring murni. Robot asisten ramah membantu memasak makanan sehat bergizi seimbang.',
          features: ['Dapur bersih daur ulang otomatis', 'Bahan makanan organik segar', 'Robot pintar pemilah sampah']
        },
        mainan: {
          icon: '🌌 🪐 🎮',
          name: 'Petualangan Virtual Reality Ruang Angkasa',
          desc: 'Anak-anak bisa memakai helm ringan untuk berjalan-jalan di planet Mars atau menyelam ke dasar laut dalam tanpa basah sambil tetap bergerak aktif.',
          features: ['Simulasi sains yang menakjubkan', 'Belajar sambil berolahraga gerak', 'Eksplorasi alam semesta interaktif']
        }
      }
    }
  };

  const currentEraInfo = eraData[selectedEra];
  const currentDetail = currentEraInfo.details[selectedCategory];

  // Games setup
  const games = theme?.bermain?.games && theme.bermain.games.length > 0
    ? theme.bermain.games
    : GAME_QUESTIONS;

  // --- State for 5 Game Formats ---
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [mcSelection, setMcSelection] = useState<number | null>(null);
  const [complexSelection, setComplexSelection] = useState<number[]>([]);
  const [matchingSelections, setMatchingSelections] = useState<{ [pairId: string]: string }>({});
  const [shortInput, setShortInput] = useState('');

  const initialReorderQuestion = games.find((g) => g.type === 'reorder') as { items: ReorderItem[] } | undefined;
  const [reorderedItems, setReorderedItems] = useState<ReorderItem[]>(
    initialReorderQuestion?.items || (GAME_QUESTIONS[4] as { items: ReorderItem[] }).items
  );

  const [feedback, setFeedback] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    message: string;
  } | null>(null);

  const [gameScore, setGameScore] = useState(0);
  const [isCompletedAllGames, setIsCompletedAllGames] = useState(false);

  const currentGame = games[currentGameIndex] || games[0];

  // When game switches to a reorder type, sync items
  useEffect(() => {
    if (currentGame?.type === 'reorder') {
      const reorderQ = currentGame as { items: ReorderItem[] };
      setReorderedItems([...reorderQ.items]);
    }
  }, [currentGameIndex, currentGame]);

  // --- State for Lampu Sentuhan Simulation (Theme #2 & safety themes) ---
  const isLampuSentuhan = theme?.bermain?.simulation?.type === 'lampu_sentuhan' || theme?.id === 'tubuhku_berharga';
  const lampuScenarios = (theme?.bermain?.simulation?.data?.scenarios as Array<{
    id: number;
    title: string;
    situation: string;
    icon: string;
    correctColor: 'green' | 'yellow' | 'red';
    feedback: string;
  }>) || [
    {
      id: 1,
      title: 'Bersalaman Sopan dengan Guru saat Masuk Kelas',
      situation: 'Kamu mencium tangan guru saat tiba di sekolah pagi hari.',
      icon: '🤝',
      correctColor: 'green',
      feedback: 'Benar! Ini sentuhan aman (Hijau) yang sopan dan merupakan bentuk penghormatan kepada guru.',
    },
    {
      id: 2,
      title: 'Seseorang Meminta Melihat Pakaian Dalammu',
      situation: 'Seorang kenalan memintamu memperlihatkan apa yang ada di dalam pakaian dalammu di tempat sepi.',
      icon: '🛑',
      correctColor: 'red',
      feedback: 'Tepat sekali! Ini sentuhan merah (Bahaya). Segera teriakkan TIDAK, lari, dan ceritakan pada orang tua!',
    },
    {
      id: 3,
      title: 'Ibu Mengompres Dahimu saat Sakit Demam',
      situation: 'Ibu meletakkan kain kompres hangat di keningmu dan membelai rambutmu saat kamu sakit flu.',
      icon: '🌡️',
      correctColor: 'green',
      feedback: 'Benar! Ini sentuhan aman (Hijau) penuh kasih sayang dan perawatan dari orang tua.',
    },
    {
      id: 4,
      title: 'Dipaksa Berpelukan oleh Orang Asing dengan Janji Permen',
      situation: 'Orang yang baru kamu temui di taman memaksamu duduk di pangkuannya sambil menjanjikan mainan baru.',
      icon: '⚠️',
      correctColor: 'yellow',
      feedback: 'Tepat! Ini sentuhan membingungkan/kuning menjurus merah. Jangan mau dirayu hadiah, segera tolak dan dekati orang tuamu!',
    },
    {
      id: 5,
      title: 'Dokter Memeriksa Dada Didampingi Ayah',
      situation: 'Dokter mendengarkan detak jantungmu menggunakan stetoskop di ruang periksa dengan ayah berdiri di sampingmu.',
      icon: '🩺',
      correctColor: 'green',
      feedback: 'Benar! Pemeriksaan medis aman (Hijau) karena dilakukan tenaga medis profesional dengan pendampingan orang tua.',
    },
    {
      id: 6,
      title: 'Dilarang Bercerita kepada Siapa Pun',
      situation: 'Seseorang memegang pundakmu dengan kasar dan mengancam: "Awas kalau bilang ke ibumu, nanti kuambil sepedamu!"',
      icon: '🚨',
      correctColor: 'red',
      feedback: 'Tepat! Ini bahaya merah (Red). Ancaman dan rahasia buruk WAJIB dilaporkan. Jangan takut, kamu tidak bersalah!',
    },
  ];

  const [lampuScenarioIdx, setLampuScenarioIdx] = useState(0);
  const [lampuSelectedColor, setLampuSelectedColor] = useState<'green' | 'yellow' | 'red' | null>(null);
  const [lampuFeedback, setLampuFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [lampuScore, setLampuScore] = useState(0);
  const [lampuCompleted, setLampuCompleted] = useState(false);

  const currentLampuScenario = lampuScenarios[lampuScenarioIdx] || lampuScenarios[0];

  const handleLampuChooseColor = (color: 'green' | 'yellow' | 'red') => {
    if (lampuFeedback) return;
    sound.playClick();
    setLampuSelectedColor(color);

    const isCorrect = color === currentLampuScenario.correctColor;
    if (isCorrect) {
      sound.playCorrect();
      setLampuScore((prev) => prev + 1);
      setLampuFeedback({
        isCorrect: true,
        message: currentLampuScenario.feedback,
      });
    } else {
      sound.playWrong();
      setLampuFeedback({
        isCorrect: false,
        message: `Kurang tepat. ${currentLampuScenario.feedback}`,
      });
    }
  };

  const handleNextLampuScenario = () => {
    sound.playClick();
    setLampuSelectedColor(null);
    setLampuFeedback(null);

    if (lampuScenarioIdx < lampuScenarios.length - 1) {
      setLampuScenarioIdx((prev) => prev + 1);
    } else {
      setLampuCompleted(true);
      sound.playFanfare();
      triggerConfetti();
    }
  };

  const handleRestartLampu = () => {
    sound.playClick();
    setLampuScenarioIdx(0);
    setLampuSelectedColor(null);
    setLampuFeedback(null);
    setLampuScore(0);
    setLampuCompleted(false);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Game Handlers
  const handleCheckCurrentGame = () => {
    sound.playClick();

    if (currentGame.type === 'mc') {
      if (mcSelection === null) return;
      const correct = mcSelection === currentGame.correctAnswer;
      if (correct) {
        sound.playCorrect();
        setGameScore(prev => prev + 20);
        setFeedback({
          submitted: true,
          isCorrect: true,
          message: `Pintar sekali! Jawabanmu 100% benar. ${currentGame.explanation}`
        });
      } else {
        sound.playWrong();
        setFeedback({
          submitted: true,
          isCorrect: false,
          message: `Yuk coba lagi! ${currentGame.explanation}`
        });
      }
    } else if (currentGame.type === 'complex') {
      const correctAnswers = currentGame.correctAnswers.slice().sort();
      const userAnswers = complexSelection.slice().sort();
      const isMatch =
        correctAnswers.length === userAnswers.length &&
        correctAnswers.every((val, idx) => val === userAnswers[idx]);

      if (isMatch) {
        sound.playCorrect();
        setGameScore(prev => prev + 20);
        setFeedback({
          submitted: true,
          isCorrect: true,
          message: `Hebat! Pilihan jawabanmu tepat sekali. ${currentGame.explanation}`
        });
      } else {
        sound.playWrong();
        setFeedback({
          submitted: true,
          isCorrect: false,
          message: `Perhatikan baik-baik: ${currentGame.explanation}`
        });
      }
    } else if (currentGame.type === 'matching') {
      const pairs = (currentGame as { pairs: MatchingPair[] }).pairs;
      let allCorrect = true;
      pairs.forEach((p) => {
        if (matchingSelections[p.id] !== p.rightText) {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        sound.playCorrect();
        setGameScore(prev => prev + 20);
        setFeedback({
          submitted: true,
          isCorrect: true,
          message: `Luar Biasa! Semua pasangan cocok sempurna! ${currentGame.explanation}`
        });
      } else {
        sound.playWrong();
        setFeedback({
          submitted: true,
          isCorrect: false,
          message: `Ada pasangan yang belum pas. Coba cocokkan kembali pasangan yang tepat!`
        });
      }
    } else if (currentGame.type === 'short') {
      const trimmed = shortInput.trim().toLowerCase();
      const accepted = (currentGame as { acceptedAnswers: string[] }).acceptedAnswers.map((a) =>
        a.toLowerCase()
      );
      const isCorrect = accepted.includes(trimmed);

      if (isCorrect) {
        sound.playCorrect();
        setGameScore(prev => prev + 20);
        setFeedback({
          submitted: true,
          isCorrect: true,
          message: `Tepat sekali! Jawabanmu benar. ${currentGame.explanation}`
        });
      } else {
        sound.playWrong();
        setFeedback({
          submitted: true,
          isCorrect: false,
          message: `Jawabanmu belum pas. Petunjuk: ${(currentGame as { hint?: string }).hint || ''}. ${currentGame.explanation}`
        });
      }
    } else if (currentGame.type === 'reorder') {
      const correctOrder = (currentGame as { correctOrder: string[] }).correctOrder;
      const currentOrder = reorderedItems.map((item) => item.id);
      const isMatch = correctOrder.every((id, idx) => id === currentOrder[idx]);

      if (isMatch) {
        sound.playCorrect();
        sound.playFanfare();
        triggerConfetti();
        setGameScore(prev => prev + 20);
        setFeedback({
          submitted: true,
          isCorrect: true,
          message: `Juara! Urutan langkah sudah tepat dan runtut! ${currentGame.explanation}`
        });
      } else {
        sound.playWrong();
        setFeedback({
          submitted: true,
          isCorrect: false,
          message: `Urutan belum sepenuhnya tepat. Gunakan panah naik/turun untuk menukar langkah ke urutan yang benar!`
        });
      }
    }
  };

  const handleNextGame = () => {
    sound.playClick();
    setFeedback(null);
    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex(prev => prev + 1);
    } else {
      setIsCompletedAllGames(true);
      onMarkCompleted();
      sound.playFanfare();
      triggerConfetti();
    }
  };

  const handleNextToBerlatih = () => {
    sound.playClick();
    onMarkCompleted();
    onGoToBerlatih();
  };

  const handleRestartGames = () => {
    sound.playClick();
    setCurrentGameIndex(0);
    setMcSelection(null);
    setComplexSelection([]);
    setMatchingSelections({});
    setShortInput('');
    setFeedback(null);
    setGameScore(0);
    setIsCompletedAllGames(false);
  };

  const moveItemUp = (idx: number) => {
    if (idx === 0) return;
    sound.playClick();
    const newItems = [...reorderedItems];
    const temp = newItems[idx - 1];
    newItems[idx - 1] = newItems[idx];
    newItems[idx] = temp;
    setReorderedItems(newItems);
  };

  const moveItemDown = (idx: number) => {
    if (idx === reorderedItems.length - 1) return;
    sound.playClick();
    const newItems = [...reorderedItems];
    const temp = newItems[idx + 1];
    newItems[idx + 1] = newItems[idx];
    newItems[idx] = temp;
    setReorderedItems(newItems);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4 pb-4 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-amber-200 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-display flex items-center gap-2 flex-wrap">
              <span>🎮 Menu Bermain: {theme?.judulTema || 'Dahulu, Kini, & Nanti'}</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-sans font-bold">
                {theme?.bermain?.simulation?.badge || 'Simulasi & 5 Game Seru'}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Selesai Dimainkan</span>
            </span>
          ) : (
            <button
              onClick={() => {
                sound.playCorrect();
                onMarkCompleted();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Tandai Selesai</span>
            </button>
          )}

          <button
            onClick={handleNextToBerlatih}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>Lanjut ke Asesmen HOTS</span>
            <span>✍️➔</span>
          </button>
        </div>
      </header>

      {/* Sub Tabs: Menu Simulasi & Menu Game */}
      <nav aria-label="Sub-menu Bermain" className="max-w-5xl w-full mx-auto my-4">
        <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-2xl border border-amber-100 shadow-xs">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('simulasi');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'simulasi'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isLampuSentuhan ? '1. Simulasi Lampu Sentuhan 🚦' : (theme?.bermain?.simulation?.title || '1. Menu Simulasi Interaktif')}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('game');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>2. Menu Game ({games.length} Format Tantangan)</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto flex-1 my-2">
        {/* ================= SECTION 1: SIMULASI INTERAKTIF ================= */}
        {activeTab === 'simulasi' && (
          isLampuSentuhan ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Simulasi Perlindungan Diri &amp; Privasi
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display mt-2">
                    🚦 Lampu Lalu Lintas Sentuhan: Aman, Ragu, &amp; Bahaya
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold">
                    Skenario {lampuScenarioIdx + 1} dari {lampuScenarios.length}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
                    Poin: {lampuScore}
                  </span>
                </div>
              </div>

              {lampuCompleted ? (
                <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg text-4xl">
                    🛡️
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800 font-display">
                    Luar Biasa! Kamu Penjaga Diri yang Hebat!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Kamu berhasil menguasai jurus membedakan sentuhan aman, membingungkan, dan tidak aman dengan skor <strong>{lampuScore} dari {lampuScenarios.length} benar</strong>! Ingat selalu jurus: <strong>TOLAK, PERGI, CERITAKAN!</strong>
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                      onClick={handleRestartLampu}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Ulangi Simulasi</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('game');
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Lanjut ke Tantangan Game</span>
                      <span>🎮➔</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Scenario Question Card */}
                  <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl flex flex-col md:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-4xl shadow-xs shrink-0">
                      {currentLampuScenario.icon}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Skenario #{lampuScenarioIdx + 1}:
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 font-display mb-1.5">
                        {currentLampuScenario.title}
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200/80">
                        "{currentLampuScenario.situation}"
                      </p>
                    </div>
                  </div>

                  {/* 3 Traffic Light Action Buttons */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 text-center">
                      Klasifikasikan: Termasuk Jenis Sentuhan Mana Situasi Ini?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Green button */}
                      <button
                        type="button"
                        disabled={!!lampuFeedback}
                        onClick={() => handleLampuChooseColor('green')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          lampuSelectedColor === 'green'
                            ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 scale-102'
                            : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-xs animate-pulse" />
                          <span className="font-bold text-sm text-emerald-800">Lampu Hijau (🟢 Aman)</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          Sentuhan yang sopan, ramah, dan penuh kasih sayang (misal: salaman dengan guru, pelukan orang tua saat sakit).
                        </p>
                      </button>

                      {/* Yellow button */}
                      <button
                        type="button"
                        disabled={!!lampuFeedback}
                        onClick={() => handleLampuChooseColor('yellow')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          lampuSelectedColor === 'yellow'
                            ? 'bg-amber-50 border-amber-500 ring-4 ring-amber-200 scale-102'
                            : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-amber-500 shadow-xs animate-pulse" />
                          <span className="font-bold text-sm text-amber-800">Lampu Kuning (🟡 Ragu)</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          Sentuhan yang membingungkan atau membuat hati risih/tidak nyaman. Waspada dan jangan simpan rahasia!
                        </p>
                      </button>

                      {/* Red button */}
                      <button
                        type="button"
                        disabled={!!lampuFeedback}
                        onClick={() => handleLampuChooseColor('red')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          lampuSelectedColor === 'red'
                            ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-200 scale-102'
                            : 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-rose-500 shadow-xs animate-pulse" />
                          <span className="font-bold text-sm text-rose-800">Lampu Merah (🔴 Bahaya)</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          Menyentuh area pribadi (tertutup pakaian dalam) atau paksaan. Gunakan jurus: TOLAK, PERGI, CERITAKAN!
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Box */}
                  {lampuFeedback && (
                    <div
                      className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in ${
                        lampuFeedback.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                    >
                      {lampuFeedback.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <strong className="block mb-0.5">
                          {lampuFeedback.isCorrect ? 'Tepat Sekali! 🎉' : 'Ulasan Pembelajaran:'}
                        </strong>
                        <p className="leading-relaxed">{lampuFeedback.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Next Scenario Button */}
                  {lampuFeedback && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleNextLampuScenario}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>
                          {lampuScenarioIdx < lampuScenarios.length - 1
                            ? 'Lanjut ke Skenario Berikutnya ➔'
                            : 'Selesaikan Simulasi 🛡️'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Simulasi Praktik Sains &amp; Sejarah
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">
                    Jelajah Mesin Waktu: Geser Era dan Pilih Benda!
                  </h3>
                </div>
                <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full font-bold">
                  Pilih Masa Dahulu, Kini, atau Nanti
                </span>
              </div>

              {/* Era Timeline Switcher */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 p-2 bg-slate-100 rounded-2xl">
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedEra('dahulu');
                  }}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedEra === 'dahulu'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-102'
                      : 'bg-white text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-2xl">🕰️</span>
                  <span>Zaman DAHULU</span>
                  <span className="text-[10px] font-normal opacity-90">Kakek &amp; Nenek</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedEra('kini');
                  }}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedEra === 'kini'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md scale-102'
                      : 'bg-white text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-2xl">📱</span>
                  <span>Masa KINI</span>
                  <span className="text-[10px] font-normal opacity-90">Tahun 2026</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedEra('nanti');
                  }}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedEra === 'nanti'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md scale-102'
                      : 'bg-white text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-2xl">🚀</span>
                  <span>Masa NANTI</span>
                  <span className="text-[10px] font-normal opacity-90">Masa Depan Impian</span>
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Pilih Bidang Benda:</span>
                </span>
                {[
                  { id: 'transportasi', label: '🚗 Transportasi', icon: '🚗' },
                  { id: 'komunikasi', label: '📱 Komunikasi', icon: '📱' },
                  { id: 'dapur', label: '💡 Rumah & Dapur', icon: '💡' },
                  { id: 'mainan', label: '🪁 Permainan Anak', icon: '🪁' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategory(cat.id as typeof selectedCategory);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Active Machine Stage Display */}
              <div className={`p-6 rounded-3xl border ${currentEraInfo.bgColor} transition-all space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/20 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl sm:text-5xl">{currentDetail.icon}</span>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest opacity-80">
                        {currentEraInfo.year}
                      </span>
                      <h4 className="text-xl font-black font-display">{currentDetail.name}</h4>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-white/80 px-3 py-1 rounded-full shadow-2xs">
                    {currentEraInfo.title}
                  </span>
                </div>

                <p className="text-sm leading-relaxed font-medium">
                  {currentDetail.desc}
                </p>

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider block mb-2 opacity-90">
                    Ciri Khas &amp; Keunikan:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {currentDetail.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3 bg-white/90 rounded-xl shadow-2xs border border-current/10 flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-slate-800">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* ================= SECTION 2: MENU GAME (5 FORMAT KUIS) ================= */}
        {activeTab === 'game' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Tantangan 5 Format Game Pembelajaran
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">
                  {currentGame.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">
                  Tantangan: <span className="text-amber-600">{currentGameIndex + 1}</span> / {games.length}
                </span>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>Skor Game: {gameScore}</span>
                </span>
              </div>
            </div>

            {isCompletedAllGames ? (
              <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg text-4xl">
                  🏆
                </div>
                <h4 className="text-2xl font-bold text-slate-800 font-display">
                  Hore! Semua Tantangan Game Tuntas!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Kamu berhasil menyelesaikan 5 game tantangan ({theme?.judulTema || 'IPAS'}) dengan skor <strong>{gameScore} poin</strong>!
                </p>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={handleRestartGames}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Main Ulang Game</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onGoToBerlatih();
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Lanjut ke 10 Soal Asesmen HOTS</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-slate-800 text-sm font-medium leading-relaxed flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block text-xs uppercase tracking-wider mb-0.5">
                      Instruksi Soal:
                    </span>
                    <span>{currentGame.prompt}</span>
                  </div>
                </div>

                {/* GAME 1: MC */}
                {currentGame.type === 'mc' && (
                  <div className="space-y-2">
                    {currentGame.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        disabled={feedback?.submitted}
                        onClick={() => {
                          sound.playClick();
                          setMcSelection(optIdx);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                          mcSelection === optIdx
                            ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {mcSelection === optIdx && (
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* GAME 2: COMPLEX CHOICE */}
                {currentGame.type === 'complex' && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500">
                      Pilih kotak centang di bawah ini (kamu bisa memilih lebih dari satu):
                    </span>
                    {currentGame.options.map((opt, optIdx) => {
                      const isSelected = complexSelection.includes(optIdx);
                      return (
                        <button
                          key={optIdx}
                          disabled={feedback?.submitted}
                          onClick={() => {
                            sound.playClick();
                            if (isSelected) {
                              setComplexSelection(complexSelection.filter((i) => i !== optIdx));
                            } else {
                              setComplexSelection([...complexSelection, optIdx]);
                            }
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                            />
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* GAME 3: MATCHING */}
                {currentGame.type === 'matching' && (
                  <div className="space-y-4">
                    <span className="text-xs text-slate-500">
                      Pilihlah alat masa KINI yang tepat pada menu dropdown untuk mencocokkan alat zaman DAHULU:
                    </span>
                    <div className="space-y-3">
                      {currentGame.pairs.map((pair) => (
                        <div
                          key={pair.id}
                          className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                        >
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>{pair.leftText}</span>
                          </div>
                          <select
                            disabled={feedback?.submitted}
                            value={matchingSelections[pair.id] || ''}
                            onChange={(e) => {
                              sound.playClick();
                              setMatchingSelections({
                                ...matchingSelections,
                                [pair.id]: e.target.value
                              });
                            }}
                            className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden max-w-sm"
                          >
                            <option value="">-- Pilih Alat Pengganti Masa Kini --</option>
                            {currentGame.pairs.map((p) => (
                              <option key={p.id} value={p.rightText}>
                                {p.rightText}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* GAME 4: SHORT ANSWER */}
                {currentGame.type === 'short' && (
                  <div className="space-y-3 max-w-md">
                    <div className="p-2.5 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Petunjuk: {currentGame.hint}</span>
                    </div>

                    <input
                      type="text"
                      disabled={feedback?.submitted}
                      value={shortInput}
                      onChange={(e) => setShortInput(e.target.value)}
                      placeholder="Ketik nama benda tradisional di sini..."
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800"
                    />
                  </div>
                )}

                {/* GAME 5: REORDERING (PANAH NAIK DAN TURUN) */}
                {currentGame.type === 'reorder' && (
                  <div className="space-y-3">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>Gunakan tombol</span>
                      <strong className="text-amber-700">Panah Naik ⬆️</strong>
                      <span>dan</span>
                      <strong className="text-amber-700">Panah Turun ⬇️</strong>
                      <span>untuk mengurutkan dari masa paling kuno hingga masa depan:</span>
                    </span>

                    <div className="space-y-2.5">
                      {reorderedItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="font-medium text-slate-700">{item.label}</span>
                          </div>

                          {!feedback?.submitted && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => moveItemUp(idx)}
                                disabled={idx === 0}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title="Pindah Naik"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveItemDown(idx)}
                                disabled={idx === reorderedItems.length - 1}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title="Pindah Turun"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div
                    className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in ${
                      feedback.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    {feedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold">
                        {feedback.isCorrect ? 'Jawaban Benar!' : 'Belum Tepat'}
                      </div>
                      <p className="mt-1 leading-relaxed">{feedback.message}</p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  {!feedback?.submitted ? (
                    <button
                      onClick={handleCheckCurrentGame}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Periksa Jawaban Game</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNextGame}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <span>
                        {currentGameIndex < GAME_QUESTIONS.length - 1
                          ? 'Tantangan Selanjutnya ➔'
                          : 'Selesaikan Seluruh Game 🏆'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
        <span>MPI Lumi IPAS SD Kelas 3 • Mesin Waktu &amp; Game Interaktif</span>
        <span>Asyik, Menyenangkan, &amp; Edukatif</span>
      </footer>
    </div>
  );
};
