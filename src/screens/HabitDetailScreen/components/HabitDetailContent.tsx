/**
 * HabitDetailContent - Scrollspy layout: Hero → sticky tabs → Calendar + Strength + Goal stacked.
 * Tabs act as anchors, not gatekeepers. Every progress surface is visible in one scroll,
 * and the complete action stays pinned in the StickyCompleteBar so it never scrolls away.
 */
import { useRef } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { DetailHeroSection } from './DetailHeroSection';
import { DetailViewTabs, type DetailView } from './DetailViewTabs';
import { HabitDetailSections } from './HabitDetailSections';
import { StickyCompleteBar } from './StickyCompleteBar';
import { useDetailScrollSpy } from './useDetailScrollSpy';

/** Clearance so the last scroll section never hides behind the pinned complete bar. */
const STICKY_BAR_CLEARANCE = 132;

interface HabitDetailContentProps {
  completedDates: Set<string>;
  daysTracking?: number;
  habit: Habit;
  isCompletedToday: boolean;
  pendingToggleDate?: string | null;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  daysTracking,
  habit,
  isCompletedToday,
  pendingToggleDate = null,
  totalCompletions,
  onDayPress,
  onPinnedChange,
}: HabitDetailContentProps) {
  const scrollRef = useRef<ScrollView>(null);
  const { activeView, handleScroll, handleSectionLayout, scrollToView } =
    useDetailScrollSpy(scrollRef, { onPinnedChange });

  const onSectionLayout =
    (view: DetailView) => (event: LayoutChangeEvent) => {
      handleSectionLayout(view, event.nativeEvent.layout.y);
    };

  return (
    <View className='flex-1'>
      <ScrollView
        ref={scrollRef}
        bounces
        className='flex-1'
        contentContainerStyle={{ paddingBottom: STICKY_BAR_CLEARANCE }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        onScroll={handleScroll}
      >
        <DetailHeroSection
          daysTracking={daysTracking}
          habit={habit}
          isCompletedToday={isCompletedToday}
          totalCompletions={totalCompletions}
        />
        <DetailViewTabs activeView={activeView} onViewChange={scrollToView} />
        <HabitDetailSections
          completedDates={completedDates}
          habit={habit}
          pendingToggleDate={pendingToggleDate}
          onDayPress={onDayPress}
          onSectionLayout={onSectionLayout}
        />
      </ScrollView>

      <StickyCompleteBar
        currentStreak={habit.currentStreak ?? 0}
        isCompletedToday={isCompletedToday}
        isToggling={pendingToggleDate !== null}
        onToggle={() => onDayPress(getLocalDateString(), isCompletedToday)}
      />
    </View>
  );
}
