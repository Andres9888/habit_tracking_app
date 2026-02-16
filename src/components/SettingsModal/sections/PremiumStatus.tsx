import React from 'react';
import { Text, View } from 'react-native';
import { Crown, Zap } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export function PremiumStatus({ highContrast, isPremium, onUpgrade }: Props) {
  const { colors: themeColors, isDark } = useThemeColors();

  if (isPremium) {
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
                style={{
                  backgroundColor: isDark ? '#422006' : '#fef3c7',
                }}
              >
                <Text
                  className='text-[10px] font-bold uppercase'
                  style={{ color: isDark ? '#fbbf24' : '#b45309' }}
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
