/**
 * GoalAdjustSheetBody — inner content for GoalAdjustSheet (handle, title,
 * preset grid, Save, Remove). Chrome/animation lives in GoalAdjustSheet.
 */
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Button } from '../../../../components/Button';
import { useDetailPressAnimation } from '../../../../hooks/useDetailPressAnimation';
import { withAlpha } from '../../../../theme';
import { borderRadius, componentSpacing, spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '../../../../theme/typography';
import { GoalPresetChip } from '../GoalPresetChip';
import type { useGoalAdjust } from './GoalAdjustSheet.hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESETS = [7, 21, 30, 66, 100, 365];
const RECOMMENDED = 66;
const labelFor = (d: number) => (d === 365 ? '1-year' : `${d}-day`);

interface GoalAdjustSheetBodyProps {
  currentGoal: number;
  goal: ReturnType<typeof useGoalAdjust>;
}

export function GoalAdjustSheetBody({ currentGoal, goal }: GoalAdjustSheetBodyProps) {
  const { colors } = useThemeColors();
  const { animatedStyle, pressHandlers } = useDetailPressAnimation();
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
      <AnimatedPressable
        accessibilityLabel={
          confirmRemove ? 'Tap again to confirm goal removal' : 'Remove goal'
        }
        accessibilityRole='button'
        accessibilityState={{ disabled: saving }}
        disabled={saving}
        style={[
          animatedStyle,
          {
            alignItems: 'center',
            backgroundColor: confirmRemove
              ? withAlpha(colors.status.error, 0.1)
              : 'transparent',
            borderRadius: borderRadius.medium,
            opacity: saving ? 0.6 : 1,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
        ]}
        onPress={() => void handleRemove()}
        onPressIn={pressHandlers.onPressIn}
        onPressOut={pressHandlers.onPressOut}
      >
        <Text
          accessibilityLiveRegion='polite'
          style={{ ...typography.bodySmall, color: colors.status.error, fontWeight: fontWeights.semibold }}
        >
          {confirmRemove ? 'Tap again to confirm' : 'Remove goal'}
        </Text>
      </AnimatedPressable>
    </>
  );
}
