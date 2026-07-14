import { COMPLETION_DOT_PULSE_CYCLES } from '@/components/CalendarTimeline/components/CompletionDot';
import { FAB_ATTENTION_CYCLES } from '@/features/habits/components/FloatingActionButton/useFABAnimations';
import { TODAY_BREATHING_CYCLES } from '../useHabitDayToggleAnimations.helpers';

describe('home attention animations', () => {
  it('stops every decorative loop after two cycles', () => {
    expect(FAB_ATTENTION_CYCLES).toBe(2);
    expect(COMPLETION_DOT_PULSE_CYCLES).toBe(2);
    expect(TODAY_BREATHING_CYCLES).toBe(2);
  });
});
