import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

interface WOOPReminderProps {
  obstacle: string;
  plan: string;
}

/**
 * WOOPReminder - IF-THEN implementation intention
 */
export function WOOPReminder({ obstacle, plan }: WOOPReminderProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='rounded-2xl p-4'>
      <LinearGradient
        className='absolute inset-0 rounded-2xl'
        colors={['#fffbeb', '#ecfdf5']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='mb-2 flex-row items-center gap-2'>
        <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: themeColors.status.warningLight }}>
          <Target color={themeColors.status.warning} size={iconSizes.small} />
        </View>
        <Text className='font-semibold' style={{ color: themeColors.text.primary }}>Your Plan</Text>
      </View>
      <Text className='text-sm leading-5' style={{ color: themeColors.text.primary }}>
        <Text className='font-medium' style={{ color: themeColors.status.warningText }}>If </Text>
        {obstacle}
        <Text className='font-medium' style={{ color: themeColors.status.successText }}> → then </Text>
        {plan}
      </Text>
    </View>
  );
}
