/**
 * TemplatesList Component
 * Horizontal FlatList of template cards with staggered animations
 */

import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import Animated from 'react-native-reanimated';

import type { Doc } from '../../../convex/_generated/dataModel';
import MiniTemplateCard from '../MiniTemplateCard';
import { CARD_EXITING, cardEntering } from './animations';
import { styles } from './styles';

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

      return (
        <Animated.View
          entering={cardEntering(index, reducedMotion)}
          exiting={CARD_EXITING}
        >
          <MiniTemplateCard
            description={template.description || ''}
            hasResearch={Boolean(template.scientificReference)}
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
    [
      importedTemplateIds,
      importingTemplateId,
      onImport,
      onTemplatePress,
      reducedMotion,
    ]
  );

  const keyExtractor = useCallback((item: Doc<'templates'>) => item._id, []);

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
