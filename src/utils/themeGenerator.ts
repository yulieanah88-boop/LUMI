import { ThemeConfig, HotsQuestion, GameQuestion } from '../types';

export interface ThemeGeneratorInput {
  topic: string;
  subject?: string;
  gradePhase?: string;
  goals?: string;
  paletteId?: string;
}

export function validateTheme(theme: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!theme || typeof theme !== 'object') {
    return { valid: false, errors: ['Objek tema tidak valid.'] };
  }

  if (!theme.judulTema || typeof theme.judulTema !== 'string' || theme.judulTema.trim().length === 0) {
    errors.push('Judul tema tidak boleh kosong.');
  }

  if (!Array.isArray(theme.tujuanPembelajaran) || theme.tujuanPembelajaran.length === 0) {
    errors.push('Tujuan pembelajaran minimal 1 item.');
  }

  if (!theme.belajar || !Array.isArray(theme.belajar.materiBab) || theme.belajar.materiBab.length === 0) {
    errors.push('Materi bab pembelajaran minimal 1 bab.');
  }

  if (!theme.bermain || !Array.isArray(theme.bermain.games) || theme.bermain.games.length < 5) {
    errors.push('Menu Bermain wajib memiliki minimal 5 tantangan game.');
  }

  if (!theme.berlatih || !Array.isArray(theme.berlatih.questions) || theme.berlatih.questions.length !== 10) {
    errors.push(`Menu Berlatih wajib memiliki tepat 10 soal HOTS (saat ini: ${theme?.berlatih?.questions?.length || 0}).`);
  } else {
    // Validate each HOTS question
    theme.berlatih.questions.forEach((q: HotsQuestion, index: number) => {
      if (!q.caseStory || q.caseStory.trim().length === 0) {
        errors.push(`Soal ${index + 1}: Cerita studi kasus tidak boleh kosong.`);
      }
      if (!q.question || q.question.trim().length === 0) {
        errors.push(`Soal ${index + 1}: Pertanyaan tidak boleh kosong.`);
      }
      if (!Array.isArray(q.options) || q.options.length < 4) {
        errors.push(`Soal ${index + 1}: Pilihan jawaban minimal 4 opsi.`);
      }
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        errors.push(`Soal ${index + 1}: Kunci jawaban harus berupa indeks 0, 1, 2, atau 3.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function generateFallbackTheme(input: ThemeGeneratorInput): ThemeConfig {
  const topic = input.topic.trim();
  const subject = input.subject?.trim() || 'IPAS';
  const gradePhase = input.gradePhase?.trim() || 'Fase B (Kelas 3 SD)';
  const paletteId = input.paletteId || 'rose';

  const paletteMap: Record<string, any> = {
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
      name: 'Zamrud Alami',
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
      name: 'Lembayung Kreatif',
      primary: 'purple',
      primaryHex: '#9333ea',
      secondaryHex: '#c084fc',
      accentHex: '#ec4899',
      bgGradient: 'from-purple-50/70 via-fuchsia-50/50 to-pink-50/70',
      cardBorder: 'border-purple-200',
      badgeBg: 'bg-purple-100 text-purple-700',
    },
  };

  const selectedPalette = paletteMap[paletteId] || paletteMap.rose;

  const fallbackQuestions: HotsQuestion[] = [
    {
      id: 1,
      dimension: 'Analisis (C4)',
      caseStory: `Saat mempelajari topik "${topic}", Budi melihat bahwa menerapkan konsep ini di lingkungan rumahnya membuat suasana menjadi lebih tertib dan menyenangkan bagi semua anggota keluarga.`,
      question: `Berdasarkan pengalaman Budi, mengapa pemahaman tentang "${topic}" sangat bermanfaat bagi kehidupan sehari-hari anak-anak?`,
      options: [
        `Membantu kita memahami cara bersikap bijak, bertanggung jawab, dan bekerja sama dengan orang di sekitar kita.`,
        `Agar kita mendapatkan hadiah uang jajan yang sangat banyak dari tetangga.`,
        `Karena materi ini hanya perlu dihafal saat ujian sekolah saja.`,
        `Supaya kita tidak perlu lagi belajar di sekolah.`,
      ],
      correctAnswer: 0,
      explanation: `Mempelajari "${topic}" menumbuhkan kebiasaan positif, penalaran kritis, dan sikap peduli terhadap sesama dan lingkungan.`,
    },
    {
      id: 2,
      dimension: 'Analisis (C4)',
      caseStory: `Siti dan teman sekelasnya mengamati contoh-contoh nyata terkait "${topic}". Mereka mencatat perbedaan antara tindakan yang baik dan tindakan yang kurang tepat di sekolah.`,
      question: `Faktor apa yang paling menentukan keberhasilan dalam menerapkan prinsip "${topic}" di lingkungan sekolah?`,
      options: [
        `Kedisiplinan, kekompakan seluruh warga sekolah, dan sikap saling menghargai.`,
        `Hanya bergantung pada pengawasan guru piket semata.`,
        `Banyaknya piala dan piagam yang dipajang di lemari sekolah.`,
        `Adanya hukuman fisik yang keras bagi siswa yang lupa.`,
      ],
      correctAnswer: 0,
      explanation: `Keberhasilan penerapan materi pembelajaran bersumber dari kesadaran bersama, pembiasaan positif, dan saling mendukung antarteman.`,
    },
    {
      id: 3,
      dimension: 'Evaluasi (C5)',
      caseStory: `Doni melihat seorang temannya melakukan kesalahan saat mempraktikkan konsep "${topic}". Teman tersebut merasa malu dan ingin menyerah.`,
      question: `Bagaimana evaluasi sikap yang paling tepat dan suportif yang seharusnya ditunjukkan Doni sebagai sahabat yang baik?`,
      options: [
        `Menyemangati temannya, menjelaskan bagian yang keliru dengan ramah, dan mengajak mencoba bersama lagi.`,
        `Mengejek temannya di depan kelas agar temannya merasa jera.`,
        `Membiarkan temannya menyerah karena belajar hal baru itu tidak penting.`,
        `Melaporkan temannya ke kepala sekolah agar mendapat hukuman berat.`,
      ],
      correctAnswer: 0,
      explanation: `Sahabat yang hebat selalu memberikan semangat, merangkul teman, dan belajar dari kesalahan bersama-sama.`,
    },
    {
      id: 4,
      dimension: 'Evaluasi (C5)',
      caseStory: `Di perpustakaan desa, ada dua buku panduan tentang "${topic}". Buku pertama hanya berisi teks panjang tanpa contoh, sedangkan buku kedua dilengkapi gambar ilustrasi berwarna dan studi kasus cerita.`,
      question: `Mengapa buku yang dilengkapi ilustrasi dan contoh cerita lebih efektif untuk anak-anak seusia kita?`,
      options: [
        `Ilustrasi dan cerita membantu kita membayangkan situasi nyata dan memahami alasan di balik setiap tindakan.`,
        `Karena anak-anak dilarang membaca teks yang lebih dari tiga kata.`,
        `Hanya karena gambar membuat buku menjadi lebih mahal harganya.`,
        `Supaya kita tidak perlu berpikir sama sekali saat membaca.`,
      ],
      correctAnswer: 0,
      explanation: `Media visual dan narasi kontekstual merangsang imajinasi serta memudahkan anak mencerna konsep abstrak secara bermakna.`,
    },
    {
      id: 5,
      dimension: 'Kreasi (C6)',
      caseStory: `Regu Garuda ingin membuat proyek karya sederhana di kelas tentang "${topic}" agar teman-teman mudah mengingat intisari pembelajarannya.`,
      question: `Ide karya kreatif manakah yang paling menarik dan bermanfaat untuk dipamerkan di sudut baca kelas?`,
      options: [
        `Membuat poster cerita bergambar atau mading interaktif dengan kuis tebak pesan moral.`,
        `Mencoret-coret dinding sekolah dengan cat minyak warna gelap.`,
        `Menyembunyikan buku pelajaran teman agar tidak bisa belajar.`,
        `Hanya diam saja dan menunggu tugas diselesaikan oleh kelompok lain.`,
      ],
      correctAnswer: 0,
      explanation: `Membuat poster cerita dan mading interaktif melatih kreativitas, kerja sama regu, dan menyebarkan pesan kebaikan.`,
    },
    {
      id: 6,
      dimension: 'Analisis (C4)',
      caseStory: `Ketika mempraktikkan materi "${topic}", Lani menemukan bahwa ada cara lama yang membutuhkan waktu lama dan ada cara baru yang lebih cepat dan aman.`,
      question: `Berdasarkan perbandingan tersebut, apa yang sebaiknya dilakukan oleh Lani dan kelompoknya?`,
      options: [
        `Menganalisis kelebihan cara baru tanpa melupakan nilai-nilai kebaikan dari cara sebelumnya.`,
        `Langsung membuang semua buku lama dan tidak mau belajar sejarahnya.`,
        `Menolak cara baru karena takut mencoba hal yang belum pernah dilakukan.`,
        `Menyuruh orang lain saja yang mengerjakan tugas tersebut.`,
      ],
      correctAnswer: 0,
      explanation: `Sikap ilmiah yang bijak adalah menganalisis inovasi baru dengan kritis sambil tetap menghargai fondasi pengetahuan yang sudah ada.`,
    },
    {
      id: 7,
      dimension: 'Evaluasi (C5)',
      caseStory: `Pak Guru memberikan pujian kepada seluruh siswa karena berhasil menyelesaikan proyek "${topic}" dengan penuh antusiasme dan kerja sama yang baik.`,
      question: `Nilai karakter Profil Pelajar Pancasila apa yang paling menonjol dari keberhasilan kelas tersebut?`,
      options: [
        `Gotong royong, bernalar kritis, dan mandiri dalam menyelesaikan tugas bersama.`,
        `Sikap ingin menang sendiri dan tidak mau mendengarkan pendapat teman.`,
        `Ketergantungan penuh pada perintah tanpa inisiatif pribadi.`,
        `Menyerah ketika menemui kesulitan kecil dalam proses belajar.`,
      ],
      correctAnswer: 0,
      explanation: `Gotong royong dan bernalar kritis adalah dimensi penting Kurikulum Merdeka yang tercermin saat siswa belajar bekerja sama secara harmonis.`,
    },
    {
      id: 8,
      dimension: 'Kreasi (C6)',
      caseStory: `Kamu diminta membuat satu kalimat komitmen diri setelah menuntaskan pembelajaran "${topic}" untuk dibacakan di depan kelas.`,
      question: `Kalimat komitmen manakah yang paling menunjukkan tekad pribadi yang positif dan menginspirasi?`,
      options: [
        `"Aku berjanji akan mengamalkan ilmu tentang ${topic} ini dengan sungguh-sungguh demi kebaikan diri dan sesama!"`,
        `"Aku berjanji akan melupakan materi ini begitu bel istirahat berbunyi."`,
        `"Aku belajar hanya agar mendapat nilai rapor yang tinggi saja."`,
        `"Aku berjanji tidak akan membagikan ilmu ini kepada siapa pun."`,
      ],
      correctAnswer: 0,
      explanation: `Komitmen belajar yang mulia berorientasi pada pengamalan ilmu nyata yang memberi manfaat bagi diri dan lingkungan sekitar.`,
    },
    {
      id: 9,
      dimension: 'Analisis (C4)',
      caseStory: `Di sebuah desa, warga berhasil memanfaatkan pemahaman terkait "${topic}" untuk menyelesaikan masalah kebersihan dan ketertiban lingkungan secara bersama-sama.`,
      question: `Hal apa yang membuktikan bahwa ilmu pengetahuan tentang "${topic}" dapat membawa perubahan nyata di masyarakat?`,
      options: [
        `Adanya perubahan positif pada perilaku warga dan lingkungan yang menjadi lebih sehat, aman, dan tenteram.`,
        `Hanya karena desa tersebut diliput di siaran berita televisi nasional.`,
        `Karena kepala desa membagikan hadiah gawai kepada semua warga.`,
        `Karena semua warga dilarang keluar rumah selama satu bulan penuh.`,
      ],
      correctAnswer: 0,
      explanation: `Bukti nyata dari keberhasilan belajar adalah transformasi perilaku positif yang dirasakan manfaatnya oleh masyarakat luas.`,
    },
    {
      id: 10,
      dimension: 'Evaluasi (C5)',
      caseStory: `Seorang siswa bertanya: "Mengapa kita perlu terus belajar dan mendalami topik '${topic}', padahal kita sudah membaca buku modul ini?"`,
      question: `Jawaban reflektif apa yang paling tepat untuk menjawab pertanyaan rasa ingin tahu siswa tersebut?`,
      options: [
        `Karena kehidupan terus berkembang, dan belajar sepanjang hayat membuat kita siap menghadapi masa depan dengan bijak.`,
        `Karena jika tidak belajar, kita tidak akan diizinkan naik kelas selamanya.`,
        `Hanya untuk menghabiskan waktu luang di dalam kelas setiap hari.`,
        `Supaya kita bisa menyombongkan kepintaran kita kepada adik kelas.`,
      ],
      correctAnswer: 0,
      explanation: `Belajar adalah proses sepanjang hayat (lifelong learning) yang memperluas wawasan dan membentuk pribadi yang adaptif dan berakhlak mulia.`,
    },
  ];

  const fallbackGames: GameQuestion[] = [
    {
      id: 'game-fb-1',
      type: 'mc',
      title: 'Tantangan 1: Pilihan Ganda Pemahaman Konsep',
      prompt: `Berdasarkan pembelajaran tema "${topic}", manakah pernyataan yang paling tepat menggambarkan sikap seorang pembelajar yang bijak?`,
      options: [
        `Menerapkan ilmu yang dipelajari dengan penuh tanggung jawab dan rasa syukur dalam kehidupan sehari-hari.`,
        `Menghafalkan materi hanya untuk mendapatkan nilai ujian lalu melupakannya.`,
        `Merasa sudah paling pintar dan tidak mau berdiskusi dengan teman kelompok.`,
        `Menolak mempelajari hal-hal baru yang belum pernah diketahui sebelumnya.`,
      ],
      correctAnswer: 0,
      explanation: `Pembelajar yang bijak selalu mengamalkan ilmunya untuk kebaikan diri dan sesama dengan penuh rasa tanggung jawab.`,
    },
    {
      id: 'game-fb-2',
      type: 'complex',
      title: 'Tantangan 2: Pilihan Ganda Kompleks (Centang 3 Jawaban Tepat)',
      prompt: `Manakah dari tindakan berikut yang mencerminkan pemahaman yang baik tentang "${topic}"? (Pilihlah 3 jawaban tepat)`,
      options: [
        `Selalu berhati-hati dan memperhatikan keselamatan saat beraktivitas`,
        `Saling menghargai pendapat teman saat berdiskusi di dalam kelas`,
        `Menyerah dan menangis saat menemui tugas yang sedikit menantang`,
        `Menunjukkan rasa ingin tahu yang tinggi dengan bertanya secara sopan`,
        `Memaksa teman untuk selalu setuju dengan pendapat kita sendiri`,
      ],
      correctAnswers: [0, 1, 3],
      explanation: `Berhati-hati, saling menghargai pendapat, dan bertanya dengan sopan adalah sikap positif seorang pelajar yang cerdas.`,
    },
    {
      id: 'game-fb-3',
      type: 'matching',
      title: 'Tantangan 3: Menjodohkan Konsep & Penerapannya',
      prompt: `Pasangkanlah konsep pembelajaran di sebelah kiri dengan contoh tindakan nyata di sebelah kanan!`,
      pairs: [
        {
          id: 'fb-p1',
          leftText: `Mengenal hakikat materi "${topic}"`,
          rightText: `Membaca buku modul dengan teliti dan penuh rasa ingin tahu`,
        },
        {
          id: 'fb-p2',
          leftText: `Menghadapi tantangan belajar yang sulit`,
          rightText: `Pantang menyerah dan berdiskusi bersama guru atau orang tua`,
        },
        {
          id: 'fb-p3',
          leftText: `Bekerja sama di dalam kelompok`,
          rightText: `Saling menghormati, berbagi tugas, dan kompak mencari solusi`,
        },
        {
          id: 'fb-p4',
          leftText: `Mengakhiri kegiatan belajar`,
          rightText: `Bersyukur kepada Tuhan dan membuat komitmen aksi nyata`,
        },
      ],
      explanation: `Memahami konsep diiringi tindakan nyata membuat hasil belajar menjadi berkah dan membekas di hati.`,
    },
    {
      id: 'game-fb-4',
      type: 'short',
      title: 'Tantangan 4: Isian Singkat',
      prompt: `Sikap pantang menyerah dan terus berusaha saat mempelajari hal baru di sekolah sering disebut dengan sikap ... (satu kata berawalan huruf G).`,
      acceptedAnswers: ['gigih', 'GIGIH', 'Gigih', 'giat', 'gemar', 'gotong royong'],
      hint: 'Kata berawalan huruf G yang berarti ulet, tekun, dan tidak mudah putus asa.',
      explanation: `Kegigihan dan ketekunan adalah modal utama seorang siswa untuk meraih cita-cita gemilang.`,
    },
    {
      id: 'game-fb-5',
      type: 'reorder',
      title: 'Tantangan 5: Mengurutkan Langkah Pembelajaran yang Efektif',
      prompt: `Gunakan tombol Panah Naik (⬆️) dan Panah Turun (⬇️) untuk menyusun urutan langkah belajar yang paling efektif dari awal hingga akhir!`,
      items: [
        { id: 'fb-step-2', label: '2. Eksplorasi materi, bertanya, dan berdiskusi aktif bersama teman' },
        { id: 'fb-step-1', label: '1. Mengamati pertanyaan pemantik dan menetapkan niat belajar yang baik' },
        { id: 'fb-step-3', label: '3. Berlatih memecahkan soal HOTS dan merefleksikan hikmah pembelajaran' },
      ],
      correctOrder: ['fb-step-1', 'fb-step-2', 'fb-step-3'],
      explanation: `Urutan belajar efektif: Membuka rasa ingin tahu -> Eksplorasi materi mendalam -> Latihan penerapan dan refleksi bermakna.`,
    },
  ];

  return {
    id: `custom_${Date.now()}`,
    judulTema: topic,
    subJudul: `Eksplorasi Pembelajaran Interaktif ${subject} Kelas 3 SD`,
    mataPelajaran: subject,
    fase: 'Fase B',
    kelas: gradePhase,
    emojiMaskot: '🌟',
    sapaanLumi: `Halo Sahabat Cilik! Selamat datang di modul pembelajaran interaktif "${topic}". Mari belajar bersama Lumi dengan penuh semangat dan rasa gembira!`,
    deskripsiSingkat: `Mempelajari konsep dasar, eksplorasi interaktif, dan penerapan nyata materi ${topic} untuk siswa Kelas 3 SD.`,
    palet: selectedPalette,
    tujuanPembelajaran: [
      {
        id: 1,
        text: `Peserta didik dapat mengidentifikasi konsep utama materi "${topic}" dengan cermat dan rasa ingin tahu yang tinggi.`,
        icon: '🎯',
      },
      {
        id: 2,
        text: `Peserta didik mampu menghubungkan keterkaitan materi "${topic}" dengan aktivitas kehidupan sehari-hari di rumah dan sekolah.`,
        icon: '💡',
      },
      {
        id: 3,
        text: `Peserta didik dapat memecahkan masalah kontekstual melalui penalaran kritis tingkat tinggi (HOTS).`,
        icon: '🌟',
      },
      {
        id: 4,
        text: `Peserta didik mampu menunjukkan sikap mandiri, gotong royong, dan bersyukur atas ilmu yang telah dipelajari.`,
        icon: '💖',
      },
    ],
    capaianPembelajaran: `Pada Fase B (${gradePhase}), peserta didik memahami materi "${topic}" melalui pengamatan langsung, bernalar kritis dalam menganalisis informasi, serta menerapkan perilaku bertanggung jawab dalam kehidupan sosial bermasyarakat.`,
    belajar: {
      pertanyaanPemantik: [
        {
          id: 1,
          title: `Mengapa Kita Perlu Mempelajari ${topic}?`,
          scenario: `Di lingkungan sekitar kita, setiap peristiwa saling berkaitan. Mempelajari "${topic}" membantu kita memahami rahasia di balik hal-hal yang sering kita jumpai setiap hari.`,
          imageCaption: `Eksplorasi awal materi ${topic} melalui pengamatan lingkungan sekitar.`,
          imageEmoji: '🔍 💡',
          question: `Menurut pendapatmu, apa manfaat terbesar jika kita memahami "${topic}" sejak usia sekolah dasar?`,
          options: [
            {
              text: `Kita menjadi lebih bijak, peka terhadap lingkungan, dan mampu memecahkan masalah secara cerdas.`,
              feedback: `Tepat sekali! Memahami hal baru sejak dini membuat pikiran kita terbuka, mandiri, dan berkarakter mulia.`,
            },
            {
              text: `Hanya untuk memamerkan kepintaran kita kepada orang lain.`,
              feedback: `Kurang tepat. Ilmu dipelajari untuk diamalkan dalam kebaikan, bukan untuk bersikap sombong.`,
            },
          ],
          narasiText: `Mengapa kita perlu mempelajari ${topic}? Memahami hal baru sejak dini membantu kita menjadi pribadi yang bijak, cerdas, dan bermanfaat bagi sesama.`,
        },
        {
          id: 2,
          title: `Menghubungkan Materi dengan Lingkungan Kita`,
          scenario: `Guru mengajak siswa mengamati benda dan kejadian di sekitar sekolah yang berkaitan langsung dengan penerapan "${topic}".`,
          imageCaption: `Mengaitkan konsep belajar dengan contoh nyata di sekitar kita.`,
          imageEmoji: '🌱 🤝',
          question: `Bagaimana cara terbaik untuk membuktikan bahwa kita sudah memahami materi ini dengan baik?`,
          options: [
            {
              text: `Dengan mempraktikkan kebiasaan baik dan saling berbagi pemahaman positif kepada teman-teman.`,
              feedback: `Hebat sekali! Pemahaman sejati terlihat saat ilmu diterapkan dalam tindakan nyata sehari-hari.`,
            },
            {
              text: `Dengan menyimpan buku catatan di dalam lemari dan tidak membukanya lagi.`,
              feedback: `Kurang tepat. Buku dan ilmu harus terus diulang dan dipraktikkan agar tidak terlupakan.`,
            },
          ],
          narasiText: `Cara terbaik membuktikan pemahaman adalah dengan mempraktikkan ilmu dalam tindakan nyata sehari-hari.`,
        },
      ],
      materiBab: [
        {
          id: 'bab_konsep',
          title: `1. Mengenal Konsep Dasar ${topic}`,
          badge: 'Fondasi Pembelajaran',
          summary: `Pada bagian ini kita mempelajari pengertian mendasar, unsur-unsur penting, serta fakta menarik seputar ${topic}.`,
          narasiText: `Bab 1: Mengenal Konsep Dasar ${topic}. Mempelajari fakta menarik, unsur penting, dan pemahaman awal yang menyenangkan.`,
          points: [
            {
              title: `Pengertian dan Makna Penting 🌟`,
              desc: `Topik "${topic}" adalah bagian berharga dari ilmu pengetahuan yang membantu kita mengerti bagaimana alam dan kehidupan bekerja secara harmonis.`,
              emoji: '🌟',
            },
            {
              title: `Contoh Nyata di Sekitar Kita 🔍`,
              desc: `Kita dapat menjumpai penerapan "${topic}" di rumah, di ruang kelas, maupun saat bermain di luar ruangan bersama teman-teman.`,
              emoji: '🔍',
            },
          ],
          tableData: [
            { price: 'Bagian Awal', qty: 'Pengenalan Konsep', label: 'Memahami dasar materi dengan bahasa sederhana' },
            { price: 'Bagian Inti', qty: 'Pengamatan Mandiri', label: 'Menemukan contoh-contoh nyata di lingkungan sekitar' },
          ],
        },
        {
          id: 'bab_penerapan',
          title: `2. Penerapan & Keterampilan Praktis`,
          badge: 'Aksi & Eksplorasi',
          summary: `Bagaimana cara kita mempraktikkan pengetahuan tentang ${topic} dalam kehidupan sehari-hari?`,
          narasiText: `Bab 2: Penerapan dan Keterampilan Praktis. Menerapkan ilmu dalam tindakan sehari-hari dengan penuh tanggung jawab.`,
          points: [
            {
              title: `Langkah Aksi Sehari-hari 🚀`,
              desc: `Mulai dari hal-hal kecil, seperti menjaga keteraturan, berani bertanya jika belum paham, dan saling membantu dalam menyelesaikan tugas bersama.`,
              emoji: '🚀',
            },
            {
              title: `Bekerja Sama Menuntaskan Tugas 🤝`,
              desc: `Diskusi kelompok membuat tugas terasa lebih ringan dan melatih kita mendengarkan serta menghargai gagasan orang lain.`,
              emoji: '🤝',
            },
          ],
        },
        {
          id: 'bab_hikmah',
          title: `3. Hikmah & Sikap Bersyukur`,
          badge: 'Karakter Mulia',
          summary: `Menumbuhkan rasa syukur kepada Tuhan Yang Maha Esa dan memiliki tekad untuk menjadi anak Indonesia yang berprestasi.`,
          narasiText: `Bab 3: Hikmah dan Sikap Bersyukur. Menumbuhkan rasa syukur dan tekad menjadi generasi berprestasi.`,
          points: [
            {
              title: `Rasa Syukur atas Anugerah Ilmu 💖`,
              desc: `Setiap ilmu yang kita pelajari adalah bekal masa depan yang harus dijaga dengan kejujuran dan budi pekerti luhur.`,
              emoji: '💖',
            },
          ],
        },
      ],
      videoSummary: {
        title: `Teater Petualangan Belajar: ${topic}`,
        stages: [
          { stageName: 'Langkah 1', years: 'Tahap Awal', desc: 'Mengenal dasar materi melalui pengamatan kontekstual.', icon: '💡' },
          { stageName: 'Langkah 2', years: 'Tahap Pendalaman', desc: 'Eksplorasi contoh dan berdiskusi aktif bersama teman.', icon: '🔍' },
          { stageName: 'Langkah 3', years: 'Tahap Penerapan', desc: 'Mengamalkan ilmu dalam kebiasaan baik sehari-hari.', icon: '🌟' },
        ],
      },
    },
    bermain: {
      simulation: {
        type: 'custom_interactive',
        title: `Laboratorium Eksplorasi Interaktif: ${topic}`,
        badge: 'Praktik & Eksplorasi',
        description: `Eksplorasi interaktif berbagai studi kasus dan skenario seputar topik ${topic}.`,
      },
      games: fallbackGames,
    },
    berlatih: {
      questions: fallbackQuestions,
    },
    refleksi: {
      prompt: `Bagaimana perasaan dan kesan belajarmu setelah menuntaskan tema "${topic}" hari ini?`,
      emojiOptions: [
        { emoji: '🤩', label: 'Sangat Paham & Antusias', desc: 'Materi sangat jelas, seru, dan menyenangkan!' },
        { emoji: '😊', label: 'Senang & Mengerti', desc: 'Memahami inti materi dan siap mempraktikkannya.' },
        { emoji: '🤔', label: 'Ingin Tahu Lebih Banyak', desc: 'Masih penasaran dan ingin bertanya kepada guru.' },
        { emoji: '💖', label: 'Merasa Bersyukur', desc: 'Bersyukur dapat mempelajari ilmu baru yang bermanfaat.' },
      ],
      favoriteOptions: [
        'Pertanyaan Pemantik Bergambar (Menu Belajar)',
        'Materi Interaktif & Rangkuman (Menu Belajar)',
        'Tantangan Game Edukasi 5 Format (Menu Bermain)',
        '10 Soal Asesmen HOTS Berpikir Kritis (Menu Berlatih)',
        'Mengunduh Piagam Prestasi Belajar Digital',
      ],
      commitmentPrompt: `Tuliskan satu tekad atau komitmen baik yang akan kamu lakukan setelah mempelajari tema "${topic}":`,
    },
    sumberBelajar: [
      {
        title: `Buku Siswa & Panduan Guru ${subject} Kelas 3 SD`,
        author: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI',
        year: '2024',
        type: 'Buku Teks Kurikulum Merdeka',
        description: `Buku teks resmi rujukan Capaian Pembelajaran Fase B untuk topik ${topic}.`,
        link: 'https://buku.kemdikbud.go.id',
      },
      {
        title: 'Modul Pembelajaran Mandiri Ramah Anak',
        author: 'Direktorat Sekolah Dasar, Ditjen PAUD Dikdasmen',
        year: '2025',
        type: 'Modul Ajar Digital',
        description: 'Panduan aktivitas pembelajaran bermakna dan asesmen formatif Kurikulum Merdeka.',
      },
    ],
    glosarium: [
      {
        term: 'Penalaran Kritis (HOTS)',
        meaning: 'Kemampuan berpikir mendalam untuk menganalisis, mengevaluasi, dan menemukan solusi terbaik dalam suatu masalah.',
      },
      {
        term: 'Gotong Royong',
        meaning: 'Bekerja bersama-sama saling tolong-menolong demi mencapai tujuan bersama yang baik.',
      },
      {
        term: 'Refleksi Diri',
        meaning: 'Mengingat kembali apa yang sudah dipelajari dan memikirkan manfaatnya bagi perbaikan diri kita.',
      },
    ],
    sertifikat: {
      appreciationText: `Atas keberhasilan menuntaskan seluruh petualangan pembelajaran interaktif:`,
      themeTitleOnCert: `${topic.toUpperCase()}`,
      subText: `Materi Pembelajaran ${subject} ${gradePhase} Kurikulum Merdeka`,
    },
    badges: [
      {
        id: `badge-${Date.now()}-belajar`,
        section: 'belajar',
        title: `Penjelajah ${topic.slice(0, 18)}`,
        nickname: 'Pembelajar Tangguh',
        icon: '📖',
        color: 'from-emerald-500 to-teal-500',
        borderColor: 'border-emerald-300 hover:border-emerald-400',
        bgGradient: 'bg-emerald-50',
        description: `Berhasil mempelajari konsep dasar dan contoh nyata tema "${topic}".`,
        requirement: 'Selesaikan dan baca modul pada Menu Belajar.',
        quote: '"Ilmu pengetahuan adalah pelita yang menerangi masa depan!"',
      },
      {
        id: `badge-${Date.now()}-bermain`,
        section: 'bermain',
        title: 'Pakar Game Interaktif',
        nickname: 'Jagoan Kuis Ceria',
        icon: '🎮',
        color: 'from-amber-500 to-orange-500',
        borderColor: 'border-amber-300 hover:border-amber-400',
        bgGradient: 'bg-amber-50',
        description: 'Menuntaskan seluruh 5 format tantangan game edukasi.',
        requirement: 'Selesaikan seluruh permainan pada Menu Bermain.',
        quote: '"Bermain dengan gembira, belajar dengan cerdas!"',
      },
      {
        id: `badge-${Date.now()}-berlatih`,
        section: 'berlatih',
        title: 'Cendekiawan HOTS',
        nickname: 'Bintang Penalaran Kritis',
        icon: '🌟',
        color: 'from-rose-500 to-pink-500',
        borderColor: 'border-rose-300 hover:border-rose-400',
        bgGradient: 'bg-rose-50',
        description: 'Menyelesaikan 10 soal asesmen HOTS kontekstual dengan kemampuan bernalar kritis.',
        requirement: 'Selesaikan 10 soal asesmen pada Menu Berlatih.',
        quote: '"Pantang menyerah memecahkan tantangan berpikir!"',
      },
      {
        id: `badge-${Date.now()}-refleksi`,
        section: 'refleksi',
        title: 'Sahabat Bijak Berkarakter',
        nickname: 'Anak Berbudi Mulia',
        icon: '💖',
        color: 'from-sky-500 to-blue-500',
        borderColor: 'border-sky-300 hover:border-sky-400',
        bgGradient: 'bg-sky-50',
        description: 'Mengenali perasaan diri dan memiliki komitmen pengamalan ilmu sehari-hari.',
        requirement: 'Simpan refleksi dan komitmen diri pada Menu Refleksi.',
        quote: '"Ilmu yang bermanfaat diamalkan dengan hati yang mulia!"',
      },
      {
        id: `badge-${Date.now()}-grandmaster`,
        section: 'grand_master',
        title: 'Grand Master Bintang Juara',
        nickname: 'Duta Pembelajar Sejati',
        icon: '👑',
        color: 'from-amber-400 via-rose-500 to-teal-500',
        borderColor: 'border-amber-400 hover:border-amber-500',
        bgGradient: 'bg-gradient-to-r from-amber-50 to-rose-50',
        description: 'Tuntas menyelesaikan keempat misi pembelajaran: Belajar, Bermain, Berlatih, dan Refleksi 100%.',
        requirement: 'Tuntaskan seluruh modul dan raih prestasi gemilang!',
        quote: '"Aku anak Indonesia yang cerdas, berani, dan siap menyongsong masa depan!"',
      },
    ],
    isCustom: true,
  };
}

export async function generateThemeWithAI(input: ThemeGeneratorInput): Promise<ThemeConfig> {
  try {
    const res = await fetch('/api/generate-theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.theme) {
        const validation = validateTheme(data.theme);
        if (validation.valid) {
          return data.theme;
        } else {
          console.warn('AI generated theme has validation issues, filling missing fields:', validation.errors);
          // If questions are missing or incomplete, merge with fallback questions
          const fallback = generateFallbackTheme(input);
          const mergedTheme = {
            ...fallback,
            ...data.theme,
            berlatih: {
              questions:
                Array.isArray(data.theme?.berlatih?.questions) && data.theme.berlatih.questions.length === 10
                  ? data.theme.berlatih.questions
                  : fallback.berlatih.questions,
            },
            bermain: {
              ...fallback.bermain,
              ...(data.theme?.bermain || {}),
              games:
                Array.isArray(data.theme?.bermain?.games) && data.theme.bermain.games.length >= 5
                  ? data.theme.bermain.games
                  : fallback.bermain.games,
            },
            badges: Array.isArray(data.theme?.badges) && data.theme.badges.length === 5 ? data.theme.badges : fallback.badges,
          };
          return mergedTheme;
        }
      }
    }
  } catch (err) {
    console.warn('Server AI generation failed or offline, using fallback generator:', err);
  }

  // Graceful, high-quality fallback generator
  return generateFallbackTheme(input);
}
