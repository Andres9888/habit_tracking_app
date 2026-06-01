/**
 * GoalAdjustSheetBody — inner content for GoalAdjustSheet (handle, title,
 * preset grid, Save, Remove). Chrome/animation lives in GoalAdjustSheet.
 */
import { Pressable, Text, View } from 'react-native';
import { Button } from '../../../../components/Button';
import { spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '../../../../theme/typography';
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
        className='mx-auto mb-4 h-1 w-10 rounded-full'
        style={{ backgroundColor: colors.border }}
      />
      <Text
        className='text-center'
        style={{ ...typography.heading3, color: colors.text.primary, fontFamily: fontFamilies.primary.display }}
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
      <Pressable
        accessibilityRole='button'
        className='items-center rounded-xl px-6 py-3'
        disabled={saving}
        onPress={() => void handleRemove()}
      >
        <Text
          style={{ ...typography.bodySmall, color: colors.status.error, fontWeight: fontWeights.semibold }}
        >
          {confirmRemove ? 'Tap again to confirm' : 'Remove goal'}
        </Text>
      </Pressable>
    </>
  );
}
