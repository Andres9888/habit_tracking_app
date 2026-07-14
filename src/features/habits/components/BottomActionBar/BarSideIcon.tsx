import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './BottomActionBar.styles';

const iconButtonHitSlop = {
  bottom: 18,
  left: 18,
  right: 18,
  top: 18,
};

interface BarSideIconProps {
  accessibilityLabel: string;
  animatedStyle: object;
  children: ReactNode;
  testID: string;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function BarSideIcon({
  accessibilityLabel,
  animatedStyle,
  children,
  testID,
  onPress,
  onPressIn,
  onPressOut,
}: BarSideIconProps) {
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        hitSlop={iconButtonHitSlop}
        testID={testID}
        style={styles.iconTouchArea}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={styles.iconButton}>{children}</View>
      </Pressable>
    </Animated.View>
  );
}
