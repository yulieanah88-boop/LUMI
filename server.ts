import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PALETTE_PRESETS: Record<string, any> = {
  rose: {
    id: 'rose',
    name: 'Mawar Pastel',
    primary: 'rose',
    primaryHex: '#f43f5e',
    secondaryHex: '#fb7185',
    accentHex: '#f59e0b',
    bgGradient: 'from-rose-50/70 via-pink-50/50 to-amber-50/70',
    cardBorder: 'border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-700',
  },
  emerald: {
    id: 'emerald',
    name: 'Zamrud Sejuk',
    primary: 'emerald',
    primaryHex: '#10b981',
    secondaryHex: '#34d399',
    accentHex: '#0284c7',
    bgGradient: 'from-emerald-50/70 via-teal-50/50 to-sky-50/70',
    cardBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-700',
  },
  sky: {
    id: 'sky',
    name: 'Langit Ceria',
    primary: 'sky',
    primaryHex: '#0284c7',
    secondaryHex: '#38bdf8',
    accentHex: '#f59e0b',
    bgGradient: 'from-sky-50/70 via-cyan-50/50 to-indigo-50/70',
    cardBorder: 'border-sky-200',
    badgeBg: 'bg-sky-100 text-sky-700',
  },
  amber: {
    id: 'amber',
    name: 'Mentari Hangat',
    primary: 'amber',
    primaryHex: '#d97706',
    secondaryHex: '#fbbf24',
    accentHex: '#ea580c',
    bgGradient: 'from-amber-50/70 via-yellow-50/50 to-orange-50/70',
    cardBorder: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-700',
  },
  purple: {
    id: 'purple',
    name: 'Lembayung Ungu',
    primary: 'purple',
    primaryHex: '#9333ea',
    secondaryHex: '#c084fc',
    accentHex: '#ec4899',
    bgGradient: 'from-purple-50/70 via-fuchsia-50/50 to-pink-50/70',
    cardBorder: 'border-purple-200',
    badgeBg: 'bg-purple-100 text-purple-700',
  },
};

