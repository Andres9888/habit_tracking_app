/**
 * Hook for TemplatePreviewModal business logic
 */

import { useState, useEffect, useCallback } from 'react';

import * as Haptics from 'expo-haptics';

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from './types';
import { DEFAULT_ICON_COLOR, safeColor } from './constants';

interface UseTemplatePreviewProps {
  template: Doc<'templates'> | null;
  onClose: () => void;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => void;
}

export function useTemplatePreview({
  template,
  onClose,
  onImport,
}: UseTemplatePreviewProps) {
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

  const handleImport = useCallback(() => {
    if (!template) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const customizations: TemplateCustomizations = {};

    if (customName !== template.name) {
      customizations.name = customName;
    }
    if (customColor !== template.iconColor) {
      customizations.iconColor = customColor;
    }
    if (showTimePicker) {
      customizations.reminderTime = reminderTime.toISOString();
    }

    onImport(template._id, customizations);
  }, [template, customName, customColor, reminderTime, showTimePicker, onImport]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  const handleColorSelect = useCallback((color: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCustomColor(color);
  }, []);

  const handleTimeChange = useCallback((time: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReminderTime(time);
  }, []);

  return {
    customColor,
    customName,
    handleClose,
    handleColorSelect,
    handleImport,
    handleTimeChange,
    reminderTime,
    setCustomName,
    setShowTimePicker,
    showTimePicker,
  };
}
