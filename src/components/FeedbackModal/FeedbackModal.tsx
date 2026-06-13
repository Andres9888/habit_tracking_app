/* eslint-disable max-lines */
/**
 * FeedbackModal Component
 *
 * Structured in-app feedback collection for bug reports,
 * feature requests, and general feedback.
 *
 * Features:
 * - Categorized feedback types (bug/feature/general)
 * - Title and description fields
 * - Email capture for follow-up
 * - Sends structured email to support
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Alert,
  Linking,
} from 'react-native';
import { Modal } from '../Modal';
import { Button } from '../Button/Button';
import { Bug, Lightbulb, MessageSquare } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors as appColors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import type { FeedbackModalProps, FeedbackType } from './FeedbackModal.types';
import { getDescriptionPlaceholder } from './FeedbackModalHelpers';
import { useFeedbackModalStyles } from './FeedbackModal.styles';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { MAX_SHORT_TEXT_LENGTH, MAX_LONG_TEXT_LENGTH } from '@/constants';

const SUPPORT_EMAIL = 'support@chainday.app';

const FEEDBACK_TYPES = [
  {
    type: 'bug' as const,
    label: '🐛 Report a Bug',
    icon: Bug,
    color: appColors.error,
    lightBgColor: appColors.errorLight,
    description: 'Something not working right?',
  },
  {
    type: 'feature' as const,
    label: '💡 Request a Feature',
    icon: Lightbulb,
    color: appColors.warning,
    lightBgColor: appColors.warningLight,
    description: 'Have an idea to improve the app?',
  },
  {
    type: 'general' as const,
    label: '💬 General Feedback',
    icon: MessageSquare,
    color: appColors.secondary[500],
    lightBgColor: appColors.secondary[100],
    description: 'Share your thoughts',
  },
];

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const fullHex =
    normalized.length === 3
      ? [...normalized].map((char) => char + char).join('')
      : normalized;

  if (fullHex.length !== 6) {
    return `rgba(5, 150, 105, ${alpha})`;
  }

  const red = Number.parseInt(fullHex.slice(0, 2), 16);
  const green = Number.parseInt(fullHex.slice(2, 4), 16);
  const blue = Number.parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const { colors, isDark } = useThemeColors();
  const styles = useFeedbackModalStyles();
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const resetForm = () => {
    setSelectedType(null);
    setTitle('');
    setDescription('');
    setEmail('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedType || !title.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Keyboard.dismiss();

    const typeLabels = {
      bug: '🐛 Bug Report',
      feature: '💡 Feature Request',
      general: '💬 General Feedback',
    };

    const subject = encodeURIComponent(
      `[${typeLabels[selectedType]}] ${title.trim()}`
    );
    const body = encodeURIComponent(
      `Feedback Type: ${typeLabels[selectedType]}\n\n` +
        `Title: ${title.trim()}\n\n` +
        `Description:\n${description.trim()}\n\n` +
        (email.trim() ? `Follow-up email: ${email.trim()}\n\n` : '') +
        `---\nSent from Chain Day app`
    );

    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        handleClose();
        Alert.alert(
          'Thank you!',
          'Your feedback has been opened in your email app. Please send it to help us improve Chain Day.'
        );
      } else {
        Alert.alert(
          'Email Not Available',
          `Please email us directly at ${SUPPORT_EMAIL} with your feedback.`
        );
      }
    } catch (error) {
      if (__DEV__) console.error('Error opening email:', error);
      Alert.alert(
        'Error',
        `Could not open email. Please contact us at ${SUPPORT_EMAIL}`
      );
    }
  };

  const canSubmit =
    selectedType !== null && title.trim() !== '' && description.trim() !== '';
  const feedbackTypes = FEEDBACK_TYPES.map((item) => ({
    ...item,
    bgColor: isDark ? withAlpha(item.color, 0.18) : item.lightBgColor,
  }));

  return (
    <Modal variant='fullScreen' visible={visible} onClose={handleClose}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Send Feedback</Text>
          <Text style={styles.headerSubtitle}>Help us improve Chain Day</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What type of feedback?</Text>
          {feedbackTypes.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;
            return (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.typeCard,
                  isSelected && styles.typeCardSelected,
                  { borderColor: isSelected ? item.color : colors.border },
                ]}
                onPress={() => setSelectedType(item.type)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.typeIconContainer,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  <Icon size={iconSizes.medium} color={item.color} />
                </View>
                <View style={styles.typeContent}>
                  <Text style={styles.typeLabel}>{item.label}</Text>
                  <Text style={styles.typeDescription}>{item.description}</Text>
                </View>
                {isSelected ? (
                  <View
                    style={[
                      styles.selectedIndicator,
                      { backgroundColor: item.color },
                    ]}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedType ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                accessibilityLabel='Feedback title'
                style={styles.input}
                value={title}
                {...buildTextInputHintProps(
                  'Brief summary of your feedback',
                  colors.text.tertiary
                )}
                onChangeText={setTitle}
                maxLength={MAX_SHORT_TEXT_LENGTH}
                returnKeyType='next'
              />
              <Text style={styles.charCount}>
                {title.length}/{MAX_SHORT_TEXT_LENGTH}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Description <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                accessibilityLabel='Feedback description'
                style={[styles.input, styles.textArea]}
                value={description}
                {...buildTextInputHintProps(
                  getDescriptionPlaceholder(selectedType),
                  colors.text.tertiary
                )}
                onChangeText={setDescription}
                maxLength={MAX_LONG_TEXT_LENGTH}
                multiline
                numberOfLines={8}
                textAlignVertical='top'
              />
              <Text style={styles.charCount}>
                {description.length}/{MAX_LONG_TEXT_LENGTH}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Email (optional, for follow-up)
              </Text>
              <TextInput
                accessibilityLabel='Email for follow-up (optional)'
                style={styles.input}
                value={email}
                {...buildTextInputHintProps(
                  'your.email@example.com',
                  colors.text.tertiary
                )}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                onSubmitEditing={
                  canSubmit
                    ? () => {
                        void handleSubmit();
                      }
                    : undefined
                }
              />
            </View>

            <View style={styles.footer}>
              <Button
                variant='secondary'
                onPress={handleClose}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                disabled={!canSubmit}
                onPress={() => {
                  void handleSubmit();
                }}
                style={styles.submitButton}
              >
                Send Feedback
              </Button>
            </View>
          </>
        ) : null}
      </ScrollView>
    </Modal>
  );
}