const THEME_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    judulTema: { type: Type.STRING },
    subJudul: { type: Type.STRING },
    emojiMaskot: { type: Type.STRING },
    sapaanLumi: { type: Type.STRING },
    deskripsiSingkat: { type: Type.STRING },
    capaianPembelajaran: { type: Type.STRING },
    tujuanPembelajaran: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: { type: Type.STRING },
          icon: { type: Type.STRING },
        },
        required: ['id', 'text', 'icon'],
      },
    },
    belajar: {
      type: Type.OBJECT,
      properties: {
        pertanyaanPemantik: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              title: { type: Type.STRING },
              scenario: { type: Type.STRING },
              imageCaption: { type: Type.STRING },
              imageEmoji: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                  },
                  required: ['text', 'feedback'],
                },
              },
              narasiText: { type: Type.STRING },
            },
            required: ['id', 'title', 'scenario', 'imageCaption', 'imageEmoji', 'question', 'options', 'narasiText'],
          },
        },
        materiBab: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              badge: { type: Type.STRING },
              summary: { type: Type.STRING },
              narasiText: { type: Type.STRING },
              imageCaption: { type: Type.STRING },
              visualScene: {
                type: Type.OBJECT,
                properties: {
                  sceneCategory: { type: Type.STRING },
                  sceneTitle: { type: Type.STRING },
                  mainIcon: { type: Type.STRING },
                  subIcons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  caption: { type: Type.STRING },
                },
                required: ['sceneCategory', 'sceneTitle', 'mainIcon', 'subIcons', 'caption'],
              },
              points: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    desc: { type: Type.STRING },
                    emoji: { type: Type.STRING },
                  },
                  required: ['title', 'desc', 'emoji'],
                },
              },
              tableData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    price: { type: Type.STRING },
                    qty: { type: Type.STRING },
                    label: { type: Type.STRING },
                  },
                  required: ['price', 'qty', 'label'],
                },
              },
            },
            required: ['id', 'title', 'badge', 'summary', 'narasiText', 'imageCaption', 'visualScene', 'points'],
          },
        },
        videoSummary: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stageName: { type: Type.STRING },
                  years: { type: Type.STRING },
                  desc: { type: Type.STRING },
                  icon: { type: Type.STRING },
                },
                required: ['stageName', 'years', 'desc', 'icon'],
              },
            },
          },
          required: ['title', 'stages'],
        },
      },
      required: ['pertanyaanPemantik', 'materiBab', 'videoSummary'],
    },
    bermain: {
      type: Type.OBJECT,
      properties: {
        simulationTitle: { type: Type.STRING },
        simulationBadge: { type: Type.STRING },
        simulationDescription: { type: Type.STRING },
        scenarios: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              title: { type: Type.STRING },
              situation: { type: Type.STRING },
              icon: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN },
                    feedback: { type: Type.STRING },
                  },
                  required: ['text', 'isCorrect', 'feedback'],
                },
              },
            },
            required: ['id', 'title', 'situation', 'icon', 'options'],
          },
        },
        mcGame: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            prompt: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ['title', 'prompt', 'options', 'correctAnswer', 'explanation'],
        },
        complexGame: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            prompt: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
            explanation: { type: Type.STRING },
          },
          required: ['title', 'prompt', 'options', 'correctAnswers', 'explanation'],
        },
        matchingGame: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            prompt: { type: Type.STRING },
            pairs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  leftText: { type: Type.STRING },
                  rightText: { type: Type.STRING },
                },
                required: ['id', 'leftText', 'rightText'],
              },
            },
            explanation: { type: Type.STRING },
          },
          required: ['title', 'prompt', 'pairs', 'explanation'],
        },
        shortGame: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            prompt: { type: Type.STRING },
            acceptedAnswers: { type: Type.ARRAY, items: { type: Type.STRING } },
            hint: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ['title', 'prompt', 'acceptedAnswers', 'hint', 'explanation'],
        },
        reorderGame: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            prompt: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                },
                required: ['id', 'label'],
              },
            },
            correctOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING },
          },
          required: ['title', 'prompt', 'items', 'correctOrder', 'explanation'],
        },
      },
      required: [
        'simulationTitle',
        'simulationBadge',
        'simulationDescription',
        'scenarios',
        'mcGame',
        'complexGame',
        'matchingGame',
        'shortGame',
        'reorderGame',
      ],
    },
    berlatihQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          dimension: { type: Type.STRING },
          caseStory: { type: Type.STRING },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ['id', 'dimension', 'caseStory', 'question', 'options', 'correctAnswer', 'explanation'],
      },
    },
    refleksi: {
      type: Type.OBJECT,
      properties: {
        prompt: { type: Type.STRING },
        commitmentPrompt: { type: Type.STRING },
      },
      required: ['prompt', 'commitmentPrompt'],
    },
    sumberBelajar: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          year: { type: Type.STRING },
          type: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['title', 'author', 'year', 'type', 'description'],
      },
    },
    glosarium: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          meaning: { type: Type.STRING },
        },
        required: ['term', 'meaning'],
      },
    },
    sertifikat: {
      type: Type.OBJECT,
      properties: {
        appreciationText: { type: Type.STRING },
        subText: { type: Type.STRING },
      },
      required: ['appreciationText', 'subText'],
    },
    badges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING },
          title: { type: Type.STRING },
          nickname: { type: Type.STRING },
          icon: { type: Type.STRING },
          description: { type: Type.STRING },
          requirement: { type: Type.STRING },
          quote: { type: Type.STRING },
        },
        required: ['section', 'title', 'nickname', 'icon', 'description', 'requirement', 'quote'],
      },
    },
  },
  required: [
    'judulTema',
    'subJudul',
    'emojiMaskot',
    'sapaanLumi',
    'deskripsiSingkat',
    'capaianPembelajaran',
    'tujuanPembelajaran',
    'belajar',
    'bermain',
    'berlatihQuestions',
    'refleksi',
    'sumberBelajar',
    'glosarium',
    'sertifikat',
    'badges',
  ],
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeGeneratedTheme(
  raw: any,
  input: { topic: string; subject: string; gradePhase: string; detectedFase: string; paletteId: string }
) {
  const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const themeId = `custom_${uniqueSuffix}`;
  const selectedPalette = PALETTE_PRESETS[input.paletteId] || PALETTE_PRESETS.rose;

  const badgeColors = [
    { color: 'from-emerald-500 to-teal-500', borderColor: 'border-emerald-300 hover:border-emerald-400', bgGradient: 'bg-emerald-50' },
    { color: 'from-amber-500 to-orange-500', borderColor: 'border-amber-300 hover:border-amber-400', bgGradient: 'bg-amber-50' },
    { color: 'from-rose-500 to-pink-500', borderColor: 'border-rose-300 hover:border-rose-400', bgGradient: 'bg-rose-50' },
    { color: 'from-sky-500 to-blue-500', borderColor: 'border-sky-300 hover:border-sky-400', bgGradient: 'bg-sky-50' },
    { color: 'from-amber-400 via-rose-500 to-teal-500', borderColor: 'border-amber-400 hover:border-amber-500', bgGradient: 'bg-gradient-to-r from-amber-50 to-rose-50' },
  ];
  const expectedSections = ['belajar', 'bermain', 'berlatih', 'refleksi', 'grand_master'];

  const rawQuestions = Array.isArray(raw?.berlatihQuestions) ? raw.berlatihQuestions : [];
  const normalizedQuestions = rawQuestions.slice(0, 10).map((q: any, idx: number) => {
    const opts = Array.isArray(q?.options) ? q.options.slice(0, 4) : [];
    const safeCorrect =
      typeof q?.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < opts.length
        ? q.correctAnswer
        : 0;
    return {
      id: idx + 1,
      dimension: q?.dimension || (idx % 3 === 0 ? 'Analisis (C4)' : idx % 3 === 1 ? 'Evaluasi (C5)' : 'Kreasi (C6)'),
      caseStory: String(q?.caseStory || ''),
      question: String(q?.question || ''),
      options: opts.map((o: any) => String(o)),
      correctAnswer: safeCorrect,
      explanation: String(q?.explanation || ''),
    };
  });

  const b = raw?.bermain || {};
  const games = [
    {
      id: `game-${themeId}-1`,
      type: 'mc',
      title: String(b.mcGame?.title || `Tantangan 1: Pilihan Ganda ${input.topic}`),
      prompt: String(b.mcGame?.prompt || ''),
      options: Array.isArray(b.mcGame?.options) ? b.mcGame.options.map(String) : [],
      correctAnswer: typeof b.mcGame?.correctAnswer === 'number' ? b.mcGame.correctAnswer : 0,
      explanation: String(b.mcGame?.explanation || ''),
    },
    {
      id: `game-${themeId}-2`,
      type: 'complex',
      title: String(b.complexGame?.title || `Tantangan 2: Pilihan Ganda Kompleks`),
      prompt: String(b.complexGame?.prompt || ''),
      options: Array.isArray(b.complexGame?.options) ? b.complexGame.options.map(String) : [],
      correctAnswers: Array.isArray(b.complexGame?.correctAnswers)
        ? b.complexGame.correctAnswers.map(Number)
        : [0, 1],
      explanation: String(b.complexGame?.explanation || ''),
    },
    {
      id: `game-${themeId}-3`,
      type: 'matching',
      title: String(b.matchingGame?.title || `Tantangan 3: Menjodohkan Konsep`),
      prompt: String(b.matchingGame?.prompt || ''),
      pairs: Array.isArray(b.matchingGame?.pairs)
        ? b.matchingGame.pairs.map((p: any, i: number) => ({
            id: String(p?.id || `pair-${i + 1}`),
            leftText: String(p?.leftText || ''),
            rightText: String(p?.rightText || ''),
          }))
        : [],
      explanation: String(b.matchingGame?.explanation || ''),
    },
    {
      id: `game-${themeId}-4`,
      type: 'short',
      title: String(b.shortGame?.title || `Tantangan 4: Isian Singkat`),
      prompt: String(b.shortGame?.prompt || ''),
      acceptedAnswers: Array.isArray(b.shortGame?.acceptedAnswers)
        ? b.shortGame.acceptedAnswers.map(String)
        : [],
      hint: String(b.shortGame?.hint || ''),
      explanation: String(b.shortGame?.explanation || ''),
    },
    {
      id: `game-${themeId}-5`,
      type: 'reorder',
      title: String(b.reorderGame?.title || `Tantangan 5: Menyusun Urutan`),
      prompt: String(b.reorderGame?.prompt || ''),
      items: Array.isArray(b.reorderGame?.items)
        ? b.reorderGame.items.map((it: any, i: number) => ({
            id: String(it?.id || `step-${i + 1}`),
            label: String(it?.label || ''),
          }))
        : [],
      correctOrder: Array.isArray(b.reorderGame?.correctOrder)
        ? b.reorderGame.correctOrder.map(String)
        : [],
      explanation: String(b.reorderGame?.explanation || ''),
    },
  ];

  const rawBadges = Array.isArray(raw?.badges) ? raw.badges : [];
  const badges = expectedSections.map((sec, idx) => {
    const found = rawBadges.find((bg: any) => bg?.section === sec) || rawBadges[idx] || {};
    const style = badgeColors[idx];
    return {
      id: `badge-${themeId}-${sec}`,
      section: sec,
      title: String(found.title || `Bintang ${sec} ${input.topic}`).slice(0, 60),
      nickname: String(found.nickname || 'Pembelajar Hebat'),
      icon: String(found.icon || ['📖', '🎮', '🌟', '💖', '👑'][idx]),
      color: style.color,
      borderColor: style.borderColor,
      bgGradient: style.bgGradient,
      description: String(found.description || `Menyelesaikan aktivitas ${sec} tema ${input.topic}.`),
      requirement: String(found.requirement || `Selesaikan Menu ${sec}.`),
      quote: String(found.quote || '"Terus belajar dengan semangat!"'),
    };
  });

  const judulTema = String(raw?.judulTema || input.topic).trim();

  return {
    id: themeId,
    judulTema,
    subJudul: String(raw?.subJudul || `Pembelajaran Interaktif ${input.subject} ${input.gradePhase}`),
    mataPelajaran: input.subject,
    fase: input.detectedFase,
    kelas: input.gradePhase,
    emojiMaskot: String(raw?.emojiMaskot || '🌟'),
    sapaanLumi: String(raw?.sapaanLumi || ''),
    deskripsiSingkat: String(raw?.deskripsiSingkat || ''),
    palet: selectedPalette,
    tujuanPembelajaran: Array.isArray(raw?.tujuanPembelajaran) ? raw.tujuanPembelajaran : [],
    capaianPembelajaran: String(raw?.capaianPembelajaran || ''),
    belajar: {
      pertanyaanPemantik: Array.isArray(raw?.belajar?.pertanyaanPemantik) ? raw.belajar.pertanyaanPemantik : [],
      materiBab: Array.isArray(raw?.belajar?.materiBab) ? raw.belajar.materiBab : [],
      videoSummary: raw?.belajar?.videoSummary || {
        title: `Teater Pembelajaran: ${judulTema}`,
        stages: [],
      },
    },
    bermain: {
      simulation: {
        type: 'custom_interactive',
        title: String(b.simulationTitle || `Simulasi Studi Kasus: ${judulTema}`),
        badge: String(b.simulationBadge || 'Eksplorasi Interaktif'),
        description: String(b.simulationDescription || ''),
        data: {
          scenarios: Array.isArray(b.scenarios) ? b.scenarios : [],
        },
      },
      games,
    },
    berlatih: {
      questions: normalizedQuestions,
    },
    refleksi: {
      prompt: String(raw?.refleksi?.prompt || `Bagaimana perasaanmu setelah mempelajari "${judulTema}"?`),
      emojiOptions: [
        { emoji: '🤩', label: 'Sangat Paham & Antusias', desc: 'Materi sangat jelas, seru, dan menyenangkan!' },
        { emoji: '😊', label: 'Senang & Mengerti', desc: 'Memahami inti materi dan siap mempraktikkannya.' },
        { emoji: '🤔', label: 'Ingin Tahu Lebih Banyak', desc: 'Masih penasaran dan ingin bertanya kepada guru.' },
        { emoji: '💖', label: 'Merasa Bersyukur', desc: 'Bersyukur dapat mempelajari ilmu baru yang bermanfaat.' },
      ],
      favoriteOptions: [
        'Pertanyaan Pemantik Bergambar (Menu Belajar)',
        'Materi Interaktif & Rangkuman (Menu Belajar)',
        'Simulasi & Game Edukasi 5 Format (Menu Bermain)',
        '10 Soal Asesmen HOTS Berpikir Kritis (Menu Berlatih)',
        'Mengunduh Piagam Prestasi Belajar Digital',
      ],
      commitmentPrompt: String(
        raw?.refleksi?.commitmentPrompt || `Tuliskan komitmen baik yang akan kamu lakukan terkait "${judulTema}":`
      ),
    },
    sumberBelajar: Array.isArray(raw?.sumberBelajar) ? raw.sumberBelajar : [],
    glosarium: Array.isArray(raw?.glosarium) ? raw.glosarium : [],
    sertifikat: {
      appreciationText: String(
        raw?.sertifikat?.appreciationText || 'Atas keberhasilan menuntaskan seluruh petualangan pembelajaran interaktif:'
      ),
      themeTitleOnCert: judulTema.toUpperCase(),
      subText: String(raw?.sertifikat?.subText || `Materi ${input.subject} ${input.gradePhase} Kurikulum Merdeka`),
    },
    badges,
    isCustom: true,
  };
}

