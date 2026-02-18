/**
 * FeedbackModal Component - Structured feedback collection
 *
 * Features:
 * - Categorized feedback types (bug/feature/general)
 * - Inline validation feedback
 * - Title and description fields
 * - Email capture for follow-up
 */

import React, { useState, useCallback } from 'react';
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
import { Bug, Lightbulb, MessageSquare, CheckCircle2, AlertCircle, Mail } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import type { FeedbackModalProps, FeedbackType } from './FeedbackModal.types';
import { styles } from './FeedbackModal.styles';
import { ValidationFeedback } from './ValidationFeedback';
import { getDescriptionPlaceholder } from './FeedbackModalHelpers';
import { MAX_SHORT_TEXT_LENGTH, MAX_LONG_TEXT_LENGTH } from '@/constants';
import { validateEmail } from '@/utils/validation';

const SUPPORT_EMAIL = 'support@chainday.app';

const FEEDBACK_TYPES = [
  {
    type: 'bug' as const,
    label: '🐛 Report a Bug',
    icon: Bug,
    color: '#ef4444',
    bgColor: '#fee2e2',
    description: 'Something not working right?',
  },
  {
    type: 'feature' as const,
    label: '💡 Request a Feature',
    icon: Lightbulb,
    color: '#f59e0b',
    bgColor: '#fef3c7',
    description: 'Have an idea to improve the app?',
  },
  {
    type: 'general' as const,
    label: '💬 General Feedback',
    icon: MessageSquare,
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    description: 'Share your thoughts',
  },
];

export function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    email: false,
  });
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message?: string;
  } | null>(null);

  const resetForm = useCallback(() => {
    setSelectedType(null);
    setTitle('');
    setDescription('');
    setEmail('');
    setTouchedFields({ title: false, description: false, email: false });
    setEmailValidation(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleBlur = useCallback((field: 'title' | 'description' | 'email') => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    if (field === 'email' && email.length > 0) {
      const result = validateEmail(email);
      setEmailValidation({
        isValid: result.isValid,
        message: result.isValid ? 'Valid email format' : result.message,
      });
    }
  }, [email]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (text.length > 0) {
      const result = validateEmail(text);
      setEmailValidation({
        isValid: result.isValid,
        message: result.isValid ? 'Valid email format' : result.message,
      });
    } else {
      setEmailValidation(null);
    }
  }, []);

  const canSubmit = selectedType !== null && title.trim() !== '' && description.trim() !== '';

  const handleSubmit = useCallback(async () => {
    setTouchedFields({ title: true, description: true, email: true });

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
  }, [selectedType, title, description, email, handleClose]);

  const getInputBorderColor = (field: 'title' | 'description' | 'email') => {
    if (!touchedFields[field]) return colors.gray[300];
    if (field === 'email' && email.length > 0 && emailValidation) {
      return emailValidation.isValid ? '#10b981' : '#ef4444';
    }
    if (field === 'title' && touchedFields.title && title.length === 0) {
      return '#ef4444';
    }
    if (field === 'description' && touchedFields.description && description.length === 0) {
      return '#ef4444';
    }
    return colors.gray[300];
  };

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
          {FEEDBACK_TYPES.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;
            return (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.typeCard,
                  isSelected && styles.typeCardSelected,
                  { borderColor: isSelected ? item.color : colors.gray[200] },
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
                  <Icon size={20} color={item.color} />
                </View>
                <View style={styles.typeContent}>
                  <Text style={styles.typeLabel}>{item.label}</Text>
                  <Text style={styles.typeDescription}>{item.description}</Text>
                </View>
                {isSelected && (
                  <View
                    style={[
                      styles.selectedIndicator,
                      { backgroundColor: item.color },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedType && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: getInputBorderColor('title') },
                  ]}
                  placeholder='Brief summary of your feedback'
                  placeholderTextColor={colors.gray[400]}
                  value={title}
                  onChangeText={setTitle}
                  onBlur={() => handleBlur('title')}
                  maxLength={MAX_SHORT_TEXT_LENGTH}
                  returnKeyType='next'
                />
                {touchedFields.title && title.length > 0 && (
                  <View style={styles.inputIndicator}>
                    <CheckCircle2 size={18} color='#10b981' strokeWidth={2.5} />
                  </View>
                )}
              </View>
              <Text style={styles.charCount}>
                {title.length}/{MAX_SHORT_TEXT_LENGTH}
              </Text>
              <ValidationFeedback
                message={touchedFields.title && !title.trim() ? 'Title is required' : undefined}
                isValid={touchedFields.title ? title.trim().length > 0 : undefined}
                touched={touchedFields.title}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Description <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { borderColor: getInputBorderColor('description') },
                  ]}
                  placeholder={getDescriptionPlaceholder(selectedType)}
                  placeholderTextColor={colors.gray[400]}
                  value={description}
                  onChangeText={setDescription}
                  onBlur={() => handleBlur('description')}
                  maxLength={MAX_LONG_TEXT_LENGTH}
                  multiline
                  numberOfLines={8}
                  textAlignVertical='top'
                />
                {touchedFields.description && description.length > 0 && (
                  <View style={styles.inputIndicator}>
                    <CheckCircle2 size={18} color='#10b981' strokeWidth={2.5} />
                  </View>
                )}
              </View>
              <Text style={styles.charCount}>
                {description.length}/{MAX_LONG_TEXT_LENGTH}
              </Text>
              <ValidationFeedback
                message={touchedFields.description && !description.trim() ? 'Description is required' : undefined}
                isValid={touchedFields.description ? description.trim().length > 0 : undefined}
                touched={touchedFields.description}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Email (optional, for follow-up)</Text>
              <View style={styles.inputContainer}>
                <View style={styles.emailInputWrapper}>
                  <Mail
                    size={18}
                    color={colors.gray[400]}
                    strokeWidth={2}
                    style={styles.emailIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.emailInput,
                      { borderColor: getInputBorderColor('email') },
                    ]}
                    placeholder='your.email@example.com'
                    placeholderTextColor={colors.gray[400]}
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    returnKeyType='done'
                  />
                </View>
                {touchedFields.email && email.length > 0 && emailValidation && (
                  <View style={styles.inputIndicator}>
                    {emailValidation.isValid ? (
                      <CheckCircle2 size={18} color='#10b981' strokeWidth={2.5} />
                    ) : (
                      <AlertCircle size={18} color='#ef4444' strokeWidth={2.5} />
                    )}
                  </View>
                )}
              </View>
              <ValidationFeedback
                message={emailValidation?.message}
                isValid={emailValidation?.isValid}
                touched={touchedFields.email}
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
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                Send Feedback
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </Modal>
  );
}
