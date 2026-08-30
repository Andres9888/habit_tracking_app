/**
 * HeroTodayActions — the check-in toggle, then a fixed-height secondary slot so
 * the sections below never jump between states.
 *
 * The toggle carries both "Complete today" and "Logged today", including undo,
 * so the slot only holds the caption, the recovery hint, or the note row.
 */
import { Text, View } from 'react-native';
import type { HabitDayState } from '../../../../features/habits/habitDayState';
import { useInsightPalette } from '../../insightPalette';
import { HeroCheckInToggle } from './HeroCheckInToggle';
import { HeroNoteRow } from './HeroNoteRow';
import { HeroRecoveryHint } from './HeroRecoveryHint';
import { HeroUnavailableBar } from './HeroUnavailableBar';

interface HeroTodayActionsProps {
  isToggling: boolean;
  recoveryHint?: string;
  todayNote?: string;
  todayState: HabitDayState;
  onOpenNote: () => void;
  onToggleToday: () => void;
}

export function HeroTodayActions({
  isToggling,
  recoveryHint,
  todayNote,
  todayState,
  onOpenNote,
  onToggleToday,
}: HeroTodayActionsProps) {
  const palette = useInsightPalette();
  const isCompletedToday = todayState === 'completed';
  const isUnavailable =
    todayState !== 'completed' && todayState !== 'open-today';
  const unavailableLabel =
    todayState === 'paused' ? 'Habit paused' : 'Not scheduled today';

  return (
    <View style={{ gap: 8, paddingBottom: 4, paddingTop: 11 }}>
      {isUnavailable ? (
        <HeroUnavailableBar label={unavailableLabel} />
      ) : (
        <HeroCheckInToggle
          checked={isCompletedToday}
          disabled={isToggling}
          onPress={onToggleToday}
        />
      )}
      <View
        testID='hero-secondary-slot'
        style={{ height: 48, justifyContent: 'center' }}
      >
        {isUnavailable ? (
          <Text
            style={{
              color: palette.textTertiary,
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            {'History remains available below.'}
          </Text>
        ) : isCompletedToday ? (
          <HeroNoteRow
            label={todayNote ? 'Edit note' : 'Add a note'}
            onPress={onOpenNote}
          />
        ) : recoveryHint ? (
          <HeroRecoveryHint hint={recoveryHint} />
        ) : (
          <Text
            style={{
              color: palette.textTertiary,
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            Tap to log today. You can undo anytime.
          </Text>
        )}
      </View>
    </View>
  );
}
