/**
 * PreviewContent - Main content area of the preview modal
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { layoutStyles } from '../styles';
import { buildHeroGradient } from '../utils/heroGradient';
import { useHeaderTintAnimation } from '../hooks/useHeaderTintAnimation';
import { ModalHeader } from './ModalHeader';
import { ScrollableContent } from './ScrollableContent';
import { FooterSection } from './FooterSection';
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
  template,
  visible,
}: PreviewContentProps) {
  const headerTint = buildHeroGradient(iconColor)[0];
  const { scrollHandler, onHeroLayout, animatedBgStyle, scrollY } =
    useHeaderTintAnimation(headerTint);
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
        tintColor={headerTint}
        topInset={insets.top}
        onBack={handlers.handleBack}
        onClose={handlers.handleClose}
      />
      <ScrollableContent
        iconAnimatedStyle={animatedStyles.iconAnimatedStyle}
        iconColor={iconColor}
        iconGlowStyle={animatedStyles.iconGlowStyle}
        initialAnchor={initialAnchor}
        overscrollTint={headerTint}
        scrollHandler={scrollHandler}
        scrollY={scrollY}
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
    </Animated.View>
  );
}
