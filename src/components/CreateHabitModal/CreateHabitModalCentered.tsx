/**
 * @file CreateHabitModalCentered.tsx
 * @description Full-screen modal for creating or editing a habit.
 *
 * ## Architecture
 * Matches `HabitEditScreen` presentation: transparent modal with dark overlay,
 * rounded-top container, `KeyboardAvoidingView`, and swipe-to-dismiss gesture.
 *
 * All form state lives in the `useCreateHabitModal` hook (habit name, emoji, color,
 * reminder settings). This component is a structural shell that:
 * 1. Manages modal visibility and swipe-dismiss gesture.
 * 2. Resets form state when the modal opens in create mode.
 * 3. Delegates scrollable form content to `CreateHabitScrollContent`.
 * 4. Delegates header (title + save button) to `ModalHeader`.
 *
 * ## State Flow
 * ```
 * Modal opens (visible=true)
 *   ├─ isEditMode=false → form.resetForm() + clear name error
 *   └─ isEditMode=true  → form pre-populated from habitToEdit prop
 *
 * User interaction:
 *   Type name → pick emoji → pick color → toggle reminder → set time
 *     → Tap "Save" (ModalHeader) → callbacks.handleSave()
 *       → validates name (≥2 chars) → handleCreate() → onClose()
 *
 * Swipe down → panGesture triggers onClose()
 * ```
 *
 * ## Refactoring Opportunities
 * - **REFACTOR**: The `useEffect` that resets form on open could move into `useCreateHabitModal`
 *   to co-locate all form lifecycle logic.
 * - **REFACTOR**: `showNameError` state is managed here but consumed deep in
 *   `CreateHabitScrollContent` → consider lifting into the form hook.
 */

import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, View } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useThemeColors } from '../../theme/ThemeContext';
import { CreateHabitScrollContent } from './components/CreateHabitScrollContent';
import { ModalHeader } from './components/ModalHeader';
import { useCenteredFormCallbacks } from './hooks/useCenteredFormCallbacks';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { useKeyboardState } from './hooks/useKeyboardState';
import { useSwipeDismiss } from './hooks/useSwipeDismiss';
import type { CreateHabitModalProps } from './types';

// ── Component ────────────────────────────────────────────────────────

/**
 * Full-screen habit creation / editing modal.
 *
 * @param props.visible    - Controls modal visibility.
 * @param props.onClose    - Called when the user dismisses the modal (save, swipe, or back button).
 * @param props.habitToEdit - When provided, the form pre-fills for editing instead of creating.
 */
export default function CreateHabitModalCentered(props: CreateHabitModalProps) {
  const { visible, onClose } = props;

  // ── Hooks ──────────────────────────────────────────────────────

  /** Core form state & submission handler. `isEditMode` is derived from `habitToEdit`. */
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);

  /** Ref to the inner ScrollView — used to scroll to validation errors. */
  const scrollViewRef = useRef<ScrollViewType>(null);

  /** Whether the habit name validation error is currently shown. */
  const [showNameError, setShowNameError] = useState(false);

  const { colors } = useThemeColors();

  /** Tracks keyboard visibility — used by `ModalHeader` to adjust layout. */
  const { isKeyboardVisible } = useKeyboardState();

  /** Pan gesture + animated style for swipe-to-dismiss behavior. */
  const { animatedStyle, panGesture } = useSwipeDismiss({ onClose });

  /**
   * Form action callbacks (save, validation error handling).
   * Bridges between `ModalHeader` actions and the form hook.
   */
  const callbacks = useCenteredFormCallbacks({
    form,
    handleCreate,
    scrollViewRef,
    setShowNameError,
  });

  // ── Side Effects ───────────────────────────────────────────────

  /**
   * Resets the form when the modal opens in create mode.
   * In edit mode, the form is pre-populated by `useCreateHabitModal`.
   */
  useEffect(() => {
    if (visible && !isEditMode) {
      form.resetForm();
      setShowNameError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isEditMode]);

  // ── Render ─────────────────────────────────────────────────────

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Dark overlay behind the modal */}
        <View className='flex-1 bg-black/50'>
          {/* Swipe-to-dismiss gesture wraps the entire modal container */}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              className='flex-1 overflow-hidden rounded-t-3xl shadow-2xl'
              style={[animatedStyle, { backgroundColor: colors.surface }]}
            >
              {/* Header: title ("New Habit" / "Edit Habit") + Save button */}
              <ModalHeader
                habitName={form.habitName}
                isEditMode={isEditMode}
                isKeyboardVisible={isKeyboardVisible}
                onClose={onClose}
                onSave={callbacks.handleSave}
                onValidationError={callbacks.handleValidationError}
              />

              {/* Scrollable form: name input, emoji, color, reminder */}
              <CreateHabitScrollContent
                callbacks={callbacks}
                form={form}
                scrollViewRef={scrollViewRef}
                showNameError={showNameError}
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
