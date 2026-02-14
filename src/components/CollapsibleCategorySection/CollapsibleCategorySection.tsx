/**
 * CollapsibleCategorySection Component
 * Expandable category section with header and template previews
 */

import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLORS,
} from '../../screens/templates/constants';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { CollapsibleCategorySectionProps } from './types';
import { styles } from './styles';
import { useHeaderAnimations } from './useHeaderAnimations';
import { SectionHeader } from './SectionHeader';
import { TemplatesList } from './TemplatesList';

const AnimatedView = Animated.createAnimatedComponent(View);

export function CollapsibleCategorySection({
  categoryId,
  label,
  icon,
  templates,
  scienceCount = 0,
  isExpanded,
  onToggle,
  onTemplatePress,
  onImport,
  importedTemplateIds,
  importingTemplateId,
  isPremiumUser = false,
}: CollapsibleCategorySectionProps) {
  const colors = CATEGORY_COLORS[categoryId] || DEFAULT_CATEGORY_COLORS;
  const reducedMotion = useReduceMotion();

  const {
    chevronAnimatedStyle,
    handleHeaderPress,
    handleHeaderPressIn,
    handleHeaderPressOut,
    headerAnimatedStyle,
    iconAnimatedStyle,
  } = useHeaderAnimations({ isExpanded, onToggle, reducedMotion });

  return (
    <AnimatedView style={styles.container}>
      <SectionHeader
        chevronAnimatedStyle={chevronAnimatedStyle}
        colors={colors}
        headerAnimatedStyle={headerAnimatedStyle}
        icon={icon}
        iconAnimatedStyle={iconAnimatedStyle}
        isExpanded={isExpanded}
        label={label}
        scienceCount={scienceCount}
        templateCount={templates?.length ?? 0}
        onPress={handleHeaderPress}
        onPressIn={handleHeaderPressIn}
        onPressOut={handleHeaderPressOut}
      />

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
          style={styles.content}
        >
          <TemplatesList
            importedTemplateIds={importedTemplateIds}
            importingTemplateId={importingTemplateId}
            isPremiumUser={isPremiumUser}
            reducedMotion={reducedMotion}
            templates={templates}
            onImport={onImport}
            onTemplatePress={onTemplatePress}
          />
        </Animated.View>
      )}
    </AnimatedView>
  );
}

export default CollapsibleCategorySection;
