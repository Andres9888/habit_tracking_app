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
import { useThemeColors } from '../../../theme';
import { typography } from '../../../theme/typography';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { GoalEmptyIntro } from './GoalEmptyIntro';
import { GoalPresetChip } from './GoalPresetChip';
import { GoalCtaLabel } from './GoalCtaLabel';

const PRESETS = [7, 21, 30, 66, 100, 365];
const RECOMMENDED = 66;

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
      entering={FadeInDown.duration(durations.enter).easing(
        Easing.out(Easing.cubic)
      )}
    >
      <GoalEmptyIntro />

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
        fullWidth
        loading={saving}
        variant='primary'
        onPress={() => void handleSave()}
      >
        <GoalCtaLabel
          label={`Set ${selected === 365 ? '1-year' : `${selected}-day`} goal`}
          trigger={selected}
        />
      </Button>

      <Text
        className='mt-4 text-center'
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          fontStyle: 'italic',
        }}
      >
        You can change this anytime in Edit
      </Text>
    </Animated.View>
  );
}
