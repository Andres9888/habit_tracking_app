/* eslint-disable max-lines */
/**
 * Hook for TemplatePreviewModal business logic
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { algorithmForMinutes } from '@/utils/algorithmFromDuration';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
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
const DEFAULT_STRENGTH_ALGORITHM: AlgorithmMode = 'balanced';
const DEFAULT_STREAK_GOAL = 0;

export function useTemplatePreview({
  template,
  onClose,
  onImport,
}: UseTemplatePreviewProps) {
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState(DEFAULT_ICON_COLOR);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [preferredTime, setPreferredTime] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>(ALL_DAYS);
  const [strengthAlgorithm, setStrengthAlgorithm] = useState<AlgorithmMode>(
    DEFAULT_STRENGTH_ALGORITHM
  );
  const initialStrengthAlgorithmRef = useRef<AlgorithmMode>(
    DEFAULT_STRENGTH_ALGORITHM
  );
  const [progressEmojis, setProgressEmojis] = useState<
    ProgressEmojiSet | undefined
  >(undefined);
  const [streakGoal, setStreakGoal] = useState<number>(DEFAULT_STREAK_GOAL);

  // Reset customization when template changes
  useEffect(() => {
    if (template) {
      setCustomName(template.name);
      setCustomIcon(template.icon);
      setCustomColor(safeColor(template.iconColor));
      setReminderTime(new Date());
      setPreferredTime(null);
      setSelectedDays(ALL_DAYS);
      const derived =
        typeof template.estimatedMinutes === 'number'
          ? algorithmForMinutes(template.estimatedMinutes)
          : DEFAULT_STRENGTH_ALGORITHM;
      initialStrengthAlgorithmRef.current = derived;
      setStrengthAlgorithm(derived);
      setProgressEmojis(undefined);
      setStreakGoal(DEFAULT_STREAK_GOAL);
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
    if (customIcon && customIcon !== template.icon) {
      customizations.icon = customIcon;
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
    if (strengthAlgorithm !== initialStrengthAlgorithmRef.current) {
      customizations.strengthAlgorithm = strengthAlgorithm;
    }
    if (progressEmojis !== undefined) {
      customizations.progressEmojis = progressEmojis;
    }
    if (streakGoal !== DEFAULT_STREAK_GOAL) {
      customizations.streakGoal = streakGoal;
    }

    onImport(template._id, customizations);
  }, [
    template,
    customName,
    customIcon,
    customColor,
    reminderTime,
    showTimePicker,
    preferredTime,
    selectedDays,
    strengthAlgorithm,
    progressEmojis,
    streakGoal,
    onImport,
  ]);

  const handleClose = useCallback(() => {
    void triggerHaptic('tap');
    onClose();
  }, [onClose]);

  const handleColorSelect = useCallback((color: string) => {
    void triggerHaptic('tap');
    setCustomColor(color);
  }, []);

  const handleIconSelect = useCallback((icon: string | null) => {
    void triggerHaptic('tap');
    setCustomIcon(icon);
  }, []);

  const handleTimeChange = useCallback((time: Date) => {
    void triggerHaptic('tap');
    setReminderTime(time);
  }, []);

  const handleStrengthAlgorithmChange = useCallback((mode: AlgorithmMode) => {
    void triggerHaptic('tap');
    setStrengthAlgorithm(mode);
  }, []);

  const handleProgressEmojisChange = useCallback(
    (next: ProgressEmojiSet | undefined) => {
      void triggerHaptic('tap');
      setProgressEmojis(next);
    },
    []
  );

  const handleStreakGoalChange = useCallback((days: number) => {
    void triggerHaptic('tap');
    setStreakGoal(days);
  }, []);

  return {
    customColor,
    customIcon,
    customName,
    handleClose,
    handleColorSelect,
    handleIconSelect,
    handleImport,
    handleProgressEmojisChange,
    handleSelectPreferredTime,
    handleStreakGoalChange,
    handleStrengthAlgorithmChange,
    handleTimeChange,
    handleToggleDay,
    preferredTime,
    progressEmojis,
    reminderTime,
    selectedDays,
    setCustomName,
    setShowTimePicker,
    showTimePicker,
    streakGoal,
    strengthAlgorithm,
  };
}
