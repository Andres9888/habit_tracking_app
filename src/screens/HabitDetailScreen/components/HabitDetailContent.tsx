/**
 * HabitDetailContent - Scrollspy layout: Hero → sticky tabs → sections + dock.
 */
import { useCallback, useRef, useState } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { useProgressEmojis } from '../../../hooks/useProgressEmojis';
import { useThemeColors } from '../../../theme';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { DetailHeroSection } from './DetailHeroSection';
import { DetailStickyDock } from './DetailStickyDock';
import { DetailViewTabs } from './DetailViewTabs';
import { HabitDetailSections } from './HabitDetailSections';
import { useDetailScrollSpy } from './useDetailScrollSpy';

interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  pendingToggleDate?: string | null;
  totalCompletions: number;
  onCompletePress: () => void;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  habit,
  isCompletedToday,
  pendingToggleDate = null,
  totalCompletions,
  onCompletePress,
  onDayPress,
  onPinnedChange,
}: HabitDetailContentProps) {
  const { colors } = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  const [dockVisible, setDockVisible] = useState(false);
  const {
    activeView,
    handleHeroLayout,
    handleScroll,
    handleSectionLayout,
    scrollToView,
  } = useDetailScrollSpy(scrollRef, {
    onDockVisibilityChange: setDockVisible,
    onPinnedChange,
  });
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const isTodayToggling = pendingToggleDate === getLocalDateString();
  const progressEmojis = useProgressEmojis(habit);

  const onHeroLayout = useCallback(
    (event: LayoutChangeEvent) => {
      handleHeroLayout(event.nativeEvent.layout.height);
    },
    [handleHeroLayout]
  );

  return (
    <View className='flex-1'>
      <ScrollView
        ref={scrollRef}
        bounces
        className='flex-1'
        contentContainerClassName={dockVisible ? 'pb-28' : 'pb-16'}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        onScroll={handleScroll}
      >
        <DetailHeroSection
          completedDates={completedDates}
          habit={habit}
          isCompletedToday={isCompletedToday}
          isToggling={isTodayToggling}
          totalCompletions={totalCompletions}
          onCompletePress={onCompletePress}
          onLayout={onHeroLayout}
        />
        <DetailViewTabs activeView={activeView} onViewChange={scrollToView} />
        <HabitDetailSections
          completedDates={completedDates}
          habit={habit}
          habitColor={habitColor}
          pendingToggleDate={pendingToggleDate}
          progressEmojis={progressEmojis}
          onDayPress={onDayPress}
          onSectionLayout={handleSectionLayout}
        />
      </ScrollView>

      <DetailStickyDock
        isCompletedToday={isCompletedToday}
        isToggling={isTodayToggling}
        visible={dockVisible}
        onCompletePress={onCompletePress}
      />
    </View>
  );
}
