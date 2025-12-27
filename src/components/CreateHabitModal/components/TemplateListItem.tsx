import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Microscope } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import type { HabitTemplate } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Entrance animation constants (per UI audit spec)
const ENTRANCE_STAGGER_DELAY = 100; // ms between each item
const ENTRANCE_DURATION = 350; // ms total animation duration
const ENTRANCE_TRANSLATE_Y = 20; // pt initial offset

interface TemplateListItemProps {
  /** Index in list for staggered entrance animation */
  index?: number;
  template: HabitTemplate;
  onSelect: (template: HabitTemplate) => void;
  onViewScience: (template: HabitTemplate) => void;
}

export const TemplateListItem = ({
  index = 0,
  template,
  onSelect,
  onViewScience,
}: TemplateListItemProps) => {
  const reduceMotion = useReduceMotion();
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});

  // Entrance animation values
  const entranceOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const entranceTranslateY = useSharedValue(
    reduceMotion ? 0 : ENTRANCE_TRANSLATE_Y
  );

  // Press animation for template row
  const templateScale = useSharedValue(1);
  // Press animation for science button
  const scienceScale = useSharedValue(1);

  // Staggered entrance animation
  useEffect(() => {
    if (reduceMotion) {
      entranceOpacity.value = 1;
      entranceTranslateY.value = 0;
      return;
    }

    const delay = index * ENTRANCE_STAGGER_DELAY;
    entranceOpacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
    entranceTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 200 })
    );

    return () => {
      cancelAnimation(entranceOpacity);
      cancelAnimation(entranceTranslateY);
    };
  }, [index, reduceMotion, entranceOpacity, entranceTranslateY]);

  const entranceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceTranslateY.value }],
  }));

  const templateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templateScale.value }],
  }));

  const scienceAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scienceScale.value }],
  }));

  const handleTemplatePressIn = () => {
    triggerLightImpact();
    templateScale.value = withTiming(0.98, { duration: 50 });
  };

  const handleTemplatePressOut = () => {
    templateScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleSciencePressIn = () => {
    triggerLightImpact();
    scienceScale.value = withTiming(0.95, { duration: 50 });
  };

  const handleSciencePressOut = () => {
    scienceScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={entranceAnimatedStyle}>
      <View className='flex-row items-center gap-3 border-b border-stone-100 p-4'>
        <AnimatedPressable
          accessibilityLabel={`Select ${template.name} template`}
          accessibilityRole='button'
          className='flex-1 flex-row items-center gap-3'
          style={templateAnimatedStyle}
          onPress={() => {
            triggerSelection();
            onSelect(template);
          }}
          onPressIn={handleTemplatePressIn}
          onPressOut={handleTemplatePressOut}
        >
          <View
            className='h-12 w-12 items-center justify-center rounded-xl'
            style={{ backgroundColor: template.iconColor + '20' }}
          >
            <Text className='text-xl'>{template.icon}</Text>
          </View>
          <View className='flex-1'>
            <Text
              className='text-[15px] font-semibold text-stone-800'
              numberOfLines={1}
            >
              {template.name}
            </Text>
            <Text
              className='text-[13px] font-normal text-stone-500'
              numberOfLines={2}
            >
              {template.description}
            </Text>
          </View>
        </AnimatedPressable>
        <AnimatedPressable
          accessibilityLabel={`View science for ${template.name}`}
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full bg-blue-50'
          style={scienceAnimatedStyle}
          onPress={() => {
            triggerSelection();
            onViewScience(template);
          }}
          onPressIn={handleSciencePressIn}
          onPressOut={handleSciencePressOut}
        >
          <Microscope color='#3B82F6' size={18} strokeWidth={2} />
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
};
