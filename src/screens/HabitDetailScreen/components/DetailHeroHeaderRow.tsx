/**
 * DetailHeroHeaderRow — Open Design hero-head:
 * icon | name + schedule + reminder cue
 * (Today's status lives on the Complete CTA + week strip — no chip.)
 */
import { View } from 'react-native';
import { spacing } from '../../../theme/spacing';
import type { Habit } from '../HabitDetailScreen.types';
import {
  buildHeroReminderLabel,
  buildHeroSubtitle,
  getHabitDisplayName,
} from './DetailHero.utils';
import { DetailHeroHeaderMeta } from './DetailHeroHeaderMeta';
import { DetailHeroIcon } from './DetailHeroIcon';

interface DetailHeroHeaderRowProps {
  habit: Habit;
  isCompletedToday: boolean;
}

export function DetailHeroHeaderRow({
  habit,
  isCompletedToday,
}: DetailHeroHeaderRowProps) {
  const habitName = getHabitDisplayName(habit);
  const subtitle = buildHeroSubtitle(habit);
  const reminder = buildHeroReminderLabel(habit);

  return (
    <View
      className='flex-row items-start'
      style={{
        gap: spacing.md,
        paddingBottom: spacing.xs,
        paddingHorizontal: spacing.base + 2,
        paddingTop: spacing.base + 2,
      }}
    >
      {habit.icon ? (
        <DetailHeroIcon
          color={habit.color ?? habit.iconColor}
          icon={habit.icon}
          isCompletedToday={isCompletedToday}
        />
      ) : null}

      <DetailHeroHeaderMeta
        habitName={habitName}
        reminder={reminder}
        subtitle={subtitle}
      />
    </View>
  );
}
