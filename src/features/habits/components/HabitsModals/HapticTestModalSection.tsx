import { Modal, Pressable, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
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
      accessibilityViewIsModal
      animationType='slide'
      visible={showHapticTest}
      onRequestClose={closeHapticTest}
    >
      <View className='flex-1'>
        <View className='px-4 py-4' style={{ backgroundColor: colors.dark.background }}>
          <Pressable
            accessibilityHint='Go back to the habits app'
            accessibilityLabel='Go back'
            accessibilityRole='button'
            onPress={closeHapticTest}
          >
            <Text style={{ color: colors.text.inverse, fontFamily: fontFamilies.primary.text, fontSize: typography.body.fontSize, fontWeight: fontWeights.semibold }}>
              ← Back to App
            </Text>
          </Pressable>
        </View>
        <HapticTest />
      </View>
    </Modal>
  );
}
