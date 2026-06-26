/**
 * PreviewContent - Main content area of the preview modal
 */

import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import { layoutStyles } from '../styles';
import { scienceTheme } from './science/scienceTheme';
import { useHeaderTintAnimation } from '../hooks/useHeaderTintAnimation';
import { ModalHeader } from './ModalHeader';
import { ScrollableContent } from './ScrollableContent';
import { FooterSection } from './FooterSection';
import { TemplateShareSheet } from './share/TemplateShareSheet';
import type { PreviewContentProps } from './PreviewContent.types';

export function PreviewContent({
  animatedStyles,
  createPressHandlers,
  customizeButtonScale,
  handlers,
  iconColor,
  importButtonScale,
  insets,
  initialAnchor = 'top',
  isImported,
  isImporting,
  reducedMotion,
  template,
  visible,
}: PreviewContentProps) {
  const headerTint = scienceTheme(template).gradientStart;
  const { scrollHandler, onHeroLayout, animatedBgStyle } =
    useHeaderTintAnimation(headerTint);
  const [shareOpen, setShareOpen] = useState(false);
  return (
    <Animated.View
      testID='templates-preview-modal'
      style={[layoutStyles.container, animatedStyles.contentStyle]}
    >
      <ModalHeader
        animatedBgStyle={animatedBgStyle}
        closeButtonAnimatedOpacityStyle={
          animatedStyles.closeButtonAnimatedOpacityStyle
        }
        template={template}
        tintColor={headerTint}
        topInset={insets.top}
        onClose={handlers.handleClose}
        onShare={() => setShareOpen(true)}
      />
      <ScrollableContent
        iconAnimatedStyle={animatedStyles.iconAnimatedStyle}
        iconColor={iconColor}
        iconGlowStyle={animatedStyles.iconGlowStyle}
        initialAnchor={initialAnchor}
        overscrollTint={headerTint}
        reducedMotion={reducedMotion}
        scrollHandler={scrollHandler}
        template={template}
        visible={visible}
        onHeroLayout={onHeroLayout}
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
        successPillStyle={animatedStyles.successPillStyle}
        templateName={template?.name ?? ''}
        onCustomize={handlers.handleCustomize}
        onImport={handlers.handleImport}
      />
      <TemplateShareSheet
        template={template}
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </Animated.View>
  );
}
