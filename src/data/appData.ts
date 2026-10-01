import { DeveloperProfile } from '../types';

export const DEFAULT_DEVELOPER: DeveloperProfile = {
  name: "Yulianah, S.Pd.",
  title: "Guru Kelas III SD & Pengembang Media Pembelajaran Interaktif",
  institution: "SD Negeri / Sahabat Guru Belajar Kemendikbudristek",
  subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS) Kelas III SD",
  email: "yulianah571@guru.sd.belajar.id",
  creationYear: "2026",
  bio: "Pendidik sekolah dasar yang penuh dedikasi menciptakan media pembelajaran digital yang ramah anak, interaktif, visual menarik, dan bermakna sesuai semangat Kurikulum Merdeka Fase B.",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
};

export const PRESET_AVATARS = [
  {
    id: 'default-female',
    name: 'Ibu Guru Ceria (Default)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    emoji: '👩‍🏫'
  },
  {
    id: 'hijab-female',
    name: 'Ibu Guru Berhijab',
    url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=300&auto=format&fit=crop',
    emoji: '🧕'
  },
  {
    id: 'young-female',
    name: 'Ibu Guru Muda Inspiratif',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop',
    emoji: '👩‍💼'
  },
  {
    id: 'male-friendly',
    name: 'Pak Guru Ramah',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop',
    emoji: '👨‍🏫'
  },
  {
    id: 'creative-female',
    name: 'Pendidik Kreatif',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    emoji: '✨'
  },
  {
    id: 'science-male',
    name: 'Pak Guru Sains & IPAS',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    emoji: '🔬'
  }
];

export const SUMBER_BELAJAR = [
  {
    title: "Buku Panduan Guru & Buku Siswa IPAS Kelas III SD",
    author: "Amalia Fitri, dkk. (Pusat Perbukuan Badan Standar, Kurikulum, dan Asesmen Pendidikan Kemendikbudristek RI)",
    year: "2023/2024",
    type: "Buku Paket Resmi",
    description: "Bab: Tradisi dan Perkembangan Kehidupan Masyarakat — Materi Dahulu, Kini, dan Nanti.",
    link: "https://buku.kemdikbud.go.id"
  },
  {
    title: "Modul Ajar IPAS Fase B Kelas 3: Mesin Waktu Kehidupan",
    author: "Direktorat Sekolah Dasar (Ditjen PAUD, Dikdas, dan Dikmen)",
    year: "2024",
    type: "Modul Ajar Digital",
    description: "Panduan aktivitas perbandingan teknologi, transportasi, komunikasi, dan permainan tradisional.",
    link: "https://ditpsd.kemdikbud.go.id"
  },
  {
    title: "Ensiklopedi Anak Cerdas: Sejarah Penemuan Benda di Sekitar Kita",
    author: "Pusat Sumber Belajar Anak Indonesia",
    year: "2025/2026",
    type: "Ensiklopedia Edukasi",
    description: "Kisah penemuan lampu, listrik, telepon, mobil, hingga teknologi ramah lingkungan masa depan.",
    link: "https://kemdikbud.go.id"
  },
  {
    title: "Platform Media Pembelajaran Lumi Education & H5P",
    author: "Lumi Education Open Source Project",
    year: "2026",
    type: "Framework Desain MPI",
    description: "Arsitektur desain interaktif H5P berbasis web untuk gamifikasi dan interaktivitas mandiri siswa SD.",
    link: "https://lumi.education"
  }
];

export const GLOSARIUM_EKONOMI = [
  {
    term: "Zaman Dahulu",
    meaning: "Masa lampau atau masa lalu ketika kakek, nenek, dan nenek moyang kita masih menggunakan peralatan tradisional sederhana."
  },
  {
    term: "Masa Kini",
    meaning: "Waktu saat ini atau masa sekarang yang sedang kita jalani dengan bantuan listrik, internet, dan mesin modern."
  },
  {
    term: "Masa Nanti",
    meaning: "Waktu yang akan datang atau masa depan yang penuh dengan impian teknologi canggih dan ramah lingkungan."
  },
  {
    term: "Transportasi",
    meaning: "Kendaraan atau alat yang digunakan manusia untuk bepergian dan memindahkan barang dari satu tempat ke tempat lain."
  },
  {
    term: "Komunikasi",
    meaning: "Cara menyampaikan pesan, suara, tulisan, atau berita kepada orang lain."
  },
  {
    term: "Tradisi & Permainan Rakyat",
    meaning: "Kebiasaan turun-temurun dari nenek moyang seperti egrang, gobak sodor, dan congklak yang perlu dilestarikan."
  }
];

