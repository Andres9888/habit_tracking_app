/**
 * TemplateIcon Component
 *
 * Icon with glow effect for template cards
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing'
import { fontFamilies } from '../../../theme/typography';;

interface TemplateIconProps {
  icon: string;
  iconColor: string;
}

export function TemplateIcon({ icon, iconColor }: TemplateIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <View
        style={[
          styles.iconGlow,
          {
            backgroundColor: iconColor,
            shadowColor: iconColor,
          },
        ]}
      />
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: `${iconColor}25`,
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  icon: {
    fontSize: 28,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  iconGlow: {
    borderRadius: borderRadius.full,
    height: 56,
    opacity: 0.2,
    position: 'absolute',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    width: 56,
  },
  iconWrapper: {
    position: 'relative',
  },
});
