/**
 * GoalAdjustSheet — Bottom-sheet for changing or removing the streak goal.
 *
 * Uses animationType='none' + an animated backdrop (useSwipeDismiss) rather than
 * the native slide modal. A nested native `slide` Modal renders an opaque black
 * background on iOS; this matches the proven pattern in AdvancedSheet.
 */
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useSwipeDismiss } from '../../../../components/CreateHabitModal/hooks/useSwipeDismiss';
import { shadows } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useGoalAdjust } from './GoalAdjustSheet.hooks';
import { GoalAdjustSheetBody } from './GoalAdjustSheetBody';

interface GoalAdjustSheetProps {
  habitId: Id<'habits'>;
  currentGoal: number;
  currentStreak: number;
  habitColor: string;
  /** Preset to open on when it differs from the stored goal (the suggested ladder). */
  initialGoal?: number;
  visible: boolean;
  onClose: () => void;
}

export function GoalAdjustSheet(props: GoalAdjustSheetProps) {
  const { currentGoal, currentStreak, habitColor, visible, onClose } = props;
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { animateOut, backdropStyle, panGesture, sheetStyle } = useSwipeDismiss(
    {
      visible,
      onClose,
    }
  );
  // Route every close (save, remove, swipe, backdrop) through animateOut so the
  // sheet slides away instead of snapping shut.
  const goal = useGoalAdjust({ ...props, onClose: animateOut });

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={animateOut}
    >
      <View className='flex-1'>
        <Pressable style={StyleSheet.absoluteFill} onPress={animateOut}>
          <Animated.View className='flex-1 bg-black' style={backdropStyle} />
        </Pressable>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className='absolute bottom-0 left-0 right-0 rounded-t-3xl px-5 pt-3'
            style={[
              sheetStyle,
              {
                backgroundColor: colors.card,
                paddingBottom: insets.bottom + 28,
                ...shadows.modal,
              },
            ]}
          >
            <GoalAdjustSheetBody
              currentGoal={currentGoal}
              currentStreak={currentStreak}
              goal={goal}
              habitColor={habitColor}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
