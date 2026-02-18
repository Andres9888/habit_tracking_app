import { lazy, Suspense } from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
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
import { TemplateListSkeleton } from '../../../../components/SkeletonLoader';
import type { TemplatesModalSectionProps } from './HabitsModals.types';

// Lazy load TemplatesScreen - only bundle when modal is opened
const TemplatesScreen = lazy(() => import('../../../../screens/TemplatesScreen'));

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Templates modal section - displays templates screen in full-screen modal
 * Performance: TemplatesScreen is lazy loaded to reduce initial bundle size
 */
export function TemplatesModalSection({
  showTemplatesScreen,
  closeTemplatesScreen,
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
    >
      <View className='flex-1' style={{ paddingTop: insets.top }}>
        <ErrorBoundary>
          <Suspense fallback={<TemplateListSkeleton />}>
            <TemplatesScreen />
          </Suspense>
        </ErrorBoundary>
        <View className='absolute right-4' style={{ top: insets.top + 8 }}>
          <AnimatedPressable
            accessibilityHint='Close the templates screen'
            accessibilityLabel='Close templates'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full shadow-md'
            style={[{ backgroundColor: colors.card }, closeAnimatedStyle]}
            onPress={handleClose}
            onPressIn={() => {
              closeScale.value = withSpring(0.9, {
                damping: 15,
                stiffness: 200,
              });
            }}
            onPressOut={() => {
              closeScale.value = withSpring(1, { damping: 18, stiffness: 150 });
            }}
          >
            <X color='#57534e' size={24} />
          </AnimatedPressable>
        </View>
      </View>
    </CustomModal>
  );
}
