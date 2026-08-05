/**
 * GoalAdjustSheetBody — inner content for GoalAdjustSheet (handle, title,
 * preset grid, Save, Remove). Chrome/animation lives in GoalAdjustSheet.
 */
import { Pressable, Text, View } from 'react-native';
import { Button } from '../../../../components/Button';
import { componentSpacing, borderRadius, spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { GoalCtaLabel } from '../GoalCtaLabel';
import { readableHabitAccent } from '../goalColorUtils';
import { GoalPresetChip } from '../GoalPresetChip';
import { GoalAdjustProgressSummary } from './GoalAdjustProgressSummary';
import { GoalContextLine } from './GoalContextLine';
import { GOAL_PRESETS, goalLabelFor, RECOMMENDED_GOAL, type useGoalAdjust } from './GoalAdjustSheet.hooks';

interface GoalAdjustSheetBodyProps {
  currentGoal: number;
  currentStreak: number;
  goal: ReturnType<typeof useGoalAdjust>;
  habitColor: string;
}

export function GoalAdjustSheetBody({
  currentGoal,
  currentStreak,
  goal,
  habitColor,
}: GoalAdjustSheetBodyProps) {
  const { colors } = useThemeColors();
  const { confirmRemove, handleRemove, handleSelect, handleUpdate, saving, selected } = goal;
  const ctaColor = readableHabitAccent(
    habitColor,
    colors.text.inverse,
    colors.primary[700]
  );

  return (
    <>
      <View
        style={{
          alignSelf: 'center',
          backgroundColor: colors.border,
          borderRadius: borderRadius.full,
          height: spacing.xs,
          marginBottom: spacing.base,
          width: componentSpacing.avatar.size,
        }}
      />
      <Text
        className='text-center'
        style={{ ...typography.heading3, color: colors.text.primary, fontWeight: fontWeights.bold }}
      >
        Adjust your goal
      </Text>
      <GoalAdjustProgressSummary
        currentGoal={currentGoal}
        currentStreak={currentStreak}
        habitColor={habitColor}
      />
      <View className='mb-3.5 flex-row flex-wrap' style={{ marginHorizontal: -spacing.xs / 2 }}>
        {GOAL_PRESETS.map((days) => (
          <View key={days} style={{ marginBottom: spacing.sm, paddingHorizontal: spacing.xs / 2, width: '33.333%' }}>
            <GoalPresetChip
              days={days}
              disabled={saving}
              habitColor={habitColor}
              recommended={days === RECOMMENDED_GOAL}
              selected={days === selected}
              variant='grid'
              onPress={() => handleSelect(days)}
            />
          </View>
        ))}
      </View>
      <GoalContextLine
        currentStreak={currentStreak}
        habitColor={habitColor}
        selected={selected}
      />
      <Button
        accessibilityLabel='Save goal'
        disabled={saving}
        fullWidth
        loading={saving}
        style={{ backgroundColor: ctaColor, marginBottom: spacing.xs }}
        variant='primary'
        onPress={() => void handleUpdate()}
      >
        <GoalCtaLabel label={`Set ${goalLabelFor(selected)} goal`} trigger={selected} />
      </Button>
      <Pressable
        accessibilityLabel={
          confirmRemove ? 'Tap again to confirm goal removal' : 'Remove goal'
        }
        accessibilityRole='button'
        disabled={saving}
        style={{ alignItems: 'center', opacity: saving ? 0.45 : 1, paddingVertical: spacing.sm }}
        onPress={() => void handleRemove()}
      >
        <Text style={{ ...typography.bodySmall, color: colors.status.error, fontWeight: fontWeights.medium }}>
          {confirmRemove ? 'Tap again to confirm' : 'Remove goal'}
        </Text>
      </Pressable>
    </>
  );
}