export const MPI_PROMPT_TEMPLATE = `Prompt Master AI: Pembuatan Aplikasi Multimedia Pembelajaran Interaktif (MPI) Kurikulum Merdeka Model Desain Lumi

[PERAN & TUJUAN]
Kamu adalah seorang Instructional Designer dan Senior Fullstack Educational Software Engineer spesialis media pembelajaran berbasis web (Multimedia Pembelajaran Interaktif / MPI) untuk jenjang Sekolah Dasar (SD).
Tujuanmu adalah merancang dan membangun aplikasi MPI interaktif lengkap bertema "Dahulu, Kini, dan Nanti" untuk mata pelajaran IPAS Kelas III SD (Fase B) Kurikulum Merdeka dengan gaya visual "Menu Love Lumi" yang ramah anak, kaya visual, gamified, dan dilengkapi audio synthesizer mandiri.

[SPESIFIKASI PENGGUNA & KURIKULUM]
1. Sasaran Pengguna: Peserta didik Kelas 3 SD (usia 8-9 tahun) dan Guru Pengampu IPAS SD.
2. Karakteristik Desain: Antarmuka ramah anak (ceria, warna pastel lembut rose/amber/emerald/sky, tipografi jelas, tombol besar, icon/emoji ekspresif, bebas konten rumit).
3. Capaian Pembelajaran (CP) Fase B:
   - Peserta didik mengidentifikasi keterkaitan antara masa lalu, masa kini, dan masa depan.
   - Mengamati dan membandingkan perubahan lingkungan, teknologi transportasi, komunikasi, peralatan kehidupan sehari-hari, serta permainan tradisional vs modern.
   - Menumbuhkan rasa syukur, sikap bijak dalam berteknologi, serta menghargai warisan budaya leluhur.

[ARSITEKTUR & STRUKTUR HALAMAN]
1. Screen 1: Layar Sambutan (Welcome Screen)
   - Judul Besar: "MPI LUMI IPAS KELAS 3 SD: DAHULU, KINI, DAN NANTI" dengan subtitle interaktif.
   - Maskot Ceria Lumi dan tombol utama "MULAI BELAJAR" beranimasi bouncing dan efek suara klik.
   - Tombol "Panduan & Prompt Guru" untuk menyalin prompt master ini.
   - Kontrol Audio Musik & Suara di sudut layar.

2. Screen 2: Registrasi Identitas Siswa (Student Registration)
   - Form input ramah anak: Nama Lengkap Siswa, Pilihan Kelas (3A, 3B, 3C, 3D, atau Lainnya), dan Nomor Absen.
   - Data otomatis tersimpan di LocalStorage ('mpi_lumi_student') dan langsung digunakan untuk personalisasi sapaan, piagam sertifikat, dan papan peringkat.

3. Screen 3: Halaman Beranda (Main Menu) dengan Desain "Menu Love Lumi":
   A. Header Navigasi Pojok Kiri Atas:
      - Foto Profil Pengguna/Siswa dengan bingkai rounded-xl yang tersinkronisasi otomatis dengan foto yang diunggah.
      - Menampilkan: Nama Siswa, Kelas, dan Nomor Absen.
      - Fitur klik langsung pada foto atau ikon kamera untuk membuka modal cepat ganti foto (upload, drag-drop, pilihan preset avatar guru, atau tautan gambar).
      - Tombol ganti akun / keluar di samping nama.
      - Bilah kontrol audio: Toggle Musik Lofi, Toggle Suara Ambient Alam, dan Mute Master.

   B. Milestone Progres Belajar (Student Progress Bar):
      - 4 Tahapan visual: 📖 Belajar (25%), 🎮 Bermain (50%), ✍️ Berlatih (75%), 🤔 Refleksi (100%).
      - Tombol langsung unduh piagam saat progres mencapai 100%.

   C. Galeri Lencana Prestasi (Achievement Badges Gallery):
      - 5 Lencana Penghargaan:
        1) 🕰️ Penjelajah Waktu (Selesaikan Menu Belajar)
        2) 🛸 Pengendali Mesin Waktu (Selesaikan Menu Bermain & Game 5 Format)
        3) 🌟 Cendekiawan HOTS (Selesaikan Menu Berlatih 10 Soal HOTS)
        4) 💖 Sahabat Bijak Berteknologi (Selesaikan Menu Refleksi)
        5) 👑 Grand Master Bintang Masa Depan (Tuntaskan seluruh 4 misi belajar 100%)
      - Efek perayaan: Popup Lencana Unlocked dengan suara fanfare kemenangan dan hujan confetti saat lencana terbuka.

   D. Papan Peringkat Global (Global Leaderboard Top 5):
      - Menampilkan 5 skor tertinggi asesmen HOTS dari seluruh siswa yang tersimpan di LocalStorage.
      - Podium juara bergengsi: Juara 1 Mahkota Emas (Gold), Juara 2 Medali Perak (Silver), Juara 3 Medali Perunggu (Bronze).
      - Badge penanda "★ Kamu" dengan foto profil siswa jika siswa masuk peringkat.
      - Ringkasan skor terbaik siswa saat ini dan tombol "Tantang Dirimu ➔" ke Menu Berlatih.
      - Tombol ciutkan/bentangkan (expand/collapse) agar rapi.

   E. Susunan Grid 3 Baris Kartu "Menu Love" (Bentuk Hati Khas Lumi):
      - BARIS 1: RUANG EKSPLORASI & PRAKTIK
        * [Menu Belajar] (Rose Theme): Memuat 4 Tab (Tujuan Pembelajaran Fase B, Pertanyaan Pemantik Bergambar interaktif, Materi Komparasi 3 Babak [Transportasi, Komunikasi, Peralatan Rumah, Permainan Anak], dan Video Animasi Waktu interaktif). Dilengkapi tombol Narasi Suara (Text-to-Speech) untuk memandu siswa membaca.
        * [Menu Bermain] (Amber Theme): Simulasi Mesin Waktu Interaktif (Slider timeline Tahun 1920 Dahulu, 2026 Kini, 2060 Nanti) + Game Interaktif 5 Format Soal (Pilihan Ganda, Pilihan Ganda Kompleks multi-pilihan, Menjodohkan pasangan masa lalu vs modern, Isian Singkat nama alat, dan Drag/Order urutan evolusi alat).
        * [Menu Berlatih] (Emerald Theme): 10 Soal Asesmen HOTS (Higher Order Thinking Skills) berbasis studi kasus cerita kontekstual (analisis cangkul vs traktor, etika penggunaan smartphone, mobil terbang ramah lingkungan, pelestarian alat kuno). Dilengkapi pembahasan detail tiap soal dan kalkulasi skor otomatis (0-100).
      
      - BARIS 2: REFLEKSI, REFERENSI, & PROFIL
        * [Menu Refleksi] (Sky Theme): Refleksi emosional belajar dengan emoji (🤩 Hebat, 😊 Senang, 🤔 Penasaran, 😴 Lelah), menu favorit, dan formulir apresiasi serta komitmen penggunaan teknologi secara bijak.
        * [Menu Sumber Belajar] (Violet Theme): Daftar referensi buku teks IPAS Kelas 3 Kemendikbudristek RI, Modul Fase B Ditjen Dikdas, Ensiklopedia Anak Cerdas, dan Glosarium istilah zaman dahulu, kini, nanti.
        * [Menu Pengembang] (Fuchsia Theme): Profil lengkap Guru Pembuat MPI (Foto Profil, Nama Guru: Yulianah, S.Pd., Instansi: SD Negeri, Mapel: IPAS Kelas 3, Surel, Tahun 2026, dan Biodata). Dilengkapi fitur unggah foto dari file komputer/HP (JPG, PNG, WEBP), drag & drop, kompresi otomatis Canvas, 6 pilihan preset avatar guru ceria, dan input URL.

      - BARIS 3: BUKTI PRESTASI BELAJAR
        * [Menu Sertifikat] (Gold Theme): Generator Piagam Kelulusan Resmi Digital yang menampilkan Nama Siswa, Kelas, Nilai HOTS, Predikat (A+, A, B, C), Stempel Verifikasi, dan Tanda Tangan Guru Pengampu. Dapat langsung diunduh sebagai gambar PNG resolusi tinggi (1200x840) via HTML5 Canvas atau dicetak (PDF).

[SISTEM AUDIO MANDIRI (WEB AUDIO API)]
Aplikasi tidak boleh bergantung pada file audio eksternal yang rentan gagal dimuat (404). Gunakan Web Audio API synthesizer murni:
1. SFX Interaktif:
   - sound.playHover(): Suara kristal lembut (chime 820Hz-1080Hz) saat kursor melintasi tombol dan kartu menu.
   - sound.playMenuClick(): Suara klik renyah harmonik saat tombol ditekan.
   - sound.playCorrect(): Nada ganda ceria (523Hz -> 659Hz) untuk jawaban benar.
   - sound.playWrong(): Nada buzz lembut bersahabat (220Hz -> 180Hz) untuk jawaban salah.
   - sound.playFanfare(): Nada perayaan kemenangan agung saat menyelesaikan modul atau asesmen.
   - sound.playWhoosh(): Suara desiran halus transisi menu.
2. Background Audio:
   - Musik BGM Lofi arpeggio yang santai dan dapat diaktifkan/dimatikan.
   - Ambient Soundscape Generatif yang berbunyi lembut di halaman beranda (drone hangat + denting loncing angin pentatonik) dan otomatis dijeda saat siswa masuk ke materi belajar atau kuis agar fokus.

[PENYIMPANAN DATA PERSISTEN]
Gunakan LocalStorage untuk menyimpan seluruh riwayat aktivitas:
- 'mpi_lumi_student': Identitas siswa dan URL foto profil.
- 'mpi_lumi_developer': Profil pengembang dan URL foto profil guru.
- 'mpi_lumi_progress': Progres belajar, bermain, berlatih, dan refleksi.
- 'mpi_lumi_hots_score': Skor asesmen HOTS terbaru.
- 'mpi_lumi_reflection': Data isian refleksi emosi siswa.
- 'mpi_lumi_leaderboard': Daftar entri skor terbaik seluruh siswa untuk Global Leaderboard.`;
