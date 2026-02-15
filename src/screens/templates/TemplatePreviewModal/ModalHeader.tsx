/**
 * Modal header with title and close button
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ModalHeaderProps } from './types';
import { styles } from './styles';
import { useAppTheme } from '../../../theme';

export function ModalHeader({ disabled, onClose }: ModalHeaderProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 12 }]}
    >
      <Text
        style={[
          styles.headerTitle,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        Customize Habit
      </Text>
      <Pressable
        accessible
        accessibilityLabel='Close customize modal'
        accessibilityRole='button'
        disabled={disabled}
        style={styles.closeButton}
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        onPress={onClose}
      >
        <X color='#374151' size={24} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
