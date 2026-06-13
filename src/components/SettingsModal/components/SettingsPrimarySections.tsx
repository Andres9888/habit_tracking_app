/** Upper settings sections: profile through notifications */
import { BellRing, Palette } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated from 'react-native-reanimated';
import { ProfileHeroCard } from '../ProfileHeroCard';
import { StreakRemindersSection } from '../StreakRemindersSection';
import { AppearanceSection } from '../sections';
import { BehaviorSection } from './BehaviorSection';
import { sectionEnterAnim } from '../SettingsContent.constants';
import type { SettingsContentProps } from '../SettingsContent.types';

interface PrimarySectionsProps extends SettingsContentProps {
  sectionIconColor: string;
}

export function SettingsPrimarySections(p: PrimarySectionsProps) {
  const iconSize = iconSizes.small;

  return (
    <>
      <Animated.View entering={sectionEnterAnim(0)}>
        <ProfileHeroCard isPremium={p.isPremium} onPress={p.onOpenAccount} />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(1)}>
        <AppearanceSection
          compactView={p.compactView}
          darkModePreference={p.darkModePreference}
          dayShape={p.dayShape}
          habitCompletionIcon={p.habitCompletionIcon}
          icon={<Palette color={p.sectionIconColor} size={iconSize} />}
          showGradientFill={p.showGradientFill}
          showStreakConnections={p.showStreakConnections}
          onChangeCompactView={p.onChangeCompactView}
          onChangeDarkModePreference={p.onChangeDarkModePreference}
          onChangeDayShape={p.onChangeDayShape}
          onChangeHabitCompletionIcon={p.onChangeHabitCompletionIcon}
          onChangeShowGradientFill={p.onChangeShowGradientFill}
          onChangeShowStreakConnections={p.onChangeShowStreakConnections}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(2)}>
        <BehaviorSection
          archivedHabitsCount={p.archivedHabitsCount}
          completionSoundEnabled={p.completionSoundEnabled}
          completionSoundType={p.completionSoundType}
          habitSortMode={p.habitSortMode}
          sectionIconColor={p.sectionIconColor}
          stickyCalendarHeader={p.stickyCalendarHeader}
          onChangeCompletionSoundEnabled={p.onChangeCompletionSoundEnabled}
          onChangeCompletionSoundType={p.onChangeCompletionSoundType}
          onChangeHabitSortMode={p.onChangeHabitSortMode}
          onChangeStickyCalendarHeader={p.onChangeStickyCalendarHeader}
          onExportHabitsData={p.onExportHabitsData}
          onOpenArchivedHabits={p.onOpenArchivedHabits}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(3)}>
        <StreakRemindersSection
          enabled={p.streakRemindersEnabled}
          icon={<BellRing color={p.sectionIconColor} size={iconSize} />}
          isPremium={p.isPremium}
          reminderTime={p.streakReminderTime}
          onChangeTime={p.onChangeStreakReminderTime}
          onPremiumUpsell={p.onPremiumUpsell}
          onToggle={p.onToggleStreakReminders}
        />
      </Animated.View>
    </>
  );
}
