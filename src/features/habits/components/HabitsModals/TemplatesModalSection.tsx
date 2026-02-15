import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';

import CustomModal from '../../../../components/Modal';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import { useThemeColors } from '../../../../theme/ThemeContext';
import TemplatesScreen from '../../../../screens/TemplatesScreen';
import type { TemplatesModalSectionProps } from './HabitsModals.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Templates modal section - displays templates screen in full-screen modal
 */
export function TemplatesModalSection({
  showTemplatesScreen,
  closeTemplatesScreen,
}: TemplatesModalSectionProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const closeScale = useSharedValue(1);

  const closeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const handleClose = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeTemplatesScreen();
  };

  return (
    <CustomModal
      variant='fullScreen'
      visible={showTemplatesScreen}
      onClose={handleClose}
    >
      <View className='flex-1' style={{ paddingTop: insets.top }}>
        <ErrorBoundary>
          <TemplatesScreen />
        </ErrorBoundary>
        <View className='absolute right-4' style={{ top: insets.top + 8 }}>
          <AnimatedPressable
            accessibilityHint='Close the templates screen'
            accessibilityLabel='Close templates'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full shadow-md'
            style={{ backgroundColor: colors.card }}
            style={closeAnimatedStyle}
            onPress={handleClose}
            onPressIn={() => {
              closeScale.value = withSpring(0.9, {
                damping: 15,
                stiffness: 200,
              });
            }}
            onPressOut={() => {
              closeScale.value = withSpring(1, { damping: 15, stiffness: 200 });
            }}
          >
            <X color='#57534e' size={24} />
          </AnimatedPressable>
        </View>
      </View>
    </CustomModal>
  );
}
