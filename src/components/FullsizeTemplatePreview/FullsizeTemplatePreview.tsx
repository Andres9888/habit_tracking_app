/**
 * FullsizeTemplatePreview - Main orchestration component
 * A fullsize preview modal for template cards
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from '../Modal';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import {
  HeroSection,
  DescriptionSection,
  ScienceBox,
  TipsBox,
  FooterSection,
  ModalHeader,
  ConfettiOverlay,
} from './components';
import {
  useEntranceAnimations,
  useSuccessAnimations,
  useButtonAnimations,
  useAnimatedStyles,
  useHandlers,
} from './hooks';
import { layoutStyles } from './styles';
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
  const tips = (template as any).tips;

  return (
    <Modal
      disableBackdropClose={isImporting}
      variant='fullScreen'
      visible={visible}
      onClose={handlers.handleClose}
    >
      <Animated.View
        style={[layoutStyles.container, animatedStyles.contentStyle]}
      >
        <Animated.View
          pointerEvents='none'
          style={[
            layoutStyles.successGlowOverlay,
            { backgroundColor: '#22c55e' },
            animatedStyles.successGlowStyle,
          ]}
        />
        <ModalHeader
          closeButtonAnimatedOpacityStyle={
            animatedStyles.closeButtonAnimatedOpacityStyle
          }
          closeButtonPressHandlers={createPressHandlers(closeButtonScale, 0.9)}
          closeButtonStyle={animatedStyles.closeButtonStyle}
          topInset={insets.top}
          onClose={handlers.handleClose}
        />
        <ScrollView
          bounces
          contentContainerStyle={layoutStyles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <HeroSection
            iconAnimatedStyle={animatedStyles.iconAnimatedStyle}
            iconColor={iconColor}
            iconGlowStyle={animatedStyles.iconGlowStyle}
            template={template}
          />
          <DescriptionSection description={template.description} />
          <ScienceBox
            template={template}
            onResearchPress={handlers.handleResearchPress}
          />
          {tips && Array.isArray(tips) && tips.length > 0 && (
            <TipsBox iconColor={iconColor} tips={tips} />
          )}
          <View style={layoutStyles.bottomSpacer} />
        </ScrollView>
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
          templateName={template.name}
          onCustomize={handlers.handleCustomize}
          onImport={handlers.handleImport}
        />
        <ConfettiOverlay
          ref={successAnimations.confettiRef}
          visible={isImported && !reducedMotion}
        />
      </Animated.View>
    </Modal>
  );
}
