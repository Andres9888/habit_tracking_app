/**
 * UpgradePrompt Component
 * Modal overlay for upgrade CTA — optimized for trial conversion
 */

import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors } = useThemeColors();

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
    >
      <Pressable
        accessibilityHint='Tap outside to dismiss'
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={onClose}
      />
      <Animated.View
        className='w-full rounded-t-3xl px-6 py-8'
        entering={SlideInDown.duration(280).damping(18)}
        style={{ backgroundColor: colors.card }}
      >
        <View className='gap-4'>
          <View className='items-center pb-2'>
            <Text className='text-[32px]'>🚀</Text>
          </View>
          <Text
            style={[styles.title, { color: colors.text.primary }]}
          >
            You're on a roll! Ready for more?
          </Text>
          <Text
            style={[styles.subtitle, { color: colors.text.secondary }]}
          >
            Track unlimited habits across all areas of your life. Premium
            members build stronger routines and stay consistent 2× longer.
          </Text>
          <View className='items-center rounded-2xl bg-violet-50 px-4 py-3'>
            <Text className='text-center text-[13px] font-semibold text-violet-700'>
              $0 for 7 days · Cancel anytime
            </Text>
          </View>
          <Pressable
            accessibilityHint='Start your 7-day free trial'
            accessibilityLabel='Start 7-day free trial for premium'
            accessibilityRole='button'
            className='items-center rounded-full px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
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
            style={[
              styles.dismissButton,
              {
                backgroundColor: `${colors.surface}CC`,
                borderColor: colors.border,
              },
              ({ pressed }) => ({ opacity: pressed ? 0.7 : 1 }),
            ]}
            onPress={onClose}
          >
            <Text style={[styles.dismissText, { color: colors.text.secondary }]}>
              Maybe later
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dismissButton: {
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dismissText: {
    fontSize: 15,
    fontWeight: '400',
  },
  overlay: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'flex-end',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
