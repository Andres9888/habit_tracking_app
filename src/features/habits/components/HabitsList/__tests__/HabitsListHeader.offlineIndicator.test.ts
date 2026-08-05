/**
 * HabitsListHeader - OfflineIndicator Integration Tests (Task T027)
 *
 * These tests verify the integration of the OfflineIndicator in the habits header.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 1:
 * "Given no connectivity, When viewing habits, Then subtle offline indicator visible"
 *
 * @see docs/offline-habit-sync.md T027
 */

import * as fs from 'fs';
import * as path from 'path';

describe('HabitsListHeader - OfflineIndicator Integration (Code Verification)', () => {
  const habitsListHeaderPath = path.resolve(
    __dirname,
    '../HabitsListHeader.tsx'
  );
  let habitsListHeaderSource: string;

  beforeAll(() => {
    habitsListHeaderSource = fs.readFileSync(habitsListHeaderPath, 'utf-8');
  });

  describe('Import Integration', () => {
    it('should import OfflineIndicator from SyncStatus components', () => {
      expect(habitsListHeaderSource).toContain(
        "import { OfflineIndicator } from '../../../../components/SyncStatus'"
      );
    });

    it('should import useHabitsListHeaderComputed hook', () => {
      expect(habitsListHeaderSource).toContain(
        "import { useHabitsListHeaderComputed } from './useHabitsListHeaderComputed'"
      );
    });
  });

  describe('Hook Usage', () => {
    it('should destructure isOffline from useHabitsListHeaderComputed', () => {
      expect(habitsListHeaderSource).toMatch(
        /\{\s*[\s\S]*isOffline[\s\S]*\}\s*=\s*\n?\s*useHabitsListHeaderComputed/
      );
    });
  });

  describe('OfflineIndicator Rendering', () => {
    it('should render OfflineIndicator component', () => {
      expect(habitsListHeaderSource).toContain('<OfflineIndicator');
    });

    it('should pass visible prop based on isOffline state', () => {
      expect(habitsListHeaderSource).toContain('visible={isOffline}');
    });

    it('should have testID for testing', () => {
      expect(habitsListHeaderSource).toContain(
        "testID='habits-offline-indicator'"
      );
    });

    it('should be positioned at top with absolute positioning', () => {
      expect(habitsListHeaderSource).toContain('absolute');
      expect(habitsListHeaderSource).toContain('top-4');
    });

    it('should be centered horizontally', () => {
      expect(habitsListHeaderSource).toContain('justify-center');
    });

    it('should have z-index for proper layering', () => {
      expect(habitsListHeaderSource).toContain('z-10');
    });
  });

  describe('Documentation', () => {
    it('should have JSDoc mentioning US3', () => {
      expect(habitsListHeaderSource).toContain('US3');
    });

    it('should have comment explaining offline indicator placement', () => {
      expect(habitsListHeaderSource).toContain('offline indicator');
    });
  });
});

describe('useHabitsListHeaderComputed - Offline Detection (Code Verification)', () => {
  const hookPath = path.resolve(__dirname, '../useHabitsListHeaderComputed.ts');
  let hookSource: string;

  beforeAll(() => {
    hookSource = fs.readFileSync(hookPath, 'utf-8');
  });

  describe('Import Integration', () => {
    it('should import useIsOnline from NetworkStatusContext', () => {
      expect(hookSource).toContain(
        "import { useIsOnline } from '../../../../contexts/NetworkStatusContext'"
      );
    });
  });

  describe('Hook Implementation', () => {
    it('should call useIsOnline hook', () => {
      expect(hookSource).toContain('const isOnline = useIsOnline()');
    });

    it('should derive isOffline from isOnline', () => {
      expect(hookSource).toContain('const isOffline = !isOnline');
    });

    it('should return isOffline in result', () => {
      expect(hookSource).toContain('isOffline,');
    });
  });

  describe('Return Type', () => {
    it('should define isOffline in UseHabitsListHeaderComputedResult', () => {
      expect(hookSource).toContain('isOffline: boolean');
    });
  });
});

describe('OfflineIndicator Component Contract', () => {
  it('should export OfflineIndicator from SyncStatus index', () => {
    const indexPath = path.resolve(
      __dirname,
      '../../../../../../components/SyncStatus/index.ts'
    );
    const source = fs.readFileSync(indexPath, 'utf-8');
    expect(source).toContain('export { OfflineIndicator }');
  });

  it('should have visible prop in OfflineIndicatorProps', () => {
    const typesPath = path.resolve(
      __dirname,
      '../../../../../../components/SyncStatus/OfflineIndicator/types.ts'
    );
    const source = fs.readFileSync(typesPath, 'utf-8');
    expect(source).toContain('visible?: boolean');
  });
});
