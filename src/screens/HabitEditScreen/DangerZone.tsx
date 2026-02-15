/**
 * DangerZone Component
 *
 * Destructive actions section for habit management.
 * Provides archive (recoverable) and delete (permanent) options
 * with appropriate visual warnings.
 */

import { View, Text, Pressable } from 'react-native';
import { Trash2, Archive } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface DangerZoneProps {
  onArchive: () => void;
  onDelete: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DangerZone({ onArchive, onDelete }: DangerZoneProps) {
  const archiveScale = useSharedValue(1);
  const deleteScale = useSharedValue(1);

  const archiveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: archiveScale.value }],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
  }));

  const handleArchive = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onArchive();
  };

  const handleDelete = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onDelete();
  };

  return (
    <View className='flex-col gap-3'>
      <AnimatedPressable
        accessibilityLabel='Archive habit'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-4'
        style={archiveStyle}
        onPress={handleArchive}
        onPressIn={() => {
          archiveScale.value = withSpring(0.97, { damping: 18, stiffness: 240 });
        }}
        onPressOut={() => {
          archiveScale.value = withSpring(1, { damping: 18, stiffness: 240 });
        }}
      >
        <Archive color='#d97706' size={18} strokeWidth={2} />
        <Text
          className='font-semibold text-amber-700'
          style={{ fontSize: 17, letterSpacing: -0.41 }}
        >
          Archive Habit
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        accessibilityLabel='Delete habit'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-4'
        style={deleteStyle}
        onPress={handleDelete}
        onPressIn={() => {
          deleteScale.value = withSpring(0.97, { damping: 18, stiffness: 240 });
        }}
        onPressOut={() => {
          deleteScale.value = withSpring(1, { damping: 18, stiffness: 240 });
        }}
      >
        <Trash2 color='#dc2626' size={18} strokeWidth={2} />
        <Text
          className='font-semibold text-red-600'
          style={{ fontSize: 17, letterSpacing: -0.41 }}
        >
          Delete Habit
        </Text>
      </AnimatedPressable>
    </View>
  );
}
