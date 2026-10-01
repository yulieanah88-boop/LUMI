import React, { useState } from 'react';
import { User, BookOpen, Hash, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { StudentInfo } from '../types';
import { sound } from '../utils/audio';

interface StudentRegistrationProps {
  initialData: StudentInfo | null;
  onSubmit: (data: StudentInfo) => void;
  onBack: () => void;
}

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({
  initialData,
  onSubmit,
  onBack,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [className, setClassName] = useState(initialData?.className || '3A');
  const [customClass, setCustomClass] = useState('');
  const [studentNumber, setStudentNumber] = useState(initialData?.studentNumber || '');
  const [error, setError] = useState('');

  const classOptions = ['3A', '3B', '3C', '3D', '3E', 'Lainnya'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    const finalClass = className === 'Lainnya' ? customClass.trim() : className;

    if (!finalName) {
      sound.playWrong();
      setError('Mohon masukkan Nama Lengkap kamu!');
      return;
    }

    if (!finalClass) {
      sound.playWrong();
      setError('Mohon tentukan Kelas kamu!');
      return;
    }

    sound.playCorrect();
    sound.playWhoosh();
    onSubmit({
      name: finalName,
      className: finalClass,
      studentNumber: studentNumber.trim(),
      registeredAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 relative">
      {/* Decorative Hearts */}
      <div className="absolute top-12 left-10 text-rose-300 opacity-40 pointer-events-none">
        <Heart className="w-12 h-12 fill-rose-200" />
      </div>
      <div className="absolute bottom-10 right-12 text-pink-300 opacity-40 pointer-events-none">
        <Heart className="w-10 h-10 fill-pink-200" />
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-rose-100 relative z-10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md text-white">
            <User className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Identitas Peserta Didik
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-2 font-display">
            Selamat Datang di MPI!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Silakan masukkan nama dan kelasmu terlebih dahulu sebelum mulai belajar ya!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Siswa (Wajib) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-500" />
              <span>Nama Lengkap Siswa</span>
              <span className="text-rose-500 text-xs font-normal">(Wajib)</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Muhammad Farhan"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Kelas (Wajib) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-rose-500" />
              <span>Pilihan Kelas</span>
              <span className="text-rose-500 text-xs font-normal">(Wajib)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {classOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => {
                    sound.playClick();
                    setClassName(opt);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    className === opt
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {className === 'Lainnya' && (
              <input
                type="text"
                value={customClass}
                onChange={(e) => setCustomClass(e.target.value)}
                placeholder="Tulis nama kelasmu (cth: 7 Unggulan 1)"
                className="mt-2 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            )}
          </div>

          {/* Nomor Absen (Opsional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Nomor Presensi / Absen</span>
              <span className="text-slate-400 text-xs font-normal">(Opsional)</span>
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              placeholder="Contoh: 18"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              onMouseEnter={() => sound.playHover()}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Kembali
            </button>

            <button
              type="submit"
              onMouseEnter={() => sound.playHover()}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk ke Beranda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Data digunakan untuk mencetak e-sertifikat prestasi belajarmu
          </span>
        </div>
      </div>
    </div>
  );
};
