import type { Habit } from '../../../../features/habits/types';

export interface WhyBenefitsEditModalProps {
  habit: Habit;
  visible: boolean;
  onClose: () => void;
}

export interface WhyBenefitsFormState {
  why: string;
  identity: string;
  benefitsRaw: string;
  scienceNote: string;
}
