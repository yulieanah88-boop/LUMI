import { ThemeConfig } from '../../types';

export const TUBUHKU_BERHARGA_THEME: ThemeConfig = {
  id: 'tubuhku_berharga',
  judulTema: 'Tubuhku Berharga',
  subJudul: 'Menjaga Diri, Pubertas, & Kesehatan Reproduksi Dasar',
  mataPelajaran: 'IPAS / Pendidikan Pancasila / PJOK Terintegrasi',
  fase: 'Fase C',
  kelas: 'Kelas 5 SD',
  emojiMaskot: '🛡️',
  sapaanLumi: 'Halo Teman Hebat Kelas 5! Bersama Lumi si Penjaga Ceria, kita akan belajar bahwa tubuh kita sangat berharga, memahami perubahan masa pubertas, dan menjaga diri dengan penuh rasa syukur!',
  deskripsiSingkat: 'Mengenal bagian tubuh pribadi, perubahan masa pubertas, kebersihan diri, membedakan sentuhan aman dan tidak aman, serta jurus berani Tolak, Pergi, Ceritakan!',
  palet: {
    id: 'emerald',
    name: 'Hijau Zamrud & Mint Penjaga',
    primary: 'emerald',
    primaryHex: '#10b981',
    secondaryHex: '#34d399',
    accentHex: '#0284c7',
    bgGradient: 'from-emerald-50/70 via-teal-50/50 to-sky-50/70',
    cardBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800',
  },
  tujuanPembelajaran: [
    {
      id: 1,
      text: 'Peserta didik dapat menyebutkan bagian tubuh pribadi dengan istilah yang benar, sopan, dan memahami bahwa tubuh adalah anugerah Tuhan yang berharga.',
      icon: '✨',
    },
    {
      id: 2,
      text: 'Peserta didik mampu menerapkan kebiasaan hidup bersih dengan merawat kebersihan tubuh serta area pribadi setiap hari.',
      icon: '🧼',
    },
    {
      id: 3,
      text: 'Peserta didik mampu membedakan antara sentuhan aman, sentuhan tidak aman, dan sentuhan yang membingungkan.',
      icon: '🚦',
    },
    {
      id: 4,
      text: 'Peserta didik mampu mempraktikkan langkah penyelamatan diri: TOLAK dengan tegas, PERGI segera, dan CERITAKAN kepada orang dewasa tepercaya.',
      icon: '🗣️',
    },
    {
      id: 5,
      text: 'Peserta didik mampu mengidentifikasi dan menyebutkan minimal 3 orang dewasa tepercaya dalam lingkaran kehidupannya.',
      icon: '👥',
    },
    {
      id: 6,
      text: 'Peserta didik mampu menunjukkan sikap menghormati batasan privasi diri sendiri dan privasi orang lain.',
      icon: '🚪',
    },
  ],
  capaianPembelajaran:
    'Pada Fase C (Kelas 5 SD), peserta didik memahami perubahan fisik masa pubertas, pentingnya memelihara kesehatan reproduksi dan keselamatan diri, mengidentifikasi bagian tubuh pribadi dan batasannya, membedakan situasi aman dan berbahaya dalam interaksi sosial, serta memiliki keberanian mencari perlindungan kepada orang dewasa tepercaya.',
  belajar: {
    pertanyaanPemantik: [
      {
        id: 1,
        title: 'Baju Renang & Batasan Privasi Tubuh',
        scenario:
          'Saat pergi berenang bersama keluarga, Rani dan Dimas mengenakan pakaian renang. Guru PJOK menjelaskan bahwa area tubuh yang tertutup pakaian renang adalah bagian tubuh pribadi kita yang sangat istimewa dan tidak boleh dilihat atau disentuh sembarangan oleh orang lain.',
        imageCaption: 'Pakaian renang menutup area tubuh pribadi yang harus dijaga privasinya.',
        imageEmoji: '🩱 🩳',
        question: 'Mengapa tubuh kita memiliki bagian pribadi yang harus kita jaga dan tutupi dengan sopan?',
        options: [
          {
            text: 'Karena tubuh kita adalah anugerah Tuhan yang sangat berharga dan kita memiliki hak penuh atas privasi diri kita.',
            feedback: 'Tepat sekali! Tubuhmu adalah milikmu seutuhnya. Menjaga privasi bagian tubuh pribadi adalah tanda kita menghargai dan menyayangi diri kita.',
          },
          {
            text: 'Karena baju renang hanya dipakai saat cuaca dingin saja.',
            feedback: 'Kurang tepat. Pakaian renang dan pakaian dalam berfungsi melindungi bagian tubuh pribadi kita setiap saat.',
          },
          {
            text: 'Agar orang lain merasa takut dengan kita.',
            feedback: 'Bukan itu tujuannya. Menjaga privasi bertujuan menciptakan rasa aman, nyaman, dan saling menghormati.',
          },
        ],
        narasiText:
          'Baju Renang dan Batasan Privasi Tubuh. Area tubuh yang tertutup pakaian renang adalah bagian tubuh pribadi kita yang istimewa. Tidak boleh disentuh atau dilihat sembarangan.',
      },
      {
        id: 2,
        title: 'Rahasia Pesta Ulang Tahun vs Rahasia yang Tidak Nyaman',
        scenario:
          'Kakak mengajak adik merahasiakan rencana membeli kue ulang tahun kejutan untuk Ibu sore nanti. Sementara di cerita lain, ada anak yang diminta seseorang menyimpan rahasia yang membuatnya merasa cemas, takut, dan jantungnya berdebar kencang.',
        imageCaption: 'Membedakan rahasia kejutan yang membahagiakan dengan rahasia yang membuat cemas.',
        imageEmoji: '🎂 🤫',
        question: 'Bagaimana cara membedakan rahasia yang baik dengan rahasia yang tidak boleh disimpan?',
        options: [
          {
            text: 'Rahasia baik membuat semua orang bahagia (seperti kado kejutan), sedangkan rahasia yang membuat kita cemas atau takut WAJIB segera diceritakan kepada orang tua/guru.',
            feedback: 'Hebat sekali! Jangan pernah menyimpan rahasia yang membuatmu merasa sedih, bingung, atau takut. Selalu ceritakan kepada orang dewasa tepercaya!',
          },
          {
            text: 'Semua rahasia harus disembunyikan selamanya dari orang tua.',
            feedback: 'Kurang tepat. Rahasia yang membuatmu takut tidak boleh disembunyikan. Kamu berhak bercerita!',
          },
          {
            text: 'Hanya orang dewasa yang boleh bercerita rahasia.',
            feedback: 'Kurang tepat. Anak-anak berhak merasa aman dan boleh bercerita kepada guru atau orang tua kapan saja.',
          },
        ],
        narasiText:
          'Membedakan rahasia baik dan rahasia buruk. Rahasia baik berakhir dengan senyuman dan bahagia. Jika ada rahasia yang membuatmu takut atau tidak nyaman, jangan disimpan, segera ceritakan!',
      },
    ],
    materiBab: [
      {
        id: 'bagian_pribadi',
        title: '1. Tubuhku Milikku & Bagian Pribadi',
        badge: 'Hak Privasi Tubuh Sendiri',
        summary:
          'Tubuh kita adalah anugerah terindah. Kita memiliki hak untuk menjaga dan merawatnya. Ada bagian tubuh luar yang terbuka (seperti tangan dan wajah), dan ada bagian tubuh pribadi yang wajib tertutup.',
        narasiText:
          'Bab 1: Tubuhku Milikku dan Bagian Pribadi. Tubuhmu adalah milikmu. Bagian tubuh pribadi adalah area yang tertutup pakaian dalam: dada, area antara paha, pantat, dan mulut. Tidak boleh disentuh sembarangan.',
        points: [
          {
            title: 'Tubuhku adalah Milikku Seutuhnya 🌟',
            desc: 'Kamu adalah kapten atas tubuhmu sendiri. Kamu berhak merasa nyaman, aman, dan mengatakan tidak jika ada hal yang membuatmu risih.',
            emoji: '🌟',
          },
          {
            title: 'Empat Area Bagian Tubuh Pribadi 🔒',
            desc: 'Bagian pribadi adalah area yang biasanya tertutup pakaian dalam atau baju renang: (1) Mulut, (2) Dada, (3) Area antara kedua paha / alat kelamin, dan (4) Pantat. Tidak seorang pun boleh melihat atau menyentuh area ini, dan kamu juga tidak boleh menyentuh area pribadi orang lain.',
            emoji: '🔒',
          },
          {
            title: 'Satu-satunya Pengecualian Medis & Kebersihan 🩺',
            desc: 'Bagian pribadi hanya boleh dilihat atau disentuh dokter saat kamu diperiksa kesehatan, dan ITU HARUS DIDAMPINGI oleh ayah, ibu, atau wali resmimu; atau saat ayah/ibu membantumu mandi dan membersihkan diri ketika sakit.',
            emoji: '🩺',
          },
        ],
        tableData: [
          { price: 'Bagian Terbuka', qty: 'Tangan, Kaki, Wajah', label: 'Boleh terlihat untuk bersalaman dan beraktivitas sopan' },
          { price: 'Bagian Pribadi', qty: 'Dada, Kemaluan, Pantat, Mulut', label: 'Tertutup rapi pakaian dalam, wajib dijaga privasinya' },
          { price: 'Pengecualian', qty: 'Dokter saat sakit', label: 'Wajib didampingi orang tua, hanya untuk tujuan medis' },
        ],
      },
      {
        id: 'kebersihan_privasi',
        title: '2. Merawat Kebersihan & Menghormati Privasi',
        badge: 'Sehat, Bersih, & Beradab',
        summary:
          'Menjaga tubuh tetap bersih adalah cara kita bersyukur. Selain itu, kita juga harus menghormati privasi diri sendiri dan privasi orang lain di sekitar kita.',
        narasiText:
          'Bab 2: Merawat Kebersihan dan Menghormati Privasi. Mandi dua kali sehari, mengganti pakaian dalam bersih setiap hari, dan cuci tangan setelah buang air. Selalu ketuk pintu sebelum masuk kamar orang lain.',
        points: [
          {
            title: 'Kebiasaan Bersih Setiap Hari 🧼',
            desc: 'Mandi dua kali sehari menggunakan sabun bersih, keramas secara teratur, dan selalu membasuh area pribadi dengan air bersih yang mengalir dari arah depan ke belakang setelah buang air kecil atau besar, lalu mencuci tangan dengan sabun.',
            emoji: '🧼',
          },
          {
            title: 'Ganti Pakaian Dalam yang Kering & Bersih 🩲',
            desc: 'Gantilah pakaian dalam minimal dua kali sehari atau jika terasa lembap/kotor. Pakaian dalam berbahan katun yang bersih mencegah gatal-gatal dan kuman penyakit.',
            emoji: '🩲',
          },
          {
            title: 'Sopan Santun Privasi Ruangan 🚪',
            desc: 'Selalu berganti pakaian di dalam kamar tertutup atau kamar mandi. Selalu ketuk pintu dan meminta izin sebelum membuka pintu kamar mandi atau kamar tidur orang lain.',
            emoji: '🚪',
          },
        ],
        tableData: [
          { price: 'Pagi & Sore', qty: 'Mandi & Sabun Bersih', label: 'Membersihkan kuman keringat seharian beraktivitas' },
          { price: 'Setiap Hari', qty: 'Ganti Pakaian Dalam', label: 'Pakaian dalam bersih & kering menjaga kesehatan area sensitif' },
          { price: 'Kapan Saja', qty: 'Ketuk Pintu Ruangan', label: 'Menghormati hak privasi anggota keluarga dan teman' },
        ],
      },
      {
        id: 'lampu_sentuhan',
        title: '3. Tiga Jenis Sentuhan & Jurus 3 Langkah',
        badge: 'Lampu Aman, Ragu, & Bahaya',
        summary:
          'Kita bisa mengenali sentuhan dengan menganalogikan Lampu Lalu Lintas: Lampu Hijau (Aman), Lampu Kuning (Membingungkan), dan Lampu Merah (Tidak Aman). Jika merasa tidak aman, gunakan jurus: Tolak, Pergi, Ceritakan!',
        narasiText:
          'Bab 3: Tiga Jenis Sentuhan dan Jurus Tiga Langkah. Sentuhan hijau itu aman dan penuh kasih sayang. Sentuhan kuning membingungkan dan membuat risih. Sentuhan merah tidak aman karena menyentuh area pribadi. Jika tidak nyaman, gunakan jurus: Tolak, Pergi, Ceritakan! Ingat, itu bukan salahmu.',
        points: [
          {
            title: 'Sentuhan Hijau (Aman & Nyaman) 🟢',
            desc: 'Sentuhan yang membuatmu merasa aman, disayangi, dan dihargai. Contohnya: bersalaman dengan guru saat masuk kelas, tos tangan dengan teman regu, pelukan hangat ayah/ibu saat pulang sekolah, atau digandeng saat menyeberang jalan ramai.',
            emoji: '🟢',
          },
          {
            title: 'Sentuhan Kuning (Membingungkan / Ragu) 🟡',
            desc: 'Sentuhan yang membuatmu merasa aneh, risih, tidak nyaman, atau disertai bisikan: "Jangan kasih tahu siapa-siapa ya, ini rahasia kita". Jika kamu merasa ragu atau tidak suka, kamu berhak meminta orang tersebut berhenti!',
            emoji: '🟡',
          },
          {
            title: 'Sentuhan Merah (Tidak Aman & Berbahaya) 🔴',
            desc: 'Sentuhan yang menyentuh bagian tubuh pribadimu, meminta kamu melihat bagian tubuh orang lain, atau memaksa memotretmu tanpa pakaian. Ini sangat dilarang dan berbahaya!',
            emoji: '🔴',
          },
          {
            title: 'Jurus 3 Langkah: TOLAK - PERGI - CERITAKAN! 🏃',
            desc: 'Langkah 1: TOLAK dengan suara lantang dan tegas ("TIDAK! JANGAN!"). Langkah 2: PERGI segera ke tempat ramai yang banyak orang. Langkah 3: CERITAKAN semuanya secara jujur kepada orang tua atau guru. Dan INGAT: Bila ada orang yang berbuat tidak baik kepadamu, ITU BUKAN KESALAHANMU!',
            emoji: '🏃',
          },
        ],
        tableData: [
          { price: 'Lampu Hijau 🟢', qty: 'Sentuhan Aman', label: 'Salaman, pelukan orang tua, tos teman, gandengan jalan' },
          { price: 'Lampu Kuning 🟡', qty: 'Sentuhan Ragu/Risih', label: 'Membuat bingung, risih, atau dipaksa berpelukan saat tak mau' },
          { price: 'Lampu Merah 🔴', qty: 'Sentuhan Bahaya', label: 'Menyentuh area pribadi atau meminta rahasia buruk. Tolak!' },
        ],
      },
    ],
    videoSummary: {
      title: 'Animasi Edukasi: Jurus Pelindung Tubuhku',
      stages: [
        {
          stageName: 'Tahap 1: Mengenali Tubuhku',
          years: 'Hak Diri',
          desc: 'Memahami bahwa tubuh kita istimewa dan memiliki area pribadi yang tertutup pakaian dalam.',
          icon: '✨',
        },
        {
          stageName: 'Tahap 2: Lampu Lalu Lintas Sentuhan',
          years: 'Kepekaan Emosi',
          desc: 'Merasakan sinyal tubuh kita: jika merasa tidak nyaman, dengarkan hatimu dan berani bersuara.',
          icon: '🚦',
        },
        {
          stageName: 'Tahap 3: Jurus Tolak, Pergi, Ceritakan',
          years: 'Aksi Nyata',
          desc: 'Katakan TIDAK, lari ke tempat aman, dan laporkan kepada orang dewasa tepercaya. Kamu berani dan dilindungi!',
          icon: '🛡️',
        },
      ],
    },
  },
  bermain: {
    simulation: {
      type: 'lampu_sentuhan',
      title: 'Simulasi Lampu Lalu Lintas Sentuhan',
      badge: 'Hijau (Aman) · Kuning (Ragu) · Merah (Bahaya)',
      description:
        'Pilihlah warna lampu lalu lintas yang tepat untuk setiap skenario kejadian sehari-hari: Hijau untuk sentuhan aman, Kuning untuk sentuhan membingungkan, dan Merah untuk sentuhan tidak aman.',
      data: {
        scenarios: [
          {
            id: 1,
            title: 'Salaman dengan Bapak/Ibu Guru',
            situation: 'Kamu mencium tangan dan bersalaman dengan guru saat tiba di gerbang sekolah di pagi hari.',
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
        ],
      },
    },
    games: [
      {
        id: 'game-tb-pg-1',
        type: 'mc',
        title: 'Tantangan 1: Pilihan Ganda (Menjaga Diri)',
        prompt:
          'Jika ada orang yang memintamu membuka pakaian di ruangan sepi atau menyentuh area pribadimu, tindakan pertama yang paling benar dan berani adalah ...',
        options: [
          'Mengatakan "TIDAK!" dengan tegas, segera pergi ke tempat ramai, dan menceritakan kepada orang tua atau guru',
          'Diam saja dan menuruti karena takut dimarahi',
          'Menerimanya asalkan diberi uang jajan atau mainan baru',
          'Menyimpan rahasia tersebut sendirian di dalam hati',
        ],
        correctAnswer: 0,
        explanation:
          'Kamu memiliki hak penuh atas tubuhmu! Selalu gunakan jurus Tolak-Pergi-Ceritakan dan jangan pernah takut melapor kepada orang tua atau guru.',
      },
      {
        id: 'game-tb-complex-1',
        type: 'complex',
        title: 'Tantangan 2: Pilihan Ganda Kompleks (Centang 3 Jawaban Aman)',
        prompt:
          'Manakah dari contoh interaksi di bawah ini yang termasuk dalam kelompok Sentuhan Aman (Lampu Hijau 🟢)? (Pilihlah 3 jawaban tepat)',
        options: [
          'Bersalaman dengan sopan dengan Bapak/Ibu Guru di sekolah',
          'Tos tangan (high-five) merayakan kemenangan sepak bola bersama teman',
          'Menyentuh area pribadi di tempat sepi dengan bisikan rahasia',
          'Berpegangan tangan dengan Ibu saat menyeberang jalan raya yang ramai',
          'Memaksa difoto tanpa baju dengan iming-iming hadiah gawai',
        ],
        correctAnswers: [0, 1, 3],
        explanation:
          'Salaman sopan, tos tangan tim, dan gandengan tangan saat menyeberang jalan adalah sentuhan aman yang membuat kita terlindungi dan ceria.',
      },
      {
        id: 'game-tb-matching-1',
        type: 'matching',
        title: 'Tantangan 3: Menjodohkan Tindakan & Tanggapan yang Tepat',
        prompt:
          'Pasangkan situasi perlindungan diri di sebelah kiri dengan tindakan penyelamatan yang tepat di sebelah kanan!',
        pairs: [
          {
            id: 'tb-p1',
            leftText: 'Seseorang menyentuhmu dan membuatmu merasa risih',
            rightText: 'Katakan "TIDAK!" dengan suara lantang dan tegas',
          },
          {
            id: 'tb-p2',
            leftText: 'Berada di tempat yang sepi dan mencurigakan',
            rightText: 'Segera PERGI berlari ke tempat yang ramai orang',
          },
          {
            id: 'tb-p3',
            leftText: 'Ada orang yang menyuruhmu menyimpan rahasia buruk',
            rightText: 'Segera CERITAKAN jujur ke orang tua / guru tepercaya',
          },
          {
            id: 'tb-p4',
            leftText: 'Selesai buang air di toilet sekolah',
            rightText: 'Basuh air bersih dan cuci tangan memakai sabun',
          },
        ],
        explanation:
          'Jurus Tolak, Pergi, Ceritakan serta menjaga kebersihan adalah kunci utama dalam merawat diri dan menjaga keselamatan diri sehari-hari.',
      },
      {
        id: 'game-tb-short-1',
        type: 'short',
        title: 'Tantangan 4: Isian Singkat (Kata Kunci Keberanian)',
        prompt:
          'Kata singkat berawalan huruf T yang harus kita ucapkan dengan lantang dan percaya diri saat ada orang yang menyentuh bagian pribadi atau membuat kita tidak nyaman adalah kata ... (satu kata).',
        acceptedAnswers: ['tidak', 'TIDAK', 'Tidak', 'tolak', 'stop', 'jangan'],
        hint: 'Lawan kata dari "Ya". Terdiri dari 5 huruf: T - I - D - A - K.',
        explanation:
          'Kata "TIDAK!" adalah hak suaramu yang paling kuat untuk melindungi tubuh dan privasimu.',
      },
      {
        id: 'game-tb-reorder-1',
        type: 'reorder',
        title: 'Tantangan 5: Mengurutkan Jurus 3 Langkah Penyelamatan Diri',
        prompt:
          'Gunakan tombol Panah Naik (⬆️) dan Panah Turun (⬇️) untuk menyusun urutan jurus perlindungan diri dari langkah pertama hingga langkah terakhir!',
        items: [
          {
            id: 'tb-step-2',
            label: '2. PERGI segera ke tempat ramai yang banyak orang dewasa atau teman-teman',
          },
          {
            id: 'tb-step-1',
            label: '1. TOLAK dengan berani dan bersuara lantang: "TIDAK! Hentikan sekarang!"',
          },
          {
            id: 'tb-step-3',
            label: '3. CERITAKAN seluruh kejadian kepada orang dewasa tepercaya (Ayah, Ibu, atau Guru)',
          },
        ],
        correctOrder: ['tb-step-1', 'tb-step-2', 'tb-step-3'],
        explanation:
          'Urutan jurus 3 langkah penyelamatan: (1) TOLAK dengan tegas -> (2) PERGI ke tempat ramai -> (3) CERITAKAN kepada orang dewasa tepercaya!',
      },
    ],
  },
  berlatih: {
    questions: [
      {
        id: 1,
        dimension: 'Analisis (C4)',
        caseStory:
          'Dina diajak bermain petak umpet oleh tetangganya. Saat bersembunyi di gudang belakang rumah yang sepi, tetangga tersebut mencoba memegang pundak dan menyentuh area dada Dina sambil berkata: "Diam saja ya Dina, ini rahasia kecil kita, jangan bilang ibumu."',
        question:
          'Berdasarkan cerita di atas, mengapa tindakan orang tersebut tergolong situasi bahaya (Sentuhan Merah)?',
        options: [
          'Karena menyentuh bagian tubuh pribadi di tempat sepi dan menyuruh menyimpan rahasia yang membuat takut.',
          'Karena bermain petak umpet di gudang adalah hal yang dilarang saat sore hari.',
          'Karena tetangga tersebut tidak membelikan es krim untuk Dina.',
          'Karena Dina lupa membawa senter saat bersembunyi di gudang.',
        ],
        correctAnswer: 0,
        explanation:
          'Menyentuh area tubuh pribadi dan memaksa menyimpan rahasia dari orang tua adalah tanda bahaya merah. Dina berhak menolak, lari, dan menceritakan kejadian tersebut.',
      },
      {
        id: 2,
        dimension: 'Evaluasi (C5)',
        caseStory:
          'Bayu merasa sangat takut dan sedih karena kemarin ada orang dewasa yang berbuat tidak sopan kepadanya. Bayu berpikir: "Apakah ini terjadi karena aku memakai baju yang salah? Apakah ini salahku?"',
        question:
          'Bagaimana evaluasi yang paling tepat dan suportif terhadap apa yang dirasakan oleh Bayu?',
        options: [
          'Bayu sama sekali TIDAK bersalah. Jika ada orang yang berbuat tidak baik atau tidak sopan, kesalahan 100% ada pada pelaku, bukan pada Bayu.',
          'Bayu memang bersalah karena tidak memakai pakaian besi pelindung.',
          'Bayu sebaiknya mengurung diri di kamar dan tidak boleh bermain lagi.',
          'Bayu harus meminta maaf kepada orang dewasa tersebut.',
        ],
        correctAnswer: 0,
        explanation:
          'Ingat selalu prinsip utama perlindungan anak: Anak TIDAK PERNAH bersalah ketika menjadi korban tindakan tidak sopan. Jangan pernah menyalahkan diri sendiri.',
      },
      {
        id: 3,
        dimension: 'Kreasi (C6)',
        caseStory:
          'Di sekolah, Bu Guru meminta setiap siswa membuat "Peta 3 Lingkaran Orang Dewasa Tepercaya" yang bisa dihubungi saat membutuhkan pertolongan.',
        question:
          'Manakah susunan 3 orang dewasa tepercaya yang paling tepat dan realistis bagi seorang siswa Kelas 3 SD?',
        options: [
          'Orang tua (Ayah/Ibu di rumah), Wali kelas/Guru BP di sekolah, dan Kakek/Nenek atau Petugas UKS',
          'Orang asing yang baru dikenal di halte bus, penjual online, dan orang tak dikenal',
          'Teman bermain yang suka mengancam, akun robot di internet, dan orang yang suka berbisik rahasia',
          'Hanya tokoh pahlawan kartun di televisi saja',
        ],
        correctAnswer: 0,
        explanation:
          'Orang dewasa tepercaya adalah orang yang kita kenal baik perilakunya, bertanggung jawab menjaga kita, dan siap mendengarkan tanpa menghakimi.',
      },
      {
        id: 4,
        dimension: 'Analisis (C4)',
        caseStory:
          'Saat jam istirahat sekolah, Ahmad melihat temannya, Rio, tampak murung dan menangis di pojok kelas. Ketika ditanya pelan-pelan, Rio berbisik bahwa ada seseorang di dekat rumahnya yang mengancam akan memukulnya jika menceritakan perbuatan tidak baik orang tersebut.',
        question:
          'Sebagai sahabat yang peduli, saran terbaik apa yang seharusnya diberikan Ahmad kepada Rio?',
        options: [
          'Mengajak Rio bersama-sama melapor ke Ibu Guru Kelas atau Guru BP dan meyakinkan Rio bahwa ancaman itu tidak benar dan guru akan melindunginya.',
          'Menyuruh Rio membalas memukul orang tersebut sendirian malam hari.',
          'Menyuruh Rio merahasiakannya selamanya agar tidak dipukul.',
          'Mengejek Rio karena menangis di depan kelas.',
        ],
        correctAnswer: 0,
        explanation:
          'Sahabat yang baik akan mendampingi temannya mencari bantuan ke orang dewasa tepercaya (seperti guru). Guru dan sekolah memiliki kewajiban melindungi siswa.',
      },
      {
        id: 5,
        dimension: 'Evaluasi (C5)',
        caseStory:
          'Ketika Fani berganti pakaian olahraga di dalam kelas, tiba-tiba ada siswa lain yang membuka pintu tanpa mengetuk dan tertawa sambil mengintip ke dalam.',
        question:
          'Tindakan apa yang tepat untuk mengevaluasi peristiwa tersebut demi menjaga privasi bersama?',
        options: [
          'Membuka pintu tanpa izin melanggar privasi orang lain. Setiap siswa wajib mengetuk pintu dan menunggu izin sebelum masuk ke ruang ganti/kamar mandi.',
          'Peristiwa itu wajar dan boleh dijadikan bahan tertawaan antarteman.',
          'Fani yang salah karena berganti baju saat jam pelajaran olahraga.',
          'Pintu ruangan tidak boleh ditutup sama sekali saat ada orang ganti baju.',
        ],
        correctAnswer: 0,
        explanation:
          'Menghormati batasan privasi adalah kewajiban semua anak. Kita harus mengetuk pintu dan tidak boleh mengintip orang yang sedang berganti pakaian atau di toilet.',
      },
      {
        id: 6,
        dimension: 'Analisis (C4)',
        caseStory:
          'Eko baru saja membuat akun game di ponsel. Tiba-tiba seorang pemain tak dikenal mengirim pesan pribadi: "Hai Eko, fotokan dirimu tanpa baju ya, nanti kukirim 1.000 koin game gratis!"',
        question:
          'Analisis langkah bahaya apa yang sedang dihadapi Eko di dunia maya (internet) dan apa yang harus dilakukan?',
        options: [
          'Itu adalah bahaya eksploitasi online. Eko harus langsung menolak, tidak mengirim foto apa pun, memblokir akun tersebut, dan memberi tahu orang tua.',
          'Eko sebaiknya mengirim foto karena hadiah 1.000 koin game sangat langka.',
          'Eko mengirim foto temannya saja agar aman.',
          'Eko merahasiakan pesan tersebut dari ayah dan ibunya.',
        ],
        correctAnswer: 0,
        explanation:
          'Di dunia maya sekalipun, bagian tubuh pribadi TIDAK BOLEH difoto atau dibagikan kepada siapa pun. Selalu laporkan pesan mencurigakan kepada orang tua.',
      },
      {
        id: 7,
        dimension: 'Kreasi (C6)',
        caseStory:
          'Siti ingin membuat poster sederhana di majalah dinding sekolah tentang "Jurus Tolak, Pergi, Ceritakan" agar mudah diingat oleh adik-adik kelas 1 dan 2.',
        question:
          'Kalimat slogan manakah yang paling jelas, positif, dan memberdayakan untuk poster mading Siti?',
        options: [
          '"Tubuhku Berharga, Privasiku Istimewa: Berani Katakan TIDAK, Segera PERGI, dan CERITAKAN!"',
          '"Awas Banyak Orang Jahat di Mana-Mana, Jangan Bicara dengan Siapa Pun!"',
          '"Kalian Anak Kecil yang Lemah dan Tidak Bisa Melawan!"',
          '"Rahasiakan Semua Hal Agar Hidupmu Tenang!"',
        ],
        correctAnswer: 0,
        explanation:
          'Slogan edukasi anak harus bernada memberdayakan, jelas memberikan instruksi penyelamatan, dan menumbuhkan rasa percaya diri anak.',
      },
      {
        id: 8,
        dimension: 'Evaluasi (C5)',
        caseStory:
          'Adit baru selesai berenang. Celana renangnya masih basah kuyup. Adit merasa malas berganti pakaian dalam kering dan langsung memakai celana seragam sekolahnya sepanjang hari.',
        question:
          'Mengapa membiarkan area pribadi dalam kondisi basah dan lembap tidak baik bagi kesehatan tubuh?',
        options: [
          'Karena kelembapan memicu pertumbuhan jamur, bakteri kuman penyakit, dan menyebabkan rasa gatal serta iritasi kulit.',
          'Karena celana basah bisa membuat celana tersebut terbakar api.',
          'Karena celana basah dilarang oleh aturan lalu lintas.',
          'Karena warna seragam sekolah akan berubah menjadi warna pelangi.',
        ],
        correctAnswer: 0,
        explanation:
          'Merawat kebersihan area pribadi dengan pakaian dalam yang kering dan bersih adalah bagian penting dari menjaga kesehatan reproduksi dasar sejak dini.',
      },
      {
        id: 9,
        dimension: 'Analisis (C4)',
        caseStory:
          'Lani sedang berbelanja di minimarket bersama ibunya. Di lorong makanan, seorang pria tak dikenal mencoba memegang tangan Lani dan mengajaknya keluar toko sambil berkata: "Ayo ikut om keluar, ibu tadi menyuruh om menjemputmu."',
        question:
          'Apa analisis tindakan cerdas yang harus segera dilakukan Lani saat itu?',
        options: [
          'Menarik tangannya, berteriak meminta tolong: "Bukan, kamu bukan om saya!", lalu segera berlari mendekati kasir atau ibunya.',
          'Langsung ikut pria tersebut karena takut dianggap tidak sopan kepada orang tua.',
          'Bersembunyi di bawah rak makanan sampai minimarket tutup.',
          'Menangis pelan-pelan tanpa bersuara sama sekali.',
        ],
        correctAnswer: 0,
        explanation:
          'Anak berhak menarik diri dan berteriak mencari perhatian orang dewasa lain (seperti kasir toko atau orang tua) saat ada orang asing yang mencoba membujuk.',
      },
      {
        id: 10,
        dimension: 'Evaluasi (C5)',
        caseStory:
          'Setelah menyelesaikan pembelajaran "Tubuhku Berharga", seorang siswa bertanya kepada guru: "Bu Guru, kalau saya pernah mengalami hal yang membuat saya tidak nyaman sebulan lalu tapi baru berani cerita hari ini, apakah masih boleh?"',
        question:
          'Bagaimana jawaban guru yang paling tepat, suportif, dan menenangkan hati siswa?',
        options: [
          '"Tentu saja sangat boleh, Nak. Kapan pun kamu siap bercerita, Ibu/Bapak Guru akan selalu mendengarkan, mempercayaimu, dan membantumu."',
          '"Sudah terlambat, seharusnya kamu cerita sebulan yang lalu."',
          '"Tidak boleh karena kejadiannya sudah lewat dan basi."',
          '"Kamu akan dihukum karena terlambat melaporkan."',
        ],
        correctAnswer: 0,
        explanation:
          'Tidak ada kata terlambat untuk bercerita demi keselamatan dan kenyamanan diri. Pintu pertolongan orang tua dan guru selalu terbuka lebar bagi anak.',
      },
    ],
  },
  refleksi: {
    prompt: 'Bagaimana perasaanmu setelah mempelajari tema "Tubuhku Berharga" bersama Lumi si Penjaga Ceria?',
    emojiOptions: [
      { emoji: '🤩', label: 'Merasa Berani & Berdaya', desc: 'Aku tahu hak tubuhku dan berani menerapkan jurus Tolak-Pergi-Ceritakan!' },
      { emoji: '😊', label: 'Tenang & Mengerti', desc: 'Aku paham cara menjaga kebersihan dan membedakan sentuhan aman.' },
      { emoji: '🤔', label: 'Ingin Berdiskusi Lebih Lanjut', desc: 'Aku ingin bertanya lebih banyak kepada Ayah, Ibu, atau Bapak/Ibu Guru.' },
      { emoji: '💖', label: 'Merasa Disayangi & Berharga', desc: 'Aku bersyukur memiliki tubuh yang sehat dan keluarga yang menjagaku.' },
    ],
    favoriteOptions: [
      'Mengenal 4 Bagian Tubuh Pribadi (Menu Belajar)',
      'Simulasi Lampu Lalu Lintas Sentuhan (Menu Bermain)',
      'Jurus 3 Langkah: Tolak, Pergi, Ceritakan (Menu Bermain)',
      '10 Soal Asesmen HOTS Menjaga Diri (Menu Berlatih)',
      'Mengunduh Piagam Duta Penjaga Diri Cilik',
    ],
    trustedAdultsPrompt: 'Tuliskan nama 3 orang dewasa tepercaya yang siap mendengarkan dan melindungimu (misal: Ibu Rina, Ayah Budi, Bu Guru Siti):',
    commitmentPrompt: 'Tuliskan ikrar komitmenmu untuk selalu menjaga kebersihan dan berani melindungi diri sendiri serta menghormati privasi teman:',
  },
  sumberBelajar: [
    {
      title: 'Panduan Pendidikan Keterampilan Hidup (PKH) untuk Sekolah Dasar',
      author: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI & UNICEF Indonesia',
      year: '2024',
      type: 'Pedoman Resmi Nasional',
      description: 'Pedoman perlindungan diri, kebersihan reproduksi dasar, dan keterampilan hidup ramah anak Fase C SD Kelas 5.',
      link: 'https://kemdikbud.go.id',
    },
    {
      title: 'Buku Saku Menjaga Diri dan Pencegahan Kekerasan terhadap Anak',
      author: 'Kementerian Pemberdayaan Perempuan dan Perlindungan Anak (Kemen PPPA)',
      year: '2024/2025',
      type: 'Buku Panduan Edukasi',
      description: 'Materi edukatif sentuhan aman, privasi anak, dan kontak layanan sahabat anak SAPA 129.',
      link: 'https://kemenpppa.go.id',
    },
    {
      title: 'Modul Usaha Kesehatan Sekolah (UKS): Kebersihan Pribadi & Sanitasi Diri',
      author: 'Direktorat Sekolah Dasar, Ditjen PAUD Dikdasmen',
      year: '2025',
      type: 'Modul Pelatihan Sekolah Sehat',
      description: 'Panduan cuci tangan pakai sabun, perawatan pakaian dalam, dan etika kebersihan toilet sekolah.',
      link: 'https://ditpsd.kemdikbud.go.id',
    },
    {
      title: 'Layanan Pengaduan Sahabat Perempuan dan Anak (SAPA 129)',
      author: 'Kemen PPPA Republik Indonesia',
      year: 'Layanan 24 Jam',
      type: 'Layanan Pengaduan & Bantuan Resmi',
      description: 'Hotline telepon resmi 129 atau pesan WhatsApp di 08111-129-129 untuk konsultasi dan bantuan perlindungan anak.',
      link: 'https://kemenpppa.go.id',
    },
  ],
  glosarium: [
    {
      term: 'Bagian Tubuh Pribadi',
      meaning: 'Area tubuh yang tertutup pakaian dalam (mulut, dada, area kelamin di antara paha, dan pantat) yang wajib dijaga privasinya.',
    },
    {
      term: 'Privasi',
      meaning: 'Hak seseorang untuk menjaga batas dirinya dan tidak diintip atau diganggu saat berganti pakaian atau di kamar mandi.',
    },
    {
      term: 'Sentuhan Aman (Hijau)',
      meaning: 'Sentuhan yang membuat hati merasa nyaman, hangat, dan terlindungi, seperti salaman sopan atau pelukan orang tua.',
    },
    {
      term: 'Sentuhan Tidak Aman (Merah)',
      meaning: 'Sentuhan yang menyentuh bagian pribadi atau membuat kita tidak nyaman dan dilarang keras dalam aturan keselamatan.',
    },
    {
      term: 'Jurus 3 Langkah',
      meaning: 'Aturan penyelamatan diri: (1) TOLAK dengan lantang, (2) PERGI segera ke tempat ramai, dan (3) CERITAKAN ke orang dewasa tepercaya.',
    },
    {
      term: 'Orang Dewasa Tepercaya',
      meaning: 'Orang dewasa yang kita kenal baik dan memiliki tanggung jawab menjaga keselamatan kita, seperti orang tua dan guru.',
    },
  ],
  sertifikat: {
    appreciationText: 'Atas keberhasilan menyelesaikan pembelajaran perlindungan diri dan menjadi Duta Pelindung Tubuhku yang berani & bijak:',
    themeTitleOnCert: 'TUBUHKU BERHARGA: MENJAGA DIRI & PRIVASI FASE C',
    subText: 'Materi Keterampilan Menjaga Keselamatan Diri & Kesehatan Reproduksi Dasar Kelas 5 SD Kurikulum Merdeka',
  },
  badges: [
    {
      id: 'badge-tb-belajar',
      section: 'belajar',
      title: 'Penjaga Tubuhku',
      nickname: 'Pemberani Privasi',
      icon: '🛡️',
      color: 'from-emerald-500 to-teal-500',
      borderColor: 'border-emerald-300 hover:border-emerald-400',
      bgGradient: 'bg-emerald-50',
      description: 'Berhasil mempelajari hak privasi tubuh, bagian pribadi yang tertutup baju renang, dan kebiasaan hidup bersih.',
      requirement: 'Buka dan selesaikan materi pada Menu Belajar.',
      quote: '"Tubuhku adalah milikku seutuhnya, anugerah Tuhan yang wajib kujaga!"',
    },
    {
      id: 'badge-tb-bermain',
      section: 'bermain',
      title: 'Ahli Lampu Sentuhan',
      nickname: 'Master Lampu Lalu Lintas',
      icon: '🚦',
      color: 'from-amber-500 to-emerald-500',
      borderColor: 'border-amber-300 hover:border-amber-400',
      bgGradient: 'bg-amber-50',
      description: 'Mampu membedakan sentuhan hijau (aman), kuning (ragu), dan merah (bahaya) serta menuntaskan 5 game edukasi.',
      requirement: 'Selesaikan simulasi lampu lalu lintas sentuhan dan game pada Menu Bermain.',
      quote: '"Peka terhadap rasa risih, berani membedakan mana yang aman dan berbahaya!"',
    },
    {
      id: 'badge-tb-berlatih',
      section: 'berlatih',
      title: 'Cendekiawan Aman',
      nickname: 'Bintang Analisis HOTS',
      icon: '🌟',
      color: 'from-sky-500 to-blue-500',
      borderColor: 'border-sky-300 hover:border-sky-400',
      bgGradient: 'bg-sky-50',
      description: 'Menyelesaikan 10 soal asesmen HOTS studi kasus perlindungan diri dengan kemampuan bernalar kritis tingkat tinggi.',
      requirement: 'Selesaikan dan kirim jawaban 10 soal asesmen pada Menu Berlatih.',
      quote: '"Cerdas menganalisis situasi, pantang takut mencari pertolongan!"',
    },
    {
      id: 'badge-tb-refleksi',
      section: 'refleksi',
      title: 'Sahabat Peduli',
      nickname: 'Penjaga Teman & Diri',
      icon: '💖',
      color: 'from-pink-500 to-rose-500',
      borderColor: 'border-pink-300 hover:border-pink-400',
      bgGradient: 'bg-pink-50',
      description: 'Mengenali 3 orang dewasa tepercaya dan memiliki komitmen berani berkata TIDAK serta menghormati privasi teman.',
      requirement: 'Simpan formulir refleksi diri dan nama orang dewasa tepercaya pada Menu Refleksi.',
      quote: '"Menyayangi diri sendiri dan menghormati hak privasi teman di sekitarku!"',
    },
    {
      id: 'badge-tb-grandmaster',
      section: 'grand_master',
      title: 'Grand Master Pelindung Diri',
      nickname: 'Duta Keselamatan Cilik',
      icon: '👑',
      color: 'from-amber-400 via-emerald-500 to-teal-600',
      borderColor: 'border-amber-400 hover:border-emerald-400',
      bgGradient: 'bg-gradient-to-r from-amber-50 to-emerald-50',
      description: 'Tuntas menyelesaikan seluruh 4 misi pembelajaran: Belajar, Bermain, Berlatih, dan Refleksi 100%.',
      requirement: 'Tuntaskan seluruh modul dan raih nilai tertinggi!',
      quote: '"Aku anak Indonesia yang cerdas, sehat, berani menjaga diri, dan siap melindungi masa depan!"',
    },
  ],
  sensitivityNote: {
    title: 'Catatan Penting untuk Bapak/Ibu Guru & Orang Tua',
    summary:
      'Tema "Tubuhku Berharga" disusun dengan pendekatan psikoedukasi positif dan ramah anak. Anak tidak ditakut-takuti, melainkan diberdayakan dengan pemahaman hak privasi, batasan aman, dan keberanian bercerita.',
    adultGuide: [
      'Dampingi anak saat belajar: Gunakan kesempatan ini untuk berdialog hangat tentang siapa saja orang dewasa yang bisa dipercaya anak di rumah dan sekolah.',
      'Dengarkan secara aktif: Jika anak bercerita tentang hal tidak nyaman yang pernah dialaminya, tetaplah tenang, jangan panik, dan dengarkan tanpa menyela.',
      'Percayai dan validasi: Katakan dengan tulus: "Terima kasih sudah berani bercerita ke Ibu/Ayah. Kamu anak hebat dan kamu tidak bersalah sama sekali."',
      'Jangan menyalahkan anak (Zero Victim Blaming): Hindari bertanya "Kenapa kamu diam saja?" atau "Kenapa lewat jalan situ?". Fokuslah pada pemulihan rasa aman anak.',
      'Tindak lanjuti dengan bijak: Jika ada indikasi kekerasan seksual atau perundungan, segera koordinasikan dengan pihak sekolah, UKS, konselor, atau hubungi saluran resmi Kemen PPPA SAPA 129.',
    ],
    helplines: [
      {
        name: 'Layanan SAPA 129 (Kemen PPPA RI)',
        contact: 'Telepon Hotline: 129 | WhatsApp: 08111-129-129',
        description: 'Layanan pengaduan dan pendampingan psikologis resmi 24 jam bagi perempuan dan anak di seluruh Indonesia.',
      },
      {
        name: 'Unit Pelayanan Perempuan & Anak (PPA) Kepolisian RI',
        contact: 'Kantor Polsek / Polres Terdekat atau Hotline 110',
        description: 'Layanan penanganan laporan hukum dan perlindungan fisik anak dari segala bentuk kekerasan.',
      },
      {
        name: 'Layanan Konseling Sahabat Anak (KPAI)',
        contact: 'Telepon: (021) 31901556 | Pengaduan Online: kpai.go.id',
        description: 'Komisi Perlindungan Anak Indonesia untuk advokasi dan pengawasan hak-hak anak.',
      },
    ],
  },
};
