export interface CharacterScreenProps {
  onBack?: () => void;
}

export interface AttributeCardProps {
  bgGradient: readonly [string, string];
  description?: string;
  gradientColors: readonly [string, string];
  icon: React.ReactNode;
  maxValue: number;
  name: string;
  value: number;
}

export interface StatCardProps {
  emoji: string;
  value: number | string;
  label: string;
}

export interface Achievement {
  description: string;
  icon: string;
  id: string;
  title: string;
}

export interface CharacterAttributes {
  energy: number;
  strength: number;
  vitality: number;
  wisdom: number;
}

export interface CharacterStats {
  activeHabits: number;
  dayStreak: number;
  totalPower: number;
}

export interface CharacterData {
  attributes: CharacterAttributes;
  level: number;
  recentAchievements: Achievement[];
  stats: CharacterStats;
  title: string;
  totalAchievements?: number;
  xp: number;
  xpToNextLevel: number;
}
