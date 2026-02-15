
import {
  AccessibilityInfo,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { memo, useCallback } from 'react';

import type { QuickPickTemplate, QuickPicksRowProps } from './types';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { HUBERMAN_PHASES } from '../../../../constants/hubermanPhases';
import { QUICK_PICK_TEMPLATES } from './constants';
import { QuickPickCard } from './QuickPickCard';

const QuickPicksRowComponent = ({
  selectedTemplateId,
  onSelectTemplate,
  onBrowseAll,
}: QuickPicksRowProps) => {
  const { triggerSelection } = useHapticFeedback();

  const handleSelectTemplate = useCallback(
    (template: QuickPickTemplate) => {
      triggerSelection();
      onSelectTemplate(template);
      // Announce template selection for screen readers
      const phaseInfo = HUBERMAN_PHASES[template.timeOfDay];
      AccessibilityInfo.announceForAccessibility(
        `Selected ${template.name} template. Scheduled for ${phaseInfo.shortLabel}`
      );
    },
    [onSelectTemplate, triggerSelection]
  );

  const handleBrowseAll = useCallback(() => {
    triggerSelection();
    onBrowseAll?.();
  }, [onBrowseAll, triggerSelection]);

  const renderItem = useCallback(
    ({ item }: { item: QuickPickTemplate }) => (
      <QuickPickCard
        isSelected={selectedTemplateId === item.id}
        template={item}
        onPress={() => handleSelectTemplate(item)}
      />
    ),
    [selectedTemplateId, handleSelectTemplate]
  );

  const keyExtractor = useCallback((item: QuickPickTemplate) => item.id, []);

  return (
    <View className='mb-4'>
      {/* Header row */}
      <View className='mb-3 flex-row items-center justify-between px-1'>
        <Text
          accessibilityRole='header'
          className='text-base font-semibold text-stone-800'
        >
          Quick picks
        </Text>
        {onBrowseAll && (
          <Pressable
            accessibilityLabel='Browse all templates'
            accessibilityRole='button'
            onPress={handleBrowseAll}
          >
            <Text className='text-sm font-medium text-[#22C55E]'>
              Browse all →
            </Text>
          </Pressable>
        )}
      </View>

      {/* Template cards */}
      <FlatList
        horizontal
        accessibilityLabel='Quick pick templates'
        accessibilityRole='list'
        contentContainerStyle={{ paddingHorizontal: 1 }}
        data={QUICK_PICK_TEMPLATES}
        initialNumToRender={5}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        windowSize={3}
      />
    </View>
  );
};

export const QuickPicksRow = memo(QuickPicksRowComponent);
