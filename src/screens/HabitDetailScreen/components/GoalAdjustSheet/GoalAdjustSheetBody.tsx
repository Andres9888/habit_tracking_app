/**
 * GoalAdjustSheetBody — inner content for GoalAdjustSheet (handle, title,
 * preset grid, Save, Remove). Chrome/animation lives in GoalAdjustSheet.
 */
import { Text, View } from 'react-native';
import { Button } from '../../../../components/Button';
import { withAlpha } from '../../../../theme';
import { borderRadius, componentSpacing, spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { GoalPresetChip } from '../GoalPresetChip';
import type { useGoalAdjust } from './GoalAdjustSheet.hooks';

const PRESETS = [7, 21, 30, 66, 100, 365];
const RECOMMENDED = 66;
const labelFor = (d: number) => (d === 365 ? '1-year' : `${d}-day`);

interface GoalAdjustSheetBodyProps {
  currentGoal: number;
  goal: ReturnType<typeof useGoalAdjust>;
}

export function GoalAdjustSheetBody({ currentGoal, goal }: GoalAdjustSheetBodyProps) {
  const { colors } = useThemeColors();
  const { confirmRemove, handleRemove, handleSelect, handleUpdate, saving, selected } = goal;

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
      <Text
        className='mb-4 mt-1 text-center'
        style={{ ...typography.caption, color: colors.text.secondary }}
      >
        Currently: {currentGoal > 0 ? `${labelFor(currentGoal)} streak` : 'none'}
      </Text>
      <View className='mb-5 flex-row flex-wrap justify-center gap-2'>
        {PRESETS.map((days) => (
          <GoalPresetChip
            key={days}
            days={days}
            disabled={saving}
            recommended={days === RECOMMENDED}
            selected={days === selected}
            onPress={() => handleSelect(days)}
          />
        ))}
      </View>
      <Button
        accessibilityLabel='Save goal'
        disabled={saving}
        fullWidth
        loading={saving}
        style={{ marginBottom: spacing.sm }}
        variant='primary'
        onPress={() => void handleUpdate()}
      >
        {`Set ${labelFor(selected)} goal`}
      </Button>
      <Button
        accessibilityLabel={
          confirmRemove ? 'Tap again to confirm goal removal' : 'Remove goal'
        }
        disabled={saving}
        fullWidth
        variant='secondary'
        style={{
          backgroundColor: confirmRemove
            ? withAlpha(colors.status.error, 0.1)
            : 'transparent',
          borderColor: withAlpha(colors.status.error, 0.4),
        }}
        textStyle={{ color: colors.status.error, fontWeight: fontWeights.semibold }}
        onPress={() => void handleRemove()}
      >
        {confirmRemove ? 'Tap again to confirm' : 'Remove goal'}
      </Button>
    </>
  );
}
