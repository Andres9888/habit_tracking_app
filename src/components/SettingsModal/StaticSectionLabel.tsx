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
    <View className='flex-row items-center px-2' style={{ gap: 7 }}>
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
