/**
 * Loading skeleton state for templates screen
 */

import { Text, View } from 'react-native';
import { useAppTheme } from '../../../theme';
import { styles } from '../../templates/templatesScreenStyles';

export function TemplatesLoadingState() {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            theme.custom.typography.heading1,
            { color: '#1c1917', fontWeight: '700' },
          ]}
        >
          Import Habits
        </Text>
        <Text
          style={[
            theme.custom.typography.bodySmall,
            { color: '#78716c', marginTop: 4 },
          ]}
        >
          Science-backed habits to get you started
        </Text>
      </View>
      <View style={styles.skeletonSearch} />
      {[0, 1, 2].map((index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonLineLarge} />
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonBadgeRow}>
            <View style={styles.skeletonBadge} />
            <View style={styles.skeletonBadge} />
            <View style={styles.skeletonBadge} />
          </View>
        </View>
      ))}
    </View>
  );
}
