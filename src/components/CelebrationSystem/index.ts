/**
 * Celebration System
 *
 * Enhanced celebration/confetti system with multiple burst types,
 * physics simulation, haptic feedback, and sound effects.
 *
 * Features:
 * - Multiple burst types: chainCompletion, streakMilestone, levelUp, perfectWeek, default
 * - Physics-based particles with gravity, wind, and drag
 * - Haptic feedback patterns for each burst type
 * - Sound effects for celebrations
 * - Dark mode-aware color palettes
 * - Reduced motion support
 *
 * @example
 * ```tsx
 * import { ConfettiSystem, useCelebration } from '@/components/CelebrationSystem';
 *
 * function MyComponent() {
 *   const { triggerCelebration, activeBurst, config } = useCelebration({
 *     soundEnabled: true,
 *     hapticsEnabled: true,
 *   });
 *
 *   const handleHabitComplete = () => {
 *     triggerCelebration('streakMilestone');
 *   };
 *
 *   return (
 *     <>
 *       {activeBurst && (
 *         <ConfettiSystem
 *           burstType={activeBurst}
 *           shouldReduceMotion={false}
 *           isDarkMode={useThemeColors().isDark}
 *           {...config}
 *         />
 *       )}
 *       <Button onPress={handleHabitComplete}>Complete Habit</Button>
 *     </>
 *   );
 * }
 * ```
 */

// Main component
export { ConfettiSystem } from './confetti/ConfettiSystem';

// Hook
export {
  useCelebration,
  type UseCelebrationOptions,
} from './hooks/useCelebration';

// Types
export type {
  BurstType,
  ConfettiSystemProps,
} from './confetti/types';

// Re-export confetti internals for advanced usage
export * from './confetti/index';

// Utilities
export * from './utils/index';
