/**
 * ExportMenu - Modal for selecting data export format
 * OPTIMIZED: Uses useThemeColors() for dark mode support
 */
import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { ExportFormat } from '../AnalyticsScreen.types';
import { styles } from './ExportMenu.styles';

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
  const { colors } = useThemeColors();
  
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
        <View style={[styles.exportMenu, { backgroundColor: colors.surface }]}>
          <Text style={[styles.exportMenuTitle, { color: colors.text.primary }]}>Choose Export Format</Text>
          <AnimatedPressable
            accessibilityHint='Exports data in spreadsheet format'
            accessibilityLabel='Export as CSV'
            accessibilityRole='button'
            style={[styles.exportMenuItem, { backgroundColor: colors.background }]}
            onPress={() => onExport('csv')}
          >
            <Ionicons
              color={colors.primary[500]}
              name='document-text-outline'
              size={24}
            />
            <View style={styles.exportMenuItemContent}>
              <Text style={[styles.exportMenuItemTitle, { color: colors.text.primary }]}>CSV</Text>
              <Text style={[styles.exportMenuItemDescription, { color: colors.text.secondary }]}>
                Spreadsheet format (Excel, Google Sheets)
              </Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint='Exports data in developer-friendly format'
            accessibilityLabel='Export as JSON'
            accessibilityRole='button'
            style={[styles.exportMenuItem, { backgroundColor: colors.background }]}
            onPress={() => onExport('json')}
          >
            <Ionicons
              color={colors.primary[500]}
              name='code-outline'
              size={24}
            />
            <View style={styles.exportMenuItemContent}>
              <Text style={styles.exportMenuItemTitle}>JSON</Text>
              <Text style={styles.exportMenuItemDescription}>
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
            <Text style={styles.exportMenuCancelText}>Cancel</Text>
          </AnimatedPressable>
        </View>
      </Pressable>
    </Modal>
  );
};
