/**
 * ActionButtons Component
 * Preview and Import action buttons for the spotlight hero
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPreview();
  };

  const handleImport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
    alignItems: 'center',
    borderRadius: 12,
    elevation: 3,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  importButtonDisabled: {
    opacity: 0.5,
  },
  importButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
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
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});
