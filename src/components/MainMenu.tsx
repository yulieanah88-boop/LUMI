import React, { useEffect, useState, useRef } from 'react';
import {
  BookOpen,
  Gamepad2,
  PenTool,
  Smile,
  Library,
  UserCheck,
  Award,
  LogOut,
  HelpCircle,
  Heart,
  Camera,
  Upload,
  Check,
  CheckCircle2,
  RotateCcw,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { StudentInfo, ActiveScreen, SectionProgress, DeveloperProfile, ThemeConfig } from '../types';
import { PRESET_AVATARS, DEFAULT_DEVELOPER } from '../data/appData';
import { LoveMenuCard } from './LoveMenuCard';
import { StudentProgressBar } from './StudentProgressBar';
import { AchievementBadgesGallery } from './AchievementBadgesGallery';
import { GlobalLeaderboard } from './GlobalLeaderboard';
import { AudioToggle } from './AudioToggle';
import { sound } from '../utils/audio';

interface MainMenuProps {
  student: StudentInfo;
  developer: DeveloperProfile;
  progress: SectionProgress;
  theme?: ThemeConfig;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenCertificate: () => void;
  onOpenPromptGuide: () => void;
  onChangeStudent: () => void;
  onChangeTheme?: () => void;
  onUpdateDeveloper?: (updated: DeveloperProfile) => void;
  onUpdateStudent?: (updated: StudentInfo) => void;
  completedHots: boolean;
  hotsScore: number | null;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  student,
  developer,
  progress,
  theme,
  onNavigate,
  onOpenCertificate,
  onOpenPromptGuide,
  onChangeStudent,
  onChangeTheme,
  onUpdateDeveloper,
  onUpdateStudent,
  completedHots,
  hotsScore,
}) => {
  const isAllComplete =
    progress.belajar && progress.bermain && progress.berlatih && progress.refleksi;

  // Active avatar URL synchronized between student and developer profile
  const activeAvatarUrl = student.avatarUrl || developer.avatarUrl || DEFAULT_DEVELOPER.avatarUrl;

  const [avatarImgError, setAvatarImgError] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string>(activeAvatarUrl);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccessToast, setUploadSuccessToast] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset image error state whenever activeAvatarUrl changes
  useEffect(() => {
    setAvatarImgError(false);
  }, [activeAvatarUrl]);

  // Manage backsound on MainMenu mount
  useEffect(() => {
    // If backsound is enabled and unmuted, ensure it is playing
    if (sound.getBacksoundEnabled() && !sound.getMuted() && !sound.getBacksoundPlaying()) {
      sound.initContext();
      sound.startBacksound();
    }

    // Modern browsers require a user gesture before Web Audio can output sound
    const handleFirstGesture = () => {
      sound.initContext();
      if (sound.getBacksoundEnabled() && !sound.getMuted() && !sound.getBacksoundPlaying()) {
        sound.startBacksound();
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Process uploaded image file with canvas resizing & compression
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Mohon unggah berkas gambar (JPG, PNG, WEBP).');
      sound.playWrong();
      return;
    }

    setUploadError('');
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setPreviewPhoto(compressedDataUrl);
          sound.playCorrect();
        } else {
          setPreviewPhoto(img.src);
        }
      };
      img.onerror = () => {
        setUploadError('Gagal memproses gambar. Silakan coba gambar lain.');
      };
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setUploadError('Terjadi kesalahan saat membaca berkas gambar.');
    };

    reader.readAsDataURL(file);
  };

  const handleApplyPhoto = (newAvatarUrl: string) => {
    sound.playCorrect();

    // 1. Update developer profile
    const updatedDev = { ...developer, avatarUrl: newAvatarUrl };
    onUpdateDeveloper?.(updatedDev);
    try {
      localStorage.setItem('mpi_lumi_developer', JSON.stringify(updatedDev));
    } catch {
      // Ignore
    }

    // 2. Update student profile for 100% sync
    const updatedStudent = { ...student, avatarUrl: newAvatarUrl };
    onUpdateStudent?.(updatedStudent);
    try {
      localStorage.setItem('mpi_lumi_student', JSON.stringify(updatedStudent));
    } catch {
      // Ignore
    }

    setAvatarImgError(false);
    setIsPhotoModalOpen(false);
    setUploadSuccessToast('Foto profil berhasil disinkronkan ke seluruh aplikasi!');
    setTimeout(() => {
      setUploadSuccessToast('');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/70 via-pink-50/50 to-amber-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Toast Notification */}
      {uploadSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{uploadSuccessToast}</span>
        </div>
      )}

      {/* Decorative ambient elements */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/3 w-80 h-80 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 z-10">
        {/* Profile Card in Top-Left Corner (Pojok Kiri Atas) */}
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-rose-200/80 shadow-xs hover:border-rose-300 transition-colors">
          {/* Avatar Photo with Sync & Quick Upload Trigger */}
          <div className="relative group/avatar">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setPreviewPhoto(activeAvatarUrl);
                setIsPhotoModalOpen(true);
              }}
              onMouseEnter={() => sound.playHover()}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-xs border-2 border-rose-200 bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shrink-0 relative cursor-pointer group-hover/avatar:ring-2 group-hover/avatar:ring-rose-400 group-hover/avatar:shadow-md transition-all active:scale-95"
              title="Klik untuk melihat atau mengganti foto profil"
            >
              {activeAvatarUrl && !avatarImgError ? (
                <img
                  src={activeAvatarUrl}
                  alt={student.name || developer.name}
                  className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110"
                  onError={() => setAvatarImgError(true)}
                />
              ) : (
                <span className="text-white font-bold text-sm sm:text-base">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              )}
              {/* Overlay camera icon on hover */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white transition-opacity">
                <Camera className="w-4 h-4 text-white drop-shadow-xs" />
              </div>
            </button>
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs border border-white pointer-events-none text-[9px]"
              title="Foto Profil"
            >
              <Camera className="w-2.5 h-2.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Siswa:</span>
              <span className="text-sm font-bold text-slate-800">{student.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold">
              <span>Kelas {student.className}</span>
              {student.studentNumber && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>Absen #{student.studentNumber}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 ml-1 pl-2 border-l border-rose-100">
            <button
              onClick={() => {
                sound.playClick();
                setPreviewPhoto(activeAvatarUrl);
                setIsPhotoModalOpen(true);
              }}
              onMouseEnter={() => sound.playHover()}
              className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
              title="Ganti / Upload Foto Profil"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onChangeStudent();
              }}
              onMouseEnter={() => sound.playHover()}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Ganti Nama Siswa"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Toggle, Change Theme & Teacher Prompt */}
        <div className="flex items-center gap-2">
          {onChangeTheme && (
            <button
              onClick={() => {
                sound.playClick();
                onChangeTheme();
              }}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center gap-1.5 text-xs text-slate-700 bg-white/95 hover:bg-white px-3 py-2 rounded-full border border-slate-200 shadow-2xs transition-all cursor-pointer font-bold active:scale-95 hover:border-amber-300"
              title="Ganti Tema Pembelajaran"
            >
              <span className="text-sm">🔄</span>
              <span className="hidden sm:inline">Ganti Tema</span>
            </button>
          )}
          <AudioToggle />
          <button
            onClick={() => {
              sound.playClick();
              onOpenPromptGuide();
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-1.5 text-xs text-rose-700 bg-white/90 hover:bg-white px-3 py-2 rounded-full border border-rose-200 shadow-xs transition-colors cursor-pointer font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Prompt Guru</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto z-10 flex-1 flex flex-col justify-center my-1">
        {/* Progress Bar at the top of the main menu */}
        <StudentProgressBar
          progress={progress}
          onNavigate={onNavigate}
          onOpenCertificate={onOpenCertificate}
        />

        {/* Lencana Pencapaian Belajar Murid */}
        <AchievementBadgesGallery
          progress={progress}
          onNavigate={onNavigate}
          badges={theme?.badges}
        />

        {/* Global Leaderboard - Top 5 Siswa Asesmen HOTS */}
        <GlobalLeaderboard
          currentStudent={student}
          currentHotsScore={hotsScore}
          onNavigate={onNavigate}
          developerAvatarUrl={activeAvatarUrl}
          themeId={theme?.id || 'dahulu_kini_nanti'}
        />

        {/* Banner Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="text-sm">{theme?.emojiMaskot || '✨'}</span>
            <span>{theme?.mataPelajaran || 'IPAS SD'} • {theme?.kelas || 'Kelas III SD'} • Kurikulum Merdeka</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 font-display">
            {theme?.judulTema || 'Dahulu, Kini, & Nanti'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-1">
            {theme?.deskripsiSingkat || theme?.subJudul || 'Yuk menjelajahi waktu! Belajar bagaimana kehidupan, alat transportasi, dan teknologi berubah dari masa lalu hingga masa depan!'}
          </p>
          {theme?.sapaanLumi && (
            <div className="mt-2.5 max-w-lg mx-auto px-4 py-1.5 bg-white/85 rounded-full border border-rose-200 text-xs text-rose-800 italic shadow-2xs">
              "{theme.sapaanLumi}"
            </div>
          )}
        </div>

        {/* The 3-Row Grid as explicitly specified by User */}
        <div className="space-y-4 sm:space-y-6">
          {/* BARIS PERTAMA: Menu Belajar, Menu Bermain, Menu Berlatih */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Baris 1: Ruang Eksplorasi &amp; Praktik</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              <LoveMenuCard
                title="Menu Belajar"
                subtitle="Tujuan, Pertanyaan Pemantik Bergambar, Cerita Waktu (Dahulu, Kini, Nanti), &amp; Video Animasi."
                icon={BookOpen}
                emoji="📖"
                themeColor="rose"
                badge={progress.belajar ? '✓ Selesai' : 'Wajib Dibaca'}
                onClick={() => onNavigate('belajar')}
              />

              <LoveMenuCard
                title="Menu Bermain"
                subtitle="Mesin Waktu Interaktif &amp; Game 5 Format (PG, PG Kompleks, Menjodohkan, Isian, Reorder)."
                icon={Gamepad2}
                emoji="🎮"
                themeColor="amber"
                badge={progress.bermain ? '✓ Selesai' : 'Mesin Waktu + Game'}
                onClick={() => onNavigate('bermain')}
              />

              <LoveMenuCard
                title="Menu Berlatih"
                subtitle="10 Soal Asesmen HOTS ramah anak Kelas 3 SD berbasis cerita masa lalu hingga masa depan."
                icon={PenTool}
                emoji="✍️"
                themeColor="emerald"
                badge={completedHots ? `✓ Skor: ${hotsScore}` : '10 Soal HOTS'}
                onClick={() => onNavigate('berlatih')}
              />
            </div>
          </div>

          {/* BARIS KEDUA: Menu Refleksi, Menu Sumber Belajar, Menu Pengembang */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Baris 2: Refleksi, Referensi, &amp; Profil</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              <LoveMenuCard
                title="Menu Refleksi"
                subtitle="Refleksi emosi belajar dengan emoji ceria &amp; rasa syukur atas kemajuan teknologi."
                icon={Smile}
                emoji="🤔"
                themeColor="sky"
                badge={progress.refleksi ? '✓ Selesai' : 'Refleksi Diri'}
                onClick={() => onNavigate('refleksi')}
              />

              <LoveMenuCard
                title="Menu Sumber Belajar"
                subtitle="Buku IPAS Kelas 3 Kemendikbudristek, Modul Fase B, &amp; Ensiklopedia Benda."
                icon={Library}
                emoji="📚"
                themeColor="violet"
                badge="Referensi Resmi"
                onClick={() => onNavigate('sumber')}
              />

              <LoveMenuCard
                title="Menu Pengembang"
                subtitle="Profil lengkap guru pengembang (Foto, Nama, Instansi SD, Mapel IPAS 3, Surel, &amp; Tahun)."
                icon={UserCheck}
                emoji="👩‍🏫"
                themeColor="fuchsia"
                badge="Profil Guru SD"
                onClick={() => onNavigate('pengembang')}
              />
            </div>
          </div>

          {/* BARIS KETIGA: Menu Sertifikat (Download Hasil Belajar Siswa) */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Baris 3: Bukti Prestasi Belajar</span>
            </div>
            <div className="max-w-xl mx-auto">
              <LoveMenuCard
                title="Menu Sertifikat Hasil Belajar"
                subtitle="Download dan cetak Piagam Penghargaan Kelulusan resmi lengkap dengan nama, kelas, nilai, dan stempel!"
                icon={Award}
                emoji="🏆"
                themeColor="gold"
                badge={isAllComplete ? '★ Tuntas 100%' : 'Unduh Piagam SD'}
                isWide={true}
                onClick={onOpenCertificate}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-3 z-10 text-xs text-slate-600 mt-4 border-t border-rose-100">
        <p>MPI IPAS Kelas III SD • Desain Menu Love Lumi • Materi Dahulu, Kini, dan Nanti</p>
      </footer>

      {/* QUICK PHOTO MODAL: Ubah/Upload Foto Profil dari Pojok Kiri Atas */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Ganti Foto Profil (Pojok Kiri Atas)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Sinkron otomatis ke Halaman Beranda &amp; Menu Pengembang
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsPhotoModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <span>⚠️ {uploadError}</span>
              </div>
            )}

            {/* Current Active Preview */}
            <div className="my-4 flex items-center gap-4 p-3 bg-pink-50/60 rounded-2xl border border-pink-100">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xs border-2 border-pink-300 bg-white shrink-0">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Preview Foto"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-600 font-bold text-xl">
                    👩‍🏫
                  </div>
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-pink-700 block uppercase tracking-wider">
                  Pratinjau Foto Aktif
                </span>
                <p className="text-xs font-semibold text-slate-700">
                  {student.name} • Kelas {student.className}
                </p>
                <span className="text-[10px] text-slate-400">
                  Foto ini akan tampil di pojok kiri atas dan piagam sertifikat
                </span>
              </div>
            </div>

            {/* Pilihan 1: Upload Berkas dari Komputer / HP */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-pink-600" />
                <span>Unggah Foto dari Perangkat (JPG, PNG, WEBP)</span>
              </span>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processImageFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                  isDragging
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-pink-200 hover:border-pink-400 hover:bg-pink-50/40 bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processImageFile(file);
                  }}
                />
                <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-1.5">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Klik untuk Memilih Foto atau Tarik File ke Sini
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Foto otomatis dioptimalkan ke resolusi pas &amp; jernih
                </p>
              </div>
            </div>

            {/* Pilihan 2: Pilih Avatar Pilihan Guru SD */}
            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Atau Pilih Avatar Pilihan Ceria</span>
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setPreviewPhoto(av.url);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition p-0.5 cursor-pointer ${
                      previewPhoto === av.url
                        ? 'border-pink-600 ring-2 ring-pink-300 scale-105 shadow-sm'
                        : 'border-slate-200 hover:border-pink-300'
                    }`}
                    title={av.name}
                  >
                    <img src={av.url} alt={av.name} className="w-full h-full object-cover rounded-lg" />
                    {previewPhoto === av.url && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-pink-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pilihan 3: Input Tautan / URL Foto */}
            <div className="mt-4 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>Atau Masukkan Tautan / Link Gambar (URL)</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://contoh.com/foto-guru.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-pink-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      sound.playClick();
                      setPreviewPhoto(customUrlInput.trim());
                      setCustomUrlInput('');
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Coba Link
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 pt-4 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setPreviewPhoto(DEFAULT_DEVELOPER.avatarUrl);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kembalikan Bawaan</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsPhotoModalOpen(false);
                    onNavigate('pengembang');
                  }}
                  className="px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Menu Pengembang Lengkap ➔
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPhoto(previewPhoto)}
                  className="px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
