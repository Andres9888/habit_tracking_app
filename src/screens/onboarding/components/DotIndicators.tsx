import { StyleSheet, View } from 'react-native';

interface DotIndicatorsProps {
  count: number;
  currentIndex: number;
}

export function DotIndicators({ count, currentIndex }: DotIndicatorsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
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
    gap: 8,
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
});
