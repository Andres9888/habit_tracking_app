/* eslint-disable max-lines */
import { useCallback } from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { FlatList, View } from 'react-native';
import type { HabitTemplate } from '../types';
import { TemplateListSkeleton } from '../../SkeletonLoader';
import { TemplateListEmpty } from './TemplateListEmpty';
import { TemplateListFooter } from './TemplateListFooter';
import { TemplateListItem } from './TemplateListItem';
import { TemplateListShadows } from './TemplateListShadows';

interface TemplateListProps {
  isLoading: boolean;
  templates: HabitTemplate[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onViewScience: (template: HabitTemplate) => void;
  onClose: () => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onContentSizeChange: (width: number, height: number) => void;
  onLayout: (event: LayoutChangeEvent) => void;
  showTopShadow: boolean;
  showBottomShadow: boolean;
}

// Fixed height for getItemLayout optimization (TemplateListItem height)
const ITEM_HEIGHT = 88;

export const TemplateList = ({
  isLoading,
  templates,
  onSelectTemplate,
  onViewScience,
  onClose,
  onScroll,
  onContentSizeChange,
  onLayout,
  showTopShadow,
  showBottomShadow,
}: TemplateListProps) => {
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: HabitTemplate; index: number }) => (
      <TemplateListItem
        index={index}
        template={item}
        onSelect={onSelectTemplate}
        onViewScience={onViewScience}
      />
    ),
    [onSelectTemplate, onViewScience]
  );

  const keyExtractor = useCallback((item: HabitTemplate) => item._id, []);

  const listFooterComponent = useCallback(
    () => <TemplateListFooter onClose={onClose} />,
    [onClose]
  );

  if (isLoading) {
    return (
      <View className='relative max-h-[300px]'>
        <TemplateListSkeleton />
        <TemplateListShadows
          showBottom={showBottomShadow}
          showTop={showTopShadow}
        />
      </View>
    );
  }

  if (templates.length === 0) {
    return (
      <View className='relative max-h-[300px]'>
        <TemplateListEmpty />
        <TemplateListShadows
          showBottom={showBottomShadow}
          showTop={showTopShadow}
        />
      </View>
    );
  }

  return (
    <View className='relative max-h-[300px]'>
      <FlatList
        nestedScrollEnabled
        showsVerticalScrollIndicator
        accessibilityLabel='Habit templates list'
        accessibilityRole='list'
        data={templates}
        getItemLayout={getItemLayout}
        initialNumToRender={8}
        keyExtractor={keyExtractor}
        ListFooterComponent={listFooterComponent}
        maxToRenderPerBatch={8}
        removeClippedSubviews
        renderItem={renderItem}
        scrollEventThrottle={16}
        windowSize={5}
        onContentSizeChange={onContentSizeChange}
        onLayout={onLayout}
        onScroll={onScroll}
      />
      <TemplateListShadows
        showBottom={showBottomShadow}
        showTop={showTopShadow}
      />
    </View>
  );
};
