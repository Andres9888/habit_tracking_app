export interface StrengthLevel {
  count: number;
  percentage: number;
  emoji: string;
}

export interface StrengthDistributionData {
  starting: StrengthLevel;
  building: StrengthLevel;
  developing: StrengthLevel;
  strong: StrengthLevel;
  automatic: StrengthLevel;
  total: number;
}

export interface StrengthDistributionChartProps {
  data: StrengthDistributionData | null;
  onSegmentPress?: (level: string) => void;
}

export type StrengthLevelKey = Exclude<keyof StrengthDistributionData, 'total'>;

export interface ChartDataItem {
  color: string;
  label: string;
  level: StrengthLevelKey;
  value: number;
}
