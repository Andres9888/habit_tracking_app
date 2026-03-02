/**
 * PerfectDayConfetti — self-contained confetti overlay for the all-done state.
 *
 * Encapsulates both the transition detection and the ConfettiSystem render
 * so HabitsApp only needs a single JSX element.
 */

import { ConfettiSystem } from '../../../components/CelebrationSystem';
import { useThemeColors } from '../../../theme/ThemeContext';
import { usePerfectDayConfetti } from '../hooks/usePerfectDayConfetti';

interface PerfectDayConfettiProps {
  completedToday: number;
  totalHabits: number;
  reduceMotion: boolean;
}

export function PerfectDayConfetti({
  completedToday,
  totalHabits,
  reduceMotion,
}: PerfectDayConfettiProps) {
  const { activeBurst } = usePerfectDayConfetti(
    completedToday, totalHabits, reduceMotion);
  const { isDark } = useThemeColors();

  if (!activeBurst) return null;

  return (
    <ConfettiSystem
      burstType={activeBurst}
      hapticsEnabled={false}
      isDarkMode={isDark}
      shouldReduceMotion={reduceMotion}
    />
  );
}
