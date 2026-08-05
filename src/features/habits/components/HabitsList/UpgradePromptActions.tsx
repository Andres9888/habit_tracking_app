import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';
import { colors as palette } from '../../../../theme';
import { OPACITY } from '../../../../constants';

interface UpgradePromptActionsProps {
  colors: SemanticColors;
  onClose: () => void;
  onUpgradePress: () => void;
}

export function UpgradePromptActions({
  colors,
  onClose,
  onUpgradePress,
}: UpgradePromptActionsProps) {
  return (
    <>
      <Pressable
        accessibilityHint='Start your 7-day free trial'
        accessibilityLabel='Start 7-day free trial for premium'
        accessibilityRole='button'
        className='items-center rounded-full px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
        style={({ pressed }) => ({
          opacity: pressed ? OPACITY.strong : OPACITY.full,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}
        onPress={onUpgradePress}
      >
        <LinearGradient
          className='absolute inset-0 rounded-full'
          colors={[palette.premium[600], palette.indigo[600]]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        />
        <Text className='text-base font-semibold text-white'>
          Start Free Trial →
        </Text>
      </Pressable>
      <Pressable
        accessibilityHint='Dismiss this upgrade prompt'
        accessibilityLabel='Dismiss upgrade prompt'
        accessibilityRole='button'
        className='items-center rounded-full border-2 px-5 py-3'
        style={({ pressed }) => ({
          backgroundColor: `${colors.card}CC`,
          borderColor: colors.border,
          opacity: pressed ? OPACITY.high : OPACITY.full,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}
        onPress={onClose}
      >
        <Text
          className='text-base font-normal'
          style={{ color: colors.text.secondary }}
        >
          Maybe later
        </Text>
      </Pressable>
    </>
  );
}
