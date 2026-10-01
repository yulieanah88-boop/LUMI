import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Mail,
  School,
  BookOpen,
  Calendar,
  Sparkles,
  Edit3,
  Check,
  Award,
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  X,
  Link as LinkIcon,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { DeveloperProfile } from '../types';
import { DEFAULT_DEVELOPER, PRESET_AVATARS } from '../data/appData';
import { sound } from '../utils/audio';

interface PengembangMenuProps {
  onBack: () => void;
  developer: DeveloperProfile;
  onUpdateDeveloper: (updated: DeveloperProfile) => void;
}

export const PengembangMenu: React.FC<PengembangMenuProps> = ({
  onBack,
  developer,
  onUpdateDeveloper,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeveloperProfile>(developer);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Photo modal state
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<string>(developer.avatarUrl);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and compress uploaded image using HTML5 Canvas
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

        // Calculate aspect ratio crop/fit to square or balanced dimensions
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyPhoto = (newAvatarUrl: string) => {
    sound.playCorrect();
    const updated = { ...developer, avatarUrl: newAvatarUrl };
    onUpdateDeveloper(updated);
    setFormData((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
    setPreviewPhoto(newAvatarUrl);
    setIsPhotoModalOpen(false);
    setUploadSuccessToast('Foto profil pengembang berhasil diperbarui!');
    setTimeout(() => {
      setUploadSuccessToast('');
    }, 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCorrect();
    onUpdateDeveloper(formData);
    setIsEditing(false);
    setUploadSuccessToast('Biodata pengembang berhasil disimpan!');
    setTimeout(() => {
      setUploadSuccessToast('');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Toast Notification */}
      {uploadSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{uploadSuccessToast}</span>
        </div>
      )}

      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between gap-4 pb-4 border-b border-pink-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-pink-200 text-xs font-bold text-pink-800 hover:bg-pink-50 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-display flex items-center gap-2">
              <span>👩‍🏫 Menu Profil Pengembang</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setPreviewPhoto(developer.avatarUrl);
              setIsPhotoModalOpen(true);
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-pink-50 border border-pink-300 hover:bg-pink-100 text-pink-800 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <Camera className="w-3.5 h-3.5 text-pink-600" />
            <span className="hidden sm:inline">Ganti Foto</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsEditing(!isEditing);
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-pink-200 hover:bg-pink-50 text-pink-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Batal Ubah' : 'Edit Profil'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto flex-1 my-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm">
          {!isEditing ? (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Foto Pengembang dengan Tombol Ganti Cepat */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-lg border-4 border-pink-100 bg-gradient-to-tr from-pink-200 to-rose-200 group">
                  {developer.avatarUrl ? (
                    <img
                      src={developer.avatarUrl}
                      alt={developer.name}
                      className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-pink-100 text-pink-600 font-bold text-6xl">
                    👩‍🏫
                  </div>

                  {/* Overlay button on hover */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setPreviewPhoto(developer.avatarUrl);
                      setIsPhotoModalOpen(true);
                    }}
                    className="absolute inset-0 z-20 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer p-2 backdrop-blur-2xs"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold">Ganti Foto Profil</span>
                    <span className="text-[10px] text-pink-200 mt-0.5">Upload / Pilih Preset</span>
                  </button>
                </div>

                {/* Tombol Aksi Upload di Bawah Foto */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setPreviewPhoto(developer.avatarUrl);
                    setIsPhotoModalOpen(true);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="mt-3 text-xs font-bold text-pink-800 hover:text-pink-900 bg-pink-50 hover:bg-pink-100/80 px-4 py-1.5 rounded-full border border-pink-200 flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5 text-pink-600" />
                  <span>Upload / Ganti Foto</span>
                </button>

                <span className="mt-2 text-xs font-bold text-pink-700 bg-pink-50/70 px-3 py-0.5 rounded-full border border-pink-200/80 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>Guru Inovatif MPI</span>
                </span>
              </div>

              {/* Biodata Lengkap */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {developer.title}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display mt-0.5">
                    {developer.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  {/* Instansi */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <School className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-semibold">Instansi Sekolah:</span>
                      <span className="font-bold text-slate-800 text-sm">{developer.institution}</span>
                    </div>
                  </div>

                  {/* Mata Pelajaran */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <BookOpen className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-semibold">Mata Pelajaran (Mapel):</span>
                      <span className="font-bold text-slate-800 text-sm">{developer.subject}</span>
                    </div>
                  </div>

                  {/* Surel / Email */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <Mail className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-semibold">Surel (Email):</span>
                      <span className="font-bold text-pink-700 font-mono text-xs break-all">
                        {developer.email}
                      </span>
                    </div>
                  </div>

                  {/* Tahun Pembuatan */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-semibold">Tahun Pembuatan:</span>
                      <span className="font-bold text-slate-800 text-sm">{developer.creationYear}</span>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Dedikasi Pengembang */}
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 text-xs text-slate-700 leading-relaxed font-medium">
                  "{developer.bio}"
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                    Model Desain Lumi / H5P
                  </span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-semibold">
                    Kurikulum Merdeka SD Fase B
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                    Terverifikasi
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-pink-600" />
                  <h3 className="font-bold text-base text-slate-800 font-display">
                    Sesuaikan Biodata Pengembang MPI
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setPreviewPhoto(formData.avatarUrl);
                    setIsPhotoModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ganti / Unggah Foto</span>
                </button>
              </div>

              {/* Photo Preview in Edit Mode */}
              <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xs border-2 border-pink-200 shrink-0">
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-pink-100 text-pink-600 font-bold text-xl">
                    👩‍🏫
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <span className="font-bold text-slate-800 block">Foto Profil Aktif</span>
                  <p className="text-slate-500 truncate text-[11px]">{formData.avatarUrl}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setPreviewPhoto(formData.avatarUrl);
                    setIsPhotoModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-white border border-pink-300 hover:bg-pink-50 text-pink-700 font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-2xs"
                >
                  Ubah Foto
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap &amp; Gelar:</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instansi / Sekolah:</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran (Mapel):</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Surel (Email):</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Pembuatan:</label>
                  <input
                    type="text"
                    required
                    value={formData.creationYear}
                    onChange={(e) => setFormData({ ...formData, creationYear: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Foto Profil:</label>
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">Catatan / Dedikasi Singkat:</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* ======================================================== */}
      {/* MODAL UPLOAD & GANTI FOTO PROFIL PENGEMBANG */}
      {/* ======================================================== */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-pink-100 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    Ganti Foto Profil Pengembang
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload dari perangkat, pilih preset guru, atau gunakan URL
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Preview */}
            <div className="flex items-center gap-4 p-3 bg-pink-50/70 rounded-2xl border border-pink-100">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm border-2 border-white shrink-0 bg-pink-200">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Pratinjau Foto"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center bg-pink-100 text-pink-600 font-bold text-2xl">
                  👩‍🏫
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider block">
                  Pratinjau Foto Saat Ini
                </span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">
                  Foto siap disimpan sebagai profil resmi
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Foto ini akan tampil di Menu Pengembang dan piagam sertifikat kelulusan siswa.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {uploadError}
              </div>
            )}

            {/* METODE 1: Upload Langsung dari File Perangkat (Komputer / HP) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-pink-600" />
                  <span>1. Upload Foto dari Perangkat (Komputer / HP):</span>
                </span>
                <span className="text-[10px] text-slate-400">JPG, PNG, WEBP</span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Drag and Drop Box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
                  isDragging
                    ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                    : 'border-slate-200 hover:border-pink-300 hover:bg-slate-50/70 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Klik untuk Pilih Foto dari Perangkat
                  </span>
                  <span className="text-[11px] text-slate-500">
                    atau seret &amp; lepas berkas foto ke area ini
                  </span>
                </div>
              </div>
            </div>

            {/* METODE 2: Pilihan Avatar Guru SD Siap Pakai */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>2. Atau Pilih Koleksi Avatar Guru SD:</span>
              </span>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = previewPhoto === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setPreviewPhoto(preset.url);
                        setUploadError('');
                      }}
                      className={`p-1.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      title={preset.name}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 mb-1 border border-slate-200">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                        {preset.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* METODE 3: Input URL Gambar Langsung */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>3. Atau Masukkan Tautan (URL) Foto:</span>
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/foto-guru.jpg"
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      sound.playClick();
                      setPreviewPhoto(customUrlInput.trim());
                      setUploadError('');
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs shrink-0 cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>

            {/* Footer Buttons Modal */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setPreviewPhoto(DEFAULT_DEVELOPER.avatarUrl);
                  setUploadError('');
                }}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Kembalikan foto asli bawaan sistem"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Foto Bawaan</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPhoto(previewPhoto)}
                  className="px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Foto Profil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
        <span>MPI Lumi IPAS SD Kelas 3 • Pengembang Media</span>
        <span className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-pink-500" />
          <span>Guru Sekolah Dasar Indonesia</span>
        </span>
      </footer>
    </div>
  );
};
