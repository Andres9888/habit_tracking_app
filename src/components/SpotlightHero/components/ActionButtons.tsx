/**
 * ActionButtons Component
 * Preview and Import action buttons for the spotlight hero
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { shadows } from '../../../theme/spacing'
import { fontFamilies } from '../../../theme/typography';;
import { triggerHaptic } from '@/utils/haptics';

interface ActionButtonsProps {
  iconColor: string;
  isImporting: boolean;
  onPreview: () => void;
  onImport: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  iconColor,
  isImporting,
  onPreview,
  onImport,
}) => {
  const handlePreview = () => {
    triggerHaptic('tap');
    onPreview();
  };

  const handleImport = () => {
    triggerHaptic('toggle');
    onImport();
  };

  return (
    <View style={styles.actions}>
      <Pressable
        accessibilityLabel='Preview template'
        style={styles.previewButton}
        onPress={handlePreview}
      >
        <Text style={styles.previewButtonText}>Preview</Text>
      </Pressable>

      <Pressable
        accessibilityLabel='Import template'
        disabled={isImporting}
        style={[
          styles.importButton,
          { backgroundColor: iconColor },
          isImporting && styles.importButtonDisabled,
        ]}
        onPress={handleImport}
      >
        <Text style={styles.importButtonText}>
          {isImporting ? 'Importing...' : 'Import Habit'}
        </Text>
        {!isImporting && (
          <ArrowRight color='#ffffff' size={16} strokeWidth={2.5} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  importButton: {
    ...shadows.card,
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowOpacity: 0.15,
  },
  importButtonDisabled: {
    opacity: 0.5,
  },
  importButtonText: {
    color: '#ffffff',
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: '600',
  },
  previewButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  previewButtonText: {
    color: '#1c1917',
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: '600',
  },
});
