import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ExternalLink } from 'lucide-react-native';

import type { Doc, Id } from '../../../convex/_generated/dataModel';

import Button from '../../components/Button/Button';
import Modal from '../../components/Modal';
import { useAppTheme } from '../../theme';

import { ICON_COLOR_OPTIONS, REMINDER_OPTIONS } from './constants';
import { styles } from './templatesScreenStyles';

type TemplateCustomizations = {
  iconColor?: string;
  name?: string;
  reminderTime?: string;
};

interface TemplatePreviewModalProps {
  importingTemplateId: Id<'templates'> | null;
  onClose: () => void;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => Promise<void> | void;
  template: Doc<'templates'> | null;
  visible: boolean;
}

export default function TemplatePreviewModal(props: TemplatePreviewModalProps) {
  const { importingTemplateId, onClose, onImport, template, visible } = props;
  const theme = useAppTheme();

  const [customHabitName, setCustomHabitName] = useState('');
  const [selectedIconColor, setSelectedIconColor] = useState('');
  const [selectedReminderTime, setSelectedReminderTime] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (!template) {
      return;
    }

    setCustomHabitName(template.name);
    setSelectedIconColor(template.iconColor);
    setSelectedReminderTime('');
  }, [template?._id, visible]);

  const previewResearchDomain = useMemo(() => {
    if (!template?.scientificLink) {
      return null;
    }

    try {
      const url = new URL(template.scientificLink);
      return url.hostname.replace('www.', '');
    } catch {
      return template.scientificLink
        .replace(/^https?:\/\//, '')
        .split('/')[0];
    }
  }, [template?.scientificLink]);

  const handleOpenUrl = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open link', error);
    }
  }, []);

  const handlePreviewResearchLink = useCallback(async () => {
    if (!template?.scientificLink) {
      return;
    }

    await handleOpenUrl(template.scientificLink);
  }, [handleOpenUrl, template?.scientificLink]);

  const handlePreviewYoutubeLink = useCallback(async () => {
    if (!template?.youtubeLink) {
      return;
    }

    await handleOpenUrl(template.youtubeLink);
  }, [handleOpenUrl, template?.youtubeLink]);

  const handleImportPress = useCallback(() => {
    if (!template) {
      return;
    }

    onImport(template._id, {
      iconColor: selectedIconColor || template.iconColor,
      name: customHabitName || template.name,
      reminderTime: selectedReminderTime || undefined,
    });
  }, [customHabitName, onImport, selectedIconColor, selectedReminderTime, template]);

  if (!template) {
    return null;
  }

  const isImporting = importingTemplateId === template._id;

  return (
    <Modal variant='bottomSheet' visible={visible} onClose={onClose}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.previewScrollContent}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewModal}>
          {/* Template Header */}
          <View style={styles.previewHeader}>
            <View
              style={[
                styles.previewIconContainer,
                {
                  backgroundColor: template.iconColor + '20',
                  borderRadius: theme.custom.borderRadius.medium,
                },
              ]}
            >
              <Text style={styles.previewIcon}>{template.icon}</Text>
            </View>
            <Text
              style={[
                theme.custom.typography.heading2,
                { color: '#101727', fontWeight: '700', marginTop: 16 },
              ]}
            >
              {template.name}
            </Text>
            <Text style={styles.previewCategory}>
              {template.category.replace('_', ' ')} ·{' '}
              {template.frequency === 'daily' ? 'Daily' : 'Flexible'}
            </Text>
          </View>

          {/* Template Description */}
          <Text
            style={[
              theme.custom.typography.body,
              { color: '#374151', marginTop: 20 },
            ]}
          >
            {template.description}
          </Text>

          {/* Divider */}
          <View style={styles.sectionDivider} />

          {/* Scientific Reference */}
          <View>
            <View
              style={[
                styles.previewScienceBox,
                {
                  backgroundColor: '#f0fdf4',
                  borderRadius: theme.custom.borderRadius.small,
                },
              ]}
            >
              <Text style={styles.scienceIcon}>🔬</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    theme.custom.typography.caption,
                    {
                      color: '#166534',
                      fontWeight: '700',
                      letterSpacing: 0.3,
                    },
                  ]}
                >
                  Scientific Backing
                </Text>
                <Text
                  style={[
                    theme.custom.typography.bodySmall,
                    { color: '#374151', lineHeight: 20, marginTop: 6 },
                  ]}
                >
                  {template.scientificReference}
                </Text>
                {template.scientificLink && (
                  <Pressable
                    accessibilityLabel='Open research link'
                    style={styles.researchLink}
                    onPress={handlePreviewResearchLink}
                  >
                    <ExternalLink color='#166534' size={14} />
                    <Text
                      style={[
                        theme.custom.typography.caption,
                        {
                          color: '#166534',
                          fontWeight: '600',
                          marginLeft: 6,
                          textDecorationLine: 'underline',
                        },
                      ]}
                    >
                      {previewResearchDomain || 'View research'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* YouTube Video Link */}
            {template.youtubeLink && (
              <Pressable
                accessibilityLabel='Watch video on YouTube'
                style={styles.youtubeLink}
                onPress={handlePreviewYoutubeLink}
              >
                <View style={styles.youtubeIconWrapper}>
                  <Text style={styles.youtubeIcon}>▶️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      theme.custom.typography.caption,
                      { color: '#111827', fontWeight: '700' },
                    ]}
                  >
                    Watch Video
                  </Text>
                  <Text
                    style={[
                      theme.custom.typography.bodySmall,
                      {
                        color: '#DC2626',
                        marginTop: 2,
                        textDecorationLine: 'underline',
                      },
                    ]}
                  >
                    Learn more on YouTube
                  </Text>
                </View>
                <ExternalLink color='#DC2626' size={16} />
              </Pressable>
            )}
          </View>

          {/* Divider */}
          <View style={styles.sectionDivider} />

          {/* Customization Block */}
          <View style={styles.customizeSection}>
            <View style={styles.customizeTitleRow}>
              <Text style={styles.customizeTitle}>Make it yours</Text>
              <Text style={styles.customizeSubtitle}>Optional</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Habit name</Text>
              <TextInput
                maxLength={50}
                placeholder='Name your habit'
                placeholderTextColor='#94a3b8'
                style={styles.nameInput}
                value={customHabitName}
                onChangeText={setCustomHabitName}
              />
              <Text style={styles.charCount}>{customHabitName.length}/50</Text>
            </View>

            <Text style={styles.inputLabel}>Reminder</Text>
            <View style={styles.reminderRow}>
              {REMINDER_OPTIONS.map((option) => {
                const isSelected = selectedReminderTime === option;
                return (
                  <Pressable
                    key={option}
                    accessibilityLabel={`Set reminder for ${option}`}
                    accessibilityRole='button'
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.reminderChip,
                      isSelected && styles.reminderChipActive,
                    ]}
                    onPress={() =>
                      setSelectedReminderTime((current) =>
                        current === option ? '' : option
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.reminderChipText,
                        { color: isSelected ? '#fff' : '#334155' },
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.inputLabel}>Accent color</Text>
            <View style={styles.colorRow}>
              {ICON_COLOR_OPTIONS.map((color) => {
                const isSelected = selectedIconColor === color;
                return (
                  <Pressable
                    key={color}
                    accessibilityLabel={`Pick ${color} accent color`}
                    accessibilityRole='button'
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color },
                      isSelected && styles.colorSwatchActive,
                    ]}
                    onPress={() => setSelectedIconColor(color)}
                  />
                );
              })}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.previewActions}>
            <Button
              fullWidth
              loading={isImporting}
              size='large'
              style={{ backgroundColor: template.iconColor }}
              variant='primary'
              onPress={handleImportPress}
            >
              Import Template
            </Button>
            <Button
              fullWidth
              size='medium'
              style={{ marginTop: 12 }}
              variant='ghost'
              onPress={onClose}
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}





