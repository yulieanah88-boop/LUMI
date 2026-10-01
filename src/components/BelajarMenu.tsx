import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Target,
  HelpCircle,
  BookOpen,
  Film,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  TUJUAN_PEMBELAJARAN,
  CAPAIAN_PEMBELAJARAN,
  PERTANYAAN_PEMANTIK,
  MATERI_BAB,
} from '../data/learningContent';
import { ThemeConfig } from '../types';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { SpeechButton } from './SpeechButton';
import { AdultGuideModal } from './AdultGuideModal';
import { SafetyHelpModal } from './SafetyHelpModal';
import { Shield } from 'lucide-react';

interface BelajarMenuProps {
  onBack: () => void;
  onGoToBermain: () => void;
  onMarkCompleted: () => void;
  isCompleted: boolean;
  theme?: ThemeConfig;
}

export const BelajarMenu: React.FC<BelajarMenuProps> = ({
  onBack,
  onGoToBermain,
  onMarkCompleted,
  isCompleted,
  theme,
}) => {
  const tujuanList = theme?.tujuanPembelajaran || TUJUAN_PEMBELAJARAN;
  const capaianText = theme?.capaianPembelajaran || CAPAIAN_PEMBELAJARAN;
  const pemantikList = theme?.belajar?.pertanyaanPemantik || PERTANYAAN_PEMANTIK;
  const materiList = theme?.belajar?.materiBab || MATERI_BAB;
  const videoSummary = theme?.belajar?.videoSummary;

  const [activeTab, setActiveTab] = useState<'tujuan' | 'pemantik' | 'materi' | 'video'>('tujuan');
  const [selectedPemantikAnswer, setSelectedPemantikAnswer] = useState<{ [qId: number]: number }>({});
  const [activeMateriId, setActiveMateriId] = useState<string>(materiList[0]?.id || 'transportasi');
  const [videoScene, setVideoScene] = useState(0);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);

  // Modals for sensitivity note
  const [isAdultGuideOpen, setIsAdultGuideOpen] = useState(false);
  const [isSafetyHelpOpen, setIsSafetyHelpOpen] = useState(false);

  // Subscribe to speech status
  useEffect(() => {
    const unsub = speech.subscribe((id) => {
      setCurrentSpeakingId(id);
    });
    return () => {
      unsub();
      speech.stop();
    };
  }, []);

  // Update activeMateriId if materiList changes
  useEffect(() => {
    if (materiList.length > 0 && !materiList.some((m) => m.id === activeMateriId)) {
      setActiveMateriId(materiList[0].id);
    }
  }, [materiList]);

  const tabs = [
    { id: 'tujuan', label: 'Tujuan Pembelajaran', icon: Target },
    { id: 'pemantik', label: 'Pertanyaan Pemantik', icon: HelpCircle },
    { id: 'materi', label: 'Materi & Bergambar', icon: BookOpen },
    { id: 'video', label: videoSummary?.title ? 'Teater Animasi' : 'Video Animasi', icon: Film },
  ] as const;

  const handleSelectTab = (tabId: typeof activeTab) => {
    sound.playClick();
    speech.stop(); // Stop audio when changing sub-tabs
    setActiveTab(tabId);
  };

  const handleAnswerPemantik = (qId: number, optIdx: number) => {
    sound.playClick();
    setSelectedPemantikAnswer((prev) => ({ ...prev, [qId]: optIdx }));
    sound.playCorrect();
    onMarkCompleted();
  };

  const handleNextToBermain = () => {
    sound.playClick();
    speech.stop();
    onMarkCompleted();
    onGoToBermain();
  };

  const handleBack = () => {
    sound.playClick();
    speech.stop();
    onBack();
  };

  // Helper text strings for TTS
  const allTujuanText = `Capaian Pembelajaran: ${capaianText}. Tujuan Pembelajaran: ` +
    tujuanList.map((tp) => `Target ${tp.id}: ${tp.text}`).join('. ');

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-200">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-display flex items-center gap-2 flex-wrap">
              <span>📖 Menu Belajar: {theme?.judulTema || 'Dahulu, Kini, & Nanti'}</span>
              <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-sans font-bold">
                {theme?.mataPelajaran || 'IPAS'} {theme?.kelas ? `• ${theme.kelas}` : '• Kelas III SD'}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Sensitivity Note Buttons for Themes like Tubuhku Berharga */}
          {theme?.sensitivityNote && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsAdultGuideOpen(true);
                }}
                className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-emerald-300"
                title="Panduan untuk Guru & Orang Tua"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Panduan Ortu &amp; Guru</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsSafetyHelpOpen(true);
                }}
                className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-rose-300"
                title="Pusat Bantuan & Kontak Perlindungan Anak"
              >
                <span>🆘 Bantuan</span>
              </button>
            </div>
          )}

          {/* TTS Accessibility Indicator / Global Stopper */}
          {currentSpeakingId && (
            <button
              onClick={() => speech.stop()}
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md animate-pulse cursor-pointer"
              title="Hentikan pembacaan suara"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Hentikan Suara</span>
            </button>
          )}

          {isCompleted ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Selesai Dipelajari</span>
            </span>
          ) : (
            <button
              onClick={() => {
                sound.playCorrect();
                onMarkCompleted();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Tandai Selesai</span>
            </button>
          )}

          <button
            onClick={handleNextToBermain}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>Lanjut ke Menu Bermain</span>
            <span>🎮➔</span>
          </button>
        </div>
      </header>

      {/* TTS Accessibility Banner for Primary School Students */}
      <div className="max-w-5xl w-full mx-auto mt-3 px-4 py-2.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-rose-200/60 rounded-lg text-rose-700">
            <Volume2 className="w-4 h-4" />
          </div>
          <span>
            <strong>Bantuan Suara Narator Aktif:</strong> Klik tombol{' '}
            <span className="inline-flex items-center font-bold text-rose-700 bg-white px-1.5 py-0.5 rounded border border-rose-200">
              🔊 Dengarkan
            </span>{' '}
            pada materi atau cerita jika ingin mendengarkan teks dibacakan!
          </span>
        </div>
        {currentSpeakingId && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-200/80 rounded-full font-bold text-[11px] text-rose-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            Sedang membaca...
          </span>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <nav aria-label="Sub-menu Belajar" className="max-w-5xl w-full mx-auto my-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-1.5 rounded-2xl border border-rose-100 shadow-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content Area */}
      <main className="max-w-5xl w-full mx-auto flex-1 my-2">
        {/* TAB 1: TUJUAN PEMBELAJARAN */}
        {activeTab === 'tujuan' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Capaian Pembelajaran Box */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-3xl text-white shadow-md relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-100 bg-white/20 px-3 py-1 rounded-full w-fit">
                  Capaian Pembelajaran (CP) {theme?.fase || 'Fase B'} {theme?.kelas || 'Kelas 3 SD'}
                </span>
                <SpeechButton
                  id="cp-b-speech"
                  textToSpeak={`Capaian Pembelajaran: ${capaianText}`}
                  label="Dengarkan CP"
                  size="sm"
                  variant="primary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-fit"
                />
              </div>
              <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed">
                "{capaianText}"
              </p>
            </div>

            {/* List Tujuan Pembelajaran */}
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-rose-500" />
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display">
                    Tujuan Pembelajaran Khusus (TP):
                  </h3>
                </div>
                <SpeechButton
                  id="tp-all-speech"
                  textToSpeak={allTujuanText}
                  label="Dengarkan Semua Tujuan"
                  size="sm"
                  variant="secondary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {tujuanList.map((tp) => (
                  <div
                    key={tp.id}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between gap-3 hover:bg-rose-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{tp.icon}</span>
                      <div className="flex-1">
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                          Target {tp.id}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-relaxed">
                          {tp.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-rose-100/60">
                      <SpeechButton
                        id={`tp-${tp.id}-speech`}
                        textToSpeak={`Target pembelajaran ${tp.id}: ${tp.text}`}
                        label="Dengarkan TP Ini"
                        size="sm"
                        variant="secondary"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Yuk amati cerita bergambar di Pertanyaan Pemantik untuk melatih rasa ingin tahumu!</span>
                </div>
                <button
                  onClick={() => handleSelectTab('pemantik')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
                >
                  Buka Pemantik ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERTANYAAN PEMANTIK BERGAMBAR */}
        {activeTab === 'pemantik' && (
          <div className="space-y-6 animate-in fade-in">
            {pemantikList.map((item) => {
              const selectedIdx = selectedPemantikAnswer[item.id];
              const isAnswered = selectedIdx !== undefined;
              const storySpeechText = `${item.title}. Kisah nyata: ${item.scenario}. Pertanyaan guru: ${item.question}`;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-0.5 rounded-full">
                        Cerita Bergambar #{item.id}
                      </span>
                      <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display">
                        {item.title}
                      </h3>
                    </div>
                    <SpeechButton
                      id={`pemantik-${item.id}-speech`}
                      textToSpeak={storySpeechText}
                      label="Dengarkan Cerita"
                      size="sm"
                      variant="amber"
                    />
                  </div>

                  {/* Visual Illustration Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <div className="bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-rose-200 min-h-[160px]">
                      <div className="space-y-2">
                        <div className="text-4xl">
                          {item.imageEmoji || '📖 💡'}
                        </div>
                        <span className="text-xs font-bold text-rose-800 block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-600 italic">
                          {item.imageCaption}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Kisah Nyata di Sekitar Kita:
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        "{item.scenario}"
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-bold text-rose-700">
                        Pertanyaan: {item.question}
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mt-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Menurut Pendapatmu:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {item.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerPemantik(item.id, optIdx)}
                          className={`text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                            selectedIdx === optIdx
                              ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {selectedIdx === optIdx && (
                            <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isAnswered && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg">💡</span>
                        <div>
                          <strong>Ulasan Guru:</strong>{' '}
                          <span>{item.options[selectedIdx].feedback}</span>
                        </div>
                      </div>
                      <SpeechButton
                        id={`feedback-${item.id}-speech`}
                        textToSpeak={`Ulasan Guru: ${item.options[selectedIdx].feedback}`}
                        label="Dengarkan Ulasan"
                        size="sm"
                        variant="secondary"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: MATERI TERTULIS & BERGAMBAR */}
        {activeTab === 'materi' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap gap-2">
              {materiList.map((materi) => (
                <button
                  key={materi.id}
                  onClick={() => {
                    sound.playClick();
                    speech.stop();
                    setActiveMateriId(materi.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeMateriId === materi.id
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
                  }`}
                >
                  {materi.title}
                </button>
              ))}
            </div>

            {(() => {
              const current = materiList.find((m) => m.id === activeMateriId) || materiList[0];
              if (!current) return null;
              const fullMateriSpeechText = `${current.title}. Ringkasan: ${current.summary}. ` +
                current.points.map((p) => `${p.title}: ${p.desc}`).join('. ');

              return (
                <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                        {current.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">
                        {current.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <SpeechButton
                        id={`materi-full-${current.id}`}
                        textToSpeak={fullMateriSpeechText}
                        label="Dengarkan Seluruh Materi"
                        size="sm"
                        variant="primary"
                      />
                      <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full hidden sm:inline-block">
                        IPAS Kelas 3 SD Fase B
                      </span>
                    </div>
                  </div>

                  <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed flex-1">
                      {current.summary}
                    </p>
                    <SpeechButton
                      id={`materi-summary-${current.id}`}
                      textToSpeak={`Ringkasan: ${current.summary}`}
                      label="Dengarkan Ringkasan"
                      size="sm"
                      variant="secondary"
                    />
                  </div>

                  {/* 3 Waktu Cards: Dahulu, Kini, Nanti with Individual Audio Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {current.points.map((pt, i) => {
                      const periodSpeech = `${pt.title}. ${pt.desc}`;
                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                            i === 0
                              ? 'bg-amber-50/60 border-amber-200'
                              : i === 1
                              ? 'bg-blue-50/60 border-blue-200'
                              : 'bg-emerald-50/60 border-emerald-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5 font-bold text-sm text-slate-800 font-display mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-slate-600" />
                                <span>{pt.title}</span>
                              </div>
                              <SpeechButton
                                id={`pt-${current.id}-${i}`}
                                textToSpeak={periodSpeech}
                                label=""
                                showIconOnly
                                size="sm"
                                variant="ghost"
                              />
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                              {pt.desc}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-200/50 flex justify-end">
                            <SpeechButton
                              id={`pt-btn-${current.id}-${i}`}
                              textToSpeak={periodSpeech}
                              label="Dengarkan"
                              size="sm"
                              variant={i === 0 ? 'amber' : 'secondary'}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Visual Timeline Comparison Table */}
                  {current.tableData && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Tabel Perbandingan Periode Waktu:
                        </span>
                        <SpeechButton
                          id={`table-${current.id}`}
                          textToSpeak={
                            `Tabel perbandingan ${current.title}. ` +
                            current.tableData
                              .map(
                                (r) => `Periode ${r.price}: contoh peralatan ${r.qty}, ciri kelebihan: ${r.label}`
                              )
                              .join('. ')
                          }
                          label="Dengarkan Tabel"
                          size="sm"
                          variant="ghost"
                        />
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-3">Periode Waktu</th>
                              <th className="p-3">Contoh Peralatan</th>
                              <th className="p-3">Ciri &amp; Kelebihan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {current.tableData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-rose-600">{row.price}</td>
                                <td className="p-3 font-bold text-slate-800">{row.qty}</td>
                                <td className="p-3 text-slate-600">{row.label}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 4: VIDEO PEMBELAJARAN INTERAKTIF */}
        {activeTab === 'video' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                    {videoSummary ? 'Teater Edukasi Interaktif' : 'Teater Animasi Tiga Babak Waktu'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 font-display">
                    {videoSummary?.title || 'Petualangan Menjelajahi Masa: Dahulu, Kini, & Nanti'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <SpeechButton
                    id={`video-scene-speech-${videoScene}`}
                    textToSpeak={
                      videoSummary
                        ? videoScene === 0
                          ? `Selamat Datang di ${videoSummary.title}! Klik tombol Mulai Cerita di bawah untuk menyaksikan tahapan pemahaman materi ${theme?.judulTema || ''}.`
                          : `${videoSummary.stages[videoScene - 1]?.stageName || `Tahap ${videoScene}`}: ${videoSummary.stages[videoScene - 1]?.years || ''}. ${videoSummary.stages[videoScene - 1]?.desc || ''}`
                        : videoScene === 0
                        ? 'Selamat Datang di Teater Mesin Waktu IPAS! Klik tombol Mulai Cerita di bawah untuk menyaksikan bagaimana kakek-nenek hidup zaman dahulu, bagaimana kita hidup masa kini, dan impian masa depan nanti!'
                        : videoScene === 1
                        ? 'Babak 1: Zaman Dahulu. Kakek dan Nenek. Malam hari diterangi lampu minyak tanah teplok berjelaga. Bepergian naik delman kuda atau sepeda onthel. Mengirim kabar menggunakan surat pos yang butuh berminggu-minggu.'
                        : videoScene === 2
                        ? 'Babak 2: Masa Kini. Zaman Kita Sekarang. Rumah terang dengan lampu LED hemat listrik. Komunikasi tatap muka dengan video call ponsel dalam 1 detik. Bepergian naik mobil listrik dan Kereta Cepat Whoosh!'
                        : 'Babak 3: Masa Nanti. Impian Masa Depan. Mobil terbang bertenaga surya bebas polusi, robot pelayan yang ramah, komunikasi hologram tiga dimensi, dan kota hijau yang asri bebas sampah plastik!'
                    }
                    label="Dengarkan Narasi Suara"
                    size="sm"
                    variant="primary"
                  />
                  <span className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold">
                    {theme?.mataPelajaran || 'IPAS'} {theme?.fase || 'Fase B'}
                  </span>
                </div>
              </div>

              {/* Simulated Story Stage */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-w-3xl mx-auto flex flex-col justify-between p-4 shadow-xl border border-slate-800">
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  {videoScene === 0 && (
                    <div className="space-y-3 animate-pulse-subtle">
                      <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/50">
                        <Play className="w-8 h-8 fill-rose-400 ml-1" />
                      </div>
                      <h4 className="text-lg font-bold text-white font-display">
                        {videoSummary?.title || 'Selamat Datang di Teater Mesin Waktu IPAS!'}
                      </h4>
                      <p className="text-xs text-slate-300 max-w-md">
                        Klik tombol "Mulai Cerita" di bawah untuk menyaksikan tahapan pemahaman interaktif materi ini!
                      </p>
                    </div>
                  )}

                  {videoSummary ? (
                    videoScene > 0 && videoSummary.stages[videoScene - 1] && (
                      <div className="space-y-2 animate-in fade-in">
                        <span className="text-5xl">{videoSummary.stages[videoScene - 1].icon}</span>
                        <h4 className="text-base font-bold text-emerald-400 font-display">
                          {videoSummary.stages[videoScene - 1].stageName} ({videoSummary.stages[videoScene - 1].years})
                        </h4>
                        <p className="text-xs text-slate-200 max-w-md">
                          "{videoSummary.stages[videoScene - 1].desc}"
                        </p>
                      </div>
                    )
                  ) : (
                    <>
                      {videoScene === 1 && (
                        <div className="space-y-2 animate-in fade-in">
                          <span className="text-5xl">🕰️ 🐎 📜</span>
                          <h4 className="text-base font-bold text-amber-400 font-display">
                            Babak 1: Zaman DAHULU (Kakek & Nenek)
                          </h4>
                          <p className="text-xs text-slate-200 max-w-md">
                            "Malam hari diterangi lampu minyak tanah teplok berjelaga. Bepergian naik delman kuda atau sepeda onthel. Mengirim kabar menggunakan surat pos yang butuh berminggu-minggu."
                          </p>
                        </div>
                      )}

                      {videoScene === 2 && (
                        <div className="space-y-2 animate-in fade-in">
                          <span className="text-5xl">📱 🚗 🚄</span>
                          <h4 className="text-base font-bold text-blue-400 font-display">
                            Babak 2: Masa KINI (Zaman Kita Sekarang)
                          </h4>
                          <p className="text-xs text-slate-200 max-w-md">
                            "Rumah terang dengan lampu LED hemat listrik. Komunikasi tatap muka dengan video call ponsel dalam 1 detik. Bepergian naik mobil listrik dan Kereta Cepat Whoosh!"
                          </p>
                        </div>
                      )}

                      {videoScene === 3 && (
                        <div className="space-y-2 animate-in fade-in">
                          <span className="text-5xl">🛸 🤖 🌿</span>
                          <h4 className="text-base font-bold text-emerald-400 font-display">
                            Babak 3: Masa NANTI (Impian Masa Depan)
                          </h4>
                          <p className="text-xs text-slate-200 max-w-md">
                            "Mobil terbang bertenaga surya bebas polusi, robot pelayan yang ramah, komunikasi hologram tiga dimensi, dan kota hijau yang asri bebas sampah plastik!"
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Controls */}
                <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-3 text-white text-xs border border-slate-700">
                  <button
                    onClick={() => {
                      sound.playClick();
                      speech.stop();
                      const next = (videoScene + 1) % 4;
                      setVideoScene(next);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{videoScene === 0 ? 'Mulai Cerita' : `Lanjut Babak (${videoScene}/3)`}</span>
                  </button>

                  <div className="flex-1 flex items-center gap-2 px-2">
                    <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full transition-all duration-300"
                        style={{ width: `${(videoScene / 3) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      Babak {videoScene} dari 3
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      speech.stop();
                      setVideoScene(0);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Ulangi dari Awal"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
        <span>MPI Lumi • {theme?.judulTema || 'IPAS SD Kelas 3'}</span>
        <span>Kurikulum Merdeka Belajar • Dilengkapi Aksesibilitas Suara TTS</span>
      </footer>

      {/* Sensitivity Note Modals for Adult Guide and Help Center */}
      <AdultGuideModal
        isOpen={isAdultGuideOpen}
        onClose={() => setIsAdultGuideOpen(false)}
        note={theme?.sensitivityNote}
      />
      <SafetyHelpModal
        isOpen={isSafetyHelpOpen}
        onClose={() => setIsSafetyHelpOpen(false)}
      />
    </div>
  );
};
