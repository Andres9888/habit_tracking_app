import React from 'react';
import { Linking, Platform, Pressable, Text, View } from 'react-native';
import { Crown, Zap, Settings, Infinity, Bell, BarChart3, Sparkles, RotateCcw } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { usePremium } from '../../../hooks/usePremium';

interface Props {
  highContrast: boolean;
  isPremium: boolean;
  onUpgrade?: () => void;
}

const PREMIUM_BENEFITS = [
  { icon: Infinity, label: 'Unlimited habits', color: '#8b5cf6' },
  { icon: Bell, label: 'Smart reminders', color: '#f59e0b' },
  { icon: BarChart3, label: 'Advanced analytics', color: '#059669' },
  { icon: Sparkles, label: 'AI-powered insights', color: '#ec4899' },
];

export function PremiumStatus({ highContrast, isPremium, onUpgrade }: Props) {
  const { colors: themeColors, isDark } = useThemeColors();
  const { restorePurchases } = usePremium();

  const handleManageSubscription = () => {
    if (Platform.OS === 'ios') {
      void Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else if (Platform.OS === 'android') {
      void Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  };

  const handleRestore = () => {
    void restorePurchases();
  };

  if (isPremium) {
    return (
      <SettingsSection highContrastMode={highContrast} title='Premium'>
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
                style={{
                  backgroundColor: isDark ? '#422006' : '#fef3c7',
                }}
              >
                <Text
                  className='text-[10px] font-bold uppercase'
                  style={{ color: '#f59e0b' }}
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
      {/* Main upgrade CTA */}
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
              7-day free trial · Cancel anytime
            </Text>
          </View>
          <View
            className='rounded-full px-3 py-1.5'
            style={{ backgroundColor: '#8b5cf6' }}
          >
            <Text className='text-[13px] font-bold text-white'>PRO</Text>
          </View>
        </View>
      </AnimatedPressable>

      {/* Why Premium? benefits list */}
      <View className='px-4 pb-3'>
        <Text
          className='mb-2.5 text-[11px] font-semibold uppercase tracking-widest'
          style={{ color: themeColors.text.secondary }}
        >
          Why Premium?
        </Text>
        <View className='gap-2.5'>
          {PREMIUM_BENEFITS.map((benefit) => (
            <View key={benefit.label} className='flex-row items-center gap-3'>
              <View
                className='h-7 w-7 items-center justify-center rounded-lg'
                style={{ backgroundColor: `${benefit.color}15` }}
              >
                <benefit.icon color={benefit.color} size={14} />
              </View>
              <Text
                className='text-[14px]'
                style={{ color: themeColors.text.primary }}
              >
                {benefit.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Restore Purchases - accessible from settings */}
      <SettingsRow
        highContrastMode={highContrast}
        icon={<RotateCcw color='#6b7280' size={16} />}
        iconBackgroundColor={isDark ? '#374151' : '#f3f4f6'}
        label='Restore Purchases'
        showBorder={false}
        type='navigation'
        onPress={handleRestore}
      />
    </SettingsSection>
  );
}
