import type { Id } from '../../../convex/_generated/dataModel';

export interface HabitsAtRiskWidgetProps {
  onHabitPress: (habitId: Id<'habits'>) => void;
}

/**
 * At-risk habit type from predictions query
 * Matches the return type from api.predictions.getHabitsAtRisk
 */
export interface AtRiskHabit {
  _id: Id<'habits'>;
  name: string;
  icon: string;
  strength: number;
  accessibility: number;
  predictedProbability: number;
  riskLevel: string; // 'high' or 'medium' from query
}
