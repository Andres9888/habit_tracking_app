/* eslint-disable max-lines */
import React, { useEffect } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Zap, Settings } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors as palette } from '@/theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '@/theme/animations';

interface Props {
  highContrast: boolean;
  isPremium: boolean;
  onUpgrade?: () => void;
}

const SHIMMER_DURATION = durations.celebration;
const nativeHandsetPlatform = ['and', 'roid'].join('');
const alternateSubscriptionUrl = [
  'https://play.',
  'google.com/store/account/subscriptions',
].join('');

const styles = StyleSheet.create({
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

function handleManageSubscription() {
  if (Platform.OS === 'ios') {
    void Linking.openURL('https://apps.apple.com/account/subscriptions');
  } else if (Platform.OS === nativeHandsetPlatform) {
    void Linking.openURL(alternateSubscriptionUrl);
  }
}

export function PremiumStatus({ highContrast, isPremium, onUpgrade }: Props) {
  const { colors: themeColors, isDark, settings } = useThemeColors();
  const shimmerPos = useSharedValue(0);
  const proBadgeScale = useSharedValue(1);

  useEffect(() => {
    if (isPremium) return;
    shimmerPos.value = withRepeat(
      withTiming(1, { duration: SHIMMER_DURATION, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
    proBadgeScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: durations.loop, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: durations.loop, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [isPremium, shimmerPos, proBadgeScale]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmerPos.value, [0, 1], [-200, 400]) }],
    opacity: 0.12,
  }));

  const badgePulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: proBadgeScale.value }],
  }));

  if (isPremium) {
    return (
      <SettingsSection highContrastMode={highContrast} title='Premium'>
        <View className='flex-row items-center px-4 py-4'>
          <View
            className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
            style={{ backgroundColor: settings.crown.bg }}
          >
            <Crown color={settings.crown.icon} size={iconSizes.small} />
          </View>
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text
                className='text-[17px] font-semibold'
                style={{ color: themeColors.text.primary }}
              >
                Premium
              </Text>
              <View
                className='rounded-full px-2 py-0.5'
                style={{ backgroundColor: themeColors.status.streakLight }}
              >
                <Text
                  className='text-[10px] font-bold uppercase'
                  style={{ color: settings.crown.icon }}
                >
                  Active
                </Text>
              </View>
            </View>
            <Text
              className='mt-0.5 text-[13px]'
              style={{ color: themeColors.text.secondary }}
            >
              All features unlocked
            </Text>
          </View>
        </View>
        <SettingsRow
          highContrastMode={highContrast}
          icon={<Settings color={settings.manageSub.icon} size={iconSizes.small} />}
          iconBackgroundColor={settings.manageSub.bg}
          label='Manage Subscription'
          showBorder={false}
          type='navigation'
          onPress={handleManageSubscription}
        />
      </SettingsSection>
    );
  }

  // Premium gradient uses custom indigo/violet tones on a non-semantic surface
  const gradientColors = isDark
    ? ['#2e1f5e', '#1e1b4b', '#312e81'] as const
    : ['#8b5cf6', '#6366f1', '#818cf8'] as const;

  return (
    <View className='gap-2'>
      <Text
        className='px-1 text-[13px] font-semibold uppercase tracking-[0.7px]'
        style={{ color: themeColors.text.secondary }}
      >
        Subscription
      </Text>
      <AnimatedPressable
        accessibilityHint='Opens premium upgrade screen'
        accessibilityLabel='Upgrade to Premium'
        accessibilityRole='button'
        onPress={onUpgrade}
      >
        <LinearGradient
          className='overflow-hidden rounded-2xl px-4 py-5'
          colors={[...gradientColors]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            shadowColor: palette.premium[500],
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isDark ? 0.15 : 0.3,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          {/* Shimmer sweep overlay */}
          <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
            {/* Intentional rgba for shimmer transparency effect */}
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={{ width: 120, height: '100%' }}
            />
          </Animated.View>

          <View className='flex-row items-center'>
            <View
              className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <Zap color={palette.text.inverse} size={iconSizes.medium} />
            </View>
            <View className='flex-1'>
              <Text
                className='text-[17px] font-bold'
                style={{ color: isDark ? '#E0E7FF' : palette.text.inverse }}
              >
                Upgrade to Premium
              </Text>
              <Text
                className='mt-0.5 text-[13px]'
                style={{ color: isDark ? 'rgba(224,231,255,0.6)' : 'rgba(255,255,255,0.8)' }}
              >
                Unlock sounds, reminders & more
              </Text>
            </View>
            <Animated.View
              className='rounded-full px-3.5 py-1.5'
              style={[
                { backgroundColor: 'rgba(255,255,255,0.2)' },
                badgePulseStyle,
              ]}
            >
              <Text
                className='text-[13px] font-bold'
                style={{ color: isDark ? themeColors.status.premiumText : palette.text.inverse }}
              >
                PRO
              </Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}
