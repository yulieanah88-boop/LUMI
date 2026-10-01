import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Timer,
  Clock,
  Play,
  Pause,
  Settings2,
  Volume2,
  VolumeX,
  PlusCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HOTS_QUESTIONS } from '../data/hotsQuestions';
import { ThemeConfig } from '../types';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { SpeechButton } from './SpeechButton';

interface BerlatihMenuProps {
  onBack: () => void;
  onSaveScore: (score: number) => void;
  onOpenCertificate: () => void;
  savedScore: number | null;
  theme?: ThemeConfig;
}

type TimerDurationOption = 45 | 60 | 90 | 0;

interface TimerOptionConfig {
  value: TimerDurationOption;
  label: string;
  badge: string;
  description: string;
}

const TIMER_PRESETS: TimerOptionConfig[] = [
  {
    value: 60,
    label: '60 Detik',
    badge: 'Standar HOTS',
    description: 'Waktu ideal untuk membaca kasus kontekstual & menganalisis (Direkomendasikan)'
  },
  {
    value: 45,
    label: '45 Detik',
    badge: 'Tantangan Kilat',
    description: 'Untuk siswa yang ingin menguji kecepatan berpikir analitis'
  },
  {
    value: 90,
    label: '90 Detik',
    badge: 'Santai & Teliti',
    description: 'Waktu leluasa bagi siswa yang butuh pemahaman cerita lebih mendalam'
  },
  {
    value: 0,
    label: 'Tanpa Timer',
    badge: 'Bebas Waktu',
    description: 'Mengerjakan asesmen dengan tenang tanpa batasan hitung mundur'
  }
];

