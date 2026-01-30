export type RiskLevel = 'low' | 'medium' | 'high';
export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface PredictionData {
  /** Predicted strength in 7 days (0-100) */
  predictedStrength: number;
  /** Current strength (0-100) */
  currentStrength: number;
  /** Confidence level (0-100) */
  confidence: number;
  /** Risk assessment */
  riskLevel: RiskLevel;
  /** Trend direction */
  trend: TrendDirection;
  /** Suggested actions to improve */
  suggestions: string[];
}

export interface PredictionInsightsProps {
  /** Prediction data */
  data: PredictionData;
  /** Show detailed suggestions */
  showSuggestions?: boolean;
}
