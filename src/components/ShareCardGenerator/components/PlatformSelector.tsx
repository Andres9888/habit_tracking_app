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

const PLATFORM_LABELS: Record<SharePlatform, string> = {
  'instagram-story': 'Instagram Stories',
  twitter: 'Twitter / X',
  whatsapp: 'WhatsApp',
};

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
            accessibilityLabel={`${PLATFORM_LABELS[platform]} platform`}
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
              {PLATFORM_LABELS[platform]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
