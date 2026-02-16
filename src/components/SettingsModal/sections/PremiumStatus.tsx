import React from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import { Crown, Zap, Settings } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export function PremiumStatus({ highContrast, isPremium, onUpgrade }: Props) {
  const { colors: themeColors, isDark } = useThemeColors();

  // Premium badge colors
  const crownBg = isDark ? '#422006' : '#fef3c7';
  const crownIcon = isDark ? '#FBBF24' : '#f59e0b';
  const activeBadgeBg = isDark ? '#422006' : '#fef3c7';
  const activeBadgeText = isDark ? '#FBBF24' : '#f59e0b';

  // Upgrade colors
  const zapBg = isDark ? '#2E1065' : '#ede9fe';
  const zapIcon = isDark ? '#A78BFA' : '#8b5cf6';
  const proBadgeBg = isDark ? '#6D28D9' : '#8b5cf6';

  if (isPremium) {
    return (
      <SettingsSection highContrastMode={highContrast} title='Premium'>
        <View className='flex-row items-center px-4 py-4'>
          <View
            className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
            style={{ backgroundColor: crownBg }}
          >
            <Crown color={crownIcon} size={16} />
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
                style={{ backgroundColor: activeBadgeBg }}
              >
                <Text
                  className='text-[10px] font-bold uppercase'
                  style={{ color: activeBadgeText }}
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
          icon={<Settings color='#6366f1' size={16} />}
          iconBackgroundColor='#e0e7ff'
          label='Manage Subscription'
          showBorder={false}
          type='navigation'
          onPress={handleManageSubscription}
        />
      </SettingsSection>
    );
  }

  return (
    <SettingsSection highContrastMode={highContrast} title='Subscription'>
      <AnimatedPressable
        accessibilityHint='Opens premium upgrade screen'
        accessibilityLabel='Upgrade to Premium'
        accessibilityRole='button'
        onPress={onUpgrade}
      >
        <View className='flex-row items-center px-4 py-4'>
          <View
            className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
            style={{ backgroundColor: zapBg }}
          >
            <Zap color={zapIcon} size={16} />
          </View>
          <View className='flex-1'>
            <Text
              className='text-[17px] font-semibold'
              style={{ color: themeColors.text.primary }}
            >
              Upgrade to Premium
            </Text>
            <Text
              className='mt-0.5 text-[13px]'
              style={{ color: themeColors.text.secondary }}
            >
              Unlock sounds, reminders, and more
            </Text>
          </View>
          <View
            className='rounded-full px-3 py-1.5'
            style={{ backgroundColor: proBadgeBg }}
          >
            <Text className='text-[13px] font-bold text-white'>PRO</Text>
          </View>
        </View>
      </AnimatedPressable>
    </SettingsSection>
  );
}
