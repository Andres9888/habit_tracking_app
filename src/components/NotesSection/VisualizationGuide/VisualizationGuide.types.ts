/**
 * Type definitions for VisualizationGuide component
 */

export interface VisualizationApproach {
  title: string;
  description: string;
  example: string;
  why: string;
  icon: React.ReactNode;
}

export interface VisualizationTechnique {
  id: string;
  good: VisualizationApproach;
  bad: VisualizationApproach;
}

export interface VisualizationGuideProps {
  habitName?: string;
  onClose?: () => void;
}

export interface VisualizationCardProps {
  technique: VisualizationTechnique;
}

export interface QuickTipProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}
