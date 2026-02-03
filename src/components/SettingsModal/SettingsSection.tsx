/**
 * SettingsSection Component
 *
 * A grouped container for related settings rows.
 * Displays a title label and wraps children in a styled card.
 * Supports high contrast mode for accessibility.
 */

import { ReactNode } from 'react';
import { Text, View } from 'react-native';

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
        background: '#ffffff',
        border: '#f5f5f4',
        title: '#78716c', // stone-500
      };

  return (
    <View className='gap-2'>
      <Text
        className='px-2 text-[13px] font-semibold uppercase tracking-[0.7px]'
        style={{ color: colors.title }}
      >
        {title}
      </Text>
      <View
        className='overflow-hidden rounded-[16px]'
        style={{
          backgroundColor: colors.background,
          borderColor: highContrastMode ? colors.border : undefined,
          borderWidth: highContrastMode ? 1 : 0,
        }}
      >
        {children}
      </View>
    </View>
  );
}
