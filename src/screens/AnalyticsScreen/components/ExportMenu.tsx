/**
 * ExportMenu - Modal for selecting data export format
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
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
  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        accessibilityLabel='Close export menu'
        accessibilityRole='button'
        activeOpacity={1}
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <View style={styles.exportMenu}>
          <Text style={styles.exportMenuTitle}>Choose Export Format</Text>
          <TouchableOpacity
            accessibilityHint='Exports data in spreadsheet format'
            accessibilityLabel='Export as CSV'
            accessibilityRole='button'
            activeOpacity={0.7}
            style={styles.exportMenuItem}
            onPress={() => onExport('csv')}
          >
            <Ionicons
              color={colors.primary[500]}
              name='document-text-outline'
              size={24}
            />
            <View style={styles.exportMenuItemContent}>
              <Text style={styles.exportMenuItemTitle}>CSV</Text>
              <Text style={styles.exportMenuItemDescription}>
                Spreadsheet format (Excel, Google Sheets)
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityHint='Exports data in developer-friendly format'
            accessibilityLabel='Export as JSON'
            accessibilityRole='button'
            activeOpacity={0.7}
            style={styles.exportMenuItem}
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
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel='Cancel'
            accessibilityRole='button'
            activeOpacity={0.7}
            style={styles.exportMenuCancel}
            onPress={onClose}
          >
            <Text style={styles.exportMenuCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
