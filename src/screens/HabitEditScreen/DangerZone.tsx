/**
 * DangerZone Component — Dark mode aware
 *
 * Destructive actions with confirmation dialogs.
 */

import { Alert, View, Text, Pressable } from 'react-native';
import { Trash2, Archive } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme';
import { typography } from '@/theme/typography';
import { springs } from '@/theme/animations';
import { iconSizes } from '@/theme/iconSizes';

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
    void triggerHaptic('toggle');
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
    void triggerHaptic('warning');
    Alert.alert(
      'Delete Habit',
      'This will permanently delete this habit and all its history. This cannot be undone.',
      [
        { text: 'Keep Habit', style: 'cancel' },
        { text: 'Delete Forever', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  const archiveBg = isDark ? 'rgba(146,64,14,0.15)' : '#FFFBEB';
  const archiveBorder = isDark ? 'rgba(146,64,14,0.3)' : '#FDE68A';
  const deleteBg = isDark ? 'rgba(153,27,27,0.15)' : '#FEF2F2';
  const deleteBorder = isDark ? 'rgba(153,27,27,0.3)' : '#FECACA';

  return (
    <View className='flex-col gap-3'>
      <AnimatedPressable
        accessibilityLabel='Archive habit'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl py-4'
        style={[archiveStyle, { backgroundColor: archiveBg, borderWidth: 1, borderColor: archiveBorder }]}
        onPress={handleArchive}
        onPressIn={() => { archiveScale.value = withSpring(0.97, springs.button); }}
        onPressOut={() => { archiveScale.value = withSpring(1, springs.button); }}
      >
        <Archive color={isDark ? '#FBBF24' : '#d97706'} size={iconSizes.medium} strokeWidth={2} />
        <Text
          className='font-semibold'
          style={{ ...typography.button, letterSpacing: -0.41, color: isDark ? '#FBBF24' : '#B45309' }}
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
        onPressIn={() => { deleteScale.value = withSpring(0.97, springs.button); }}
        onPressOut={() => { deleteScale.value = withSpring(1, springs.button); }}
      >
        <Trash2 color={isDark ? '#F87171' : '#dc2626'} size={iconSizes.medium} strokeWidth={2} />
        <Text
          className='font-semibold'
          style={{ ...typography.button, letterSpacing: -0.41, color: isDark ? '#F87171' : '#DC2626' }}
        >
          Delete Habit
        </Text>
      </AnimatedPressable>
    </View>
  );
}
