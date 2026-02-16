/**
 * TemplateScienceModal Component
 * 
 * Full-screen modal displaying scientific research and evidence for habit templates.
 * 
 * **Trigger:** 
 * - Info button on template cards in TemplatesScreen
 * - Auto-opens after selecting template (with confetti)
 * 
 * **Display:**
 * - Dismiss indicator (swipe down)
 * - Header with template name, share/close buttons
 * - Hero section: Template emoji, name, tagline, reading time
 * - "Why It Works" section with scientific evidence
 * - Research links (opens in browser)
 * - YouTube video links (opens YouTube)
 * - Footer with "Use Template" button
 * - Confetti overlay on template selection
 * 
 * **Actions:**
 * - Scroll through research content
 * - Share template (native share sheet)
 * - Open research links (external browser)
 * - Watch YouTube videos (external app)
 * - Use template (creates habit, shows confetti)
 * - Close modal (swipe down or X button)
 * 
 * **Modal Type:** Shared Modal component with 'fullScreen' variant
 * 
 * **Lifecycle:**
 * - Opens: visible=true with template data
 * - Closes: onClose via X button, back button, or swipe-down gesture
 * - Loading state: Shows skeleton while template data loads
 * - Confetti: Triggers on successful template use
 * 
 * **Pattern:** Uses shared Modal (fullScreen variant)
 * Complex animations: scroll-based header shrink, button scales, parallax
 * Hooks-based architecture: separate hooks for animations, handlers, styles
 * Reading time calculated from template content
 */

import React, { useMemo } from 'react';
import Animated from 'react-native-reanimated';
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
import { useThemeColors } from '../../theme/ThemeContext';
import { layoutStyles, themedLayoutStyles } from './styles';
import { calculateReadingTime } from './TemplateScienceModal.utils';
import type { TemplateScienceModalProps } from './TemplateScienceModal.types';

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
  const { colors } = useThemeColors();
  const themedLayout = themedLayoutStyles(colors);
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
      <Animated.View style={[layoutStyles.container, themedLayout.container, animatedStyles.container]}>
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
