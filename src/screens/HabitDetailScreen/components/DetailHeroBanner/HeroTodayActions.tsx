/**
 * HeroTodayActions — the part of the hero that changes when today is logged.
 *
 * Open (frame 1): filled "Complete today" block + the two-minute escape hatch.
 * Logged (frame 2): the check-in confirmation + the note prompt, which the
 * design moves up into the band at exactly this moment. HabitDetailContent drops
 * the foot-of-stack note card while this one is showing so there is never one
 * note bound to two inputs.
 */
import { View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { spacing } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import { DetailCompleteButton } from '../DetailCompleteButton';
import { HabitNoteCard } from '../HabitNoteCard';
import { milestoneCaption, nextMilestoneProgress } from '../ThisWeekCard';
import { twoMinuteHint } from './DetailHeroBanner.utils';
import { HeroCheckInCard } from './HeroCheckInCard';
import { HeroTwoMinute } from './HeroTwoMinute';

interface HeroTodayActionsProps {
  completedAtLabel?: string;
  habit: Habit;
  isCompletedToday: boolean;
  /** Yesterday was missed — open the two-minute hatch by default. */
  isRecovering?: boolean;
  isToggling: boolean;
  palette: InsightPalette;
  onToggleToday: () => void;
}

export function HeroTodayActions({
  completedAtLabel,
  habit,
  isCompletedToday,
  isRecovering = false,
  isToggling,
  onToggleToday,
  palette,
}: HeroTodayActionsProps) {
  const currentStreak = habit.currentStreak ?? 0;
  const progress = nextMilestoneProgress(currentStreak);
  const caption = progress ? milestoneCaption(progress) : undefined;

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
        defaultExpanded={isRecovering}
        hint={twoMinuteHint(habit)}
        palette={palette}
      />
    </View>
  );
}
