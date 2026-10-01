export interface LearningGoal {
  id: number;
  text: string;
  icon: string;
}

export interface PromptQuestion {
  id: number;
  title: string;
  scenario: string;
  imageCaption: string;
  imageEmoji?: string;
  question: string;
  options: { text: string; feedback: string }[];
}

export const TUJUAN_PEMBELAJARAN: LearningGoal[] = [
  {
    id: 1,
    text: "Peserta didik dapat mengidentifikasi perbedaan cara hidup manusia pada masa dahulu, masa kini, dan membayangkan masa nanti dengan teliti.",
    icon: "🕰️"
  },
  {
    id: 2,
    text: "Peserta didik mampu menceritakan perkembangan alat transportasi, komunikasi, dan peralatan rumah tangga dari masa ke masa.",
    icon: "🚀"
  },
  {
    id: 3,
    text: "Peserta didik dapat membandingkan permainan tradisional zaman dahulu dengan permainan modern masa kini serta dampak baik dan buruknya.",
    icon: "🪁"
  },
  {
    id: 4,
    text: "Peserta didik mampu menunjukkan sikap bersyukur dan bijak dalam memanfaatkan teknologi di kehidupan sehari-hari.",
    icon: "🌟"
  }
];

export const CAPAIAN_PEMBELAJARAN = "Pada Fase B (Kelas 3 SD), peserta didik mengenal perkembangan teknologi, transportasi, komunikasi, serta tradisi kehidupan manusia dari waktu ke waktu (dahulu, kini, dan nanti) serta memahami pengaruh perubahan tersebut terhadap aktivitas manusia dan lingkungan sekitar.";

export const PERTANYAAN_PEMANTIK: PromptQuestion[] = [
  {
    id: 1,
    title: "Kakek Menulis Surat vs Cucu Video Call",
    scenario: "Kakek bercerita bahwa ketika masih kecil, jika ingin memberi kabar ke sanak saudara di luar kota, beliau harus menulis surat di atas kertas, menempelkan perangko, lalu menunggu kiriman pak pos selama berminggu-minggu. Sedangkan sekarang, cucu kakek cukup menyentuh layar gawai (smartphone) dan seketika bisa melihat wajah serta berbicara langsung lewat panggilan video!",
    imageCaption: "Perbandingan surat pos zaman dulu dengan panggilan video masa kini.",
    question: "Menurutmu, mengapa cara manusia berkomunikasi bisa berubah menjadi begitu cepat dan mudah?",
    options: [
      {
        text: "Karena manusia terus berinovasi dan mengembangkan teknologi ilmu pengetahuan yang bermanfaat.",
        feedback: "Hebat sekali! Pikiran manusia terus berkembang menciptakan teknologi baru agar hidup kita lebih mudah dan saling terhubung."
      },
      {
        text: "Karena orang zaman sekarang tidak suka menulis lagi.",
        feedback: "Kurang tepat. Menulis tetap penting, namun teknologi baru membantu pesan sampai dalam hitungan detik."
      },
      {
        text: "Karena kertas surat sudah dilarang oleh pemerintah.",
        feedback: "Kurang tepat. Kertas surat masih ada, tetapi orang lebih memilih cara yang lebih cepat dan efisien."
      }
    ]
  },
  {
    id: 2,
    title: "Setrika Arang Nenek vs Setrika Listrik Ibu",
    scenario: "Zaman dahulu, nenek harus membakar arang hitam hingga membara lalu memasukkannya ke dalam setrika besi tebal yang berat. Jika tidak hati-hati, percikan abu arang bisa mengenai baju. Sekarang, ibu cukup mencolokkan setrika listrik ke stopkontak dinding, dan dalam beberapa detik bajunya sudah rapi tanpa asap!",
    imageCaption: "Setrika arang kayu berat zaman dahulu dan setrika listrik modern yang aman.",
    question: "Apa keuntungan utama yang dirasakan manusia dari perubahan alat rumah tangga tersebut?",
    options: [
      {
        text: "Pekerjaan rumah tangga menjadi lebih cepat, hemat tenaga, bersih, dan lebih aman.",
        feedback: "Tepat sekali! Penemuan listrik membuat alat rumah tangga menjadi praktis, bersih dari asap arang, dan aman digunakan."
      },
      {
        text: "Membuat orang menjadi malas dan lupa cara membuat api.",
        feedback: "Bukan itu tujuannya. Alat modern diciptakan agar manusia bisa menggunakan waktu untuk hal lain yang bermanfaat."
      },
      {
        text: "Hanya untuk pamer barang baru kepada tetangga.",
        feedback: "Kurang tepat. Teknologi diciptakan demi keselamatan dan kenyamanan hidup bersama."
      }
    ]
  }
];

