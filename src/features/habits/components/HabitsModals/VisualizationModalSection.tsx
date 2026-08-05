import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import CustomModal from '../../../../components/Modal';
import { VisualizationExercise } from '../../../../components/VisualizationExercise';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { VisualizationModalSectionProps } from './HabitsModals.types';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function handleSave(_data: unknown) {
  Alert.alert(
    'Visualization Saved!',
    'Your mental contrasting exercise has been saved. Review it when you need motivation.',
    [{ text: 'Got it' }]
  );
}

/** Visualization modal section - mental boost / visualization exercise */
export function VisualizationModalSection({
  selectedHabit,
  showVisualizationExercise,
  closeVisualizationExercise,
}: VisualizationModalSectionProps) {
  const insets = useSafeAreaInsets();
  const closeScale = useSharedValue(1);
  const { colors } = useThemeColors();
  const { trigger } = useHaptics();

  const closeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const handleClose = () => {
    trigger('tap');
    closeVisualizationExercise();
  };

  return (
    <CustomModal
      variant='fullScreen'
      visible={showVisualizationExercise}
      onClose={handleClose}
    >
      <View
        className='flex-1'
        style={{
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
        }}
      >
        <View
          className='flex-row items-center justify-between border-b px-5 pb-4'
          style={{ borderColor: colors.cardBorder }}
        >
          <Text
            className='text-lg font-bold'
            style={{ color: colors.text.primary }}
          >
            Mental Boost
          </Text>
          <AnimatedPressable
            accessibilityHint='Close the mental boost exercise'
            accessibilityLabel='Close mental boost'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full'
            style={[{ backgroundColor: colors.gray[100] }, closeAnimatedStyle]}
            onPress={handleClose}
            onPressIn={() => {
              closeScale.value = withSpring(0.9, springs.button);
            }}
            onPressOut={() => {
              closeScale.value = withSpring(1, springs.button);
            }}
          >
            <X color={colors.text.secondary} size={iconSizes.large} />
          </AnimatedPressable>
        </View>
        <View
          className='flex-1 px-5 pt-4'
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <VisualizationExercise
            habitName={selectedHabit?.name ?? ''}
            onClose={handleClose}
            onSave={handleSave}
          />
        </View>
      </View>
    </CustomModal>
  );
}
