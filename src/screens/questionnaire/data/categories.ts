export interface QuestionnaireCategory {
  id: string;
  emoji: string;
  label: string;
}

// Aligned with categoryMeta in TemplatesScreen/data — these ids match template
// records so Step 9 can filter live templates by chosen categories.
export const CATEGORY_OPTIONS: QuestionnaireCategory[] = [
  { id: 'health_fitness', emoji: '💪', label: 'Health & fitness' },
  { id: 'mindfulness', emoji: '🧘', label: 'Mindfulness' },
  { id: 'productivity', emoji: '🎯', label: 'Productivity' },
  { id: 'sleep', emoji: '😴', label: 'Sleep' },
  { id: 'mental_health', emoji: '🧠', label: 'Mental health' },
  { id: 'learning', emoji: '📚', label: 'Learning' },
  { id: 'morning_routine', emoji: '🌅', label: 'Morning routine' },
  { id: 'social', emoji: '👥', label: 'Social & relationships' },
];
