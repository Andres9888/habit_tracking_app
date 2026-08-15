import type { MotivationDraft } from './motivationDraft';
import type { MotivationFieldKey } from '../../../../convex/habits/validateMotivationFields';

export interface MotivationSectionProps {
  onChange: (key: MotivationFieldKey, value: string) => void;
  values: MotivationDraft;
}

export interface MotivationFieldProps {
  hint: string;
  label: string;
  maxLength: number;
  onChange: (value: string) => void;
  short?: boolean;
  value: string;
}
