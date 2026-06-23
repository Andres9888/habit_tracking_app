import type { GoalCollection } from '../../data/goalCollections';

export interface HeroCopyProps {
  subtitle: string;
  title: string;
}

export interface LibraryHeroProps {
  heroSubtitle?: string;
  heroTitle?: string;
  isCompressed?: boolean;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSelectGoal: (goal: GoalCollection) => void;
  searchQuery: string;
  selectedGoalId: string | null;
}
