import { ThemeConfig } from '../../types';
import { DAHULU_KINI_NANTI_THEME } from './dahuluKiniNanti';
import { TUBUHKU_BERHARGA_THEME } from './tubuhkuBerharga';

export const BUILT_IN_THEMES: ThemeConfig[] = [
  DAHULU_KINI_NANTI_THEME,
  TUBUHKU_BERHARGA_THEME,
];

export const CUSTOM_THEMES_STORAGE_KEY = 'mpi_lumi_custom_themes';
export const ACTIVE_THEME_STORAGE_KEY = 'mpi_lumi_active_theme';

export function getCustomThemes(): ThemeConfig[] {
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAllThemes(): ThemeConfig[] {
  const custom = getCustomThemes();
  return [...BUILT_IN_THEMES, ...custom];
}

export function getThemeById(id?: string | null): ThemeConfig {
  if (!id) return DAHULU_KINI_NANTI_THEME;
  const all = getAllThemes();
  const found = all.find((t) => t.id === id);
  return found || DAHULU_KINI_NANTI_THEME;
}

export function getActiveTheme(): ThemeConfig {
  try {
    const activeId = localStorage.getItem(ACTIVE_THEME_STORAGE_KEY);
    return getThemeById(activeId);
  } catch {
    return DAHULU_KINI_NANTI_THEME;
  }
}

export function setActiveThemeId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_THEME_STORAGE_KEY, id);
  } catch {
    // Ignore
  }
}

export function saveCustomTheme(theme: ThemeConfig): void {
  try {
    const existing = getCustomThemes();
    const filtered = existing.filter((t) => t.id !== theme.id);
    const updated = [theme, ...filtered];
    localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

export function deleteCustomTheme(id: string): void {
  try {
    const existing = getCustomThemes();
    const updated = existing.filter((t) => t.id !== id);
    localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(updated));
    const activeId = localStorage.getItem(ACTIVE_THEME_STORAGE_KEY);
    if (activeId === id) {
      setActiveThemeId(DAHULU_KINI_NANTI_THEME.id);
    }
  } catch {
    // Ignore
  }
}
