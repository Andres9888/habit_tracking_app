/** StaticSectionLabel — quiet sentence-case section label (sans, no icon) */
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { fontFamilies, typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';

interface StaticSectionLabelProps {
  title: string;
  subtitle?: string;
  /** Accepted for API compatibility; main-list labels are icon-free. */
  icon?: ReactNode;
}

export function StaticSectionLabel({ title, subtitle }: StaticSectionLabelProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-row items-center px-3' style={{ gap: 8 }}>
      <Text
        style={{
          fontFamily: fontFamilies.primary.text,
          fontSize: 13,
          fontWeight: fontWeights.semibold,
          letterSpacing: -0.1,
          color: themeColors.text.secondary,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className='rounded-full px-2 py-0.5'
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
