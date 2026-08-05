/**
 * Type definitions for VisualizationExercise component
 */

export type VisualizationStep = 'intro' | 'positive' | 'negative' | 'summary';

export interface VisualizationData {
  habitName: string;
  negativeVisualization: string;
  positiveVisualization: string;
  timestamp: number;
}

export interface VisualizationExerciseProps {
  habitName: string;
  onClose?: () => void;
  onSave?: (data: VisualizationData) => void;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export interface IntroStepProps {
  habitName: string;
  onNext: () => void;
}

export interface VisualizationInputStepProps {
  onBack: () => void;
  onNext: () => void;
  value: string;
  onValueChange: (text: string) => void;
}

export interface SummaryStepProps {
  habitName: string;
  negativeVisualization: string;
  onBack: () => void;
  onSave: () => void;
  positiveVisualization: string;
}
