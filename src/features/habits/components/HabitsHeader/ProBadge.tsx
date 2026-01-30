import { Pressable, Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ProBadgeProps {
  onPress: () => void;
}

/**
 * PRO badge that appears next to the Add Habit button for free users.
 * Tapping opens the premium paywall.
 */
export function ProBadge({ onPress }: ProBadgeProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityHint="Upgrade to premium for unlimited habits"
        accessibilityLabel="PRO upgrade"
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          className="h-8 flex-row items-center gap-1.5 rounded-full bg-amber-500 px-3"
          style={{
            elevation: 2,
            shadowColor: '#f59e0b',
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
        >
          <Crown color="#ffffff" size={14} strokeWidth={2.5} />
          <Text className="text-[13px] font-semibold text-white">PRO</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
