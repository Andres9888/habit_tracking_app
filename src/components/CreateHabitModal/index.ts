/**
 * CreateHabitModal Components
 *
 * Modal variants for creating new habits:
 * - Default: Full flow with emoji/color pickers
 * - V2: Inline emoji input variant
 * - Centered: Progressive disclosure with optional customization
 * - SingleScreen: Redesigned single-screen with collapsible customize (human-optimized)
 *
 * Also exports reusable sub-components for custom flows.
 */

// Original modal - simple flow with full input, emoji picker, color picker
export { default } from './CreateHabitModal';

// V2 modal (inline emoji input variant)
export { default as CreateHabitModalV2 } from './CreateHabitModalV2';

// Centered modal - progressive disclosure with optional customization (uses standard CreateHabitModalProps)
export { default as CreateHabitModalCentered } from './CreateHabitModalCentered';

// Single-screen modal - redesigned human-optimized flow (uses standard CreateHabitModalProps)
export { SingleScreenCreateHabitModal } from './SingleScreenCreateHabitModal';

// New components
export { HeroNameInput } from './components/HeroNameInput';
export { LivePreview } from './components/LivePreview';
export { StyleSection } from './components/StyleSection';
export { SimpleReminderSection } from './components/SimpleReminderSection';
