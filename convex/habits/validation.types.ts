export interface HabitArgs {
  name?: string;
  notes?: string;
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  preferredTime?: string;
  reminderTime?: string;
  reminderSound?: string;
  identity?: string;
  why?: string;
  frequency?: string;
  goalUnit?: string;
}

export interface ValidatedHabitFields {
  name: string;
  notes?: string;
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  preferredTime?: string;
  reminderTime?: string;
  reminderSound?: string;
  identity?: string;
  why?: string;
  frequency?: string;
  goalUnit?: string;
}
