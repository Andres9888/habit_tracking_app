/**
 * GoalTabEmptyState — Prompt to set a streak goal when none exists.
 * Inline preset picker with "RECOMMENDED" emphasis on 66d.
 */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { GoalPresetChip } from './GoalPresetChip';

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
      entering={FadeInDown.duration(300).springify().damping(20)}
    >
      <View
        className='mb-5 h-16 w-16 items-center justify-center rounded-2xl'
        style={{ backgroundColor: colors.status.streakLight }}
      >
        <Text style={{ fontSize: 30 }}>🎯</Text>
      </View>

      <Text
        className='mb-2 text-center'
        style={{ ...typography.heading2, color: colors.text.primary, fontFamily: 'Literata' }}
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

      <Pressable
        accessibilityRole='button'
        className='rounded-xl px-6 py-3.5'
        disabled={saving}
        style={{ backgroundColor: colors.primary[600], opacity: saving ? 0.6 : 1 }}
        onPress={() => void handleSave()}
      >
        <Text style={{ color: '#fff', fontWeight: fontWeights.semibold, fontSize: 15 }}>
          {saving ? 'Setting…' : `Set ${selected === 365 ? '1-year' : `${selected}-day`} goal`}
        </Text>
      </Pressable>

      <Text
        className='mt-4 text-center'
        style={{ ...typography.caption, color: colors.text.tertiary, fontStyle: 'italic' }}
      >
        You can change this anytime in Edit
      </Text>
    </Animated.View>
  );
}
