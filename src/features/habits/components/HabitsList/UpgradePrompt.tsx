/**
 * UpgradePrompt Component
 * Modal overlay for upgrade CTA — optimized for trial conversion
 *
 * Uses the unified <Modal variant="bottomSheet"> for consistent
 * accessibility (accessibilityViewIsModal, hardware back), gesture
 * dismiss, and dark-mode backdrop handling.
 */

import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal } from '../../../../components/Modal';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { OPACITY } from '../../../../constants';

interface UpgradePromptProps {
  onClose: () => void;
  onUpgradePress: () => void;
  visible: boolean;
}

export function UpgradePrompt({
  onClose,
  onUpgradePress,
  visible,
}: UpgradePromptProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Modal variant='bottomSheet' visible={visible} onClose={onClose}>
      <View className='gap-4 px-2 pb-4'>
        <View className='items-center pb-2'>
          <Text className='text-[32px]'>🚀</Text>
        </View>
        <Text
          className='text-center text-[24px] font-bold tracking-tight'
          style={{ color: colors.text.primary }}
        >
          You're on a roll! Ready for more?
        </Text>
        <Text
          className='text-center text-[15px] font-normal leading-[20px]'
          style={{ color: colors.text.secondary }}
        >
          Track unlimited habits across all areas of your life. Premium
          members build stronger routines and stay consistent 2× longer.
        </Text>
        <View
          className='items-center rounded-2xl px-4 py-3'
          style={{ backgroundColor: isDark ? 'rgba(139,92,246,0.15)' : '#ede9fe' }}
        >
          <Text
            className='text-center text-[13px] font-semibold'
            style={{ color: isDark ? '#a78bfa' : '#6d28d9' }}
          >
            $0 for 7 days · Cancel anytime
          </Text>
        </View>
        <Pressable
          accessibilityHint='Start your 7-day free trial'
          accessibilityLabel='Start 7-day free trial for premium'
          accessibilityRole='button'
          className='items-center rounded-full px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
          style={({ pressed }) => ({ opacity: pressed ? OPACITY.strong : OPACITY.full })}
          onPress={onUpgradePress}
        >
          <LinearGradient
            className='absolute inset-0 rounded-full'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
          <Text className='text-[17px] font-semibold text-white'>
            Start Free Trial →
          </Text>
        </Pressable>
        <Pressable
          accessibilityHint='Dismiss this upgrade prompt'
          accessibilityLabel='Dismiss upgrade prompt'
          accessibilityRole='button'
          className='items-center rounded-full border-2 px-5 py-3'
          style={({ pressed }) => ({
            borderColor: colors.border,
            opacity: pressed ? OPACITY.high : OPACITY.full,
          })}
          onPress={onClose}
        >
          <Text
            className='text-[15px] font-normal'
            style={{ color: colors.text.secondary }}
          >
            Maybe later
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}
