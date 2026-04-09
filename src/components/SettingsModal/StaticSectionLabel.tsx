/** StaticSectionLabel - Non-collapsible section title label */
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import { highContrastColors } from '@/theme/highContrastColors';
import { useThemeColors } from '@/theme/ThemeContext';

interface StaticSectionLabelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  highContrastMode?: boolean;
}

export function StaticSectionLabel({
  title,
  subtitle,
  icon,
  highContrastMode = false,
}: StaticSectionLabelProps) {
  const { colors: themeColors } = useThemeColors();
  const titleColor = highContrastMode ? highContrastColors.accent : themeColors.text.secondary;

  return (
    <View className="flex-row items-center px-4">
      <View className="mr-4 w-10 items-center justify-center">
        {icon ?? null}
      </View>
      <Text
        style={{ ...typography.overline, color: titleColor }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="ml-2 rounded-full px-2 py-0.5"
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
