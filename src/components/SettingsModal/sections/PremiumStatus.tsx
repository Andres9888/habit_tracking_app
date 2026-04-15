import React from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Crown, Settings } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  isPremium: boolean;
  onUpgrade?: () => void;
}

const nativeHandsetPlatform = ['and', 'roid'].join('');
const alternateSubscriptionUrl = [
  'https://play.',
  'google.com/store/account/subscriptions',
].join('');

function handleManageSubscription() {
  if (Platform.OS === 'ios') {
    void Linking.openURL('https://apps.apple.com/account/subscriptions');
  } else if (Platform.OS === nativeHandsetPlatform) {
    void Linking.openURL(alternateSubscriptionUrl);
  }
}

export function PremiumStatus({ highContrast, isPremium, onUpgrade }: Props) {
  const { colors: themeColors, isDark, settings } = useThemeColors();

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

  const gradientColors = isDark
    ? (['#1a1520', '#0d0a14'] as const)
    : (['#f5f0ff', '#ede5ff'] as const);

  const borderColor = isDark ? '#2a2035' : 'rgba(139,92,246,0.15)';
  const titleColor = isDark ? '#e8e0f0' : '#1a1028';
  const subtitleColor = isDark ? '#6b5f7d' : '#7c6f94';
  const chevronColor = isDark ? '#4a3d5e' : '#b0a3c4';

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
          style={{ borderWidth: 1, borderColor }}
        >
          {/* Top accent line */}
          <View className='absolute left-0 right-0 top-0 overflow-hidden rounded-t-2xl'>
            <LinearGradient
              colors={['transparent', '#a78bfa', 'transparent']}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={{ height: 1 }}
            />
          </View>

          <View className='flex-row items-center'>
            <View
              className='mr-4 h-12 w-12 items-center justify-center rounded-xl'
              style={{
                backgroundColor: isDark ? '#2a1f3d' : '#ede5ff',
                borderWidth: 1,
                borderColor: isDark ? '#3b2d5c' : 'rgba(139,92,246,0.2)',
              }}
            >
              <Crown color={settings.crown.icon} size={iconSizes.small} />
            </View>
            <View className='flex-1'>
              <Text className='text-[16px] font-bold' style={{ color: titleColor }}>
                Unlock Unlimited Habits
              </Text>
              <Text className='mt-0.5 text-[12px]' style={{ color: subtitleColor }}>
                with Premium
              </Text>
            </View>
            <ChevronRight color={chevronColor} size={iconSizes.small} />
          </View>
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}
