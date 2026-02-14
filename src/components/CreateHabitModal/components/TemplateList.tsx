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
      <TemplateListSkeleton />
    ) : templates.length === 0 ? (
      <TemplateListEmpty />
    ) : (
      <FlatList
        nestedScrollEnabled
        showsVerticalScrollIndicator
        accessibilityLabel='Habit templates list'
        accessibilityRole='list'
        data={templates}
        keyExtractor={(item) => item._id}
        ListFooterComponent={() => <TemplateListFooter onClose={onClose} />}
        renderItem={({ item, index }) => (
          <TemplateListItem
            index={index}
            template={item}
            onSelect={onSelectTemplate}
            onViewScience={onViewScience}
          />
        )}
        scrollEventThrottle={16}
        onContentSizeChange={onContentSizeChange}
        onLayout={onLayout}
        onScroll={onScroll}
      />
    )}
    <TemplateListShadows
      showBottom={showBottomShadow}
      showTop={showTopShadow}
    />
  </View>
);
