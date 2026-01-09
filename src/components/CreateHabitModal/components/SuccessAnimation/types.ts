/**
 * SuccessAnimation Types
 *
 * Type definitions for the success animation components
 */

export interface SuccessAnimationProps {
  habitName: string;
  onComplete: () => void;
  selectedColor: string;
  selectedEmoji: string | null;
  visible: boolean;
}

export interface ConfettiParticleProps {
  color: string;
  delay: number;
  left: number;
}

export interface ConfettiParticleData {
  color: string;
  delay: number;
  id: number;
  left: number;
}
