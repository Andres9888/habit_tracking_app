import { Text, Pressable, Animated as RNAnimated } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface SwipeDeleteActionProps {
  habitName: string;
  dragX: RNAnimated.AnimatedInterpolation<number>;
  onPress: () => void;
}

export function SwipeDeleteAction({ habitName, dragX, onPress }: SwipeDeleteActionProps) {
  const scale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-90, -40, 0],
    outputRange: [1, 0.85, 0.7],
  });

  return (
    <Pressable
      accessibilityLabel={`Delete ${habitName}`}
      className="items-center justify-center"
      style={{ backgroundColor: '#ef4444', width: 90 }}
      onPress={onPress}
    >
      <RNAnimated.View className="items-center" style={{ transform: [{ scale }] }}>
        <Trash2 color="#ffffff" size={20} strokeWidth={2} />
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
          Delete
        </Text>
      </RNAnimated.View>
    </Pressable>
  );
}
