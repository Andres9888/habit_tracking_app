/**
 * FullsizeTemplatePreview - Main orchestration component
 * A fullsize preview modal for template cards
 */

import React, { useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from '../Modal';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { PreviewContent } from './components';
import {
  useEntranceAnimations,
  useExitAnimations,
  useDeferredUnmount,
  useSuccessAnimations,
  useButtonAnimations,
  useAnimatedStyles,
  useHandlers,
} from './hooks';
import type { FullsizeTemplatePreviewProps } from './FullsizeTemplatePreview.types';

function FullsizeTemplatePreviewComponent({
  template,
  visible,
  initialAnchor = 'top',
  onClose,
  onBack,
  onImport,
  onCustomize,
  isImporting = false,
  isImported = false,
}: FullsizeTemplatePreviewProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();

  const shouldRender = useDeferredUnmount({
    duration: 280,
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
  const buttons = useButtonAnimations({ reducedMotion });
  const handlers = useHandlers({
    isImported,
    isImporting,
    onBack,
    onClose,
    onCustomize,
    onImport,
    reducedMotion,
    template: effectiveTemplate,
  });
  const animatedStyles = useAnimatedStyles({
    ...entranceAnimations,
    ...buttons,
    ...successAnimations,
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
      onClose={handlers.handleClose}
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
