/**
 * PreviewContent - Main content area of the preview modal. Wires the shared
 * scroll handler to both the header tint and the jump-chip scroll-spy.
 */

import React, { useCallback, useMemo, useRef } from 'react';
import Animated from 'react-native-reanimated';
import { layoutStyles } from '../styles';
import { buildHeroGradient } from '../utils/heroGradient';
import { availableSections, type SectionKey } from '../utils/sectionAvailability';
import { useHeaderTintAnimation } from '../hooks/useHeaderTintAnimation';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSectionAnchors } from '../hooks/useSectionAnchors';
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
  insets,
  initialAnchor = 'top',
  isImported,
  isImporting,
  reducedMotion,
  template,
  visible,
}: PreviewContentProps) {
  const headerTint = buildHeroGradient(iconColor)[0];
  const scrollRef = useRef<Animated.ScrollView>(null);
  const sections = useMemo(() => availableSections(template), [template]);
  const spy = useScrollSpy(sections);
  const anchors = useSectionAnchors({
    registerSection: spy.registerSection,
    setChipsHeight: spy.setChipsHeight,
    visible,
    initialAnchor,
    reducedMotion,
    scrollRef,
    templateId: template?._id,
  });
  const { scrollHandler, onHeroLayout, animatedBgStyle } = useHeaderTintAnimation(
    headerTint,
    spy.spyWorklet
  );
  const onChipPress = useCallback(
    (key: SectionKey) => {
      spy.setActiveFromTap(key);
      anchors.scrollToSection(key);
    },
    [spy, anchors]
  );
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
        title={template?.name}
        topInset={insets.top}
        onBack={handlers.handleBack}
        onClose={handlers.handleClose}
      />
      <ScrollableContent
        activeKey={spy.activeKey}
        anchors={anchors}
        iconAnimatedStyle={animatedStyles.iconAnimatedStyle}
        iconColor={iconColor}
        iconGlowStyle={animatedStyles.iconGlowStyle}
        overscrollTint={headerTint}
        scrollHandler={scrollHandler}
        scrollRef={scrollRef}
        sections={sections}
        template={template}
        onChipPress={onChipPress}
        onHeroLayout={onHeroLayout}
      />
      <FooterSection
        bottomInset={insets.bottom}
        checkmarkAnimatedStyle={animatedStyles.checkmarkAnimatedStyle}
        createPressHandlers={createPressHandlers}
        customizeButtonScale={customizeButtonScale}
        customizeButtonStyle={animatedStyles.customizeButtonStyle}
        iconColor={iconColor}
        isImported={isImported}
        isImporting={isImporting}
        reducedMotion={reducedMotion}
        successPillStyle={animatedStyles.successPillStyle}
        templateName={template?.name ?? ''}
        onCustomize={handlers.handleCustomize}
        onImport={handlers.handleImport}
      />
    </Animated.View>
  );
}