export const BerlatihMenu: React.FC<BerlatihMenuProps> = ({
  onBack,
  onSaveScore,
  onOpenCertificate,
  savedScore,
  theme,
}) => {
  const questions = theme?.berlatih?.questions && theme.berlatih.questions.length > 0
    ? theme.berlatih.questions
    : HOTS_QUESTIONS;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(savedScore !== null);
  const [showReview, setShowReview] = useState(false);

  // Timer Configuration & State
  const [timerDuration, setTimerDuration] = useState<TimerDurationOption>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isTickingSoundEnabled, setIsTickingSoundEnabled] = useState<boolean>(true);
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState<boolean>(false);

  // Per-question status tracking
  const [expiredQuestions, setExpiredQuestions] = useState<{ [qId: number]: boolean }>({});
  const [timeSpent, setTimeSpent] = useState<{ [qId: number]: number }>({});

  const currentQ = questions[currentIdx] || questions[0];
  const isCurrentAnswered = selectedAnswers[currentQ?.id] !== undefined;
  const isCurrentExpired = !!expiredQuestions[currentQ?.id];

  // Stop text-to-speech when switching questions or unmounting
  useEffect(() => {
    speech.stop();
  }, [currentIdx]);

  // Handle question navigation and timer reset
  useEffect(() => {
    if (timerDuration === 0 || !currentQ) return;

    const currentQId = currentQ.id;
    const isAnswered = selectedAnswers[currentQId] !== undefined;
    const isExpired = expiredQuestions[currentQId];

    if (isAnswered) {
      // Question already completed
    } else if (isExpired) {
      setTimeLeft(0);
    } else {
      // Reset timer to full duration for new unanswered question
      setTimeLeft(timerDuration);
    }
  }, [currentIdx, timerDuration, currentQ]);

  // Main countdown interval effect
  useEffect(() => {
    // Timer does not run if: submitted, in review, timer turned off, paused, or question is answered/expired
    if (isSubmitted || showReview || timerDuration === 0 || isTimerPaused || !currentQ) {
      return;
    }

    const currentQId = currentQ.id;
    if (selectedAnswers[currentQId] !== undefined || expiredQuestions[currentQId]) {
      return;
    }

    if (timeLeft <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft(prev => {
        const nextTime = prev - 1;

        if (nextTime <= 0) {
          window.clearInterval(intervalId);
          setExpiredQuestions(prevExp => ({ ...prevExp, [currentQId]: true }));
          sound.playTimeUp();
          return 0;
        }

        // Ticking audio cue on the last 5 seconds (5, 4, 3, 2, 1)
        if (isTickingSoundEnabled && nextTime <= 5) {
          sound.playTick();
        }

        return nextTime;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [
    currentIdx,
    isSubmitted,
    showReview,
    timerDuration,
    isTimerPaused,
    selectedAnswers,
    expiredQuestions,
    isTickingSoundEnabled
  ]);

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    sound.playClick();

    const currentQId = currentQ.id;
    setSelectedAnswers(prev => ({ ...prev, [currentQId]: optIdx }));

    // Record time spent on this question
    if (timerDuration > 0) {
      const spent = timerDuration - timeLeft;
      setTimeSpent(prev => ({ ...prev, [currentQId]: Math.max(1, spent) }));
    }
  };

  const handleAddExtraTime = () => {
    sound.playClick();
    const currentQId = currentQ.id;
    // Add 30 seconds and remove expired flag
    setExpiredQuestions(prev => {
      const updated = { ...prev };
      delete updated[currentQId];
      return updated;
    });
    setTimeLeft(prev => prev + 30);
    setIsTimerPaused(false);
  };

  const handleTogglePause = () => {
    sound.playClick();
    setIsTimerPaused(prev => !prev);
  };

  const handleChangeTimerPreset = (newDuration: TimerDurationOption) => {
    sound.playClick();
    setTimerDuration(newDuration);
    setShowTimerModal(false);

    if (newDuration > 0) {
      const currentQId = currentQ.id;
      if (selectedAnswers[currentQId] === undefined && !expiredQuestions[currentQId]) {
        setTimeLeft(newDuration);
      }
    }
  };

  const handleAttemptFinish = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      setShowConfirmSubmitModal(true);
    } else {
      executeFinishAssessment();
    }
  };

  const executeFinishAssessment = () => {
    setShowConfirmSubmitModal(false);
    speech.stop();
    sound.playFanfare();
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.6 }
    });

    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    onSaveScore(finalScore);
    setIsSubmitted(true);
    setShowReview(true);
  };

  const handleReset = () => {
    sound.playClick();
    speech.stop();
    setSelectedAnswers({});
    setExpiredQuestions({});
    setTimeSpent({});
    setIsSubmitted(false);
    setShowReview(false);
    setCurrentIdx(0);
    setIsTimerPaused(false);
    if (timerDuration > 0) {
      setTimeLeft(timerDuration);
    }
  };

  // Calculate live score if submitted
  let correctCount = 0;
  questions.forEach(q => {
    if (selectedAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });
  const calculatedScore = Math.round((correctCount / questions.length) * 100);
  const finalScore = savedScore !== null && !isSubmitted ? savedScore : calculatedScore;

  // Percentage for countdown progress bar
  const progressPercent = timerDuration > 0 ? Math.max(0, Math.min(100, (timeLeft / timerDuration) * 100)) : 100;

  // Timer Color Themes based on urgency
  let timerBadgeTheme = 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-100';
  let timerBarColor = 'bg-emerald-500';

  if (timeLeft <= 10 && !isCurrentAnswered && timerDuration > 0) {
    timerBadgeTheme = 'bg-rose-50 text-rose-700 border-rose-400 ring-rose-200 animate-pulse';
    timerBarColor = 'bg-rose-500';
  } else if (timeLeft <= 20 && !isCurrentAnswered && timerDuration > 0) {
    timerBadgeTheme = 'bg-amber-50 text-amber-800 border-amber-300 ring-amber-100';
    timerBarColor = 'bg-amber-500';
  }

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              speech.stop();
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-display flex items-center gap-2 flex-wrap">
              <span>✍️ Menu Berlatih</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-sans font-bold">
                {questions.length} Soal Asesmen HOTS {theme?.judulTema ? `• ${theme.judulTema}` : ''}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer Settings Button (Visible when taking assessment) */}
          {!isSubmitted && (
            <button
              onClick={() => {
                sound.playClick();
                setShowTimerModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition shadow-2xs cursor-pointer"
              title="Atur durasi timer hitung mundur per soal"
            >
              <Timer className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Timer:</span>
              <span className="text-emerald-700">
                {timerDuration > 0 ? `${timerDuration}s` : 'Non-aktif'}
              </span>
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCertificate();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-100" />
              <span>Cetak Sertifikat Prestasi</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto flex-1 my-4">
        {/* SUMMARY CARD IF SUBMITTED */}
        {isSubmitted && !showReview && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm text-center max-w-2xl mx-auto space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg text-4xl">
              🏆
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Hasil Asesmen HOTS Telah Selesai
              </span>
              <h2 className="text-3xl font-extrabold text-slate-800 mt-2 font-display">
                Nilai Akhir: <span className="text-emerald-600">{finalScore}</span> / 100
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {finalScore >= 80
                  ? `Luar Biasa! Pemahamanmu tentang ${theme?.judulTema || 'materi ini'} sangat hebat!`
                  : finalScore >= 60
                  ? 'Bagus Sekali! Kamu sudah memahami banyak konsep penting dalam tema ini.'
                  : 'Tetap semangat! Yuk baca kembali cerita di Menu Belajar dan coba lagi ya!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-2 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-slate-500 block">Benar</span>
                <span className="text-lg font-bold text-emerald-700">{Math.round((finalScore / 100) * 10)} Soal</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-slate-500 block">Perlu Perbaikan</span>
                <span className="text-lg font-bold text-rose-700">{10 - Math.round((finalScore / 100) * 10)} Soal</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowReview(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lihat Pembahasan Lengkap</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Asesmen</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCertificate();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Unduh E-Sertifikat</span>
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE QUESTION OR REVIEW VIEW */}
        {(!isSubmitted || showReview) && (
          <div className="space-y-4">
            {/* Question Quick Nav Badges (1-10) */}
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Daftar Nomor Soal:</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  ({Object.keys(selectedAnswers).length}/{questions.length} Terjawab)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isExpired = !!expiredQuestions[q.id] && !isAnswered;
                  const isCurrent = idx === currentIdx;

                  let bg = 'bg-slate-100 text-slate-600 hover:bg-slate-200';

                  if (isSubmitted) {
                    const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                    bg = isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white';
                  } else if (isCurrent) {
                    bg = 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400 ring-offset-1 scale-105';
                  } else if (isAnswered) {
                    bg = 'bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300';
                  } else if (isExpired) {
                    bg = 'bg-amber-100 text-amber-800 font-semibold border border-amber-300';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        sound.playClick();
                        setCurrentIdx(idx);
                      }}
                      title={`Soal ${idx + 1}${isAnswered ? ' (Sudah Dijawab)' : isExpired ? ' (Waktu Sempat Habis)' : ''}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center justify-center relative ${bg}`}
                    >
                      <span>{idx + 1}</span>
                      {/* Mini indicator icon for expired without answering */}
                      {!isSubmitted && isExpired && !isAnswered && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-100 shadow-sm space-y-5 animate-in fade-in">
              {/* Question Header & Timer Bar */}
              <div className="space-y-3 border-b border-slate-100 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {currentIdx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Level Kognitif: {currentQ.dimension}
                        </span>
                        {isSubmitted && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedAnswers[currentQ.id] === currentQ.correctAnswer ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {selectedAnswers[currentQ.id] === currentQ.correctAnswer ? 'Jawaban Tepat' : 'Perlu Diperbaiki'}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                        Soal Asesmen HOTS #{currentIdx + 1} dari 10
                      </h3>
                    </div>
                  </div>

                  {/* TIMER DISPLAY WIDGET (Only shown during active assessment) */}
                  {!isSubmitted && (
                    <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                      {timerDuration > 0 ? (
                        <>
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                              isCurrentAnswered
                                ? 'bg-emerald-100/70 text-emerald-900 border-emerald-300'
                                : isCurrentExpired
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : timerBadgeTheme
                            }`}
                          >
                            <Clock
                              className={`w-4 h-4 ${
                                !isCurrentAnswered && !isCurrentExpired && !isTimerPaused ? 'animate-spin-slow' : ''
                              }`}
                            />
                            {isCurrentAnswered ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Terjawab ({timeSpent[currentQ.id] || 0}s)</span>
                              </span>
                            ) : isCurrentExpired ? (
                              <span className="text-amber-800 flex items-center gap-1 font-bold">
                                <span>⏰ Waktu Habis</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <span className="text-slate-500 font-normal">Sisa:</span>
                                <span className="font-mono text-sm tracking-tight">{timeLeft}s</span>
                              </span>
                            )}
                          </div>

                          {/* Pause / Resume Button */}
                          {!isCurrentAnswered && !isCurrentExpired && (
                            <button
                              type="button"
                              onClick={handleTogglePause}
                              title={isTimerPaused ? 'Lanjutkan hitung mundur timer' : 'Jeda timer sebentar'}
                              className={`p-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                                isTimerPaused
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 ring-2 ring-amber-200'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {isTimerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {/* Sound Tick Toggle Button */}
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setIsTickingSoundEnabled(prev => !prev);
                            }}
                            title={isTickingSoundEnabled ? 'Suara detak 5s aktif (Klik untuk matikan)' : 'Suara detak mati (Klik untuk aktifkan)'}
                            className={`p-1.5 rounded-xl border text-xs transition cursor-pointer ${
                              isTickingSoundEnabled
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {isTickingSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                          <Timer className="w-3.5 h-3.5 text-slate-400" />
                          <span>Mode Santai (Tanpa Timer)</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode Review badge when review is active */}
                  {isSubmitted && (
                    <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-medium border border-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mode Pembahasan Asesmen</span>
                    </div>
                  )}
                </div>

                {/* Animated Visual Countdown Bar (Linear progress meter) */}
                {!isSubmitted && timerDuration > 0 && !isCurrentAnswered && (
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
                      <div
                        className={`h-full transition-all duration-1000 ease-linear rounded-full ${timerBarColor}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {isTimerPaused && (
                      <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                        <span>⏸️ Timer sedang dijeda. Klik tombol putar (▶) untuk melanjutkan hitung mundur.</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Time's up banner notification if expired on this question without answering */}
              {!isSubmitted && isCurrentExpired && !isCurrentAnswered && (
                <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center text-xl shrink-0">
                      ⏰
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-xs sm:text-sm">
                        Waktu untuk Soal #{currentIdx + 1} Telah Habis!
                      </h4>
                      <p className="text-[11px] sm:text-xs text-amber-800">
                        Tenang, kamu bisa menambah waktu ekstra jika butuh waktu berpikir lagi, atau langsung lanjut ke soal berikutnya.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleAddExtraTime}
                      className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>+30 Detik Tambahan</span>
                    </button>
                    {currentIdx < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setCurrentIdx(prev => prev + 1);
                        }}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>Soal Berikutnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAttemptFinish}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs"
                      >
                        Selesaikan
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Case Story Stimulus with TTS Audio Narration */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-slate-800 text-xs sm:text-sm leading-relaxed space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Stimulus Kasus Kontekstual:</span>
                  </span>

                  <SpeechButton
                    id={`stimulus-q-${currentQ.id}`}
                    textToSpeak={`Kasus untuk soal nomor ${currentIdx + 1}: ${currentQ.caseStory}`}
                    label="Dengarkan Cerita Kasus"
                    size="sm"
                    variant="secondary"
                  />
                </div>
                <p className="italic font-medium text-slate-800 bg-white/70 p-3 rounded-xl border border-emerald-200/60">
                  "{currentQ.caseStory}"
                </p>
              </div>

              {/* Question text with TTS Audio */}
              <div className="flex items-start justify-between gap-2 pt-1">
                <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{currentQ.question}</span>
                </div>
                <SpeechButton
                  id={`question-text-${currentQ.id}`}
                  textToSpeak={`Pertanyaan: ${currentQ.question}`}
                  label="Dengarkan Soal"
                  size="sm"
                  variant="ghost"
                  showIconOnly
                />
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  const isCorrect = optIdx === currentQ.correctAnswer;

                  let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-300';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-current'}`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation in Review Mode */}
              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pembahasan &amp; Kunci Jawaban Resmi:</span>
                    </div>

                    <SpeechButton
                      id={`explanation-q-${currentQ.id}`}
                      textToSpeak={`Pembahasan: ${currentQ.explanation}`}
                      label="Dengarkan Pembahasan"
                      size="sm"
                      variant="amber"
                    />
                  </div>
                  <p className="text-slate-200 leading-relaxed font-normal pt-1">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => {
                    sound.playClick();
                    setCurrentIdx(prev => prev - 1);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Soal Sebelumnya
                </button>

                <div className="flex items-center gap-2">
                  {currentIdx < questions.length - 1 ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setCurrentIdx(prev => prev + 1);
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Soal Berikutnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : !isSubmitted ? (
                    <button
                      onClick={handleAttemptFinish}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kirim &amp; Selesaikan Asesmen</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowReview(false);
                      }}
                      className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Tutup Pembahasan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Timer Configuration Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  ⏱️
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    Pengaturan Timer Soal
                  </h3>
                  <p className="text-xs text-slate-500">Pilih durasi hitung mundur per soal HOTS</p>
                </div>
              </div>
              <button
                onClick={() => setShowTimerModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {TIMER_PRESETS.map(preset => {
                const isSelected = timerDuration === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleChangeTimerPreset(preset.value)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{preset.label}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            preset.value === 60
                              ? 'bg-emerald-100 text-emerald-800'
                              : preset.value === 45
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sound Tick Toggle inside modal */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Suara Detik 5 Detik Terakhir:</span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsTickingSoundEnabled(prev => !prev);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isTickingSoundEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isTickingSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isTickingSoundEnabled ? 'Suara Aktif' : 'Mati'}</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowTimerModal(false)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Terapkan &amp; Lanjutkan Latihan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal when submitting early */}
      {showConfirmSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-amber-200 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Belum Semua Soal Terjawab!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Kamu baru menjawab{' '}
                <span className="font-bold text-emerald-700">
                  {Object.keys(selectedAnswers).length} dari 10 soal
                </span>
                . Apakah kamu yakin ingin mengakhiri asesmen sekarang?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirmSubmitModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Lanjut Mengerjakan
              </button>
              <button
                onClick={executeFinishAssessment}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-200">
        <span>MPI Lumi IPAS SD Kelas 3 • Menu Berlatih HOTS dengan Timer Cerdas</span>
        <span>Asesmen Kompetensi Kurikulum Merdeka Fase B</span>
      </footer>
    </div>
  );
};
