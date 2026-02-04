/**
 * DangerZone Component
 *
 * Manage section with archive and delete actions.
 * Uses subdued outline styling to reduce visual prominence.
 */

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Trash2, Archive } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DangerZoneProps {
  onArchive: () => void;
  onDelete: () => void;
}

export function DangerZone({ onArchive, onDelete }: DangerZoneProps) {
  return (
    <Animated.View
      className='mx-4 mb-8 mt-4'
      entering={FadeIn.duration(280).delay(250)}
    >
      <Text
        className='mb-4 text-center text-xs font-medium text-stone-400'
        style={{ letterSpacing: 0.5 }}
      >
        MANAGE
      </Text>

      <View className='flex-row gap-3'>
        <Pressable
          accessibilityLabel='Archive habit'
          accessibilityRole='button'
          className='flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-4'
          style={styles.archiveButton}
          onPress={onArchive}
        >
          <Archive color='#F59E0B' size={18} strokeWidth={2} />
          <Text className='text-base font-medium' style={styles.archiveText}>
            Archive
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel='Delete habit'
          accessibilityRole='button'
          className='flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-4'
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Trash2 color='#EF4444' size={18} strokeWidth={2} />
          <Text className='text-base font-medium' style={styles.deleteText}>
            Delete
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  archiveButton: {
    backgroundColor: 'transparent',
    borderColor: '#F59E0B',
  },
  archiveText: {
    color: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderColor: '#EF4444',
  },
  deleteText: {
    color: '#EF4444',
  },
});
