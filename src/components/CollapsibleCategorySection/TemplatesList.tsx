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

/** Premium categories that require premium subscription */
const PREMIUM_CATEGORIES = ['andrew_huberman', 'longevity', 'recovery'];

interface TemplatesListProps {
  importedTemplateIds?: Set<string>;
  importingTemplateId?: string | null;
  isPremiumUser: boolean;
  reducedMotion: boolean;
  templates: Doc<'templates'>[];
  onImport: (template: Doc<'templates'>) => void;
  onTemplatePress: (template: Doc<'templates'>) => void;
}

export function TemplatesList({
  importedTemplateIds,
  importingTemplateId,
  isPremiumUser,
  reducedMotion,
  templates,
  onImport,
  onTemplatePress,
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
        const enteringAnimation = FadeIn.delay(staggerDelay).duration(200);
        const exitingAnimation = FadeOut.duration(100);

        return (
          <Animated.View
            key={template._id}
            entering={enteringAnimation}
            exiting={exitingAnimation}
          >
            <MiniTemplateCard
              description={template.description || ''}
              hasAccess={isPremiumUser}
              hasResearch={Boolean(template.scientificLink)}
              icon={template.icon || '📝'}
              iconColor={template.iconColor}
              isImported={importedTemplateIds?.has(template._id)}
              isImporting={importingTemplateId === template._id}
              isPremium={PREMIUM_CATEGORIES.includes(template.category)}
              name={template.name || 'Untitled'}
              scientificReference={template.scientificReference}
              subtitle={
                FREQUENCY_LABELS[template.frequency] ||
                template.frequency ||
                'daily'
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
