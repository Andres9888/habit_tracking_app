/**
 * Template Preview Modal Component
 * Quick preview and customization modal for importing templates
 *
 * Features:
 * - Template preview with icon and description
 * - Optional customization (name, icon color, reminder time)
 * - Import button with loading state
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Clock, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from '../../components/Modal';
import Button from '../../components/Button/Button';
import { useAppTheme } from '../../theme';
import type { Doc, Id } from '../../../convex/_generated/dataModel';

/** Default fallback color when iconColor is missing or invalid */
const DEFAULT_ICON_COLOR = '#6b7280';

/** Ensure color is valid, fallback to default if empty/undefined */
const safeColor = (color: string | undefined): string => {
  return color && color.trim() !== '' ? color : DEFAULT_ICON_COLOR;
};

interface TemplatePreviewModalProps {
  importingTemplateId: Id<'templates'> | null;
  onClose: () => void;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: {
      iconColor?: string;
      name?: string;
      reminderTime?: string;
    }
  ) => void;
  template: Doc<'templates'> | null;
  visible: boolean;
}

export default function TemplatePreviewModal({
  importingTemplateId,
  onClose,
  onImport,
  template,
  visible,
}: TemplatePreviewModalProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState(DEFAULT_ICON_COLOR);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());

  // Reset customization when template changes
  useEffect(() => {
    if (template) {
      setCustomName(template.name);
      setCustomColor(safeColor(template.iconColor));
      setReminderTime(new Date());
    }
  }, [template]);

  const handleImport = () => {
    if (!template) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const customizations: {
      iconColor?: string;
      name?: string;
      reminderTime?: string;
    } = {};

    // Only include customizations if they differ from defaults
    if (customName !== template.name) {
      customizations.name = customName;
    }
    if (customColor !== template.iconColor) {
      customizations.iconColor = customColor;
    }
    // Always include reminder time if set
    customizations.reminderTime = reminderTime.toISOString();

    onImport(template._id, customizations);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!template) return null;

  const isImporting = importingTemplateId === template._id;

  return (
    <Modal
      disableBackdropClose={isImporting}
      variant='bottomSheet'
      visible={visible}
      onClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { fontFamily: theme.custom.fontFamilies.primary.text },
            ]}
          >
            Customize Habit
          </Text>
          <Pressable
            disabled={isImporting}
            style={styles.closeButton}
            onPress={handleClose}
          >
            <X color='#6B7280' size={20} strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          style={styles.content}
        >
          {/* Template Preview */}
          <View style={styles.previewContainer}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${customColor}20` },
              ]}
            >
              <Text style={styles.iconText}>{template.icon}</Text>
            </View>
            <Text
              style={[
                styles.templateDescription,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              {template.description}
            </Text>
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <Text
              style={[
                styles.label,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              Habit Name
            </Text>
            <TextInput
              editable={!isImporting}
              placeholder='Enter habit name'
              placeholderTextColor='#9CA3AF'
              style={[
                styles.input,
                {
                  backgroundColor: theme.custom.colors.light.background,
                  borderColor: theme.custom.colors.gray[200],
                  fontFamily: theme.custom.fontFamilies.primary.text,
                },
              ]}
              value={customName}
              onChangeText={setCustomName}
            />
          </View>

          {/* Color Picker */}
          <View style={styles.section}>
            <Text
              style={[
                styles.label,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              Icon Color
            </Text>
            <View style={styles.colorPickerContainer}>
              {[
                '#FF6B6B',
                '#4ECDC4',
                '#45B7D1',
                '#96CEB4',
                '#FFEAA7',
                '#DFE6E9',
                '#A29BFE',
                '#FD79A8',
              ].map((color) => (
                <Pressable
                  key={color}
                  disabled={isImporting}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: color,
                      borderColor:
                        customColor === color ? '#1F2937' : 'transparent',
                      borderWidth: customColor === color ? 3 : 0,
                    },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCustomColor(color);
                  }}
                />
              ))}
            </View>
          </View>

          {/* Reminder Time */}
          <View style={styles.section}>
            <Text
              style={[
                styles.label,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              Reminder Time
            </Text>
            <Pressable
              disabled={isImporting}
              style={[
                styles.timePickerButton,
                {
                  backgroundColor: theme.custom.colors.light.background,
                  borderColor: theme.custom.colors.gray[200],
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowTimePicker(true);
              }}
            >
              <Clock color='#6B7280' size={20} />
              <Text
                style={[
                  styles.timeText,
                  { fontFamily: theme.custom.fontFamilies.primary.text },
                ]}
              >
                {reminderTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </Pressable>
          </View>

          {/* Category & Frequency Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillLabel}>Category</Text>
              <Text style={styles.infoPillValue}>
                {template.category
                  .replace('_', ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
            </View>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillLabel}>Frequency</Text>
              <Text style={styles.infoPillValue}>
                {template.frequency.charAt(0).toUpperCase() +
                  template.frequency.slice(1)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button
            disabled={!customName.trim() || isImporting}
            fullWidth
            loading={isImporting}
            size='large'
            style={[styles.importButton, { backgroundColor: customColor }]}
            variant='primary'
            onPress={handleImport}
          >
            {isImporting ? 'Importing...' : 'Import Habit'}
          </Button>
        </View>

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            display='spinner'
            is24Hour={false}
            mode='time'
            value={reminderTime}
            onChange={(_event, selected) => {
              setShowTimePicker(false);
              if (selected) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setReminderTime(selected);
              }
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    padding: 4,
  },
  colorOption: {
    borderRadius: 20,
    height: 44,
    width: 44,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  container: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
  },
  footer: {
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  iconText: {
    fontSize: 40,
  },
  importButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  infoPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flex: 1,
    padding: 12,
  },
  infoPillLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoPillValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  templateDescription: {
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  timePickerButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  timeText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
