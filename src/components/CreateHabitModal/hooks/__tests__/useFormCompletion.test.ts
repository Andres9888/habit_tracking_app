import { renderHook } from '@testing-library/react-native';
import { useFormCompletion } from '../useFormCompletion';

describe('useFormCompletion', () => {
  describe('Initial State', () => {
    it('returns all sections incomplete initially with empty inputs', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.basicInfoComplete).toBe(false);
      expect(result.current.appearanceComplete).toBe(false);
      expect(result.current.scheduleComplete).toBe(false);
      expect(result.current.completedCount).toBe(0);
      expect(result.current.totalCount).toBe(3);
      expect(result.current.isFormComplete).toBe(false);
    });
  });

  describe('Basic Info Completion', () => {
    it('marks basic info complete when habitName has content', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read daily',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.basicInfoComplete).toBe(true);
      expect(result.current.completedCount).toBe(1);
      expect(result.current.isFormComplete).toBe(false); // Still need schedule
    });

    it('marks basic info incomplete when habitName is only whitespace', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '   ',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.basicInfoComplete).toBe(false);
      expect(result.current.completedCount).toBe(0);
    });

    it('marks basic info incomplete when habitName is empty string', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.basicInfoComplete).toBe(false);
    });

    it('trims whitespace when checking habitName completion', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '  Exercise  ',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.basicInfoComplete).toBe(true);
    });
  });

  describe('Appearance Completion', () => {
    it('marks appearance complete when both emoji and color are selected', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          '📖',
          '#10B981',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.appearanceComplete).toBe(true);
      expect(result.current.completedCount).toBe(1);
    });

    it('marks appearance incomplete when emoji is null', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '#10B981',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.appearanceComplete).toBe(false);
    });

    it('marks appearance incomplete when color is empty string', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          '📖',
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.appearanceComplete).toBe(false);
    });

    it('marks appearance incomplete when both emoji and color are missing', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.appearanceComplete).toBe(false);
    });
  });

  describe('Schedule Completion', () => {
    it('marks schedule complete when at least one day is selected', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [true, false, false, false, false, false, false]
        )
      );

      expect(result.current.scheduleComplete).toBe(true);
      expect(result.current.completedCount).toBe(1);
    });

    it('marks schedule complete when all days are selected', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [true, true, true, true, true, true, true]
        )
      );

      expect(result.current.scheduleComplete).toBe(true);
    });

    it('marks schedule incomplete when no days are selected', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.scheduleComplete).toBe(false);
    });

    it('marks schedule complete when multiple days are selected', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [false, true, true, true, true, true, false] // Weekdays
        )
      );

      expect(result.current.scheduleComplete).toBe(true);
    });
  });

  describe('Completed Count', () => {
    it('returns completedCount = 0 when nothing is filled', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.completedCount).toBe(0);
    });

    it('returns completedCount = 1 when only basic info is complete', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.completedCount).toBe(1);
    });

    it('returns completedCount = 2 when basic info and schedule are complete', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read',
          null,
          '',
          [true, true, true, true, true, true, true]
        )
      );

      expect(result.current.completedCount).toBe(2);
    });

    it('returns completedCount = 2 when basic info and appearance are complete', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read',
          '📖',
          '#10B981',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.completedCount).toBe(2);
    });

    it('returns completedCount = 3 when all sections are complete', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read daily',
          '📖',
          '#10B981',
          [true, true, true, true, true, true, true]
        )
      );

      expect(result.current.completedCount).toBe(3);
    });
  });

  describe('Form Complete State', () => {
    it('considers form incomplete when only habitName is filled', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.isFormComplete).toBe(false);
    });

    it('considers form incomplete when only schedule is filled', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [true, true, true, true, true, true, true]
        )
      );

      expect(result.current.isFormComplete).toBe(false);
    });

    it('considers form complete when basic info and schedule are filled (appearance optional)', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read daily',
          null,
          '',
          [true, true, true, true, true, true, true]
        )
      );

      expect(result.current.isFormComplete).toBe(true);
      expect(result.current.appearanceComplete).toBe(false); // Appearance is optional
    });

    it('considers form complete when all sections are filled', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read daily',
          '📖',
          '#10B981',
          [true, true, true, true, true, true, true]
        )
      );

      expect(result.current.isFormComplete).toBe(true);
      expect(result.current.completedCount).toBe(3);
    });

    it('considers form incomplete when appearance is complete but basic info missing', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          '📖',
          '#10B981',
          [true, true, true, true, true, true, true]
        )
      );

      expect(result.current.isFormComplete).toBe(false);
    });

    it('considers form incomplete when appearance is complete but schedule missing', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          'Read',
          '📖',
          '#10B981',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.isFormComplete).toBe(false);
    });
  });

  describe('Total Count', () => {
    it('always returns totalCount = 3', () => {
      const { result } = renderHook(() =>
        useFormCompletion(
          '',
          null,
          '',
          [false, false, false, false, false, false, false]
        )
      );

      expect(result.current.totalCount).toBe(3);
    });
  });

  describe('Reactivity', () => {
    it('updates when habitName changes', () => {
      const { result, rerender } = renderHook(
        ({ habitName }) =>
          useFormCompletion(
            habitName,
            null,
            '',
            [false, false, false, false, false, false, false]
          ),
        { initialProps: { habitName: '' } }
      );

      expect(result.current.basicInfoComplete).toBe(false);

      rerender({ habitName: 'Exercise' });

      expect(result.current.basicInfoComplete).toBe(true);
      expect(result.current.completedCount).toBe(1);
    });

    it('updates when selectedDays changes', () => {
      const { result, rerender } = renderHook(
        ({ selectedDays }) =>
          useFormCompletion('Read', null, '', selectedDays),
        {
          initialProps: {
            selectedDays: [false, false, false, false, false, false, false],
          },
        }
      );

      expect(result.current.scheduleComplete).toBe(false);
      expect(result.current.isFormComplete).toBe(false);

      rerender({
        selectedDays: [true, true, true, true, true, true, true],
      });

      expect(result.current.scheduleComplete).toBe(true);
      expect(result.current.isFormComplete).toBe(true);
      expect(result.current.completedCount).toBe(2);
    });

    it('updates when emoji and color change', () => {
      const { result, rerender } = renderHook(
        ({ emoji, color }) =>
          useFormCompletion(
            'Read',
            emoji,
            color,
            [true, true, true, true, true, true, true]
          ),
        { initialProps: { emoji: null, color: '' } }
      );

      expect(result.current.appearanceComplete).toBe(false);
      expect(result.current.completedCount).toBe(2);

      rerender({ emoji: '📖', color: '#10B981' });

      expect(result.current.appearanceComplete).toBe(true);
      expect(result.current.completedCount).toBe(3);
    });
  });
});
