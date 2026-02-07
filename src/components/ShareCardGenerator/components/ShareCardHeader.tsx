/**
 * ShareCardHeader Component
 * Header with title and close button for the share card modal
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAppTheme } from '../../../theme';
import { containerStyles as styles } from '../styles';

interface ShareCardHeaderProps {
  onClose: () => void;
}

export function ShareCardHeader({ onClose }: ShareCardHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.custom.colors.gray[900] }]}>
        Share Your Achievement
      </Text>
      <Pressable
        accessibilityLabel='Done'
        accessibilityRole='button'
        onPress={onClose}
      >
        <Text
          style={[
            styles.closeButton,
            { color: theme.custom.colors.primary[700] },
          ]}
        >
          Done
        </Text>
      </Pressable>
    </View>
  );
}
