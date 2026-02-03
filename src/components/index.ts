/**
 * Component Barrel Exports
 *
 * Centralized exports for commonly-used components.
 * Import pattern: import { Button, Modal } from '@/components';
 *
 * Note: Not all components are exported here yet. For components not listed,
 * continue using direct imports: import { HabitCard } from '@/components/HabitCard';
 */

// ============================================================================
// UI Primitives
// ============================================================================
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Card, CardHeader, CardContent } from './Card';
export type { CardProps } from './Card';

// ============================================================================
// Overlays
// ============================================================================
export { Modal } from './Modal';
export { Toast } from './Toast';

// ============================================================================
// UI Components
// ============================================================================
export { EmptyState } from './EmptyState';
export type { EmptyStateProps, EmptyStateVariant } from './EmptyState/types';

export { SkeletonLoader } from './SkeletonLoader';

// ============================================================================
// Habit Components (commonly used)
// ============================================================================
export { HabitCard } from './HabitCard';
export { StreakIndicator } from './StreakIndicator';
export { DraggableHabit } from './DraggableHabit';

// ============================================================================
// Auth Components
// ============================================================================
export * from './auth';

// ============================================================================
// Future: Add more exports as needed
// To add a new component:
// 1. Add export statement above in appropriate section
// 2. Include type exports if the component has public types
// ============================================================================
