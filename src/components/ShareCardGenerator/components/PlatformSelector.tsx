/**
 * PlatformSelector Component
 * Allows selecting the target social media platform
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAppTheme } from '../../../theme';
import { controlsStyles as styles } from '../styles';
import { SHARE_FORMATS } from '../ShareCardGenerator.constants';
import type { SharePlatform } from '../ShareCardGenerator.types';

interface PlatformSelectorProps {
  selectedPlatform: SharePlatform;
  onSelectPlatform: (platform: SharePlatform) => void;
}

export function PlatformSelector({
  selectedPlatform,
  onSelectPlatform,
}: PlatformSelectorProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.optionGroup}>
      <Text
        style={[styles.optionLabel, { color: theme.custom.colors.gray[700] }]}
      >
        Platform
      </Text>
      <View style={styles.platformButtons}>
        {(Object.keys(SHARE_FORMATS) as SharePlatform[]).map((platform) => (
          <Pressable
            key={platform}
            accessibilityLabel={`${platform.replace('-', ' ')} platform`}
            accessibilityRole='button'
            accessibilityState={{ selected: selectedPlatform === platform }}
            style={[
              styles.platformButton,
              selectedPlatform === platform && {
                backgroundColor: theme.custom.colors.primary[500],
              },
            ]}
            onPress={() => onSelectPlatform(platform)}
          >
            <Text
              style={[
                styles.platformButtonText,
                selectedPlatform === platform &&
                  styles.platformButtonTextActive,
              ]}
            >
              {platform.replace('-', ' ')}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
