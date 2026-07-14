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
    expect(source).toContain(
      'schedulePostLaunchAppPreload({ homeReady: !showSkeleton })'
    );
    expect(source).not.toContain(
      'setTimeout(() => setOverlaysMounted(true), 80)'
    );
    expect(source).not.toContain(
      "import TemplatesModalSection from './components/HabitsModals/TemplatesModalSection'"
    );
    expect(source).not.toContain(
      "import TemplatesScreen from '../../screens/TemplatesScreen'"
    );
  });

  it('loads secondary modal sections through React.lazy', () => {
    const source = readSource('components/HabitsModals/HabitsModals.lazy.ts');

    expect(source).toContain("import('./SettingsModalSection')");
    expect(source).toContain("import('./CalendarAndDetailModals')");
    expect(source).toContain("import('./TemplatesModalSection')");
  });

  it('warms habit library code in the frequent post-ready preload tier', () => {
    const source = readSource('postLaunchPreload.ts');
    const frequentTier = source.slice(
      source.indexOf('export function preloadFrequentAppParts'),
      source.indexOf('export function preloadSecondaryAppParts')
    );

    expect(frequentTier).toContain("import('./components/HabitsAppOverlays')");
    expect(frequentTier).toContain("import('../../screens/TemplatesScreen')");
    expect(frequentTier).toContain(
      "import('./components/HabitsModals/TemplatesModalSection')"
    );
    expect(source).toContain('if (!homeReady || shouldSkipPreload())');
  });

  it('keeps paywall and settings in the delayed secondary preload tier', () => {
    const source = readSource('postLaunchPreload.ts');
    const secondaryTier = source.slice(
      source.indexOf('export function preloadSecondaryAppParts'),
      source.indexOf('export async function preloadPostLaunchAppParts')
    );

    expect(source).toContain('SECONDARY_PRELOAD_DELAY_MS = 2500');
    expect(source).toContain('preloadFrequentAppParts');
    expect(source).toContain('preloadSecondaryAppParts');
    expect(secondaryTier).toContain(
      "import('../../components/RevenueCatPaywall')"
    );
    expect(secondaryTier).toContain("import('../../components/SettingsModal')");
    expect(secondaryTier).not.toContain(
      "import('../../screens/TemplatesScreen')"
    );
    expect(secondaryTier).not.toContain(
      "import('./components/HabitsModals/TemplatesModalSection')"
    );
  });

  it('instruments Habit Library click-to-visible timing without changing preload behavior', () => {
    const bottomActionBar = readSource(
      'components/BottomActionBar/BottomActionBar.tsx'
    );
    const modalState = readSource('hooks/buildModalsStateReturnValue.ts');
    const templatesModal = readSource(
      'components/HabitsModals/TemplatesModalSection.tsx'
    );

    expect(bottomActionBar).toContain('markTemplatesModalOpenIntent');
    expect(bottomActionBar).toContain("'bottomActionBar'");
    expect(modalState).toContain('markTemplatesModalOpenIntent');
    expect(modalState).toContain("'modalState'");
    expect(templatesModal).toContain('captureTemplatesModalFirstVisible');
  });
});
