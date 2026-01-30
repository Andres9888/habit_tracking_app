/**
 * ModalContent - Scrollable content area for TemplateScienceModal
 */

import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { YouTubeSection } from './YouTubeSection';
import { ScienceSection } from './ScienceSection';
import { layoutStyles } from '../styles';
import type { SharedValue } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { PressHandlers } from '../TemplateScienceModal.types';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface ModalContentProps {
  animatedStyles: {
    hero: object;
    iconGlow: object;
    card1: object;
    card2: object;
    card3: object;
    youtubeButton: object;
    linkButton: object;
  };
  baseColor: string;
  createPressHandlers: (
    scaleValue: SharedValue<number>,
    scale?: number
  ) => PressHandlers;
  isPopular: boolean;
  onLinkPress: () => void;
  onYoutubePress: () => void;
  readingTime: number;
  scaleValues: {
    youtubeButton: SharedValue<number>;
    linkButton: SharedValue<number>;
  };
  scrollHandler: ReturnType<
    typeof import('react-native-reanimated').useAnimatedScrollHandler
  >;
  template: Doc<'templates'>;
}

export const ModalContent = ({
  animatedStyles,
  baseColor,
  createPressHandlers,
  isPopular,
  onLinkPress,
  onYoutubePress,
  readingTime,
  scaleValues,
  scrollHandler,
  template,
}: ModalContentProps) => (
  <AnimatedScrollView
    contentContainerStyle={layoutStyles.contentContainer}
    scrollEventThrottle={16}
    showsVerticalScrollIndicator={false}
    style={layoutStyles.content}
    onScroll={scrollHandler}
  >
    <HeroSection
      baseColor={baseColor}
      heroAnimatedStyle={animatedStyles.hero}
      iconGlowAnimatedStyle={animatedStyles.iconGlow}
      isPopular={isPopular}
      readingTime={readingTime}
      template={template}
    />
    <AboutSection
      animatedStyle={animatedStyles.card1}
      description={template.description}
    />
    {template.youtubeLink && (
      <YouTubeSection
        animatedStyle={animatedStyles.card2}
        buttonAnimatedStyle={animatedStyles.youtubeButton}
        pressHandlers={createPressHandlers(scaleValues.youtubeButton, 0.97)}
        templateName={template.name}
        onPress={onYoutubePress}
      />
    )}
    <ScienceSection
      animatedStyle={
        template.youtubeLink ? animatedStyles.card3 : animatedStyles.card2
      }
      baseColor={baseColor}
      linkButtonAnimatedStyle={animatedStyles.linkButton}
      pressHandlers={createPressHandlers(scaleValues.linkButton, 0.97)}
      scientificLink={template.scientificLink}
      scientificReference={template.scientificReference}
      template={template}
      onLinkPress={onLinkPress}
    />
    <View style={layoutStyles.bottomSpacer} />
  </AnimatedScrollView>
);
