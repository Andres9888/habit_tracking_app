/** StaticSectionLabel - iOS grouped-list section label: serif title + trailing green glyph */
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';
import { settingsSectionTitle } from './settingsSectionTitleStyle';

interface StaticSectionLabelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function StaticSectionLabel({
  title,
  subtitle,
  icon,
}: StaticSectionLabelProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-row items-center px-2' style={{ gap: 7 }}>
      <Text
        style={{
          ...settingsSectionTitle,
          color: themeColors.text.primary,
        }}
      >
        {title}
      </Text>
      {icon ? (
        <View className='items-center justify-center'>{icon}</View>
      ) : null}
      {subtitle ? (
        <Text
          className='ml-2 rounded-full px-2 py-0.5'
          style={{
            ...typography.tabBar,
            fontWeight: fontWeights.semibold,
            textTransform: 'uppercase',
            backgroundColor: themeColors.status.warningLight,
            color: themeColors.status.warningText,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
