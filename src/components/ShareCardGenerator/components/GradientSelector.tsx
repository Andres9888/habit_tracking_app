/**
 * GradientSelector Component
 * Allows selecting the background gradient for the share card
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme';
import { controlsStyles as styles } from '../styles';
import { GRADIENT_PRESETS } from '../ShareCardGenerator.constants';

interface GradientSelectorProps {
  selectedGradient: number;
  onSelectGradient: (index: number) => void;
}

export function GradientSelector({
  selectedGradient,
  onSelectGradient,
}: GradientSelectorProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.optionGroup}>
      <Text
        style={[styles.optionLabel, { color: theme.custom.colors.gray[700] }]}
      >
        Background
      </Text>
      <View style={styles.gradientButtons}>
        {GRADIENT_PRESETS.map((gradient, index) => (
          <Pressable
            key={gradient.name}
            accessibilityLabel={`${gradient.name} gradient`}
            accessibilityRole='button'
            accessibilityState={{ selected: selectedGradient === index }}
            style={[
              styles.gradientButton,
              selectedGradient === index && styles.gradientButtonSelected,
            ]}
            onPress={() => onSelectGradient(index)}
          >
            <LinearGradient
              colors={
                gradient.colors as unknown as readonly [
                  string,
                  string,
                  ...string[],
                ]
              }
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.gradientButtonInner}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
