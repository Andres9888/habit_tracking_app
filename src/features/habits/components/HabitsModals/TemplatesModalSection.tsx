import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';

import CustomModal from '../../../../components/Modal';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import TemplatesScreen from '../../../../screens/TemplatesScreen';
import { springs } from '@/theme/animations';
import type { TemplatesModalSectionProps } from './HabitsModals.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Templates modal section - displays templates screen in full-screen modal
 */
export function TemplatesModalSection({
  showTemplatesScreen,
  closeTemplatesScreen,
  reduceMotionPreference,
}: TemplatesModalSectionProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { trigger } = useHaptics();
  const closeScale = useSharedValue(1);

  const closeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const handleClose = () => {
    trigger('tap');
    closeTemplatesScreen();
  };

  return (
    <CustomModal
      variant='fullScreen'
      visible={showTemplatesScreen}
      onClose={handleClose}
      respectReduceMotion={!reduceMotionPreference}
    >
      <View className='flex-1' style={{ paddingTop: insets.top, backgroundColor: colors.background }}>
        <ErrorBoundary>
          <TemplatesScreen />
        </ErrorBoundary>
      </View>
      <View className='absolute right-4' style={{ top: insets.top + 8 }}>
        <AnimatedPressable
          accessibilityHint='Close the templates screen'
          accessibilityLabel='Close templates'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full shadow-md'
          style={[{ backgroundColor: colors.card }, closeAnimatedStyle]}
          onPress={handleClose}
          onPressIn={() => {
            closeScale.value = withSpring(0.9, springs.sheet);
          }}
          onPressOut={() => {
            closeScale.value = withSpring(1, springs.button);
          }}
        >
          <X color={colors.text.secondary} size={24} />
        </AnimatedPressable>
      </View>
    </CustomModal>
  );
}
