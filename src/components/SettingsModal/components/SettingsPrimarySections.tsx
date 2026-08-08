/** Upper settings sections, mock order:
 *  profile → Look & Feel → Reminders → Habits (sort + archive + export).
 *  The premium banner sits below Habits (SettingsSecondarySections). */
import { BellRing, Palette } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated from 'react-native-reanimated';
import { ProfileHeroCard } from '../ProfileHeroCard';
import { StreakRemindersSection } from '../StreakRemindersSection';
import { AppearanceSection } from '../sections';
import { BehaviorSection } from './BehaviorSection';
import { sectionEnterAnim } from '../SettingsContent.constants';
import { sectionHasMatch, useSettingsSearch } from '../search';
import type { SettingsContentProps } from '../SettingsContent.types';

interface PrimarySectionsProps extends SettingsContentProps {
  sectionIconColor: string;
}

export function SettingsPrimarySections(p: PrimarySectionsProps) {
  const iconSize = iconSizes.small;
  const { query, isSearching } = useSettingsSearch();
  // While searching, drop the staggered entrance so sections don't re-animate
  // on every keystroke as matches change.
  const entering = (i: number) =>
    isSearching ? undefined : sectionEnterAnim(i);

  return (
    <>
      <Animated.View entering={entering(0)}>
        <ProfileHeroCard isPremium={p.isPremium} onPress={p.onOpenAccount} />
      </Animated.View>
      {sectionHasMatch(query, 'appearance') ? (
        <Animated.View entering={entering(1)}>
          <AppearanceSection
            compactView={p.compactView}
            darkModePreference={p.darkModePreference}
            icon={<Palette color={p.sectionIconColor} size={iconSize} />}
            onChangeCompactView={p.onChangeCompactView}
            onChangeDarkModePreference={p.onChangeDarkModePreference}
            onOpenCalendarLook={p.onOpenCalendarLook}
          />
        </Animated.View>
      ) : null}
      {sectionHasMatch(query, 'reminders') ? (
        <Animated.View entering={entering(2)}>
          <StreakRemindersSection
            completionSoundEnabled={p.completionSoundEnabled}
            completionSoundType={p.completionSoundType}
            enabled={p.streakRemindersEnabled}
            icon={<BellRing color={p.sectionIconColor} size={iconSize} />}
            isPremium={p.isPremium}
            reminderTime={p.streakReminderTime}
            onChangeCompletionSoundEnabled={p.onChangeCompletionSoundEnabled}
            onChangeCompletionSoundType={p.onChangeCompletionSoundType}
            onChangeTime={p.onChangeStreakReminderTime}
            onPremiumUpsell={p.onPremiumUpsell}
            onToggle={p.onToggleStreakReminders}
          />
        </Animated.View>
      ) : null}
      {sectionHasMatch(query, 'behavior') ? (
        <Animated.View entering={entering(3)}>
          <BehaviorSection
            archivedHabitsCount={p.archivedHabitsCount}
            habitSortMode={p.habitSortMode}
            sectionIconColor={p.sectionIconColor}
            onChangeHabitSortMode={p.onChangeHabitSortMode}
            onExportHabitsData={p.onExportHabitsData}
            onOpenArchivedHabits={p.onOpenArchivedHabits}
          />
        </Animated.View>
      ) : null}
    </>
  );
}
