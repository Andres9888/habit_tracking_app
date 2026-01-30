/**
 * Type definitions for DualVizSetup component
 *
 * Defines the visualization data structure for the Huberman dual visualization protocol
 */

export interface VisualizationData {
  /** Success visualization - how body feels when succeeding */
  successBody?: string;
  /** Success visualization - how mind feels when succeeding */
  successMind?: string;
  /** Success visualization - emotions when succeeding */
  successEmotion?: string;
  /** Failure visualization - how body feels when failing */
  failureBody?: string;
  /** Failure visualization - how mind feels when failing */
  failureMind?: string;
  /** Failure visualization - emotions when failing */
  failureEmotion?: string;
}

export interface DualVizSetupProps {
  /** The habit's visualization data */
  visualization: VisualizationData | undefined;
  /** Callback when user taps to edit/add visualizations */
  onPress: () => void;
  /** Whether to run entrance animations (first tab visit only) */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

export interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export interface AnimatedSectionProps {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}

export interface VizPreviewProps {
  type: 'success' | 'failure';
  body?: string;
  mind?: string;
  emotion?: string;
}

export interface DualVizExplainerModalProps {
  visible: boolean;
  onClose: () => void;
}
