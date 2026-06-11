import type { GoalCollection } from '../../data/goalCollections';

export interface LibraryHeroProps {
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSelectGoal: (goal: GoalCollection) => void;
  searchQuery: string;
}

export interface HeroCopyProps {
  subtitle: string;
  title: string;
}
