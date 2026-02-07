/** SettingsSection - OPTIMIZED: Deeper shadows, better card styling */
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { colors as themeColors } from '@/theme/colors';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  highContrastMode?: boolean;
}

export function SettingsSection({
  title,
  children,
  highContrastMode = false,
}: SettingsSectionProps) {
  const colors = highContrastMode
    ? {
        background: '#111111',
        border: '#2f2f2f',
        title: '#facc15',
      }
    : {
        background: themeColors.light.card,
        border: themeColors.gray[100],
        title: themeColors.gray[500],
      };

  return (
    <View className='gap-2'>
      <Text
        className='px-1 text-[13px] font-semibold uppercase tracking-[0.7px]'
        style={{ color: colors.title }}
      >
        {title}
      </Text>
      <View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: colors.background,
          borderColor: highContrastMode ? colors.border : undefined,
          borderWidth: highContrastMode ? 1 : 0,
          elevation: highContrastMode ? 0 : 3,
          shadowColor: highContrastMode ? 'transparent' : '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: highContrastMode ? 0 : 0.06,
          shadowRadius: 12,
        }}
      >
        {children}
      </View>
    </View>
  );
}
