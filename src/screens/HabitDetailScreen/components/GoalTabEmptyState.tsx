/**
 * GoalTabEmptyState — Prompt to set a streak goal when none exists.
 * Inline preset picker with "RECOMMENDED" emphasis on 66d.
 */
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { Button } from '../../../components/Button';
import { durations } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { GoalPresetChip } from './GoalPresetChip';

const PRESETS = [7, 21, 30, 66, 100, 365];
const RECOMMENDED = 66;
const TARGET_EMOJI_SIZE = 30;

interface GoalTabEmptyStateProps {
  habitId: Id<'habits'>;
}

export function GoalTabEmptyState({ habitId }: GoalTabEmptyStateProps) {
  const { colors } = useThemeColors();
  const { triggerSelection, triggerSuccess } = useHapticFeedback();
  const updateHabit = useMutation(api.habits.update);
  const [selected, setSelected] = useState<number>(RECOMMENDED);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateHabit({ habitId, goalDuration: selected });
      triggerSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Animated.View
      className='items-center px-6 py-10'
      entering={FadeInDown.duration(durations.enter).easing(Easing.out(Easing.cubic))}
    >
      <View
        className='mb-5 h-16 w-16 items-center justify-center rounded-2xl'
        style={{ backgroundColor: colors.status.streakLight }}
      >
        <Text style={{ fontSize: TARGET_EMOJI_SIZE }}>🎯</Text>
      </View>

      <Text
        className='mb-2 text-center'
        style={{ ...typography.heading2, color: colors.text.primary, fontFamily: fontFamilies.primary.display }}
      >
        Set a streak goal
      </Text>
      <Text
        className='mb-1 text-center'
        style={{ ...typography.bodySmall, color: colors.text.primary, fontWeight: fontWeights.medium }}
      >
        Pick a target — we'll celebrate every milestone.
      </Text>
      <Text
        className='mb-6 text-center'
        style={{ ...typography.caption, color: colors.text.secondary, lineHeight: 18 }}
      >
        66 days is the science-backed sweet spot.
      </Text>

      <View className='mb-6 flex-row flex-wrap justify-center gap-2'>
        {PRESETS.map((days) => (
          <GoalPresetChip
            key={days}
            days={days}
            recommended={days === RECOMMENDED}
            selected={days === selected}
            onPress={() => {
              triggerSelection();
              setSelected(days);
            }}
          />
        ))}
      </View>

      <Button
        accessibilityLabel='Set streak goal'
        disabled={saving}
        loading={saving}
        variant='primary'
        onPress={() => void handleSave()}
      >
        {`Set ${selected === 365 ? '1-year' : `${selected}-day`} goal`}
      </Button>

      <Text
        className='mt-4 text-center'
        style={{ ...typography.caption, color: colors.text.tertiary, fontStyle: 'italic' }}
      >
        You can change this anytime in Edit
      </Text>
    </Animated.View>
  );
}
