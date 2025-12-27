import { Pressable, Text, View } from 'react-native';
import { Microscope } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { HabitTemplate } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TemplateListItemProps {
  template: HabitTemplate;
  onSelect: (template: HabitTemplate) => void;
  onViewScience: (template: HabitTemplate) => void;
}

export const TemplateListItem = ({
  template,
  onSelect,
  onViewScience,
}: TemplateListItemProps) => {
  // Press animation for template row
  const templateScale = useSharedValue(1);
  // Press animation for science button
  const scienceScale = useSharedValue(1);

  const templateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templateScale.value }],
  }));

  const scienceAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scienceScale.value }],
  }));

  const handleTemplatePressIn = () => {
    templateScale.value = withTiming(0.98, { duration: 50 });
  };

  const handleTemplatePressOut = () => {
    templateScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleSciencePressIn = () => {
    scienceScale.value = withTiming(0.95, { duration: 50 });
  };

  const handleSciencePressOut = () => {
    scienceScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <View className='flex-row items-center gap-3 border-b border-stone-100 p-4'>
      <AnimatedPressable
        accessibilityLabel={`Select ${template.name} template`}
        accessibilityRole='button'
        className='flex-1 flex-row items-center gap-3'
        style={templateAnimatedStyle}
        onPress={() => onSelect(template)}
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
        onPress={() => onViewScience(template)}
        onPressIn={handleSciencePressIn}
        onPressOut={handleSciencePressOut}
      >
        <Microscope color='#3B82F6' size={18} strokeWidth={2} />
      </AnimatedPressable>
    </View>
  );
};
