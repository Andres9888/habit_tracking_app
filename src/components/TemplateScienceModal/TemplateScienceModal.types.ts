/**
 * Type definitions for TemplateScienceModal component
 */

import type { Doc } from '../../../convex/_generated/dataModel';

export interface TemplateScienceModalProps {
  isLoading?: boolean;
  onClose: () => void;
  onUseTemplate: () => void;
  template: Doc<'templates'> | null;
  visible: boolean;
}

export interface SkeletonBoxProps {
  borderRadius?: number;
  height: number;
  style?: object;
  width: number | 'auto' | `${number}%`;
}

export interface ConfettiParticleProps {
  color: string;
  delay: number;
  startX: number;
}

export interface AnimatedBorderBoxProps {
  baseColor: string;
  children: React.ReactNode;
  style?: object;
}

export interface PressHandlers {
  onPressIn: () => void;
  onPressOut: () => void;
}

export interface HeroSectionProps {
  baseColor: string;
  heroAnimatedStyle: object;
  iconGlowAnimatedStyle: object;
  isPopular: boolean;
  readingTime: number;
  template: Doc<'templates'>;
}

export interface AboutSectionProps {
  animatedStyle: object;
  description: string;
}

export interface YouTubeSectionProps {
  animatedStyle: object;
  onPress: () => void;
  pressHandlers: PressHandlers;
  buttonAnimatedStyle: object;
  templateName: string;
}

export interface ScienceSectionProps {
  animatedStyle: object;
  baseColor: string;
  linkButtonAnimatedStyle: object;
  onLinkPress: () => void;
  pressHandlers: PressHandlers;
  scientificLink?: string;
  scientificReference: string;
  template: Doc<'templates'>;
}

export interface FooterSectionProps {
  animatedStyle: object;
  backButtonAnimatedStyle: object;
  baseColor: string;
  onBack: () => void;
  onUseTemplate: () => void;
  pressHandlers: PressHandlers;
  templateName: string;
}

export interface HeaderProps {
  closeButtonAnimatedStyle: object;
  headerAnimatedStyle: object;
  headerTitleAnimatedStyle: object;
  onClose: () => void;
  onShare: () => void;
  pressHandlers: PressHandlers;
  shareButtonAnimatedStyle: object;
  templateName: string;
}
