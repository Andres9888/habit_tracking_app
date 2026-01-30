/**
 * TemplateIcon Component
 * Icon with glow effect for the spotlight template
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TemplateIconProps {
  icon: string;
  iconColor: string;
}

export const TemplateIcon: React.FC<TemplateIconProps> = ({
  icon,
  iconColor,
}) => (
  <View style={styles.iconWrapper}>
    <View
      style={[
        styles.iconGlow,
        { backgroundColor: iconColor, shadowColor: iconColor },
      ]}
    />
    <View style={[styles.iconContainer, { backgroundColor: `${iconColor}30` }]}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  icon: {
    fontSize: 32,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  iconGlow: {
    borderRadius: 32,
    height: 64,
    opacity: 0.3,
    position: 'absolute',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    width: 64,
  },
  iconWrapper: {
    position: 'relative',
  },
});
