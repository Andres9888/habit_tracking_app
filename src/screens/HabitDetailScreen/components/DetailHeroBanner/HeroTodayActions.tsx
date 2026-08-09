/**
 * HeroTodayActions — open: complete + 2-minute CTA; logged: check-in + note.
 */
import { View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { spacing } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import { DetailCompleteButton } from '../DetailCompleteButton';
import { HabitNoteCard } from '../HabitNoteCard';
import { nextMilestoneProgress } from '../ThisWeekCard';
import { checkInCaption } from './checkInCaption';
import { HeroCheckInCard } from './HeroCheckInCard';
import { HeroTwoMinute } from './HeroTwoMinute';

interface HeroTodayActionsProps {
  completedAtLabel?: string;
  habit: Habit;
  isCompletedToday: boolean;
  /** Today's completion was the 2-minute version. */
  isMinimalToday?: boolean;
  isToggling: boolean;
  palette: InsightPalette;
  onMinimalToday: () => void;
  onToggleToday: () => void;
}

export function HeroTodayActions({
  completedAtLabel,
  habit,
  isCompletedToday,
  isMinimalToday = false,
  isToggling,
  onMinimalToday,
  onToggleToday,
  palette,
}: HeroTodayActionsProps) {
  const currentStreak = habit.currentStreak ?? 0;
  const progress = nextMilestoneProgress(currentStreak);
  const caption = checkInCaption({ isMinimal: isMinimalToday, progress });

  if (isCompletedToday) {
    return (
      <View style={{ gap: spacing.base, paddingHorizontal: 20 }}>
        <HeroCheckInCard
          caption={caption}
          completedAtLabel={completedAtLabel}
          disabled={isToggling}
          palette={palette}
          streakDay={Math.max(1, currentStreak)}
          onUndo={onToggleToday}
        />
        <HabitNoteCard
          habitId={habit._id}
          notes={habit.notes}
          variant='onBand'
        />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
      <DetailCompleteButton
        disabled={isToggling}
        isCompletedToday={false}
        tone='onBand'
        onPress={onToggleToday}
      />
      <HeroTwoMinute
        disabled={isToggling}
        palette={palette}
        onPress={onMinimalToday}
      />
    </View>
  );
}
