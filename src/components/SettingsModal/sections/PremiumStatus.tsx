import React from 'react';
import { Linking, Text, View } from 'react-native';
import { AlertTriangle, Crown, Zap } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { SubscriptionStatus } from '../../../hooks/usePremium/types';

interface Props {
  highContrast: boolean;
  isPremium: boolean;
  /** Subscription status for showing billing issue / expired warnings */
  status?: SubscriptionStatus;
  /** Whether there is a billing issue */
  hasBillingIssue?: boolean;
  /** URL to manage subscription in App Store / Play Store */
  managementUrl?: string | null;
  onUpgrade?: () => void;
}

export function PremiumStatus({
  highContrast,
  isPremium,
  status,
  hasBillingIssue = false,
  managementUrl,
  onUpgrade,
}: Props) {
  const { colors: themeColors, isDark } = useThemeColors();

  // Billing issue banner — shown when premium is active but payment failed
  const billingIssueWarning = hasBillingIssue ? (
    <AnimatedPressable
      onPress={() => {
        if (managementUrl) {
          void Linking.openURL(managementUrl);
        }
      }}
    >
      <View
        className='mx-4 mb-2 flex-row items-center rounded-xl px-3 py-2.5'
        style={{ backgroundColor: isDark ? '#451a03' : '#fef3c7' }}
      >
        <AlertTriangle color='#d97706' size={16} />
        <Text
          className='ml-2 flex-1 text-[13px]'
          style={{ color: isDark ? '#fbbf24' : '#92400e' }}
        >
          Payment issue — update your payment method to keep Premium.
        </Text>
      </View>
    </AnimatedPressable>
  ) : null;

  if (isPremium) {
    const statusLabel =
      status === 'past_due'
        ? 'Payment Issue'
        : status === 'trialing'
          ? 'Trial'
          : 'Active';
    const statusColor =
      status === 'past_due' ? '#d97706' : '#f59e0b';
    const statusBg =
      status === 'past_due'
        ? isDark
          ? '#451a03'
          : '#fef3c7'
        : isDark
          ? '#422006'
          : '#fef3c7';

    return (
      <SettingsSection highContrastMode={highContrast} title='Subscription'>
        {billingIssueWarning}
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
                style={{ backgroundColor: statusBg }}
              >
                <Text
                  className='text-[10px] font-bold uppercase'
                  style={{ color: statusColor }}
                >
                  {statusLabel}
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
      </SettingsSection>
    );
  }

  // Expired state — different messaging from never-subscribed
  const isExpired = status === 'expired';

  return (
    <SettingsSection highContrastMode={highContrast} title='Subscription'>
      <AnimatedPressable onPress={onUpgrade}>
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
              {isExpired ? 'Resubscribe to Premium' : 'Upgrade to Premium'}
            </Text>
            <Text
              className='mt-0.5 text-[13px]'
              style={{ color: themeColors.text.secondary }}
            >
              {isExpired
                ? 'Your subscription has expired — resubscribe to unlock all features'
                : 'Unlock sounds, reminders, and more'}
            </Text>
          </View>
          <View
            className='rounded-full px-3 py-1.5'
            style={{
              backgroundColor: '#8b5cf6',
            }}
          >
            <Text className='text-[13px] font-bold text-white'>
              PRO
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </SettingsSection>
  );
}
