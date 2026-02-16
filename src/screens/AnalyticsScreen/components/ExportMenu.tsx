/**
 * ExportMenu - Modal for selecting data export format
 * Theme-aware with dark mode support
 */
import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import type { ExportFormat } from '../AnalyticsScreen.types';

interface ExportMenuProps {
  visible: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  visible,
  onClose,
  onExport,
}) => {
  const { colors: tc, isDark } = useThemeColors();

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel='Close export menu'
        accessibilityRole='button'
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <View
          style={[
            styles.exportMenu,
            {
              backgroundColor: tc.surface,
              borderTopColor: tc.border,
              borderTopWidth: 1,
            },
          ]}
        >
          <Text style={[styles.exportMenuTitle, { color: tc.text.primary }]}>
            Choose Export Format
          </Text>
          <AnimatedPressable
            accessibilityHint='Exports data in spreadsheet format'
            accessibilityLabel='Export as CSV'
            accessibilityRole='button'
            style={[
              styles.exportMenuItem,
              {
                backgroundColor: isDark ? tc.gray[100] : tc.background,
                borderColor: tc.cardBorder,
                borderWidth: 1,
              },
            ]}
            onPress={() => onExport('csv')}
          >
            <Ionicons
              color={isDark ? tc.primary[500] : tc.primary[600]}
              name='document-text-outline'
              size={24}
            />
            <View style={styles.exportMenuItemContent}>
              <Text style={[styles.exportMenuItemTitle, { color: tc.text.primary }]}>
                CSV
              </Text>
              <Text style={[styles.exportMenuItemDescription, { color: tc.text.secondary }]}>
                Spreadsheet format (Excel, Google Sheets)
              </Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint='Exports data in developer-friendly format'
            accessibilityLabel='Export as JSON'
            accessibilityRole='button'
            style={[
              styles.exportMenuItem,
              {
                backgroundColor: isDark ? tc.gray[100] : tc.background,
                borderColor: tc.cardBorder,
                borderWidth: 1,
              },
            ]}
            onPress={() => onExport('json')}
          >
            <Ionicons
              color={isDark ? tc.primary[500] : tc.primary[600]}
              name='code-outline'
              size={24}
            />
            <View style={styles.exportMenuItemContent}>
              <Text style={[styles.exportMenuItemTitle, { color: tc.text.primary }]}>
                JSON
              </Text>
              <Text style={[styles.exportMenuItemDescription, { color: tc.text.secondary }]}>
                Developer-friendly format
              </Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityLabel='Cancel'
            accessibilityRole='button'
            style={styles.exportMenuCancel}
            onPress={onClose}
          >
            <Text style={{ color: '#DC2626', fontSize: 17, fontWeight: '500' }}>
              Cancel
            </Text>
          </AnimatedPressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  exportMenu: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  exportMenuCancel: {
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  exportMenuItem: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  exportMenuItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  exportMenuItemDescription: {
    fontSize: 13,
    marginTop: 4,
  },
  exportMenuItemTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  exportMenuTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
});
