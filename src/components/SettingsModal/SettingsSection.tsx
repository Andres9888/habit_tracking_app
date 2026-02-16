/* eslint-disable max-lines-per-function */
/** SettingsSection - OPTIMIZED: Deeper shadows, better card styling */
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';

interface SettingsSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  highContrastMode?: boolean;
}

export function SettingsSection({
  title,
  subtitle,
  children,
  highContrastMode = false,
}: SettingsSectionProps) {
  const { colors: themeColors, isDark } = useThemeColors();

  const colors = highContrastMode
    ? {
        background: '#111111',
        border: '#2f2f2f',
        title: '#facc15',
      }
    : {
        background: themeColors.card,
        border: themeColors.border,
        title: themeColors.text.secondary,
      };

  return (
    <View className='gap-2'>
      <View className='flex-row items-center gap-2 px-1'>
        <Text
          className='text-[13px] font-semibold uppercase tracking-[0.7px]'
          style={{ color: colors.title }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className='rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase'
            style={{
              backgroundColor: isDark ? '#422006' : '#fef3c7',
              color: isDark ? '#fbbf24' : '#92400e',
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: colors.background,
          borderColor: highContrastMode ? colors.border : undefined,
          borderWidth: highContrastMode ? 1 : 0,
          elevation: highContrastMode ? 0 : 3,
          shadowColor: highContrastMode
            ? 'transparent'
            : isDark
              ? '#000000'
              : '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: highContrastMode ? 0 : 0.08,
          shadowRadius: 16,
        }}
      >
        {children}
      </View>
    </View>
  );
}