function validateServerTheme(theme: any): string[] {
  const issues: string[] = [];
  if (!theme.belajar?.materiBab || theme.belajar.materiBab.length < 3) {
    issues.push('Materi bab kurang dari 3');
  }
  if (!theme.belajar?.pertanyaanPemantik || theme.belajar.pertanyaanPemantik.length < 2) {
    issues.push('Pertanyaan pemantik kurang dari 2');
  }
  if (!theme.bermain?.simulation?.data?.scenarios || theme.bermain.simulation.data.scenarios.length < 3) {
    issues.push('Skenario simulasi kurang dari 3');
  }
  const games = theme.bermain?.games || [];
  if (games.length < 5) {
    issues.push('Game kurang dari 5');
  } else {
    if (!games[0]?.options || games[0].options.length < 4) issues.push('Game 1 MC opsi kurang');
    if (!games[1]?.options || games[1].options.length < 4) issues.push('Game 2 Kompleks opsi kurang');
    if (!games[2]?.pairs || games[2].pairs.length < 3) issues.push('Game 3 Menjodohkan pasangan kurang');
    if (!games[3]?.acceptedAnswers || games[3].acceptedAnswers.length < 1) issues.push('Game 4 Isian tanpa kunci');
    if (!games[4]?.items || games[4].items.length < 3) issues.push('Game 5 Urutkan item kurang');
  }
  if (!theme.berlatih?.questions || theme.berlatih.questions.length !== 10) {
    issues.push(`Soal HOTS berjumlah ${theme.berlatih?.questions?.length || 0}, harus tepat 10`);
  }
  return issues;
}

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route for AI Theme Generation
  app.post('/api/generate-theme', async (req, res) => {
    const { topic, subject, gradePhase, goals, paletteId } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topik pembelajaran wajib diisi.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY tidak ditemukan pada pengaturan Secrets server.',
      });
    }

    const effectiveSubject = (subject || 'IPAS').trim();
    const effectiveGrade = (gradePhase || 'Fase B (Kelas 3 SD)').trim();
    const detectedFase = /fase\s*c|kelas\s*[56]/i.test(effectiveGrade)
      ? 'Fase C'
      : /fase\s*a|kelas\s*[12]/i.test(effectiveGrade)
      ? 'Fase A'
      : 'Fase B';
    const cleanTopic = topic.trim();

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Kamu adalah Instructional Designer dan Ahli Kurikulum Merdeka Sekolah Dasar (SD) Indonesia.
Tugasmu merancang isi pembelajaran lengkap yang 100% spesifik, akurat, dan mendalam tentang topik "${cleanTopic}" untuk ${effectiveSubject} ${effectiveGrade} (${detectedFase}).

