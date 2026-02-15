/**
 * PreviewContent - Main content area of the preview modal
 */

import React from 'react';

import Animated from 'react-native-reanimated';

import type { PreviewContentProps } from './PreviewContent.types';
import { ConfettiOverlay } from './ConfettiOverlay';
import { FooterSection } from './FooterSection';
import { ModalHeader } from './ModalHeader';
import { ScrollableContent } from './ScrollableContent';
import { SuccessGlowOverlay } from './SuccessGlowOverlay';
import { layoutStyles } from '../styles';

export function PreviewContent({
  animatedStyles,
  confettiRef,
  createPressHandlers,
  customizeButtonScale,
  handlers,
  iconColor,
  importButtonScale,
  insets,
  isImported,
  isImporting,
  reducedMotion,
  template,
}: PreviewContentProps) {
  return (
    <Animated.View
      style={[layoutStyles.container, animatedStyles.contentStyle]}
    >
      <SuccessGlowOverlay animatedStyle={animatedStyles.successGlowStyle} />
      <ModalHeader
        closeButtonAnimatedOpacityStyle={
          animatedStyles.closeButtonAnimatedOpacityStyle
        }
        topInset={insets.top}
        onClose={handlers.handleClose}
      />
      <ScrollableContent
        iconAnimatedStyle={animatedStyles.iconAnimatedStyle}
        iconColor={iconColor}
        iconGlowStyle={animatedStyles.iconGlowStyle}
        template={template}
        onResearchPress={handlers.handleResearchPress}
      />
      <FooterSection
        bottomInset={insets.bottom}
        checkmarkAnimatedStyle={animatedStyles.checkmarkAnimatedStyle}
        createPressHandlers={createPressHandlers}
        customizeButtonScale={customizeButtonScale}
        customizeButtonStyle={animatedStyles.customizeButtonStyle}
        iconColor={iconColor}
        importButtonScale={importButtonScale}
        importButtonStyle={animatedStyles.importButtonStyle}
        isImported={isImported}
        isImporting={isImporting}
        successButtonGlowStyle={animatedStyles.successButtonGlowStyle}
        successIconBounceStyle={animatedStyles.successIconBounceStyle}
        templateName={template?.name ?? ''}
        onCustomize={handlers.handleCustomize}
        onImport={handlers.handleImport}
      />
      <ConfettiOverlay
        ref={confettiRef}
        visible={isImported && !reducedMotion}
      />
    </Animated.View>
  );
}
