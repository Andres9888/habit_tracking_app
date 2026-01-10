export interface CharacterScreenProps {
  onBack?: () => void;
}

export interface AttributeCardProps {
  icon: React.ReactNode;
  name: string;
  value: number;
  maxValue: number;
  gradientColors: readonly [string, string];
  bgGradient: readonly [string, string];
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
  xp: number;
  xpToNextLevel: number;
}
