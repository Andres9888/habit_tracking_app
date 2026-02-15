
import { Alert, Pressable, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { VisualizationModalSectionProps } from './HabitsModals.types';
import CustomModal from '../../../../components/Modal';
import { VisualizationExercise } from '../../../../components/VisualizationExercise';

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

  const closeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const handleClose = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeVisualizationExercise();
  };

  return (
    <CustomModal
      variant='fullScreen'
      visible={showVisualizationExercise}
      onClose={handleClose}
    >
      <View className='flex-1 bg-white' style={{ paddingTop: insets.top + 16 }}>
        <View className='flex-row items-center justify-between border-b border-stone-100 px-5 pb-4'>
          <Text className='text-lg font-bold text-stone-900'>Mental Boost</Text>
          <AnimatedPressable
            accessibilityHint='Close the mental boost exercise'
            accessibilityLabel='Close mental boost'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
            style={closeAnimatedStyle}
            onPress={handleClose}
            onPressIn={() => {
              closeScale.value = withSpring(0.9, {
                damping: 15,
                stiffness: 200,
              });
            }}
            onPressOut={() => {
              closeScale.value = withSpring(1, { damping: 18, stiffness: 200 });
            }}
          >
            <X color='#57534e' size={24} />
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
