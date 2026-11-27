import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  ArrowLeft,
  Cloud,
  CloudOff,
  LogIn,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { ThemeConfig } from '../types';
import {
  mergeCloudAndLocalThemes,
  deleteCustomTheme,
  getCustomThemes,
  getSyncedThemeIds,
} from '../data/themes';
import {
  deleteCustomThemeFromFirestore,
  signInWithGooglePopup,
  signOutGoogle,
  syncLocalThemesToFirestore,
} from '../services/firebaseThemes';
import { sound } from '../utils/audio';

interface ThemeSelectScreenProps {
  currentThemeId: string;
  cloudThemes?: ThemeConfig[];
  isCloudLoading?: boolean;
  firebaseUser?: User | null;
  onSelectTheme: (theme: ThemeConfig) => void;
  onOpenGenerator: () => void;
  onBackToWelcome?: () => void;
}

const ADMIN_EMAIL = 'yulianah571@guru.sd.belajar.id';

export const ThemeSelectScreen: React.FC<ThemeSelectScreenProps> = ({
  currentThemeId,
  cloudThemes = [],
  isCloudLoading = false,
  firebaseUser = null,
  onSelectTheme,
  onOpenGenerator,
  onBackToWelcome,
}) => {
  const [localRefreshTick, setLocalRefreshTick] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string>('');

  const themes = useMemo(
    () => mergeCloudAndLocalThemes(cloudThemes),
    [cloudThemes, localRefreshTick]
  );

  const cloudThemeIds = useMemo(
    () => new Set(cloudThemes.map((t) => t.id)),
    [cloudThemes]
  );

  const unsyncedLocalCount = useMemo(() => {
    const syncedSet = new Set(getSyncedThemeIds());
    return getCustomThemes().filter(
      (t) => !cloudThemeIds.has(t.id) && !syncedSet.has(t.id)
    ).length;
  }, [cloudThemeIds, localRefreshTick]);

  const handleSelect = (theme: ThemeConfig) => {
    sound.playMenuClick();
    sound.playWhoosh();
    onSelectTheme(theme);
  };

  const handleSignInAndSync = async () => {
    sound.playClick();
    setIsSyncing(true);
    setSyncNotice('');
    let user: User;
    try {
      user = await signInWithGooglePopup();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setSyncNotice('Gagal masuk dengan Google: ' + (err?.message || 'Silakan coba lagi.'));
      }
      setIsSyncing(false);
      return;
    }

    try {
      const uploaded = await syncLocalThemesToFirestore(user);
      setLocalRefreshTick((t) => t + 1);
      sound.playCorrect();
      setSyncNotice(
        uploaded > 0
          ? `${uploaded} tema lokal berhasil diunggah ke Cloud dan kini tampil di semua akun Google!`
          : 'Akun Google terhubung! Semua tema kustom tersinkronisasi.'
      );
    } catch (err: any) {
      setSyncNotice('Akun Google berhasil masuk, namun sinkronisasi tema terkendala: ' + (err?.message || 'Coba klik sinkronkan lagi.'));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualSync = async () => {
    if (!firebaseUser) {
      await handleSignInAndSync();
      return;
    }
    sound.playClick();
    setIsSyncing(true);
    setSyncNotice('');
    try {
      const uploaded = await syncLocalThemesToFirestore(firebaseUser);
      setLocalRefreshTick((t) => t + 1);
      sound.playCorrect();
      setSyncNotice(
        uploaded > 0
          ? `${uploaded} tema lokal berhasil disinkronkan ke Cloud!`
          : 'Semua tema sudah sinkron dengan Cloud.'
      );
    } catch (err: any) {
      setSyncNotice('Gagal sinkronisasi: ' + (err?.message || 'Coba lagi.'));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, theme: ThemeConfig) => {
    e.stopPropagation();
    sound.playClick();

    if (confirmDeleteId !== theme.id) {
      setConfirmDeleteId(theme.id);
      return;
    }

    setConfirmDeleteId(null);
    const isInCloud = cloudThemeIds.has(theme.id);
    try {
      if (isInCloud) {
        await deleteCustomThemeFromFirestore(theme.id);
      }
      deleteCustomTheme(theme.id);
      setLocalRefreshTick((t) => t + 1);
      sound.playCorrect();
    } catch (err: any) {
      setSyncNotice('Hanya pembuat tema atau admin yang dapat menghapus tema Cloud ini.');
      sound.playWrong();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/70 via-sky-50/50 to-amber-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between select-none relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/3 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex flex-col gap-3 mb-5 z-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {onBackToWelcome && (
              <button
                onClick={() => {
                  sound.playClick();
                  onBackToWelcome();
                }}
                onMouseEnter={() => sound.playHover()}
                className="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Kembali</span>
              </button>
            )}

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Layers className="w-3 h-3 text-rose-600" />
                <span>Sistem Multi-Tema Kurikulum Merdeka</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
                Pilih Tema Pembelajaran
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenGenerator();
            }}
            onMouseEnter={() => sound.playHover()}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Buat Tema Guru ✨</span>
          </button>
        </div>

        {/* Cloud Sync Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            {isCloudLoading ? (
              <RefreshCw className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
            ) : (
              <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>
              {firebaseUser ? (
                <>
                  Sinkronisasi Cloud Aktif sebagai{' '}
                  <strong className="text-slate-900">{firebaseUser.displayName || firebaseUser.email}</strong>
                </>
              ) : unsyncedLocalCount > 0 ? (
                <span className="text-amber-800 font-semibold">
                  Ada <strong>{unsyncedLocalCount} tema lokal</strong> di perangkat ini yang belum masuk ke Cloud agar tampil di akun Google lain.
                </span>
              ) : (
                <span>
                  Tema Cloud otomatis tampil di semua akun Google. Masuk Google untuk membuat &amp; membagikan tema baru.
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {unsyncedLocalCount > 0 && (
              <button
                type="button"
                disabled={isSyncing}
                onClick={handleManualSync}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{firebaseUser ? 'Sinkronkan Tema Lokal' : 'Masuk & Unggah ke Cloud'}</span>
              </button>
            )}

            {firebaseUser ? (
              <button
                type="button"
                onClick={async () => {
                  sound.playClick();
                  await signOutGoogle();
                  setSyncNotice('');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Google</span>
              </button>
            ) : (
              unsyncedLocalCount === 0 && (
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleSignInAndSync}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk dengan Google</span>
                </button>
              )
            )}
          </div>
        </div>

        {syncNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-2 text-xs font-medium">
            {syncNotice}
          </div>
        )}
      </header>

      {/* Main Grid of Theme Cards */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center my-2 z-10">
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Pilihlah tema pembelajaran di bawah ini. Tema yang kamu pilih akan langsung diterapkan, dan kamu bisa meninjau serta menekan tombol <strong>"Mulai Belajar"</strong> di halaman depan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {themes.map((theme) => {
            const isSelected = theme.id === currentThemeId;
            const isInCloud = cloudThemeIds.has(theme.id);
            const canDelete =
              theme.isCustom &&
              (!isInCloud ||
                (firebaseUser &&
                  (theme.creatorUid === firebaseUser.uid ||
                    firebaseUser.email === ADMIN_EMAIL)));

            return (
              <div
                key={theme.id}
                onClick={() => {
                  setConfirmDeleteId(null);
                  handleSelect(theme);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`group relative bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-98 ${
                  isSelected
                    ? 'border-rose-400 ring-4 ring-rose-200/80 shadow-rose-100'
                    : 'border-slate-200 hover:border-rose-300'
                }`}
              >
                {/* Top-right badges & delete button */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                  {isSelected && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tema Aktif</span>
                    </div>
                  )}

                  {canDelete && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, theme)}
                      title={confirmDeleteId === theme.id ? 'Klik lagi untuk konfirmasi hapus' : 'Hapus tema kustom ini'}
                      className={`px-2 py-1 rounded-full text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                        confirmDeleteId === theme.id
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {confirmDeleteId === theme.id && <span>Yakin Hapus?</span>}
                    </button>
                  )}
                </div>

                <div>
                  {/* Mascot & Subject Tags */}
                  <div className="flex items-center gap-3 mb-3 pr-16">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-100 to-amber-100 border border-rose-200 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform shrink-0">
                      {theme.emojiMaskot}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {theme.fase} · {theme.kelas}
                        </span>
                        {theme.isCustom && (
                          isInCloud ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                              <Cloud className="w-3 h-3" />
                              <span>Cloud</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 inline-flex items-center gap-1">
                              <CloudOff className="w-3 h-3" />
                              <span>Lokal Saja</span>
                            </span>
                          )
                        )}
                      </div>
                      <span className="text-xs font-semibold text-rose-600 block mt-0.5">
                        {theme.mataPelajaran}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-slate-800 font-display leading-snug group-hover:text-rose-600 transition-colors">
                    {theme.judulTema}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                    {theme.subJudul}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                    {theme.deskripsiSingkat}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                    <span>10 Soal HOTS + 5 Game</span>
                  </span>
                  <span className={`font-bold transition-transform flex items-center gap-1 ${isSelected ? 'text-rose-600' : 'text-slate-700 group-hover:text-rose-600'}`}>
                    <span>{isSelected ? 'Sudah Dipilih ✓' : 'Pilih Tema Ini'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}

          {/* Action Card: Buat Tema Sendiri */}
          <div
            onClick={() => {
              sound.playClick();
              onOpenGenerator();
            }}
            onMouseEnter={() => sound.playHover()}
            className="group bg-gradient-to-br from-amber-50/90 via-rose-50/70 to-pink-50/90 rounded-3xl p-6 border-2 border-dashed border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between text-center items-center active:scale-98 min-h-[220px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform mb-3">
              <Plus className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase mb-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Generator AI Guru</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-display">
                Buat Tema Sendiri
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                Ketik topik pembelajaran apa saja. AI Gemini akan merancang modul, 5 game, dan 10 soal asesmen HOTS lengkap!
              </p>
            </div>
            <button
              type="button"
              className="mt-3 px-4 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
            >
              <span>Mulai Rancang Tema</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-5xl mx-auto text-center pt-4 z-10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Setiap tema memiliki lencana, simulasi, leaderboard, dan piagam kelulusan tersendiri.</span>
        <span className="font-semibold text-rose-500">Multimedia Pembelajaran Interaktif (MPI) Kurikulum Merdeka</span>
      </footer>
    </div>
  );
};
