/**
 * ActionButtons Component
 *
 * Preview and import action buttons for template cards
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Button from '../../Button/Button';
import type { ActionButtonsProps } from './ActionButtons.types';

export function ActionButtons({
  checkmarkStyle,
  iconColor,
  isImported,
  isImporting,
  isLocked,
  name,
  onImportPress,
  onPreview,
  showPreviewCTA,
}: ActionButtonsProps) {
  if (isImported) {
    return (
      <Animated.View style={[styles.successButton, checkmarkStyle]}>
        <Check color='#fff' size={18} strokeWidth={3} />
        <Text style={styles.successButtonText}>Added to Habits</Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.buttonRow}>
      {showPreviewCTA && onPreview && (
        <Button
          accessibilityLabel={`Preview ${name} habit`}
          icon={<Eye color='#57534e' size={18} />}
          size='medium'
          style={styles.previewButton}
          textStyle={styles.previewButtonText}
          variant='primary'
          onPress={(e: any) => {
            e.stopPropagation();
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPreview();
          }}
        >
          Preview
        </Button>
      )}
      <Button
        accessibilityLabel={`Import ${name} habit`}
        disabled={isLocked}
        loading={isImporting}
        size='medium'
        style={[
          styles.importButton,
          { backgroundColor: isLocked ? '#9ca3af' : iconColor },
        ]}
        variant='primary'
        onPress={onImportPress}
      >
        {isLocked ? 'Unlock with Pro' : '+ Import'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', gap: 10 },
  importButton: { borderRadius: 12, flex: 1, paddingVertical: 12 },
  previewButton: {
    backgroundColor: '#f5f5f4',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 12,
  },
  previewButtonText: { color: '#57534e' },
  successButton: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
  },
  successButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
