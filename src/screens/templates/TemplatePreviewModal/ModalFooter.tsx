/**
 * Modal footer with import button
 */

import React from 'react';
import { View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ModalFooterProps } from './types';
import Button from '../../../components/Button/Button';
import { styles } from './styles';

export function ModalFooter({
  customColor,
  disabled,
  isImporting,
  onImport,
}: ModalFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <Button
        fullWidth
        disabled={disabled}
        loading={isImporting}
        size='large'
        style={[styles.importButton, { backgroundColor: customColor }]}
        variant='primary'
        onPress={onImport}
      >
        {isImporting ? 'Importing...' : 'Import Habit'}
      </Button>
    </View>
  );
}
