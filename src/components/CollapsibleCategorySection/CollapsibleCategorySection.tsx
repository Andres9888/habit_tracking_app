/**
 * CollapsibleCategorySection Component
 * Expandable category section with header and template previews
 */

import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLORS,
} from '../../screens/templates/constants';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { CollapsibleCategorySectionProps } from './types';
import { LAYOUT_SPRING, contentEntering, contentExiting } from './animations';
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
    <AnimatedView
      layout={reducedMotion ? undefined : LAYOUT_SPRING}
      style={styles.container}
    >
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
          entering={contentEntering(reducedMotion)}
          exiting={contentExiting(reducedMotion)}
          style={styles.content}
        >
          <TemplatesList
            importedTemplateIds={importedTemplateIds}
            importingTemplateId={importingTemplateId}
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
