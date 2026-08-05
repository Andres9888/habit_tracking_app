import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColors } from '../../../theme/ThemeContext';
import { getShelfStyle } from '../CalendarTimeline.styles';

const BLEED_HEIGHT = 12;

/** Soft gradient at the shelf's bottom edge for seamless list transition */
export const ShelfBleed: React.FC = () => {
  const { isDark } = useThemeColors();
  const shelfColor = getShelfStyle(isDark).backgroundColor;

  return (
    <View style={styles.container} pointerEvents='none'>
      <LinearGradient
        colors={[shelfColor, 'transparent']}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: -BLEED_HEIGHT,
    height: BLEED_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  gradient: {
    flex: 1,
  },
});
