import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

interface LegendItem {
  label: string;
  indicatorColor: string;
  textColor: string;
}

function getLegendItems(): LegendItem[] {
  return [
    {
      label: 'Completed',
      indicatorColor: '#10B981',
      textColor: '#047857',
    },
    {
      label: 'Missed',
      indicatorColor: '#F87171',
      textColor: '#EF4444',
    },
    {
      label: 'Today',
      indicatorColor: '#10B981',
      textColor: '#059669',
    },
    {
      label: 'Upcoming',
      indicatorColor: '#D1D5DB',
      textColor: '#9CA3AF',
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
  const legendItems = getLegendItems();

  return (
    <View
      accessibilityLabel='Calendar legend'
      accessibilityRole='list'
      className='flex-row flex-wrap items-center justify-center gap-4 pb-1 pt-2'
    >
      {legendItems.map(({ label, indicatorColor, textColor }) => (
        <View
          key={label}
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