ATURAN KUALITAS KONTEN (WAJIB DIPATUHI):
1. DILARANG KERAS menulis kalimat generik/template seperti "Konsep 1", "Pasangan 1", "Memahami konsep dasar materi X", atau soal umum tentang "rajin belajar / gotong royong" yang tidak membahas fakta nyata topik "${cleanTopic}".
2. SETIAP bagian harus memuat fakta, istilah, contoh, dan situasi nyata yang spesifik tentang "${cleanTopic}":
   - tujuanPembelajaran: 4 tujuan konkret sesuai CP ${detectedFase} topik "${cleanTopic}".
   - belajar.pertanyaanPemantik: 2 cerita pemantik bergambar yang relevan langsung dengan "${cleanTopic}" (masing-masing 3 opsi; opsi indeks 0 adalah jawaban paling tepat).
   - belajar.materiBab: TEPAT 3 bab pembelajaran mendalam tentang "${cleanTopic}". Setiap bab memiliki 3 poin materi spesifik, tabel ringkasan 2-3 baris (kolom price = aspek/kategori, qty = contoh/poin, label = penjelasan), imageCaption deskriptif, serta visualScene dengan sceneCategory yang dipilih tepat dari daftar ('nature_ecosystem' | 'space_planet' | 'water_weather' | 'science_energy' | 'body_safety' | 'transport_tech' | 'communication' | 'home_tradition' | 'civics_culture' | 'math_general'), mainIcon (1 emoji inti bab), subIcons (3-4 emoji pendukung bab), sceneTitle, dan caption.
   - belajar.videoSummary: 3 babak animasi berurutan tentang "${cleanTopic}".
   - bermain.scenarios: TEPAT 4 studi kasus interaktif tentang "${cleanTopic}", masing-masing punya 3 pilihan tindakan (tepat 1 opsi memiliki isCorrect: true).
   - bermain games:
     * mcGame: 1 soal pilihan ganda (4 opsi, correctAnswer 0-3) tentang "${cleanTopic}".
     * complexGame: 1 soal pilihan ganda kompleks (5 opsi, 3 jawaban benar di correctAnswers, misal [0, 2, 4]) tentang "${cleanTopic}".
     * matchingGame: 4 pasangan konsep & penjelasan spesifik "${cleanTopic}" (id: p1..p4).
     * shortGame: 1 soal isian singkat tentang istilah kunci nyata dalam topik "${cleanTopic}" dengan beberapa variasi huruf/sinonim pada acceptedAnswers.
     * reorderGame: 3-4 langkah berurutan terkait proses/aturan pada topik "${cleanTopic}". Cantumkan item dalam kondisi acak pada items[], dan urutan id yang benar pada correctOrder[].
   - berlatihQuestions: WAJIB TEPAT 10 SOAL HOTS (id 1 sampai 10) berbasis cerita nyata seputar "${cleanTopic}"! Variasikan dimension ('Analisis (C4)', 'Evaluasi (C5)', 'Kreasi (C6)') dan acak posisi correctAnswer (0, 1, 2, atau 3) agar tidak selalu di A (0). Setiap soal wajib punya 4 opsi lengkap dan explanation 2 kalimat yang mendidik.
   - glosarium: 4-6 istilah penting nyata dari topik "${cleanTopic}".
