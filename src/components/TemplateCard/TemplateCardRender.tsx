import React from 'react';
import {
  CardContainer,
  ScrollRevealWrapper,
  TemplateCardContent,
} from './components';
import type { TemplateCardRenderProps } from './TemplateCard.types';

export function TemplateCardRender({
  category,
  checkmarkStyle,
  containerStyle,
  description,
  enableScrollReveal,
  frequency,
  glowStyle,
  handleCardPress,
  handleImportPress,
  handlePressIn,
  handlePressOut,
  icon,
  iconColor,
  isImported,
  isImporting,
  isLocked,
  isPremium,
  name,
  onPreview,
  popularityScore,
  reducedMotion,
  scientificLink,
  scientificReference,
  shadowStyle,
  showPreviewCTA,
  style,
  youtubeLink,
}: TemplateCardRenderProps) {
  return (
    <ScrollRevealWrapper
      enabled={enableScrollReveal}
      reducedMotion={reducedMotion}
    >
      <CardContainer
        containerStyle={containerStyle}
        description={description}
        glowStyle={glowStyle}
        iconColor={iconColor}
        isImported={isImported}
        isLocked={isLocked}
        name={name}
        shadowStyle={shadowStyle}
        style={style}
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <TemplateCardContent
          category={category}
          checkmarkStyle={checkmarkStyle}
          description={description}
          frequency={frequency}
          icon={icon}
          iconColor={iconColor}
          isImported={isImported}
          isImporting={isImporting}
          isLocked={isLocked}
          isPremium={isPremium}
          name={name}
          popularityScore={popularityScore}
          scientificLink={scientificLink}
          scientificReference={scientificReference}
          showPreviewCTA={showPreviewCTA}
          youtubeLink={youtubeLink}
          onImportPress={handleImportPress}
          onPreview={onPreview}
        />
      </CardContainer>
    </ScrollRevealWrapper>
  );
}
