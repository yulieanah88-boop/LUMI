import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Check,
  RotateCcw,
  BookOpen,
  Edit3,
  Layers,
  HelpCircle,
  AlertCircle,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { generateThemeWithAI, validateTheme } from '../utils/themeGenerator';
import { saveCustomTheme } from '../data/themes';
import { sound } from '../utils/audio';

interface ThemeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeCreated: (theme: ThemeConfig) => void;
}

export const ThemeGeneratorModal: React.FC<ThemeGeneratorModalProps> = ({
  isOpen,
  onClose,
  onThemeCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('IPAS (Ilmu Pengetahuan Alam & Sosial)');
  const [gradePhase, setGradePhase] = useState('Fase B (Kelas 3 SD)');
  const [goals, setGoals] = useState('');
  const [paletteId, setPaletteId] = useState('rose');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedTheme, setGeneratedTheme] = useState<ThemeConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields during preview
  const [editTitle, setEditTitle] = useState('');
  const [editSubTitle, setEditSubTitle] = useState('');
  const [editMascot, setEditMascot] = useState('');
  const [editCP, setEditCP] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Mohon isi topik pembelajaran terlebih dahulu.');
      return;
    }

    sound.playClick();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const theme = await generateThemeWithAI({
        topic: topic.trim(),
        subject,
        gradePhase,
        goals: goals.trim(),
        paletteId,
      });

      const validation = validateTheme(theme);
      if (!validation.valid) {
        console.warn('Validation warnings:', validation.errors);
      }

      setGeneratedTheme(theme);
      setEditTitle(theme.judulTema);
      setEditSubTitle(theme.subJudul);
      setEditMascot(theme.emojiMaskot);
      setEditCP(theme.capaianPembelajaran);
      setIsEditing(false);
      sound.playFanfare();
    } catch (err: any) {
      setErrorMsg('Terjadi kendala saat merancang tema: ' + (err.message || 'Silakan coba lagi.'));
      sound.playWrong();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndUse = () => {
    if (!generatedTheme) return;

    sound.playCorrect();

    const finalizedTheme: ThemeConfig = {
      ...generatedTheme,
      judulTema: editTitle.trim() || generatedTheme.judulTema,
      subJudul: editSubTitle.trim() || generatedTheme.subJudul,
      emojiMaskot: editMascot.trim() || generatedTheme.emojiMaskot,
      capaianPembelajaran: editCP.trim() || generatedTheme.capaianPembelajaran,
      sertifikat: {
        ...generatedTheme.sertifikat,
        themeTitleOnCert: (editTitle.trim() || generatedTheme.judulTema).toUpperCase(),
      },
    };

    saveCustomTheme(finalizedTheme);
    onThemeCreated(finalizedTheme);
    onClose();
  };

  const palettes = [
    { id: 'rose', name: 'Mawar Pastel', color: 'bg-rose-500' },
    { id: 'emerald', name: 'Zamrud Sejuk', color: 'bg-emerald-500' },
    { id: 'sky', name: 'Langit Ceria', color: 'bg-sky-500' },
    { id: 'amber', name: 'Mentari Hangat', color: 'bg-amber-500' },
    { id: 'purple', name: 'Lembayung Ungu', color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-amber-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
              ✨
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-display">
                Generator Tema Guru (Kurikulum Merdeka)
              </h3>
              <p className="text-xs text-rose-100">
                Rancang tema interaktif lengkap otomatis dengan Gemini AI
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-700 text-sm">
          {!generatedTheme ? (
            /* FORM INPUT */
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Panduan Bapak/Ibu Guru:</strong> Cukup ketikkan topik materi yang ingin diajarkan. Sistem AI akan menyusun Capaian Pembelajaran, 3-4 bab materi, pertanyaan pemantik, 5 tantangan game, dan 10 soal asesmen HOTS (C4-C6) berbasis cerita.
                </div>
              </div>

              {/* Topik / Tema */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topik / Tema Pembelajaran <span className="text-rose-500">* (Wajib)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Daur Hidup Kupu-kupu, Hemat Energi Listrik, Pahlawan Negeriku, Cuaca &amp; Musim..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-medium"
                />
              </div>

              {/* Grid: Mapel & Kelas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs font-medium bg-white"
                  >
                    <option value="IPAS (Ilmu Pengetahuan Alam & Sosial)">IPAS (Ilmu Pengetahuan Alam &amp; Sosial)</option>
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Matematika Kontekstual">Matematika Kontekstual</option>
                    <option value="PJOK (Pendidikan Jasmani & Kesehatan)">PJOK (Pendidikan Jasmani &amp; Kesehatan)</option>
                    <option value="Seni Budaya & Keterampilan">Seni Budaya &amp; Keterampilan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fase / Kelas
                  </label>
                  <select
                    value={gradePhase}
                    onChange={(e) => setGradePhase(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs font-medium bg-white"
                  >
                    <option value="Fase B (Kelas 3 SD)">Fase B (Kelas 3 SD)</option>
                    <option value="Fase B (Kelas 4 SD)">Fase B (Kelas 4 SD)</option>
                    <option value="Fase A (Kelas 1-2 SD)">Fase A (Kelas 1-2 SD)</option>
                    <option value="Fase C (Kelas 5-6 SD)">Fase C (Kelas 5-6 SD)</option>
                  </select>
                </div>
              </div>

              {/* Catatan Khusus Tujuan Pembelajaran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Tujuan Khusus dari Guru <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Tekankan pentingnya mengurangi sampah plastik di sekolah dan sikap gotong royong..."
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                />
              </div>

              {/* Pilihan Nuansa Warna Pastel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nuansa Warna Tema
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {palettes.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaletteId(p.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        paletteId === p.id
                          ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${p.color}`} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Merancang Tema Interaktif Lengkap...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-200" />
                      <span>Buat Tema dengan AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* PREVIEW & EDIT SCREEN */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Tema Berhasil Dirancang!</strong> Silakan tinjau dan edit teks jika diperlukan sebelum disimpan.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditing ? 'Selesai Edit' : 'Edit Teks'}</span>
                </button>
              </div>

              {/* Theme Summary Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-3xl p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editMascot}
                        onChange={(e) => setEditMascot(e.target.value)}
                        className="w-10 text-center font-bold"
                        maxLength={2}
                      />
                    ) : (
                      editMascot
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 border rounded-lg text-sm font-bold"
                          placeholder="Judul Tema"
                        />
                        <input
                          type="text"
                          value={editSubTitle}
                          onChange={(e) => setEditSubTitle(e.target.value)}
                          className="w-full px-2 py-1 border rounded-lg text-xs"
                          placeholder="Sub Judul"
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-base text-slate-800 font-display">
                          {editTitle}
                        </h4>
                        <p className="text-xs text-slate-500">{editSubTitle}</p>
                      </>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 mt-1 inline-block">
                      {generatedTheme.mataPelajaran} · {generatedTheme.kelas}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-0.5">
                    Capaian Pembelajaran:
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={editCP}
                      onChange={(e) => setEditCP(e.target.value)}
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                      {editCP}
                    </p>
                  )}
                </div>

                {/* Specs count */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-xs">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-extrabold text-rose-600 block">
                      {generatedTheme.belajar.materiBab.length} Bab
                    </span>
                    <span className="text-[10px] text-slate-500">Materi Interaktif</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-extrabold text-amber-600 block">
                      {generatedTheme.bermain.games.length} Game
                    </span>
                    <span className="text-[10px] text-slate-500">Kuis Edukasi</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-extrabold text-emerald-600 block">
                      {generatedTheme.berlatih.questions.length} Soal
                    </span>
                    <span className="text-[10px] text-slate-500">Asesmen HOTS</span>
                  </div>
                </div>
              </div>

              {/* Sample HOTS Question Preview */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Contoh Soal HOTS yang Dihasilkan:
                </span>
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-800">
                    Soal 1 ({generatedTheme.berlatih.questions[0]?.dimension}):
                  </span>
                  <p className="text-slate-700 italic">
                    "{generatedTheme.berlatih.questions[0]?.caseStory}"
                  </p>
                  <p className="font-semibold text-slate-800">
                    {generatedTheme.berlatih.questions[0]?.question}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          {generatedTheme ? (
            <>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setGeneratedTheme(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rancang Ulang</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndUse}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Tema &amp; Gunakan Sekarang</span>
              </button>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-medium cursor-pointer transition"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
