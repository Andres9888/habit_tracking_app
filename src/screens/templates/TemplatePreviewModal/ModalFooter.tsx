/**
 * Modal footer with import button
 */

import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../components/Button/Button';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from './styles';
import type { ModalFooterProps } from './types';

export function ModalFooter({
  customColor,
  disabled,
  isImporting,
  onImport,
}: ModalFooterProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <Button
        fullWidth
        disabled={disabled}
        loading={isImporting}
        size='large'
        style={[
          styles.importButton,
          {
            backgroundColor: customColor,
            shadowColor: themeColors.text.primary,
          },
        ]}
        variant='primary'
        onPress={onImport}
      >
        {isImporting ? 'Importing...' : 'Import Habit'}
      </Button>
    </View>
  );
}
