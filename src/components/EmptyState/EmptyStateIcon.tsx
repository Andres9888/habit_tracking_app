import React from 'react';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { styles } from './styles';

type EmptyStateIconProps = {
  icon: ReactNode;
  iconBackplate?: ViewStyle;
  iconSize: number;
  marginBottom: number;
  style: AnimatedStyle<TextStyle | ViewStyle>;
};

export function EmptyStateIcon({
  icon,
  iconBackplate,
  iconSize,
  marginBottom,
  style,
}: EmptyStateIconProps) {
  if (iconBackplate) {
    return (
      <Animated.View style={[{ marginBottom }, iconBackplate, style]}>
        {typeof icon === 'string' ? (
          <Animated.Text style={[styles.iconText, { fontSize: iconSize }]}>
            {icon}
          </Animated.Text>
        ) : (
          icon
        )}
      </Animated.View>
    );
  }

  return typeof icon === 'string' ? (
    <Animated.Text
      style={[styles.iconText, { fontSize: iconSize, marginBottom }, style]}
    >
      {icon}
    </Animated.Text>
  ) : (
    <Animated.View style={[{ marginBottom }, style]}>{icon}</Animated.View>
  );
}
