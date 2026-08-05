/**
 * StateReconciler Singleton Tests
 */

import { getStateReconciler, resetStateReconciler } from '../singleton';
import { StateReconciler } from '../reconciler';

describe('StateReconciler Singleton', () => {
  afterEach(() => {
    resetStateReconciler();
  });

  describe('getStateReconciler', () => {
    it('returns a StateReconciler instance', () => {
      const reconciler = getStateReconciler();

      expect(reconciler).toBeInstanceOf(StateReconciler);
    });

    it('returns the same instance on multiple calls', () => {
      const reconciler1 = getStateReconciler();
      const reconciler2 = getStateReconciler();

      expect(reconciler1).toBe(reconciler2);
    });

    it('accepts config on first call', () => {
      const onReconciled = jest.fn();
      const reconciler = getStateReconciler({ onReconciled });

      // Verify config is applied by checking callback is called
      reconciler.reconcile([
        {
          date: '2026-01-15',
          habitId: 'habit1' as unknown,
          id: 'op1',
          success: true,
        },
      ]);

      expect(onReconciled).toHaveBeenCalled();
    });

    it('ignores config on subsequent calls', () => {
      const onReconciled1 = jest.fn();
      const onReconciled2 = jest.fn();

      const reconciler1 = getStateReconciler({ onReconciled: onReconciled1 });
      const reconciler2 = getStateReconciler({ onReconciled: onReconciled2 });

      reconciler2.reconcile([
        {
          date: '2026-01-15',
          habitId: 'habit1' as unknown,
          id: 'op1',
          success: true,
        },
      ]);

      // First config should be used, not second
      expect(onReconciled1).toHaveBeenCalled();
      expect(onReconciled2).not.toHaveBeenCalled();
    });
  });

  describe('resetStateReconciler', () => {
    it('resets the singleton instance', () => {
      const reconciler1 = getStateReconciler();

      // Add some state
      reconciler1.reconcile([
        {
          date: '2026-01-15',
          habitId: 'habit1' as unknown,
          id: 'op1',
          success: true,
        },
      ]);
      expect(reconciler1.isHabitSynced('habit1')).toBe(true);

      resetStateReconciler();

      const reconciler2 = getStateReconciler();

      // Should be a new instance with fresh state
      expect(reconciler2).not.toBe(reconciler1);
      expect(reconciler2.isHabitSynced('habit1')).toBe(false);
    });

    it('is safe to call when no instance exists', () => {
      expect(() => resetStateReconciler()).not.toThrow();
    });
  });
});
