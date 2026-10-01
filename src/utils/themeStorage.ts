import { SectionProgress, ReflectionData } from '../types';

export function getThemeProgress(themeId: string): SectionProgress {
  const key = `mpi_lumi_progress_${themeId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
    // Fallback for default theme to legacy key
    if (themeId === 'dahulu_kini_nanti') {
      const legacyRaw = localStorage.getItem('mpi_lumi_progress');
      if (legacyRaw) {
        return JSON.parse(legacyRaw);
      }
    }
  } catch {
    // Ignore
  }
  return {
    belajar: false,
    bermain: false,
    berlatih: false,
    refleksi: false,
  };
}

export function saveThemeProgress(themeId: string, progress: SectionProgress): void {
  const key = `mpi_lumi_progress_${themeId}`;
  try {
    localStorage.setItem(key, JSON.stringify(progress));
    if (themeId === 'dahulu_kini_nanti') {
      localStorage.setItem('mpi_lumi_progress', JSON.stringify(progress));
    }
  } catch {
    // Ignore
  }
}

export function getThemeHotsScore(themeId: string): number | null {
  const key = `mpi_lumi_hots_score_${themeId}`;
  try {
    const val = localStorage.getItem(key);
    if (val !== null) {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }
    if (themeId === 'dahulu_kini_nanti') {
      const legacyVal = localStorage.getItem('mpi_lumi_hots_score');
      if (legacyVal !== null) {
        const num = Number(legacyVal);
        return isNaN(num) ? null : num;
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

export function saveThemeHotsScore(themeId: string, score: number): void {
  const key = `mpi_lumi_hots_score_${themeId}`;
  try {
    localStorage.setItem(key, String(score));
    if (themeId === 'dahulu_kini_nanti') {
      localStorage.setItem('mpi_lumi_hots_score', String(score));
    }
  } catch {
    // Ignore
  }
}

export function getThemeReflection(themeId: string): ReflectionData | null {
  const key = `mpi_lumi_reflection_${themeId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
    if (themeId === 'dahulu_kini_nanti') {
      const legacyRaw = localStorage.getItem('mpi_lumi_reflection');
      if (legacyRaw) {
        return JSON.parse(legacyRaw);
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

export function saveThemeReflection(themeId: string, data: ReflectionData): void {
  const key = `mpi_lumi_reflection_${themeId}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (themeId === 'dahulu_kini_nanti') {
      localStorage.setItem('mpi_lumi_reflection', JSON.stringify(data));
    }
  } catch {
    // Ignore
  }
}
