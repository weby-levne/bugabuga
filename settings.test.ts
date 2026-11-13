import { afterEach, describe, expect, it } from 'vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../storage/settings';

afterEach(() => localStorage.clear());

describe('local settings', () => {
  it('uses safe defaults when no local data exists', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
  it('persists settings on this device only', () => {
    saveSettings({ graphics: 'quality', soundEnabled: false });
    expect(loadSettings()).toEqual({ graphics: 'quality', soundEnabled: false });
  });
  it('recovers from malformed local data', () => {
    localStorage.setItem('dss.local.settings.v1', '{broken');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
