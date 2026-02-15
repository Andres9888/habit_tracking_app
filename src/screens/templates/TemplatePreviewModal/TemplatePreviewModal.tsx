/**
 * Template Preview Modal Component
 * Quick preview and customization modal for importing templates
 */

import React from 'react';
import { View, ScrollView } from 'react-native';

import type { TemplatePreviewModalProps } from './types';
import Modal from '../../../components/Modal';
import { ColorPicker } from './ColorPicker';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { NameInput } from './NameInput';
import { ReminderTimePicker } from './ReminderTimePicker';
import { TemplateInfo } from './TemplateInfo';
import { TemplatePreview } from './TemplatePreview';
import { styles } from './styles';
import { useTemplatePreview } from './useTemplatePreview';

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
    reminderTime,
    handleImport,
    handleClose,
    handleColorSelect,
    handleTimeChange,
  } = useTemplatePreview({ onClose, onImport, template });

  if (!template) return null;

  const isImporting = importingTemplateId === template._id;

  return (
    <Modal
      disableBackdropClose={isImporting}
      variant='fullScreen'
      visible={visible}
      onClose={handleClose}
    >
      <View style={styles.container}>
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
