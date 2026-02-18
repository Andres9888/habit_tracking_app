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
  const { colors: themeColors } = useThemeColors();
  return (
    <Modal
      accessibilityViewIsModal
      animationType='slide'
      visible={showHapticTest}
      onRequestClose={closeHapticTest}
    >
      <View className='flex-1'>
        <View className='px-4 py-4' style={{ backgroundColor: themeColors.card }}>
          <Pressable
            accessibilityHint='Go back to the habits app'
            accessibilityLabel='Go back'
            accessibilityRole='button'
            onPress={closeHapticTest}
          >
            <Text style={{ color: themeColors.text.primary, fontSize: 17, fontWeight: '600' }}>
              ← Back to App
            </Text>
          </Pressable>
        </View>
        <HapticTest />
      </View>
    </Modal>
  );
}
