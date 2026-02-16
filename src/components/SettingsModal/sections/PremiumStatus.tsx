import React, { useCallback } from 'react';
import { Text, View, Linking } from 'react-native';
import { Crown, Zap, ExternalLink } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  isPremium: boolean;
  isTrialActive?: boolean;
  expirationDate?: Date | null;
  managementUrl?: string | null;
  onUpgrade?: () => void;
}

export function PremiumStatus({ highContrast, isPremium, isTrialActive, expirationDate, managementUrl, onUpgrade }: Props) {
  const { colors: themeColors, isDark } = useThemeColors();

  const handleManageSubscription = useCallback(() => {
    if (managementUrl) {
      void Linking.openURL(managementUrl);
    }
  }, [managementUrl]);

  const formatExpirationDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isPremium) {
    const statusLabel = isTrialActive ? 'Trial' : 'Active';
    const statusBgColor = isTrialActive
      ? (isDark ? '#1e3a5f' : '#dbeafe')
      : (isDark ? '#422006' : '#fef3c7');
    const statusTextColor = isTrialActive ? '#3b82f6' : '#f59e0b';

    const subtitleText = isTrialActive && expirationDate
      ? `Trial ends ${formatExpirationDate(expirationDate)}`
      : expirationDate
        ? `Renews ${formatExpirationDate(expirationDate)}`
        : 'All features unlocked';

    return (
      <SettingsSection highContrastMode={highContrast} title='Subscription'>
        <View className='flex-row items-center px-4 py-4'>
          <View
            className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
            style={{ backgroundColor: '#fef3c7' }}
          >
            <Crown color='#f59e0b' size={16} />
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
                style={{ backgroundColor: statusBgColor }}
              >
                <Text
                  className='text-[10px] font-bold uppercase'
                  style={{ color: statusTextColor }}
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
            <Text
              className='mt-0.5 text-[13px]'
              style={{ color: themeColors.text.secondary }}
            >
              {subtitleText}
            </Text>
          </View>
        </View>
        {managementUrl && (
          <AnimatedPressable
            accessibilityHint='Opens subscription management in App Store or Play Store'
            accessibilityLabel='Manage Subscription'
            accessibilityRole='link'
            onPress={handleManageSubscription}
          >
            <View className='flex-row items-center border-t border-stone-200/50 px-4 py-3'>
              <ExternalLink color={themeColors.text.secondary} size={14} />
              <Text
                className='ml-2 text-[13px]'
                style={{ color: '#8b5cf6' }}
              >
                Manage Subscription
              </Text>
            </View>
          </AnimatedPressable>
        )}
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
