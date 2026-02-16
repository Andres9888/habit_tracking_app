import { Modal, Pressable, Text, View } from 'react-native';
import HapticTest from '../../../../components/HapticTest';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { HapticTestModalSectionProps } from './HabitsModals.types';

/**
 * Haptic test modal section - provides haptic feedback testing UI
 */
export function HapticTestModalSection({
  showHapticTest,
  closeHapticTest,
}: HapticTestModalSectionProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Modal
      animationType='slide'
      visible={showHapticTest}
      onRequestClose={closeHapticTest}
    >
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <View
          className='px-4 py-4'
          style={{ backgroundColor: isDark ? '#1F2937' : '#111827' }}
        >
          <Pressable
            accessibilityHint='Go back to the habits app'
            accessibilityLabel='Go back'
            accessibilityRole='button'
            onPress={closeHapticTest}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '600' }}>
              ← Back to App
            </Text>
          </Pressable>
        </View>
        <HapticTest />
      </View>
    </Modal>
  );
}
