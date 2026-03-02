import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Entrance animation constants (per UI audit spec)
const ENTRANCE_DELAY = 300; // ms delay (appears after a few templates)
const ENTRANCE_DURATION = 350; // ms total animation duration
const ENTRANCE_TRANSLATE_Y = 20; // pt initial offset

interface TemplateListFooterProps {
  onClose: () => void;
}

export const TemplateListFooter = ({ onClose }: TemplateListFooterProps) => {
  const reduceMotion = useReduceMotion();
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});

  // Entrance animation values
  const entranceOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const entranceTranslateY = useSharedValue(
    reduceMotion ? 0 : ENTRANCE_TRANSLATE_Y
  );

  // Press animation
  const scale = useSharedValue(1);

  // Entrance animation
  useEffect(() => {
    if (reduceMotion) {
      entranceOpacity.value = 1;
      entranceTranslateY.value = 0;
      return;
    }

    entranceOpacity.value = withDelay(
      ENTRANCE_DELAY,
      withTiming(1, {
        duration: ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
    entranceTranslateY.value = withDelay(
      ENTRANCE_DELAY,
      withSpring(0, springs.standard)
    );

    return () => {
      cancelAnimation(entranceOpacity);
      cancelAnimation(entranceTranslateY);
    };
  }, [reduceMotion, entranceOpacity, entranceTranslateY]);

  const entranceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceTranslateY.value }],
  }));

  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    triggerLightImpact();
    if (!reduceMotion) {
      scale.value = withTiming(0.98, { duration: 50 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, springs.responsive);
    }
  };

  return (
    <Animated.View style={entranceAnimatedStyle}>
      <View className='px-4 pb-6 pt-3'>
        <AnimatedPressable
          accessibilityLabel='Hide template browser'
          accessibilityRole='button'
          className='flex-row items-center justify-center rounded-full bg-[#f4f4f4] px-4 py-3'
          style={[pressAnimatedStyle, { minHeight: 44 }]}
          onPress={() => {
            triggerSelection();
            onClose();
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text className='mr-2 text-[15px] font-semibold text-stone-800'>
            Hide habits
          </Text>
          <ChevronDown color='#1c1917' size={16} />
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
};
