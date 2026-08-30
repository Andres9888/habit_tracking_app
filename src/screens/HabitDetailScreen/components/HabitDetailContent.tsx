/**
 * HabitDetailContent — recommitment surface:
 *   current state/action → strength snapshot → week → record doors → insight
 */
import { ScrollView, View } from 'react-native';
import type { HabitDetailContentProps } from './HabitDetailContent.types';
import { DetailHeroBanner } from './DetailHeroBanner';
import { useHabitDetailContent } from './HabitDetailContent.hooks';
import { HabitDetailSections } from './HabitDetailSections';

/** Pin only after the hero name has left — avoids two titles on screen. */
export function HabitDetailContent({
  completedDates,
  habit,
  isCompletedToday,
  pendingToggleDate = null,
  visible = true,
  onDayPress,
  onOpenAnalytics,
  onOpenDay,
  onOpenHistory,
  onOpenInsight,
  onOpenNote,
  onPinnedChange,
  onRecoveryChange,
  todayNote,
}: HabitDetailContentProps) {
  const {
    brokenRun,
    effectiveCompletedDates,
    handleScroll,
    insights,
    isRecovery,
    loggedStreak,
    recoveryDayLabel,
    today,
    todayState,
    wash,
  } = useHabitDetailContent({
    completedDates,
    habit,
    isCompletedToday,
    onPinnedChange,
    onRecoveryChange,
    visible,
  });

  return (
    // The ScrollView takes the hero's FIRST gradient stop, and the sections
    // below take the page background. Without this, bouncing at the top exposes
    // the background behind the tinted hero — the seam that
    // FullsizeTemplatePreview/components/PreviewContent.tsx:29-30 warns about.
    // This is also why every band stop must be opaque hex, never withAlpha:
    // the header tint, hero stop 0 and this overscroll tint all read wash[0].
    <ScrollView
      className='flex-1'
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: wash[0] }}
      onScroll={handleScroll}
    >
      <DetailHeroBanner
        brokenRun={brokenRun}
        habit={habit}
        isToggling={pendingToggleDate === today}
        recoveryDayLabel={recoveryDayLabel}
        todayState={todayState}
        todayNote={todayNote}
        onDayPress={onDayPress}
        onOpenNote={onOpenNote ?? (() => {})}
      />
      <View style={{ backgroundColor: wash[2] }}>
        <HabitDetailSections
          completedDates={effectiveCompletedDates}
          currentStreak={loggedStreak}
          habit={habit}
          insights={insights}
          isCompletedToday={isCompletedToday}
          isRecovery={isRecovery}
          onDayPress={onDayPress}
          onOpenAnalytics={onOpenAnalytics ?? (() => {})}
          onOpenDay={onOpenDay ?? (() => {})}
          onOpenHistory={onOpenHistory ?? (() => {})}
          onOpenInsight={onOpenInsight ?? (() => {})}
        />
      </View>
    </ScrollView>
  );
}
