import { useCallback, useState } from 'react';
import type { HabitTemplate } from '../types';

interface UseScienceModalOptions {
  onSelectTemplate: (template: HabitTemplate) => void;
}

export const useScienceModal = ({ onSelectTemplate }: UseScienceModalOptions) => {
  const [isVisible, setVisible] = useState(false);
  const [template, setTemplate] = useState<HabitTemplate | null>(null);

  const open = useCallback((next: HabitTemplate) => {
    setTemplate(next);
    setVisible(true);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const useTemplate = useCallback(() => {
    if (!template) return;
    onSelectTemplate(template);
    setVisible(false);
  }, [template, onSelectTemplate]);

  return { close, isVisible, open, template, useTemplate };
};

/** Type for the return value of useScienceModal */
export type UseScienceModal = ReturnType<typeof useScienceModal>;
