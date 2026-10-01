import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

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
        error: 'GEMINI_API_KEY tidak ditemukan pada server environment.',
        fallbackAvailable: true,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `Kamu adalah Instructional Designer dan Ahli Kurikulum Merdeka Sekolah Dasar (Fase B / Kelas 3 SD) profesional.
Tugasmu adalah menghasilkan data struktur tema pembelajaran interaktif lengkap untuk aplikasi "MPI Lumi".

KRITERIA WAJIB:
1. Target peserta didik: Usia 8-9 tahun (Kelas 3 SD Fase B). Bahasa Indonesia harus ramah anak, positif, mudah dipahami, ceria, dan memotivasi.
2. DILARANG memuat konten kekerasan, SARA, atau pornografi.
3. Struktur JSON yang dihasilkan HARUS LENGKAP dan valid sesuai format berikut:
{
  "id": "custom_${Date.now()}",
  "judulTema": "${topic.trim()}",
  "subJudul": "Sub judul tema yang menarik untuk anak SD",
  "mataPelajaran": "${subject || 'IPAS'}",
  "fase": "Fase B",
  "kelas": "${gradePhase || 'Kelas III SD'}",
  "emojiMaskot": "Emoji maskot 1 karakter (misal: 🌿 / 🌟 / 🚀)",
  "sapaanLumi": "Sapaan ramah anak dari Lumi tentang topik ini",
  "deskripsiSingkat": "Deskripsi 1-2 kalimat untuk kartu tema",
  "palet": {
    "id": "${paletteId || 'rose'}",
    "name": "Nama Palet Pastel",
    "primary": "${paletteId || 'rose'}",
    "primaryHex": "#f43f5e",
    "secondaryHex": "#fb7185",
    "accentHex": "#f59e0b",
    "bgGradient": "from-rose-50/70 via-pink-50/50 to-amber-50/70",
    "cardBorder": "border-rose-200",
    "badgeBg": "bg-rose-100 text-rose-700"
  },
  "tujuanPembelajaran": [
    { "id": 1, "text": "Tujuan pembelajaran 1 selaras CP", "icon": "🎯" },
    { "id": 2, "text": "Tujuan pembelajaran 2 selaras CP", "icon": "💡" },
    { "id": 3, "text": "Tujuan pembelajaran 3 selaras CP", "icon": "🌟" },
    { "id": 4, "text": "Tujuan pembelajaran 4 selaras CP", "icon": "✨" }
  ],
  "capaianPembelajaran": "Deskripsi capaian pembelajaran Fase B",
  "belajar": {
    "pertanyaanPemantik": [
      {
        "id": 1,
        "title": "Judul Pertanyaan Pemantik 1",
        "scenario": "Cerita skenario kontekstual ramah anak",
        "imageCaption": "Keterangan gambar",
        "imageEmoji": "🔍 💡",
        "question": "Pertanyaan pemicu rasa ingin tahu?",
        "options": [
          { "text": "Pilihan A (Benar)", "feedback": "Penjelasan apresiatif" },
          { "text": "Pilihan B (Kurang tepat)", "feedback": "Penjelasan pembimbing" },
          { "text": "Pilihan C (Kurang tepat)", "feedback": "Penjelasan pembimbing" }
        ],
        "narasiText": "Teks ringkas untuk dibaca Text-to-Speech"
      },
      {
        "id": 2,
        "title": "Judul Pertanyaan Pemantik 2",
        "scenario": "Cerita skenario kontekstual 2",
        "imageCaption": "Keterangan gambar 2",
        "imageEmoji": "📖 ✨",
        "question": "Pertanyaan kedua?",
        "options": [
          { "text": "Pilihan A (Benar)", "feedback": "Bagus sekali!" },
          { "text": "Pilihan B (Kurang tepat)", "feedback": "Coba perhatikan lagi ya." }
        ],
        "narasiText": "Teks ringkas untuk narasi suara"
      }
    ],
    "materiBab": [
      {
        "id": "bab_1",
        "title": "1. Pengenalan Konsep",
        "badge": "Konsep Dasar",
        "summary": "Ringkasan bab 1",
        "narasiText": "Teks narasi suara bab 1",
        "points": [
          { "title": "Poin Penting 1", "desc": "Penjelasan poin 1", "emoji": "🌱" },
          { "title": "Poin Penting 2", "desc": "Penjelasan poin 2", "emoji": "🔍" }
        ],
        "tableData": [
          { "price": "Kategori A", "qty": "Contoh 1", "label": "Keterangan praktis" },
          { "price": "Kategori B", "qty": "Contoh 2", "label": "Keterangan praktis" }
        ]
      },
      {
        "id": "bab_2",
        "title": "2. Penerapan Sehari-hari",
        "badge": "Aksi Nyata",
        "summary": "Ringkasan bab 2",
        "narasiText": "Teks narasi suara bab 2",
        "points": [
          { "title": "Poin Penting A", "desc": "Penjelasan poin A", "emoji": "🚀" },
          { "title": "Poin Penting B", "desc": "Penjelasan poin B", "emoji": "🤝" }
        ]
      },
      {
        "id": "bab_3",
        "title": "3. Manfaat & Sikap Bijak",
        "badge": "Refleksi & Sikap",
        "summary": "Ringkasan bab 3",
        "narasiText": "Teks narasi suara bab 3",
        "points": [
          { "title": "Poin Penting X", "desc": "Penjelasan poin X", "emoji": "💖" }
        ]
      }
    ],
    "videoSummary": {
      "title": "Petualangan Animasi: ${topic.trim()}",
      "stages": [
        { "stageName": "Langkah 1", "years": "Awal", "desc": "Mengenal dasar materi", "icon": "💡" },
        { "stageName": "Langkah 2", "years": "Inti", "desc": "Eksplorasi mendalam", "icon": "🔍" },
        { "stageName": "Langkah 3", "years": "Aplikasi", "desc": "Penerapan nyata", "icon": "🌟" }
      ]
    }
  },
  "bermain": {
    "simulation": {
      "type": "custom_interactive",
      "title": "Simulasi Eksplorasi Interaktif",
      "badge": "Laboratorium Cilik",
      "description": "Jelajahi dan amati berbagai skenario menarik tentang ${topic.trim()}."
    },
    "games": [
      {
        "id": "game-cg-1",
        "type": "mc",
        "title": "Tantangan 1: Pilihan Ganda",
        "prompt": "Pertanyaan pilihan ganda terkait materi?",
        "options": ["Jawaban Benar A", "Pilihan B", "Pilihan C", "Pilihan D"],
        "correctAnswer": 0,
        "explanation": "Penjelasan edukatif jawaban benar."
      },
      {
        "id": "game-cg-2",
        "type": "complex",
        "title": "Tantangan 2: Pilihan Ganda Kompleks (Centang 3 Benar)",
        "prompt": "Manakah hal-hal yang tepat terkait materi? (Pilih 3)",
        "options": ["Pernyataan Benar 1", "Pernyataan Benar 2", "Pernyataan Salah", "Pernyataan Benar 3", "Pernyataan Salah 2"],
        "correctAnswers": [0, 1, 3],
        "explanation": "Penjelasan mengapa 3 pilihan tersebut tepat."
      },
      {
        "id": "game-cg-3",
        "type": "matching",
        "title": "Tantangan 3: Menjodohkan Pasangan",
        "prompt": "Pasangkan pernyataan di sebelah kiri dengan pasangannya di sebelah kanan!",
        "pairs": [
          { "id": "p1", "leftText": "Konsep 1", "rightText": "Pasangan 1" },
          { "id": "p2", "leftText": "Konsep 2", "rightText": "Pasangan 2" },
          { "id": "p3", "leftText": "Konsep 3", "rightText": "Pasangan 3" }
        ],
        "explanation": "Penjelasan pasangan konsep yang cocok."
      },
      {
        "id": "game-cg-4",
        "type": "short",
        "title": "Tantangan 4: Isian Singkat",
        "prompt": "Istilah kunci satu kata yang menggambarkan materi?",
        "acceptedAnswers": ["kunci", "kata kunci", "istilah"],
        "hint": "Petunjuk kata kunci.",
        "explanation": "Penjelasan istilah kunci tersebut."
      },
      {
        "id": "game-cg-5",
        "type": "reorder",
        "title": "Tantangan 5: Menyusun Urutan",
        "prompt": "Susun urutan langkah yang benar dari awal hingga akhir!",
        "items": [
          { "id": "step-2", "label": "Langkah Kedua" },
          { "id": "step-1", "label": "Langkah Pertama" },
          { "id": "step-3", "label": "Langkah Ketiga" }
        ],
        "correctOrder": ["step-1", "step-2", "step-3"],
        "explanation": "Penjelasan urutan proses yang runut."
      }
    ]
  },
  "berlatih": {
    "questions": [
      // WAJIB TEPAT 10 SOAL HOTS (id: 1 sampai 10), masing-masing dengan dimension Analisis (C4), Evaluasi (C5), atau Kreasi (C6), caseStory kontekstual, 4 options, correctAnswer (0-3), dan explanation lengkap!
    ]
  },
  "refleksi": {
    "prompt": "Bagaimana perasaanmu setelah belajar tema ${topic.trim()} bersama Lumi?",
    "emojiOptions": [
      { "emoji": "🤩", "label": "Sangat Paham & Semangat", "desc": "Materi sangat menarik dan seru!" },
      { "emoji": "😊", "label": "Paham & Senang", "desc": "Senang belajar hal baru hari ini." },
      { "emoji": "🤔", "label": "Ingin Tahu Lebih Banyak", "desc": "Masih ingin membaca dan bertanya." },
      { "emoji": "😴", "label": "Butuh Latihan Tambahan", "desc": "Perlu bimbingan guru dan teman." }
    ],
    "favoriteOptions": [
      "Pertanyaan Pemantik Bergambar",
      "Materi Eksplorasi Interaktif",
      "Tantangan Game 5 Format",
      "10 Soal Asesmen HOTS",
      "Piagam Penghargaan Hasil Belajar"
    ],
    "commitmentPrompt": "Tuliskan komitmen atau hal baik yang akan kamu lakukan setelah mempelajari tema ini:"
  },
  "sumberBelajar": [
    {
      "title": "Buku Panduan Guru dan Siswa ${subject || 'IPAS'} Kelas 3 SD",
      "author": "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI",
      "year": "2024",
      "type": "Buku Teks Kurikulum Merdeka",
      "description": "Rujukan utama materi pembelajaran Fase B SD.",
      "link": "https://buku.kemdikbud.go.id"
    },
    {
      "title": "Modul Ajar Pembelajaran Berdiferensiasi",
      "author": "Direktorat Sekolah Dasar Kemendikbudristek",
      "year": "2024/2025",
      "type": "Modul Digital",
      "description": "Panduan aktivitas interaktif dan asesmen bermakna."
    }
  ],
  "glosarium": [
    { "term": "Istilah Utama 1", "meaning": "Pengertian ramah anak untuk istilah 1." },
    { "term": "Istilah Utama 2", "meaning": "Pengertian ramah anak untuk istilah 2." },
    { "term": "Istilah Utama 3", "meaning": "Pengertian ramah anak untuk istilah 3." }
  ],
  "sertifikat": {
    "appreciationText": "Atas keberhasilan menuntaskan seluruh petualangan pembelajaran:",
    "themeTitleOnCert": "${topic.trim().toUpperCase()}",
    "subText": "Materi ${subject || 'IPAS'} Kelas III SD Kurikulum Merdeka"
  },
  "badges": [
    {
      "id": "badge-cust-belajar",
      "section": "belajar",
      "title": "Penjelajah ${topic.trim()}",
      "nickname": "Pembelajar Tangguh",
      "icon": "📖",
      "color": "from-emerald-500 to-teal-500",
      "borderColor": "border-emerald-300 hover:border-emerald-400",
      "bgGradient": "bg-emerald-50",
      "description": "Membaca dan memahami materi modul pembelajaran.",
      "requirement": "Selesaikan Menu Belajar.",
      "quote": "\"Belajar hal baru membuka jendela dunia!\""
    },
    {
      "id": "badge-cust-bermain",
      "section": "bermain",
      "title": "Jawara Game Edukasi",
      "nickname": "Master Kuis Ceria",
      "icon": "🎮",
      "color": "from-amber-500 to-orange-500",
      "borderColor": "border-amber-300 hover:border-amber-400",
      "bgGradient": "bg-amber-50",
      "description": "Menyelesaikan tantangan permainan edukasi 5 format.",
      "requirement": "Tuntaskan kuis pada Menu Bermain.",
      "quote": "\"Bermain sambil belajar membuat otak cerdas!\""
    },
    {
      "id": "badge-cust-berlatih",
      "section": "berlatih",
      "title": "Cendekiawan HOTS",
      "nickname": "Bintang Penalaran",
      "icon": "🌟",
      "color": "from-rose-500 to-pink-500",
      "borderColor": "border-rose-300 hover:border-rose-400",
      "bgGradient": "bg-rose-50",
      "description": "Menyelesaikan 10 soal asesmen HOTS kontekstual.",
      "requirement": "Selesaikan asesmen pada Menu Berlatih.",
      "quote": "\"Berpikir kritis menyelesaikan tantangan!\""
    },
    {
      "id": "badge-cust-refleksi",
      "section": "refleksi",
      "title": "Sahabat Bijak Berkarakter",
      "nickname": "Anak Berbudi Mulia",
      "icon": "💖",
      "color": "from-sky-500 to-blue-500",
      "borderColor": "border-sky-300 hover:border-sky-400",
      "bgGradient": "bg-sky-50",
      "description": "Mengisi refleksi perasaan dan komitmen positif.",
      "requirement": "Simpan formulir pada Menu Refleksi.",
      "quote": "\"Ilmu bermanfaat diamalkan dengan hati mulia!\""
    },
    {
      "id": "badge-cust-grandmaster",
      "section": "grand_master",
      "title": "Grand Master Bintang Juara",
      "nickname": "Bintang Berprestasi",
      "icon": "👑",
      "color": "from-amber-400 via-rose-500 to-teal-500",
      "borderColor": "border-amber-400 hover:border-amber-500",
      "bgGradient": "bg-gradient-to-r from-amber-50 to-rose-50",
      "description": "Tuntas 100% seluruh modul pembelajaran.",
      "requirement": "Selesaikan keempat misi belajar!",
      "quote": "\"Prestasi gemilang untuk masa depan cerah!\""
    }
  ]
}

PENTING:
- Bagian berlatih.questions HARUS BERISI TEPAT 10 SOAL HOTS (id 1 sampai 10).
- Setiap soal wajib memiliki: id (angka 1-10), dimension ('Analisis (C4)' atau 'Evaluasi (C5)' atau 'Kreasi (C6)'), caseStory (cerita pendek kehidupan nyata anak 3-4 kalimat), question (pertanyaan analisis/evaluasi), options (array 4 pilihan kalimat lengkap), correctAnswer (angka index 0, 1, 2, atau 3), explanation (pembahasan detail 2-3 kalimat yang mendidik).
- Keluarkan HANYA JSON murni tanpa markdown backticks (tanpa \`\`\`json) agar bisa di-parse langsung.`;

      const userPrompt = `Buatkan tema pembelajaran interaktif lengkap untuk:
- Topik: "${topic.trim()}"
- Mata Pelajaran: "${subject || 'IPAS'}"
- Jenjang: "${gradePhase || 'Fase B (Kelas 3 SD)'}"
${goals ? `- Catatan Tujuan Khusus dari Guru: "${goals}"` : ''}

Pastikan tepat ada 10 soal asesmen HOTS di dalam array berlatih.questions. Hasilkan HANYA JSON murni!`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      // Clean JSON if needed
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsedTheme = JSON.parse(cleaned);
      parsedTheme.isCustom = true;
      if (!parsedTheme.id) {
        parsedTheme.id = `custom_${Date.now()}`;
      }

      return res.json({ theme: parsedTheme });
    } catch (err: any) {
      console.error('Error generating theme via Gemini API:', err);
      return res.status(500).json({
        error: 'Gagal memproses pembuatan tema dengan Gemini AI: ' + (err.message || 'Unknown error'),
        fallbackAvailable: true,
      });
    }
  });

  // Mount Vite middleware in development mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server MPI Lumi ready at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
  process.exit(1);
});
