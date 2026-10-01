import { LeaderboardEntry, StudentInfo } from '../types';

export const INITIAL_LEADERBOARD_SEEDS: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    name: 'Aisyah Putri Rahmadhani',
    className: '3A',
    studentNumber: '04',
    score: 100,
    date: 'Hari ini',
  },
  {
    id: 'seed-2',
    name: 'Budi Kurniawan Pratama',
    className: '3B',
    studentNumber: '11',
    score: 90,
    date: 'Hari ini',
  },
  {
    id: 'seed-3',
    name: 'Citra Kirana Wulandari',
    className: '3A',
    studentNumber: '17',
    score: 90,
    date: 'Kemarin',
  },
  {
    id: 'seed-4',
    name: 'Dewi Anindya Sartika',
    className: '3C',
    studentNumber: '08',
    score: 80,
    date: 'Kemarin',
  },
  {
    id: 'seed-5',
    name: 'Eko Wahyu Prasetyo',
    className: '3A',
    studentNumber: '22',
    score: 80,
    date: '2 hari lalu',
  },
];

export const getThemeLeaderboardKey = (themeId: string = 'dahulu_kini_nanti'): string => {
  return `mpi_lumi_leaderboard_${themeId}`;
};

export const getLeaderboardData = (
  themeId: string = 'dahulu_kini_nanti',
  currentStudent?: StudentInfo | null,
  currentScore?: number | null
): LeaderboardEntry[] => {
  let entries: LeaderboardEntry[] = [];
  const storageKey = getThemeLeaderboardKey(themeId);

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      entries = JSON.parse(raw);
    } else if (themeId === 'dahulu_kini_nanti') {
      const legacyRaw = localStorage.getItem('mpi_lumi_leaderboard');
      if (legacyRaw) {
        entries = JSON.parse(legacyRaw);
      } else {
        entries = [...INITIAL_LEADERBOARD_SEEDS];
        localStorage.setItem(storageKey, JSON.stringify(entries));
      }
    } else {
      entries = [...INITIAL_LEADERBOARD_SEEDS];
      localStorage.setItem(storageKey, JSON.stringify(entries));
    }
  } catch {
    entries = [...INITIAL_LEADERBOARD_SEEDS];
  }

  // If current student has recorded a score, guarantee their entry is merged/updated
  if (currentStudent && currentScore !== null && currentScore !== undefined) {
    const existingIndex = entries.findIndex(
      (e) =>
        e.isCurrentUser ||
        (e.name.toLowerCase() === currentStudent.name.toLowerCase() &&
          e.className === currentStudent.className)
    );

    const currentUserEntry: LeaderboardEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : 'user-' + Date.now(),
      name: currentStudent.name,
      className: currentStudent.className,
      studentNumber: currentStudent.studentNumber,
      score: Math.max(existingIndex >= 0 ? entries[existingIndex].score : 0, currentScore),
      date: 'Terbaru',
      isCurrentUser: true,
      avatarUrl: currentStudent.avatarUrl,
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = currentUserEntry;
    } else {
      entries.push(currentUserEntry);
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
      if (themeId === 'dahulu_kini_nanti') {
        localStorage.setItem('mpi_lumi_leaderboard', JSON.stringify(entries));
      }
    } catch {
      // Ignore
    }
  }

  // Sort descending by score
  entries.sort((a, b) => b.score - a.score);

  return entries;
};

export const saveScoreToLeaderboard = (
  themeIdOrStudent: string | StudentInfo = 'dahulu_kini_nanti',
  studentOrScore?: StudentInfo | number,
  scoreParam?: number
): LeaderboardEntry[] => {
  let themeId = 'dahulu_kini_nanti';
  let student: StudentInfo | undefined;
  let newScore: number | undefined;

  if (typeof themeIdOrStudent === 'string') {
    themeId = themeIdOrStudent;
    student = studentOrScore as StudentInfo | undefined;
    newScore = scoreParam;
  } else {
    student = themeIdOrStudent;
    newScore = typeof studentOrScore === 'number' ? studentOrScore : undefined;
  }

  return getLeaderboardData(themeId, student, newScore);
};
