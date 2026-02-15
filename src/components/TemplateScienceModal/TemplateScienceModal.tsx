/**
 * TemplateScienceModal - Main orchestration component
 * Displays scientific research and backing for habit templates
 */

import React, { useMemo } from 'react';

import Animated from 'react-native-reanimated';

import type { TemplateScienceModalProps } from './TemplateScienceModal.types';
import Modal from '../Modal';
import {
  ModalHeader,
  ModalContent,
  FooterSection,
  ConfettiOverlay,
  DismissIndicator,
  SkeletonLoading,
} from './components';
import {
  useModalAnimations,
  useScrollAnimations,
  useButtonAnimations,
  useAnimatedStyles,
  useModalHandlers,
} from './hooks';
import { calculateReadingTime } from './TemplateScienceModal.utils';
import { layoutStyles } from './styles';

export default function TemplateScienceModal({
  isLoading = false,
  onClose,
  onUseTemplate,
  template,
  visible,
}: TemplateScienceModalProps) {
  const readingTime = useMemo(
    () => (template ? calculateReadingTime(template) : 0),
    [template]
  );
  const modalAnimations = useModalAnimations({ template, visible });
  const scrollAnimations = useScrollAnimations({ template, visible });
  const { scaleValues, createPressHandlers } = useButtonAnimations();
  const handlers = useModalHandlers({ onClose, onUseTemplate, template });

  const animatedStyles = useAnimatedStyles({
    ...modalAnimations,
    ...scrollAnimations,
    backButtonScale: scaleValues.backButton,
    closeButtonScale: scaleValues.closeButton,
    linkButtonScale: scaleValues.linkButton,
    shareButtonScale: scaleValues.shareButton,
    youtubeButtonScale: scaleValues.youtubeButton,
  });

  if (isLoading || !template) {
    return <SkeletonLoading visible={visible} onClose={onClose} />;
  }

  const baseColor = template.iconColor || '#6366F1';
  const isPopular = (template.popularityScore ?? 0) >= 80;

  return (
    <Modal
      disableBackdropClose={false}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <Animated.View style={[layoutStyles.container, animatedStyles.container]}>
        <DismissIndicator animatedStyle={animatedStyles.dismissIndicator} />
        <ModalHeader
          closeButtonAnimatedStyle={animatedStyles.closeButton}
          headerAnimatedStyle={animatedStyles.header}
          headerTitleAnimatedStyle={animatedStyles.headerTitle}
          pressHandlers={createPressHandlers(scaleValues.closeButton, 0.9)}
          shareButtonAnimatedStyle={animatedStyles.shareButton}
          templateName={template.name}
          onClose={handlers.handleClose}
          onShare={handlers.handleShare}
        />
        <ModalContent
          animatedStyles={animatedStyles}
          baseColor={baseColor}
          createPressHandlers={createPressHandlers}
          isPopular={isPopular}
          readingTime={readingTime}
          scaleValues={scaleValues}
          scrollHandler={scrollAnimations.scrollHandler}
          template={template}
          onLinkPress={handlers.handleLinkPress}
          onYoutubePress={handlers.handleYoutubePress}
        />
        <FooterSection
          animatedStyle={animatedStyles.footer}
          backButtonAnimatedStyle={animatedStyles.backButton}
          baseColor={baseColor}
          pressHandlers={createPressHandlers(scaleValues.backButton, 0.95)}
          templateName={template.name}
          onBack={handlers.handleClose}
          onUseTemplate={handlers.handleUseTemplate}
        />
        <ConfettiOverlay visible={handlers.showConfetti} />
      </Animated.View>
    </Modal>
  );
}
