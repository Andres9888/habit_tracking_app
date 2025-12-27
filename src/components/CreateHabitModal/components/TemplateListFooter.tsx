import { Pressable, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TemplateListFooterProps {
  onClose: () => void;
}

export const TemplateListFooter = ({ onClose }: TemplateListFooterProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 50 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <View className='px-4 pb-6 pt-3'>
      <AnimatedPressable
        accessibilityLabel='Hide template browser'
        accessibilityRole='button'
        className='flex-row items-center justify-center rounded-full bg-[#f4f4f4] px-4 py-3'
        style={animatedStyle}
        onPress={onClose}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className='mr-2 text-[15px] font-semibold text-stone-800'>
          Hide habits
        </Text>
        <ChevronDown color='#1c1917' size={16} />
      </AnimatedPressable>
    </View>
  );
};
