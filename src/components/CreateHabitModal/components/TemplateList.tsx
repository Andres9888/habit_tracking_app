import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ActivityIndicator, FlatList, View } from 'react-native';
import type { HabitTemplate } from '../types';
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
}: TemplateListProps) => (
  <View className='relative max-h-[300px]'>
    {isLoading ? (
      <View className='items-center justify-center py-12'>
        <ActivityIndicator color='#1a1a1a' size='small' />
      </View>
    ) : templates.length === 0 ? (
      <TemplateListEmpty />
    ) : (
      <FlatList
        data={templates}
        keyExtractor={(item) => item._id}
        ListFooterComponent={() => <TemplateListFooter onClose={onClose} />}
        nestedScrollEnabled
        renderItem={({ item }) => (
          <TemplateListItem
            template={item}
            onSelect={onSelectTemplate}
            onViewScience={onViewScience}
          />
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
        onContentSizeChange={onContentSizeChange}
        onLayout={onLayout}
        onScroll={onScroll}
      />
    )}
    <TemplateListShadows showTop={showTopShadow} showBottom={showBottomShadow} />
  </View>
);
