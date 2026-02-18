/**
 * FullsizeTemplatePreview - Main orchestration component
 * A fullsize preview modal for template cards
 * 
 * Uses useMemo to prevent unnecessary animation recalculations on parent re-renders.
 */

import React, { useMemo } from 'react';
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

  // Memoize animation configs to prevent unnecessary recalculations
  const entranceAnimations = useMemo(
    () => ({
      entranceAnimations: useEntranceAnimations({
        reducedMotion,
        template,
        visible,
      }),
    }),
    [reducedMotion, template, visible]
  ).entranceAnimations;

  const successAnimations = useMemo(
    () => useSuccessAnimations({ isImported, reducedMotion }),
    [isImported, reducedMotion]
  );

  const buttonAnimations = useMemo(
    () => useButtonAnimations({ reducedMotion }),
    [reducedMotion]
  );

  const handlers = useMemo(
    () =>
      useHandlers({
        isImported,
        isImporting,
        onClose,
        onCustomize,
        onImport,
        reducedMotion,
        template,
      }),
    [isImported, isImporting, onClose, onCustomize, onImport, reducedMotion, template]
  );

  const animatedStyles = useMemo(
    () =>
      useAnimatedStyles({
        ...entranceAnimations,
        closeButtonScale: buttonAnimations.closeButtonScale,
        customizeButtonScale: buttonAnimations.customizeButtonScale,
        importButtonScale: buttonAnimations.importButtonScale,
        ...successAnimations,
      }),
    [entranceAnimations, buttonAnimations, successAnimations]
  );

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
        closeButtonScale={buttonAnimations.closeButtonScale}
        confettiRef={successAnimations.confettiRef}
        createPressHandlers={buttonAnimations.createPressHandlers}
        customizeButtonScale={buttonAnimations.customizeButtonScale}
        handlers={handlers}
        iconColor={iconColor}
        importButtonScale={buttonAnimations.importButtonScale}
        insets={insets}
        isImported={isImported}
        isImporting={isImporting}
        reducedMotion={reducedMotion}
        template={template}
      />
    </Modal>
  );
}
