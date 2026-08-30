/**
 * PreviewContent - Main content area of the preview modal
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { layoutStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
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
  importButtonScale,
  insets,
  initialAnchor = 'top',
  isImported,
  isImporting,
  reducedMotion,
  template,
  visible,
}: PreviewContentProps) {
  // Header tint, hero stop 0 and the ScrollView overscroll tint must all read
  // the same value or scrolling shows a seam at the hero boundary.
  const palette = useDetailPalette();
  const headerTint = palette.heroGradient[0];
  const { scrollHandler, onHeroLayout, animatedBgStyle } =
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
        importButtonScale={importButtonScale}
        importButtonStyle={animatedStyles.importButtonStyle}
        isImported={isImported}
        isImporting={isImporting}
        successPillStyle={animatedStyles.successPillStyle}
        templateName={template?.name ?? ''}
        onCustomize={handlers.handleCustomize}
        onGoToToday={handlers.handleGoToHabit}
        onImport={handlers.handleImport}
        onKeepExploring={handlers.handleBack}
      />
    </Animated.View>
  );
}
