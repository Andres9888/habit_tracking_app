/** StaticSectionLabel — editorial section heading: serif title, optional badge.
 *  The trailing green glyph was dropped: at heading scale it read as decoration
 *  competing with the row icon tiles below it. `icon` stays in the props so
 *  collapsible sections (which do use a glyph) share one call signature. */
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
    <View className='flex-row items-center' style={{ gap: 7 }}>
      <Text
        style={{
          ...settingsSectionTitle,
          color: themeColors.text.primary,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className='ml-2 rounded-full px-2 py-0.5'
          style={{
            // Neutral, not amber: amber is the PRO marker. A section badge
            // wearing it made "premium", "metadata" and "something is broken"
            // all the same colour.
            ...typography.tabBar,
            borderColor: themeColors.border,
            borderWidth: 1,
            fontWeight: fontWeights.semibold,
            textTransform: 'uppercase',
            backgroundColor: themeColors.background,
            color: themeColors.text.secondary,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
