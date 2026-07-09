/** Upper settings sections: profile → Pro card → Look & Feel → Reminders → Habits */
import { BellRing, Palette } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated from 'react-native-reanimated';
import { ProfileHeroCard } from '../ProfileHeroCard';
import { StreakRemindersSection } from '../StreakRemindersSection';
import { AppearanceSection, ProSettingsCard } from '../sections';
import { BehaviorSection } from './BehaviorSection';
import { sectionEnterAnim } from '../SettingsContent.constants';
import { sectionHasMatch, useSettingsSearch } from '../search';
import type { SettingsContentProps } from '../SettingsContent.types';

interface PrimarySectionsProps extends SettingsContentProps {
  sectionIconColor: string;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
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
      {isSearching ? null : (
        <Animated.View entering={entering(1)}>
          <ProSettingsCard
            isPremium={p.isPremium}
            onUpgrade={p.onPremiumUpsell}
          />
        </Animated.View>
      )}
      {sectionHasMatch(query, 'appearance') ? (
        <Animated.View entering={entering(2)}>
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
        <Animated.View entering={entering(3)}>
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
      ) : null}
      {sectionHasMatch(query, 'behavior') ? (
        <Animated.View entering={entering(4)}>
          <BehaviorSection
            archivedHabitsCount={p.archivedHabitsCount}
            completionSoundEnabled={p.completionSoundEnabled}
            completionSoundType={p.completionSoundType}
            habitSortMode={p.habitSortMode}
            sectionIconColor={p.sectionIconColor}
            onChangeCompletionSoundEnabled={p.onChangeCompletionSoundEnabled}
            onChangeCompletionSoundType={p.onChangeCompletionSoundType}
            onChangeHabitSortMode={p.onChangeHabitSortMode}
            onExportHabitsData={p.onExportHabitsData}
            onOpenArchivedHabits={p.onOpenArchivedHabits}
          />
        </Animated.View>
      ) : null}
    </>
  );
}
