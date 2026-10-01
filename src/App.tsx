/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveScreen,
  StudentInfo,
  ReflectionData,
  DeveloperProfile,
  SectionProgress,
  AchievementBadge,
  ThemeConfig,
} from './types';
import { DEFAULT_DEVELOPER } from './data/appData';
import { ACHIEVEMENT_BADGES } from './data/achievementBadges';
import { getActiveTheme, setActiveThemeId } from './data/themes';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ThemeSelectScreen } from './components/ThemeSelectScreen';
import { ThemeGeneratorModal } from './components/ThemeGeneratorModal';
import { StudentRegistration } from './components/StudentRegistration';
import { MainMenu } from './components/MainMenu';
import { BelajarMenu } from './components/BelajarMenu';
import { BermainMenu } from './components/BermainMenu';
import { BerlatihMenu } from './components/BerlatihMenu';
import { RefleksiMenu } from './components/RefleksiMenu';
import { SumberBelajarMenu } from './components/SumberBelajarMenu';
import { PengembangMenu } from './components/PengembangMenu';
import { SertifikatModal } from './components/SertifikatModal';
import { TeacherPromptModal } from './components/TeacherPromptModal';
import { BadgeUnlockedToast } from './components/BadgeUnlockedToast';
import { AudioToggle } from './components/AudioToggle';
import { sound } from './utils/audio';
import { speech } from './utils/speech';
import { saveScoreToLeaderboard } from './utils/leaderboard';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('welcome');
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(() => getActiveTheme());
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [developer, setDeveloper] = useState<DeveloperProfile>(DEFAULT_DEVELOPER);
  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const [hotsScore, setHotsScore] = useState<number | null>(null);
  const [progress, setProgress] = useState<SectionProgress>({
    belajar: false,
    bermain: false,
    berlatih: false,
    refleksi: false,
  });

  // Modals
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isPromptGuideOpen, setIsPromptGuideOpen] = useState(false);
  const [isThemeGeneratorOpen, setIsThemeGeneratorOpen] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<AchievementBadge | null>(null);

  // Helper to load theme-specific state (progress, score, reflection)
  const loadThemeState = (themeId: string) => {
    try {
      // 1. HOTS Score
      let savedScore = localStorage.getItem(`mpi_lumi_hots_score_${themeId}`);
      if (savedScore === null && themeId === 'dahulu_kini_nanti') {
        savedScore = localStorage.getItem('mpi_lumi_hots_score');
      }
      const scoreVal = savedScore !== null ? Number(savedScore) : null;
      setHotsScore(scoreVal);

      // 2. Reflection
      let savedRefl = localStorage.getItem(`mpi_lumi_reflection_${themeId}`);
      if (!savedRefl && themeId === 'dahulu_kini_nanti') {
        savedRefl = localStorage.getItem('mpi_lumi_reflection');
      }
      let reflData: ReflectionData | null = null;
      if (savedRefl) {
        try {
          reflData = JSON.parse(savedRefl);
        } catch {
          // Ignore
        }
      }
      setReflection(reflData);

      // 3. Progress
      let savedProg = localStorage.getItem(`mpi_lumi_progress_${themeId}`);
      if (!savedProg && themeId === 'dahulu_kini_nanti') {
        savedProg = localStorage.getItem('mpi_lumi_progress');
      }
      let initialProgress: SectionProgress = {
        belajar: false,
        bermain: false,
        berlatih: scoreVal !== null,
        refleksi: reflData !== null,
      };

      if (savedProg) {
        try {
          const parsed = JSON.parse(savedProg);
          initialProgress = {
            ...initialProgress,
            ...parsed,
            berlatih: scoreVal !== null || parsed.berlatih,
            refleksi: reflData !== null || parsed.refleksi,
          };
        } catch {
          // Ignore
        }
      }

      setProgress(initialProgress);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Initial load of developer, student, and active theme state
  useEffect(() => {
    try {
      const savedDev = localStorage.getItem('mpi_lumi_developer');
      let currentDev = DEFAULT_DEVELOPER;
      if (savedDev) {
        try {
          currentDev = JSON.parse(savedDev);
          setDeveloper(currentDev);
        } catch {
          // Ignore
        }
      }

      const savedStudent = localStorage.getItem('mpi_lumi_student');
      if (savedStudent) {
        try {
          const parsedStudent = JSON.parse(savedStudent);
          if (!parsedStudent.avatarUrl && currentDev.avatarUrl) {
            parsedStudent.avatarUrl = currentDev.avatarUrl;
          }
          setStudent(parsedStudent);
        } catch {
          // Ignore
        }
      }

      // Load state for current active theme
      const currentTheme = getActiveTheme();
      setActiveTheme(currentTheme);
      loadThemeState(currentTheme.id);
    } catch {
      // Ignore
    }
  }, []);

  // Global Audio Setup: Auto-Ducking on TTS and First-Gesture Audio Activation
  useEffect(() => {
    const unsubSpeech = speech.subscribe((speakingId) => {
      sound.duckBacksound(speakingId !== null);
    });

    const handleFirstGesture = () => {
      sound.initContext();
      if (sound.getBacksoundEnabled() && !sound.getMuted() && !sound.getBacksoundPlaying()) {
        sound.startBacksound();
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      unsubSpeech();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Stop any active text-to-speech when switching screens
  useEffect(() => {
    speech.stop();
  }, [activeScreen]);

  const handleSelectTheme = (selectedTheme: ThemeConfig) => {
    setActiveThemeId(selectedTheme.id);
    setActiveTheme(selectedTheme);
    loadThemeState(selectedTheme.id);

    // Keep on the welcome screen so user sees the newly chosen theme,
    // and only enters next menu when clicking 'Mulai Belajar'
    setActiveScreen('welcome');
    sound.playCorrect();
  };

  const handleMarkSectionComplete = (section: keyof SectionProgress) => {
    setProgress((prev) => {
      if (prev[section]) return prev;
      const next = { ...prev, [section]: true };
      try {
        localStorage.setItem(`mpi_lumi_progress_${activeTheme.id}`, JSON.stringify(next));
        if (activeTheme.id === 'dahulu_kini_nanti') {
          localStorage.setItem('mpi_lumi_progress', JSON.stringify(next));
        }
      } catch {
        // Ignore
      }

      // Find badge for this section in active theme badges or default
      const themeBadges = activeTheme.badges && activeTheme.badges.length > 0
        ? activeTheme.badges
        : ACHIEVEMENT_BADGES;
      const badge = themeBadges.find((b) => b.section === section);
      if (badge) {
        setNewlyUnlockedBadge(badge);
        sound.playFanfare();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      // Check if this action completes all 4 sections
      const wasAllComplete = prev.belajar && prev.bermain && prev.berlatih && prev.refleksi;
      const isNowAllComplete = next.belajar && next.bermain && next.berlatih && next.refleksi;
      if (!wasAllComplete && isNowAllComplete) {
        setTimeout(() => {
          const grandMaster = themeBadges.find((b) => b.section === 'grand_master');
          if (grandMaster) {
            setNewlyUnlockedBadge(grandMaster);
            sound.playFanfare();
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.5 },
            });
          }
        }, 1200);
      }

      return next;
    });
  };

  const handleRegisterStudent = (data: StudentInfo) => {
    const studentWithAvatar: StudentInfo = {
      ...data,
      avatarUrl: data.avatarUrl || developer.avatarUrl || DEFAULT_DEVELOPER.avatarUrl,
    };
    setStudent(studentWithAvatar);
    try {
      localStorage.setItem('mpi_lumi_student', JSON.stringify(studentWithAvatar));
    } catch {
      // Ignore
    }
    setActiveScreen('home');
  };

  const handleUpdateDeveloper = (updated: DeveloperProfile) => {
    setDeveloper(updated);
    try {
      localStorage.setItem('mpi_lumi_developer', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    if (student) {
      const updatedStudent: StudentInfo = {
        ...student,
        avatarUrl: updated.avatarUrl,
      };
      setStudent(updatedStudent);
      try {
        localStorage.setItem('mpi_lumi_student', JSON.stringify(updatedStudent));
      } catch {
        // Ignore
      }
    }
  };

  const handleSaveReflection = (data: ReflectionData) => {
    setReflection(data);
    handleMarkSectionComplete('refleksi');
    try {
      localStorage.setItem(`mpi_lumi_reflection_${activeTheme.id}`, JSON.stringify(data));
      if (activeTheme.id === 'dahulu_kini_nanti') {
        localStorage.setItem('mpi_lumi_reflection', JSON.stringify(data));
      }
    } catch {
      // Ignore
    }
  };

  const handleSaveScore = (score: number) => {
    setHotsScore(score);
    handleMarkSectionComplete('berlatih');
    try {
      localStorage.setItem(`mpi_lumi_hots_score_${activeTheme.id}`, String(score));
      if (activeTheme.id === 'dahulu_kini_nanti') {
        localStorage.setItem('mpi_lumi_hots_score', String(score));
      }
      if (student) {
        saveScoreToLeaderboard(activeTheme.id, student, score);
      }
    } catch {
      // Ignore
    }
  };

  const handleOpenCertificate = () => {
    sound.playClick();
    if (!student) {
      setActiveScreen('registration');
      return;
    }
    setIsCertificateOpen(true);
  };

  return (
    <div className="min-h-screen bg-rose-50/40 text-slate-800 flex flex-col font-sans select-none">
      {/* SCREEN 1: Welcome Screen (Halaman Awal & Mulai Belajar / Start) */}
      {activeScreen === 'welcome' && (
        <WelcomeScreen
          theme={activeTheme}
          onStart={() => {
            if (student) {
              setActiveScreen('home');
            } else {
              setActiveScreen('registration');
            }
          }}
          onSelectTheme={() => setActiveScreen('theme_select')}
          onOpenPromptGuide={() => setIsPromptGuideOpen(true)}
        />
      )}

      {/* SCREEN 2: Theme Selection Screen (PILIH TEMA BELAJAR - Multi-Tema) */}
      {activeScreen === 'theme_select' && (
        <ThemeSelectScreen
          currentThemeId={activeTheme.id}
          onSelectTheme={handleSelectTheme}
          onOpenGenerator={() => setIsThemeGeneratorOpen(true)}
          onBackToWelcome={() => setActiveScreen('welcome')}
        />
      )}

      {/* SCREEN 3: Student Registration (Wajib Masukan Nama & Kelas) */}
      {activeScreen === 'registration' && (
        <StudentRegistration
          initialData={student}
          onSubmit={handleRegisterStudent}
          onBack={() => setActiveScreen('welcome')}
        />
      )}

      {/* SCREEN 4: Halaman Beranda Menu Pilihan Desain Menu Love (3 Baris) */}
      {activeScreen === 'home' && student && (
        <MainMenu
          student={student}
          developer={developer}
          progress={progress}
          theme={activeTheme}
          onChangeTheme={() => setActiveScreen('theme_select')}
          onNavigate={(screen) => setActiveScreen(screen)}
          onOpenCertificate={handleOpenCertificate}
          onOpenPromptGuide={() => setIsPromptGuideOpen(true)}
          onChangeStudent={() => setActiveScreen('registration')}
          onUpdateDeveloper={handleUpdateDeveloper}
          onUpdateStudent={(updatedStudent) => {
            setStudent(updatedStudent);
            try {
              localStorage.setItem('mpi_lumi_student', JSON.stringify(updatedStudent));
            } catch {
              // Ignore
            }
          }}
          completedHots={hotsScore !== null}
          hotsScore={hotsScore}
        />
      )}

      {/* SUB-SCREENS */}
      {activeScreen === 'belajar' && (
        <BelajarMenu
          theme={activeTheme}
          onBack={() => setActiveScreen('home')}
          onGoToBermain={() => {
            handleMarkSectionComplete('belajar');
            setActiveScreen('bermain');
          }}
          onMarkCompleted={() => handleMarkSectionComplete('belajar')}
          isCompleted={progress.belajar}
        />
      )}

      {activeScreen === 'bermain' && (
        <BermainMenu
          theme={activeTheme}
          onBack={() => setActiveScreen('home')}
          onGoToBerlatih={() => {
            handleMarkSectionComplete('bermain');
            setActiveScreen('berlatih');
          }}
          onMarkCompleted={() => handleMarkSectionComplete('bermain')}
          isCompleted={progress.bermain}
        />
      )}

      {activeScreen === 'berlatih' && (
        <BerlatihMenu
          theme={activeTheme}
          onBack={() => setActiveScreen('home')}
          onSaveScore={handleSaveScore}
          onOpenCertificate={handleOpenCertificate}
          savedScore={hotsScore}
        />
      )}

      {activeScreen === 'refleksi' && (
        <RefleksiMenu
          theme={activeTheme}
          onBack={() => setActiveScreen('home')}
          savedReflection={reflection}
          onSaveReflection={handleSaveReflection}
        />
      )}

      {activeScreen === 'sumber' && (
        <SumberBelajarMenu theme={activeTheme} onBack={() => setActiveScreen('home')} />
      )}

      {activeScreen === 'pengembang' && (
        <PengembangMenu
          onBack={() => setActiveScreen('home')}
          developer={developer}
          onUpdateDeveloper={handleUpdateDeveloper}
        />
      )}

      {/* MODAL 1: Sertifikat Hasil Belajar (Baris 3 Menu Sertifikat) */}
      {student && (
        <SertifikatModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          student={student}
          developer={developer}
          score={hotsScore}
          theme={activeTheme}
        />
      )}

      {/* MODAL 2: Panduan & Prompt Guru MPI Lumi */}
      <TeacherPromptModal
        isOpen={isPromptGuideOpen}
        onClose={() => setIsPromptGuideOpen(false)}
      />

      {/* MODAL 3: Popup Lencana Pencapaian Baru Terbuka */}
      <BadgeUnlockedToast
        badge={newlyUnlockedBadge}
        onClose={() => setNewlyUnlockedBadge(null)}
      />

      {/* MODAL 4: Generator Tema Kustom (Mode Guru) */}
      <ThemeGeneratorModal
        isOpen={isThemeGeneratorOpen}
        onClose={() => setIsThemeGeneratorOpen(false)}
        onThemeCreated={(createdTheme) => {
          setIsThemeGeneratorOpen(false);
          handleSelectTheme(createdTheme);
        }}
      />

      {/* Floating Audio Controller on Sub-Screens */}
      {activeScreen !== 'welcome' && activeScreen !== 'home' && activeScreen !== 'theme_select' && (
        <div className="fixed bottom-4 right-4 z-40">
          <AudioToggle />
        </div>
      )}
    </div>
  );
}
