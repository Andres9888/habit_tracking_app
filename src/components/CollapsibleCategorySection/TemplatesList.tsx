/**
 * TemplatesList Component
 * Horizontal FlatList of template cards with staggered animations
 */

import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
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
  importedTemplateIds?: Set<string>;
  importingTemplateId?: string | null;
  reducedMotion: boolean;
  templates: Doc<'templates'>[];
  onImport: (template: Doc<'templates'>) => void;
  onTemplatePress: (template: Doc<'templates'>) => void;
}

export function TemplatesList({
  importedTemplateIds,
  importingTemplateId,
  reducedMotion,
  templates,
  onImport,
  onTemplatePress,
}: TemplatesListProps) {
  const renderItem = useCallback(
    ({ item: template, index }: { item: Doc<'templates'>; index: number }) => {
      if (!template || !template._id) return null;

      const staggerDelay = Math.min(
        index * CARD_STAGGER_DELAY,
        MAX_STAGGER_DELAY
      );

      const enteringAnimation = FadeIn.delay(staggerDelay).duration(200);
      const exitingAnimation = FadeOut.duration(100);

      return (
        <Animated.View
          entering={enteringAnimation}
          exiting={exitingAnimation}
        >
          <MiniTemplateCard
            description={template.description || ''}
            hasResearch={Boolean(template.scientificLink)}
            icon={template.icon || '📝'}
            iconColor={template.iconColor}
            isImported={importedTemplateIds?.has(template._id)}
            isImporting={importingTemplateId === template._id}
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
    },
    [importedTemplateIds, importingTemplateId, onImport, onTemplatePress]
  );

  const keyExtractor = useCallback(
    (item: Doc<'templates'>) => item._id,
    []
  );

  return (
    <FlatList
      directionalLockEnabled
      horizontal
      nestedScrollEnabled
      contentContainerStyle={styles.templatesScroll}
      data={templates || []}
      decelerationRate='fast'
      initialNumToRender={5}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={5}
      renderItem={renderItem}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      windowSize={3}
    />
  );
}
