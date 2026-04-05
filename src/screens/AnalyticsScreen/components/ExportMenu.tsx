/**
 * ExportMenu - Modal for selecting data export format
 */
import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Code, FileText } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../../theme/colors';
import type { ExportFormat } from '../AnalyticsScreen.types';
import { styles } from './ExportMenu.styles';
import { iconSizes } from '@/theme/iconSizes';

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
        <View style={styles.exportMenu}>
          <Text style={styles.exportMenuTitle}>Choose Export Format</Text>
          <AnimatedPressable
            accessibilityHint='Exports data in spreadsheet format'
            accessibilityLabel='Export as CSV'
            accessibilityRole='button'
            style={styles.exportMenuItem}
            onPress={() => onExport('csv')}
          >
            <FileText color={colors.primary[500]} size={iconSizes.large} />
            <View style={styles.exportMenuItemContent}>
              <Text style={styles.exportMenuItemTitle}>CSV</Text>
              <Text style={styles.exportMenuItemDescription}>
                Spreadsheet format (Excel, Google Sheets)
              </Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint='Exports data in developer-friendly format'
            accessibilityLabel='Export as JSON'
            accessibilityRole='button'
            style={styles.exportMenuItem}
            onPress={() => onExport('json')}
          >
            <Code color={colors.primary[500]} size={iconSizes.large} />
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
