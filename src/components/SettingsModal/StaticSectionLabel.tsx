/** StaticSectionLabel - Non-collapsible section title label */
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';

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
    <View className='flex-row items-center px-4'>
      <View className='mr-4 w-10 items-center justify-center'>
        {icon ?? null}
      </View>
      <Text
        style={{
          fontFamily: typography.heading3.fontFamily,
          fontSize: 15,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.2,
          color: themeColors.text.primary,
        }}
      >
        {title}
      </Text>
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
