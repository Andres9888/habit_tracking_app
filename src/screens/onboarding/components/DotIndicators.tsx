import { StyleSheet, View } from 'react-native';
import { spacing, borderRadius } from '../../../theme/spacing';

interface DotIndicatorsProps {
  count: number;
  currentIndex: number;
}

export function DotIndicators({ count, currentIndex }: DotIndicatorsProps) {
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
              backgroundColor: i === currentIndex ? '#059669' : '#D1D5DB',
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
    gap: spacing.sm,
  },
  dot: {
    borderRadius: borderRadius.xs,
    height: spacing.sm,
  },
});
