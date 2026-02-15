/**
 * Constants for AffirmationsSection
 * Content limits, type configurations, and styling
 */

import { User, Zap, BookOpen } from 'lucide-react-native';

import type { TypeConfig } from './AffirmationsSection.types';

// Content limits (matching Convex validation)
export const MAX_TEXT_LENGTH = 200;

// Free tier limit
export const FREE_TIER_MAX_AFFIRMATIONS = 2;

// Type configuration for styling and labels
export const TYPE_CONFIG: TypeConfig = {
  identity: {
    bgColor: 'bg-amber-100',
    description: '"I am someone who..."',
    icon: User,
    label: 'Identity',
    selectedBg: 'bg-amber-500',
    textColor: 'text-amber-700',
  },
  instructional: {
    bgColor: 'bg-yellow-100',
    description: '"Progress, not perfection"',
    icon: BookOpen,
    label: 'Instructional',
    selectedBg: 'bg-yellow-500',
    textColor: 'text-yellow-700',
  },
  motivational: {
    bgColor: 'bg-orange-100',
    description: '"I can do hard things"',
    icon: Zap,
    label: 'Motivational',
    selectedBg: 'bg-orange-500',
    textColor: 'text-orange-700',
  },
};

// Example affirmations for inspiration in editor
export const EXAMPLE_AFFIRMATIONS = [
  'I am capable of achieving my goals',
  'Every small step counts',
  'I choose progress over perfection',
  'I am becoming the person I want to be',
];
