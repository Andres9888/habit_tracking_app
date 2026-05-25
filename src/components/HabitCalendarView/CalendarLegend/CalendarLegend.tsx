import { Text, View } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

interface LegendItem {
  label: string;
  indicatorColor: string;
  textColor: string;
}

function getLegendItems(colors: SemanticColors): LegendItem[] {
  return [
    {
      label: 'Completed',
      indicatorColor: colors.primary[500],
      textColor: colors.primary[700],
    },
    {
      label: 'Missed',
      indicatorColor: colors.error,
      textColor: colors.error,
    },
    {
      label: 'Today',
      indicatorColor: colors.primary[500],
      textColor: colors.primary[600],
    },
    {
      label: 'Upcoming',
      indicatorColor: colors.gray[300],
      textColor: colors.gray[400],
    },
  ];
}

/**
 * CalendarLegend - Visual legend explaining calendar color meanings
 * 
 * Features:
 * - Dark mode support via ThemeContext
 * - Semantic color system for accessibility
 * - Screen reader support with ARIA roles
 * - Explains all four status states
 */
export function CalendarLegend() {
  const { colors } = useThemeColors();
  const legendItems = getLegendItems(colors);

  return (
    <View
      accessibilityLabel='Calendar legend'
      accessibilityRole='list'
      className='flex-row flex-wrap items-center justify-center gap-4 pb-1 pt-2'
    >
      {legendItems.map(({ label, indicatorColor, textColor }) => (
        <View
          key={label}
          accessibilityRole='listitem'
          className='flex-row items-center gap-1.5'
        >
          <View
            accessibilityLabel={label}
            style={{
              width: 10,
              height: 10,
              borderRadius: borderRadius.full,
              backgroundColor: indicatorColor,
            }}
          />
          <Text
            style={{
              fontFamily: fontFamilies.primary.text,
              fontSize: typography.tabBar.fontSize,
              fontWeight: fontWeights.medium,
              color: textColor,
            }}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
