import fs from 'node:fs';
import path from 'node:path';

const HABITS_ROOT = path.resolve(__dirname, '..');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(HABITS_ROOT, relativePath), 'utf8');
}

describe('overlay startup performance contract', () => {
  it('keeps the overlay bundle out of the eager HabitsApp import graph', () => {
    const source = readSource('HabitsApp.tsx');

    expect(source).toContain("import('./components/HabitsAppOverlays')");
    expect(source).not.toContain(
      'setTimeout(() => setOverlaysMounted(true), 80)'
    );
  });

  it('loads secondary modal sections through React.lazy', () => {
    const source = readSource('components/HabitsModals/HabitsModals.lazy.ts');

    expect(source).toContain("import('./SettingsModalSection')");
    expect(source).toContain("import('./CalendarAndDetailModals')");
    expect(source).toContain("import('./TemplatesModalSection')");
  });

  it('delays the secondary preload tier', () => {
    const source = readSource('postLaunchPreload.ts');

    expect(source).toContain('SECONDARY_PRELOAD_DELAY_MS = 2500');
    expect(source).toContain('preloadFrequentAppParts');
    expect(source).toContain('preloadSecondaryAppParts');
  });
});
