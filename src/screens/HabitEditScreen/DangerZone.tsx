/**
 * DangerZone Component — Dark mode aware
 *
 * Destructive actions with confirmation dialogs.
 */

import { Alert, View, Text, Pressable } from 'react-native';
import { Trash2, Archive } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme';

interface DangerZoneProps {
  onArchive: () => void;
  onDelete: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DangerZone({ onArchive, onDelete }: DangerZoneProps) {
  const { isDark } = useThemeColors();
  const archiveScale = useSharedValue(1);
  const deleteScale = useSharedValue(1);

  const archiveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: archiveScale.value }],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
  }));

  const handleArchive = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Archive Habit',
      'This habit will be hidden from your daily list. You can restore it anytime from Settings.',
      [
        { text: 'Keep Active', style: 'cancel' },
        { text: 'Archive', style: 'destructive', onPress: onArchive },
      ],
    );
  };

  const handleDelete = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Habit',
      'This will permanently delete this habit and all its history. This cannot be undone.',
      [
        { text: 'Keep Habit', style: 'cancel' },
        { text: 'Delete Forever', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  // Dark mode: use slightly lighter tinted backgrounds
  const archiveBg = isDark ? '#422006' : '#FFFBEB';
  const archiveBorder = isDark ? '#92400E' : '#FDE68A';
  const deleteBg = isDark ? '#450A0A' : '#FEF2F2';
  const deleteBorder = isDark ? '#991B1B' : '#FECACA';

  const springConfig = { damping: 18, stiffness: 150 };

  return (
    <View className='flex-col gap-3'>
      <AnimatedPressable
        accessibilityLabel='Archive habit'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl py-4'
        style={[archiveStyle, { backgroundColor: archiveBg, borderWidth: 1, borderColor: archiveBorder }]}
        onPress={handleArchive}
        onPressIn={() => { archiveScale.value = withSpring(0.97, springConfig); }}
        onPressOut={() => { archiveScale.value = withSpring(1, springConfig); }}
      >
        <Archive color='#d97706' size={18} strokeWidth={2} />
        <Text
          className='font-semibold'
          style={{ fontSize: 17, letterSpacing: -0.41, color: isDark ? '#FBBF24' : '#B45309' }}
        >
          Archive Habit
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        accessibilityLabel='Delete habit'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl py-4'
        style={[deleteStyle, { backgroundColor: deleteBg, borderWidth: 1, borderColor: deleteBorder }]}
        onPress={handleDelete}
        onPressIn={() => { deleteScale.value = withSpring(0.97, springConfig); }}
        onPressOut={() => { deleteScale.value = withSpring(1, springConfig); }}
      >
        <Trash2 color='#dc2626' size={18} strokeWidth={2} />
        <Text
          className='font-semibold'
          style={{ fontSize: 17, letterSpacing: -0.41, color: isDark ? '#F87171' : '#DC2626' }}
        >
          Delete Habit
        </Text>
      </AnimatedPressable>
    </View>
  );
}
