/**
 * Hook for TemplatePreviewModal business logic
 */

import { useState, useEffect, useCallback } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { DEFAULT_ICON_COLOR, safeColor } from './constants';
import type { TemplateCustomizations } from './types';
import { triggerHaptic } from '@/utils/haptics';

interface UseTemplatePreviewProps {
  template: Doc<'templates'> | null;
  onClose: () => void;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => void;
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export function useTemplatePreview({
  template,
  onClose,
  onImport,
}: UseTemplatePreviewProps) {
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState(DEFAULT_ICON_COLOR);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [preferredTime, setPreferredTime] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>(ALL_DAYS);

  // Reset customization when template changes
  useEffect(() => {
    if (template) {
      setCustomName(template.name);
      setCustomColor(safeColor(template.iconColor));
      setReminderTime(new Date());
      setPreferredTime(null);
      setSelectedDays(ALL_DAYS);
    }
  }, [template]);

  const handleToggleDay = useCallback((day: number) => {
    void triggerHaptic('tap');
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        // Don't allow deselecting all days
        if (prev.length <= 1) return prev;
        return prev.filter((d) => d !== day);
      }
      return [...prev, day].sort();
    });
  }, []);

  const handleSelectPreferredTime = useCallback((time: string | null) => {
    void triggerHaptic('tap');
    setPreferredTime(time);
  }, []);

  const handleImport = useCallback(() => {
    if (!template) return;

    void triggerHaptic('toggle');

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
    if (preferredTime) {
      customizations.preferredTime = preferredTime;
    }
    const isAllDays = selectedDays.length === 7;
    if (!isAllDays) {
      customizations.daysOfWeek = selectedDays;
    }

    onImport(template._id, customizations);
  }, [template, customName, customColor, reminderTime, showTimePicker, preferredTime, selectedDays, onImport]);

  const handleClose = useCallback(() => {
    void triggerHaptic('tap');
    onClose();
  }, [onClose]);

  const handleColorSelect = useCallback((color: string) => {
    void triggerHaptic('tap');
    setCustomColor(color);
  }, []);

  const handleTimeChange = useCallback((time: Date) => {
    void triggerHaptic('tap');
    setReminderTime(time);
  }, []);

  return {
    customColor,
    customName,
    handleClose,
    handleColorSelect,
    handleImport,
    handleSelectPreferredTime,
    handleTimeChange,
    handleToggleDay,
    preferredTime,
    reminderTime,
    selectedDays,
    setCustomName,
    setShowTimePicker,
    showTimePicker,
  };
}
