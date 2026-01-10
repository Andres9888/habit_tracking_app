/**
 * Header for browse view mode
 */

import { Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme';
import { styles } from '../../templates/templatesScreenStyles';

interface BrowseHeaderProps {
  animatedStyle: AnimatedStyle;
}

export function BrowseHeader({ animatedStyle }: BrowseHeaderProps) {
  const theme = useAppTheme();

  return (
    <Animated.View style={[styles.header, animatedStyle]}>
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
    </Animated.View>
  );
}
