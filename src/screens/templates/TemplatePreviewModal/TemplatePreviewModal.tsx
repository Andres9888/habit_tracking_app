/**
 * Template Preview Modal Component
 * Quick preview and customization modal for importing templates
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import Modal from '../../../components/Modal';
import { useThemeColors } from '../../../theme/ThemeContext';
import { ModalHeader } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import { TemplatePreview } from './TemplatePreview';
import { NameInput } from './NameInput';
import { ColorPicker } from './ColorPicker';
import { PreferredTimePicker } from './PreferredTimePicker';
import { DaysOfWeekPicker } from './DaysOfWeekPicker';
import { ReminderTimePicker } from './ReminderTimePicker';
import { TemplateInfo } from './TemplateInfo';
import { useTemplatePreview } from './useTemplatePreview';
import { styles } from './styles';
import type { TemplatePreviewModalProps } from './types';

export default function TemplatePreviewModal({
  importingTemplateId,
  onClose,
  onImport,
  template,
  visible,
}: TemplatePreviewModalProps) {
  const {
    customName,
    setCustomName,
    customColor,
    showTimePicker,
    setShowTimePicker,
    preferredTime,
    selectedDays,
    reminderTime,
    handleImport,
    handleClose,
    handleColorSelect,
    handleSelectPreferredTime,
    handleToggleDay,
    handleTimeChange,
  } = useTemplatePreview({ onClose, onImport, template });

  const { colors } = useThemeColors();

  if (!template) return null;

  const isImporting = importingTemplateId === template._id;

  return (
    <Modal
      inline
      accessibilityViewIsModal
      disableBackdropClose={isImporting}
      disableGestureClose
      skipAnimation
      variant='fullScreen'
      visible={visible}
      onClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ModalHeader disabled={isImporting} onClose={handleClose} />

        <ScrollView
          bounces
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          style={styles.content}
        >
          <TemplatePreview
            customColor={customColor}
            description={template.description}
            icon={template.icon}
          />
          <NameInput
            customName={customName}
            disabled={isImporting}
            onChangeName={setCustomName}
          />
          <ColorPicker
            customColor={customColor}
            disabled={isImporting}
            onSelectColor={handleColorSelect}
          />
          <PreferredTimePicker
            disabled={isImporting}
            selectedTime={preferredTime}
            onSelectTime={handleSelectPreferredTime}
          />
          <DaysOfWeekPicker
            disabled={isImporting}
            selectedDays={selectedDays}
            onToggleDay={handleToggleDay}
          />
          <ReminderTimePicker
            disabled={isImporting}
            reminderTime={reminderTime}
            showTimePicker={showTimePicker}
            onTimeChange={handleTimeChange}
            onTogglePicker={setShowTimePicker}
          />
          <TemplateInfo
            category={template.category}
            frequency={template.frequency}
          />
        </ScrollView>

        <ModalFooter
          customColor={customColor}
          disabled={!customName.trim() || isImporting}
          isImporting={isImporting}
          onImport={handleImport}
        />
      </View>
    </Modal>
  );
}
