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

  const handleManageSubscription = () => {
    if (Platform.OS === 'ios') {
      void Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else if (Platform.OS === 'android') {
      void Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  };

  if (isPremium) {
    return (
      <SettingsSection highContrastMode={highContrast} title='Premium'>
        <View className='flex-row items-center px-4 py-4'>
          <View
            className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
            style={{ backgroundColor: themeColors.warning.background }}
          >
            <Crown color={themeColors.warning.primary} size={16} />
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
                style={{
                  backgroundColor: themeColors.warning.background,
                }}
              >
                <Text
                  className='text-[10px] font-bold uppercase'
                  style={{ color: themeColors.warning.primary }}
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
          icon={<Settings color={themeColors.category.indigo.primary} size={16} />}
          iconBackgroundColor={themeColors.info.background}
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
            style={{ backgroundColor: '#ede9fe' }}
          >
            <Zap color='#8b5cf6' size={16} />
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
            style={{
              backgroundColor: '#8b5cf6',
            }}
          >
            <Text className='text-[13px] font-bold text-white'>PRO</Text>
          </View>
        </View>
      </AnimatedPressable>
    </SettingsSection>
  );
}
