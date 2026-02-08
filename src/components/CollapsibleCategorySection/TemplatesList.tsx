/**
 * TemplatesList Component
 * Horizontal scrolling list of template cards with staggered animations
 */

import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { Doc } from '../../../convex/_generated/dataModel';
import MiniTemplateCard from '../MiniTemplateCard';
import { styles } from './styles';

/** Stagger delay between each card animation in ms */
const CARD_STAGGER_DELAY = 50;
/** Maximum stagger delay to prevent long wait times for large categories */
const MAX_STAGGER_DELAY = 400;

const FREQUENCY_LABELS: Record<string, string> = {
  custom: 'Custom',
  daily: 'Daily',
  weekly: 'Weekly',
};

interface TemplatesListProps {
  templates: Doc<'templates'>[];
  importingTemplateId?: string | null;
  reducedMotion: boolean;
  onTemplatePress: (template: Doc<'templates'>) => void;
  onImport: (template: Doc<'templates'>) => void;
}

export function TemplatesList({
  templates,
  importingTemplateId,
  reducedMotion,
  onTemplatePress,
  onImport,
}: TemplatesListProps) {
  return (
    <ScrollView
      directionalLockEnabled
      horizontal
      nestedScrollEnabled
      contentContainerStyle={styles.templatesScroll}
      decelerationRate='fast'
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
    >
      {(templates || []).map((template, index) => {
        // Skip invalid templates
        if (!template || !template._id) return null;

        const staggerDelay = Math.min(
          index * CARD_STAGGER_DELAY,
          MAX_STAGGER_DELAY
        );

        // Simplified animations to avoid potential crash issues
        const enteringAnimation = FadeIn.delay(staggerDelay).duration(280).springify().damping(18);
        const exitingAnimation = FadeOut.duration(200);

        return (
          <Animated.View
            key={template._id}
            entering={enteringAnimation}
            exiting={exitingAnimation}
          >
            <MiniTemplateCard
              description={template.description || ''}
              hasResearch={Boolean(template.scientificLink)}
              icon={template.icon || '📝'}
              iconColor={template.iconColor}
              isImporting={importingTemplateId === template._id}
              name={template.name || 'Untitled'}
              scientificReference={template.scientificReference}
              subtitle={
                FREQUENCY_LABELS[template.frequency] || template.frequency || 'daily'
              }
              onImport={() => onImport(template)}
              onPress={() => onTemplatePress(template)}
            />
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}