3. Keamanan & Kesesuaian Usia SD: Untuk topik sensitif seperti kesehatan reproduksi, pubertas, pendidikan seksual dasar, atau perlindungan diri anak SD, gunakan pendekatan edukatif Kurikulum Merdeka yang hangat, sopan, ilmiah sesuai usia (bagian tubuh pribadi, batas privasi, kebersihan diri, sentuhan aman vs tidak aman, berani berkata tidak & melapor ke orang dewasa tepercaya) tanpa konten seksual eksplisit, kekerasan, atau SARA.`;

    const userPrompt = `Buatkan modul pembelajaran lengkap Kurikulum Merdeka untuk:
- Topik: "${cleanTopic}"
- Mata Pelajaran: "${effectiveSubject}"
- Jenjang/Fase: "${effectiveGrade}" (${detectedFase})
${goals ? `- Catatan Tujuan Khusus Guru: "${goals}"` : ''}

Pastikan:
1) Menu Belajar (3 bab materi spesifik + pemantik + ringkasan teater), Menu Bermain (4 skenario simulasi + 5 format game), dan Menu Berlatih (TEPAT 10 soal HOTS C4-C6) semuanya membahas materi nyata tentang "${cleanTopic}".
2) Posisi jawaban benar pada soal HOTS bervariasi antara index 0, 1, 2, dan 3.`;

    const modelAttempts: Array<{ model: string; thinkingLevel: ThinkingLevel }> = [
      { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.MEDIUM },
      { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW },
      { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.LOW },
    ];

    let lastError: any = null;

    for (let i = 0; i < modelAttempts.length; i++) {
      const attempt = modelAttempts[i];
      try {
        const response = await ai.models.generateContent({
          model: attempt.model,
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: THEME_RESPONSE_SCHEMA,
            thinkingConfig: { thinkingLevel: attempt.thinkingLevel },
          },
        });

        const responseText = (response.text ?? '').trim();
        let cleaned = responseText;
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const rawParsed = JSON.parse(cleaned);
        const normalizedTheme = normalizeGeneratedTheme(rawParsed, {
          topic: cleanTopic,
          subject: effectiveSubject,
          gradePhase: effectiveGrade,
          detectedFase,
          paletteId: paletteId || 'rose',
        });

        const issues = validateServerTheme(normalizedTheme);
        if (issues.length > 0) {
          console.warn(`Attempt ${i + 1} (${attempt.model}) incomplete theme:`, issues);
          lastError = new Error(`Hasil AI belum lengkap (${issues.join(', ')})`);
          await sleep(800);
          continue;
        }

        return res.json({ theme: normalizedTheme });
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${i + 1} (${attempt.model}) failed:`, err?.message || err);
        if (i < modelAttempts.length - 1) {
          await sleep(1200 * (i + 1));
        }
      }
    }

    const msg = lastError?.message || 'Unknown error';
    const isOverloaded = /503|UNAVAILABLE|429|RESOURCE_EXHAUSTED/i.test(msg);
    return res.status(isOverloaded ? 503 : 500).json({
      error: isOverloaded
        ? 'Layanan Gemini AI sedang padat sesaat. Silakan klik "Buat Tema dengan AI" kembali dalam beberapa detik.'
        : 'Gagal memproses pembuatan tema dengan Gemini AI: ' + msg,
    });
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server MPI Lumi ready at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
  process.exit(1);
});
