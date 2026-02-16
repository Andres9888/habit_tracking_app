import { Text, View, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

export function CalendarLegend() {
  const { colors } = useThemeColors();

  const LEGEND_ITEMS = [
    {
      indicatorColor: colors.primary[500],
      label: 'Completed',
      textColor: colors.primary[700],
    },
    {
      indicatorColor: '#F87171', // rose-400 equivalent
      label: 'Missed',
      textColor: '#F43F5E', // rose-500 equivalent
    },
    {
      indicatorColor: colors.primary[500],
      label: 'Today',
      textColor: colors.primary[600],
    },
    {
      indicatorColor: colors.gray[400],
      label: 'Upcoming',
      textColor: colors.gray[400],
    },
  ];

  return (
    <View style={sheet.container}>
      {LEGEND_ITEMS.map(({ indicatorColor, label, textColor }) => (
        <View key={label} style={sheet.legendItem}>
          <View
            style={[
              sheet.indicator,
              {
                backgroundColor: indicatorColor,
              },
            ]}
          />
          <Text
            style={[
              sheet.label,
              {
                color: textColor,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const sheet = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 4,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});
