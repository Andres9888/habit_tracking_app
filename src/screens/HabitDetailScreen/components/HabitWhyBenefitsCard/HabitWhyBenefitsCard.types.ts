import type { Habit } from '../../../../features/habits/types';

export type PersonalSource = 'why' | 'identity' | 'woopWish';

export interface PersonalBlockData {
  source: PersonalSource;
  label: string;
  icon: string;
  value: string;
}

export interface HabitWhyBenefitsCardProps {
  habit: Habit;
}

export interface TemplateProvenance {
  templateName: string;
  scientificReference: string;
  scientificLink: string | null;
}
