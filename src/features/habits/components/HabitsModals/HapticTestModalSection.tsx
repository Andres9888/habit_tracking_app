import { Modal, Pressable, Text, View } from 'react-native';
import HapticTest from '../../../../components/HapticTest';
import type { HapticTestModalSectionProps } from './HabitsModals.types';

/**
 * Haptic test modal section - provides haptic feedback testing UI
 */
export function HapticTestModalSection({
  showHapticTest,
  closeHapticTest,
}: HapticTestModalSectionProps) {
  return (
    <Modal
      animationType='slide'
      visible={showHapticTest}
      onRequestClose={closeHapticTest}
    >
      <View className='flex-1'>
        <View className='px-4 py-4' style={{ backgroundColor: '#111827' }}>
          <Pressable onPress={closeHapticTest}>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>
              ← Back to App
            </Text>
          </Pressable>
        </View>
        <HapticTest />
      </View>
    </Modal>
  );
}
