import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

interface DotIndicatorsProps {
  count: number;
  currentIndex: number;
}

export function DotIndicators({ count, currentIndex }: DotIndicatorsProps) {
  const { colors, isDark } = useThemeColors();
  return (
    <View
      accessible
      accessibilityLabel={`Page ${currentIndex + 1} of ${count}`}
      accessibilityRole='tablist'
      style={styles.container}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          accessibilityLabel={`Page ${i + 1}${i === currentIndex ? ', current' : ''}`}
          accessibilityRole='tab'
          accessibilityState={{ selected: i === currentIndex }}
          style={[
            styles.dot,
            {
              backgroundColor: i === currentIndex ? colors.primary[600] : colors.gray[300],
              width: i === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
});