export const MATERI_BAB = [
  {
    id: "transportasi",
    title: "1. Perkembangan Alat Transportasi",
    badge: "Bepergian dari Masa ke Masa",
    summary: "Alat transportasi membantu manusia berpindah tempat dan membawa barang dari satu tempat ke tempat lain. Mari kita lihat perjalanannya dari masa dahulu, kini, hingga nanti!",
    points: [
      {
        title: "Zaman DAHULU 🐎",
        desc: "Menggunakan tenaga hewan (kuda, sapi, kerbau) dan tenaga angin/manusia. Contohnya: delman, dokar, gerobak pedati, sepeda onthel, dan perahu layar kayu. Perjalanan membutuhkan waktu berhari-hari."
      },
      {
        title: "Masa KINI 🚗",
        desc: "Menggunakan mesin bahan bakar dan tenaga listrik. Contohnya: sepeda motor, mobil listrik ramah lingkungan, bus Trans, pesawat terbang, dan Kereta Cepat Whoosh yang melaju secepat kilat!"
      },
      {
        title: "Masa NANTI 🛸",
        desc: "Di masa depan, para ilmuwan sedang merancang mobil terbang otomatis tanpa pengemudi, kereta tabung hyperloop berkecepatan suara, dan kapal bertenaga surya murni tanpa polusi udara."
      }
    ],
    tableData: [
      { price: "Dahulu", qty: "Delman & Gerobak Sapi", label: "Lambat, ramah hewan, jarak tempuh dekat" },
      { price: "Kini", qty: "Mobil Listrik & Kereta Cepat", label: "Cepat, nyaman, menggunakan baterai/mesin" },
      { price: "Nanti", qty: "Mobil Terbang & Taksi Drone", label: "Bebas macet di udara, sensor otomatis cerdas" }
    ]
  },
  {
    id: "komunikasi",
    title: "2. Perkembangan Alat Komunikasi",
    badge: "Berbagi Kabar dan Cerita",
    summary: "Komunikasi adalah cara manusia menyampaikan pesan, berita, dan bertukar informasi satu sama lain.",
    points: [
      {
        title: "Zaman DAHULU 📜",
        desc: "Menggunakan kentongan bambu saat ada bahaya, bedug di masjid, merpati pos, surat tulisan tangan yang diantar berhari-hari, dan telepon engkol manual."
      },
      {
        title: "Masa KINI 📱",
        desc: "Menggunakan smartphone pintar, aplikasi pesan WhatsApp, panggilan video tatap muka, surat elektronik (email), dan berita internet yang tersebar ke seluruh dunia dalam 1 detik."
      },
      {
        title: "Masa NANTI 🌐",
        desc: "Komunikasi hologram 3 dimensi seolah orangnya berdiri di depan kita, kacamata pintar pintar virtual, dan gelang pintar pengirim sinyal pikiran yang aman."
      }
    ],
    tableData: [
      { price: "Dahulu", qty: "Kentongan & Surat Kertas", label: "Pesan lokal suara kayu / pos berminggu-minggu" },
      { price: "Kini", qty: "Smartphone & Video Call", label: "Pesan instan sedetik, melihat wajah langsung" },
      { price: "Nanti", qty: "Hologram 3D Interaktif", label: "Tatap muka nyata seperti di ruangan yang sama" }
    ]
  },
  {
    id: "permainan",
    title: "3. Peralatan Rumah & Permainan Anak",
    badge: "Kehidupan di Rumah & Lapangan",
    summary: "Cara manusia memasak, menerangi malam, serta cara anak-anak bermain juga mengalami perubahan yang sangat menarik!",
    points: [
      {
        title: "Penerangan & Dapur 💡",
        desc: "Dahulu menggunakan lampu minyak teplok/damar berjelaga dan tungku kayu bakar. Kini menggunakan lampu LED terang hemat energi dan kompor gas/listrik otomatis."
      },
      {
        title: "Permainan Zaman Dahulu 🪁",
        desc: "Egrang bambu, gobak sodor, kelereng, lompat tali karet, congklak, dan petak umpet. Membuat tubuh sehat, banyak bergerak di lapangan, dan melatih kerja sama antarteman."
      },
      {
        title: "Permainan Masa Kini & Nanti 🎮",
        desc: "Game di tablet/gawai dan konsol virtual reality. Seru dan melatih otak, tetapi ingat: tidak boleh main terlalu lama agar mata tidak sakit dan tetap berolahraga bersama teman!"
      }
    ]
  }
];
