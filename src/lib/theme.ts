export type AccentHex = '#F97316' | '#22D3EE' | '#4ADE80' | '#8B5CF6';
export type ThemeMode = 'dark' | 'light';

export interface ThemePrefs {
  mode: ThemeMode;
  accent: AccentHex;
}

const ACCENT_HSL: Record<AccentHex, string> = {
  '#F97316': '25 95% 53%',
  '#22D3EE': '190 91% 52%',
  '#4ADE80': '142 71% 58%',
  '#8B5CF6': '262 83% 58%',
};

export function getThemePrefs(): ThemePrefs {
  try {
    const s = localStorage.getItem('fl_theme');
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return { mode: 'dark', accent: '#F97316' };
}

export function saveThemePrefs(prefs: ThemePrefs): void {
  localStorage.setItem('fl_theme', JSON.stringify(prefs));
}

export function applyTheme(prefs: ThemePrefs): void {
  const root = document.documentElement;

  if (prefs.mode === 'light') {
    root.classList.add('light');
  } else {
    root.classList.remove('light');
  }

  const hsl = ACCENT_HSL[prefs.accent] ?? ACCENT_HSL['#F97316'];
  root.style.setProperty('--primary', hsl);
  root.style.setProperty('--ring', hsl);
  root.style.setProperty('--sidebar-primary', hsl);
  root.style.setProperty('--sidebar-ring', hsl);
  root.style.setProperty('--chart-1', hsl);
}
