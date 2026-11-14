export type GraphicsPreset = 'performance' | 'balanced' | 'quality';

export interface LocalSettings {
  graphics: GraphicsPreset;
  soundEnabled: boolean;
}

const SETTINGS_KEY = 'dss.local.settings.v1';
export const DEFAULT_SETTINGS: LocalSettings = {
  graphics: 'performance',
  soundEnabled: true,
};

export function loadSettings(): LocalSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_SETTINGS;
    const value = parsed as Partial<LocalSettings>;
    return {
      graphics: value.graphics === 'balanced' || value.graphics === 'quality' ? value.graphics : 'performance',
      soundEnabled: typeof value.soundEnabled === 'boolean' ? value.soundEnabled : true,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: LocalSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be disabled or full; the current session can still continue.
  }
}
