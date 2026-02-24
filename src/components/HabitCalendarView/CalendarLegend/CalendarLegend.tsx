import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '@/theme/typography';

interface LegendItem {
  label: string;
  indicatorColor: string;
  textColor: string;
}

/**
 * Gets legend items with theme-aware colors for dark mode support.
 * Uses semantic colors from the theme system.
 */
function getLegendItems(colors: unknown): LegendItem[] {
  return [
    {
      label: 'Completed',
      indicatorColor: colors.success?.[500] || '#10B981',
      textColor: colors.success?.[700] || '#047857',
    },
    {
      label: 'Missed',
      indicatorColor: colors.error?.[400] || '#F87171',
      textColor: colors.error?.[500] || '#EF4444',
    },
    {
      label: 'Today',
      indicatorColor: colors.success?.[500] || '#10B981',
      textColor: colors.success?.[600] || '#059669',
    },
    {
      label: 'Upcoming',
      indicatorColor: colors.gray?.[300] || '#D1D5DB',
      textColor: colors.gray?.[400] || '#9CA3AF',
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
              borderRadius: 5,
              backgroundColor: indicatorColor,
            }}
          />
          <Text
            style={{
              fontFamily: fontFamilies.primary.text,
              fontSize: 10,
              fontWeight: '500',
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
