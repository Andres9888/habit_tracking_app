/**
 * FullsizeTemplatePreview - Main orchestration component
 * A fullsize preview modal for template cards
 */

import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from '../Modal';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { PreviewContent } from './components';
import {
  useEntranceAnimations,
  useSuccessAnimations,
  useButtonAnimations,
  useAnimatedStyles,
  useHandlers,
} from './hooks';
import { DEFAULT_ICON_COLOR } from './FullsizeTemplatePreview.constants';
import type { FullsizeTemplatePreviewProps } from './FullsizeTemplatePreview.types';

export default function FullsizeTemplatePreview({
  template,
  visible,
  onClose,
  onImport,
  onCustomize,
  isImporting = false,
  isImported = false,
}: FullsizeTemplatePreviewProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const iconColor = template?.iconColor?.trim() || DEFAULT_ICON_COLOR;

  const entranceAnimations = useEntranceAnimations({
    reducedMotion,
    template,
    visible,
  });
  const successAnimations = useSuccessAnimations({ isImported, reducedMotion });
  const {
    closeButtonScale,
    importButtonScale,
    customizeButtonScale,
    createPressHandlers,
  } = useButtonAnimations({ reducedMotion });
  const handlers = useHandlers({
    isImported,
    isImporting,
    onClose,
    onCustomize,
    onImport,
    reducedMotion,
    template,
  });
  const animatedStyles = useAnimatedStyles({
    ...entranceAnimations,
    closeButtonScale,
    customizeButtonScale,
    importButtonScale,
    ...successAnimations,
  });

  if (!template) return null;

  return (
    <Modal
      disableBackdropClose={isImporting}
      variant='fullScreen'
      visible={visible}
      onClose={handlers.handleClose}
    >
      <PreviewContent
        animatedStyles={animatedStyles}
        confettiRef={successAnimations.confettiRef}
        createPressHandlers={createPressHandlers}
        customizeButtonScale={customizeButtonScale}
        handlers={handlers}
        iconColor={iconColor}
        importButtonScale={importButtonScale}
        insets={insets}
        isImported={isImported}
        isImporting={isImporting}
        reducedMotion={reducedMotion}
        template={template}
      />
    </Modal>
  );
}
