/** SettingsHeader - OPTIMIZED: FadeInDown, AnimatedPressable, X button */
import { X } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { SettingsColors } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(View);

interface SettingsHeaderProps {
  colors: SettingsColors;
  paddingTop: number;
  onClose: () => void;
}

export function SettingsHeader({
  colors,
  paddingTop,
  onClose,
}: SettingsHeaderProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Animated.View
      className='bg-background px-5 pb-4'
      entering={FadeInDown.duration(280).springify().damping(18)}
      style={{ backgroundColor: colors.background, paddingTop }}
    >
      <View className='flex-row items-center justify-between'>
        <AnimatedPressable
          accessibilityLabel='Close settings'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
          style={animStyle}
          onTouchCancel={() => {
            scale.value = withSpring(1, { damping: 15 });
          }}
          onTouchEnd={() => {
            scale.value = withSpring(1, { damping: 15 });
            handlePress();
          }}
          onTouchStart={() => {
            scale.value = withSpring(0.9, { damping: 15 });
          }}
        >
          <X color={colors.icon} size={20} strokeWidth={2.5} />
        </AnimatedPressable>
        <Text
          className='text-[22px] font-bold tracking-tight'
          style={{ color: colors.headerText, letterSpacing: -0.5 }}
        >
          Settings
        </Text>
        <View className='h-10 w-10' />
      </View>
    </Animated.View>
  );
}
