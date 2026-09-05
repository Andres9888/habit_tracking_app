/**
 * FullsizeTemplatePreview - Main orchestration component
 * A fullsize preview modal for template cards
 */

import React, { useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from '../Modal';
import { useReducedMotion } from 'react-native-reanimated';
import { PreviewContent } from './components';
import {
  useEntranceAnimations,
  useExitAnimations,
  useDeferredUnmount,
  useSuccessAnimations,
  useButtonAnimations,
  useAnimatedStyles,
  useHandlers,
  useHardwareBack,
} from './hooks';
import type { FullsizeTemplatePreviewProps } from './FullsizeTemplatePreview.types';
import { durations } from '@/theme/animations';

function FullsizeTemplatePreviewComponent({
  template,
  visible,
  initialAnchor = 'top',
  onClose,
  onBack,
  onImport,
  onCustomize,
  onGoToHabit,
  importedHabitId,
  isImporting = false,
  isImported = false,
}: FullsizeTemplatePreviewProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  const shouldRender = useDeferredUnmount({
    duration: durations.enter,
    reducedMotion,
    visible,
  });
  const lastTemplateRef = useRef(template);
  if (template) lastTemplateRef.current = template;
  const effectiveTemplate = visible ? template : lastTemplateRef.current;

  const entranceAnimations = useEntranceAnimations({
    reducedMotion,
    template: effectiveTemplate,
    visible,
  });
  useExitAnimations({ ...entranceAnimations, reducedMotion, visible });
  const successAnimations = useSuccessAnimations({ isImported, reducedMotion });
  const buttons = useButtonAnimations({ isImported, reducedMotion, visible });
  const handlers = useHandlers({
    importedHabitId,
    isImported,
    isImporting,
    onBack,
    onClose,
    onCustomize,
    onGoToHabit,
    onImport,
    template: effectiveTemplate,
  });
  const animatedStyles = useAnimatedStyles({
    ...entranceAnimations,
    ...buttons,
    ...successAnimations,
  });

  // Block the hardware back mid-import for the same reason the backdrop is
  // blocked: the add is in flight and unmounting under it strands the result.
  useHardwareBack({
    enabled: visible && !isImporting,
    onBack: handlers.handleDismiss,
  });

  if (!shouldRender || !effectiveTemplate) return null;

  return (
    <Modal
      inline
      accessibilityViewIsModal
      disableBackdropClose={isImporting}
      disableGestureClose
      skipAnimation
      variant='fullScreen'
      visible={shouldRender}
      onClose={handlers.handleDismiss}
    >
      <PreviewContent
        animatedStyles={animatedStyles}
        createPressHandlers={buttons.createPressHandlers}
        customizeButtonScale={buttons.customizeButtonScale}
        handlers={handlers}
        importButtonScale={buttons.importButtonScale}
        insets={insets}
        initialAnchor={initialAnchor}
        isImported={isImported}
        isImporting={isImporting}
        reducedMotion={reducedMotion}
        template={effectiveTemplate}
        visible={visible}
      />
    </Modal>
  );
}

export default React.memo(FullsizeTemplatePreviewComponent);
