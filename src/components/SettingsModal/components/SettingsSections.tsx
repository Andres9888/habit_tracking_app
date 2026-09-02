/** Every settings section, in order:
 *  Profile hero → Appearance → Habits → Data & about → footer.
 *  Five cards became three: Behavior and Notifications merged into Habits
 *  (Archived joined them), Data & Privacy and Help & About into Data & about. */
import Animated from 'react-native-reanimated';
import { ProfileHeroCard } from '../ProfileHeroCard';
import { AppearanceSection } from '../sections';
import { AppVersionFooter } from './AppVersionFooter';
import { DataAboutSection } from './DataAboutSection';
import { HabitsSection } from './HabitsSection';
import { sectionEnterAnim } from '../SettingsContent.constants';
import type { SettingsContentProps } from '../SettingsContent.types';

export interface SettingsSectionsProps extends SettingsContentProps {
  onFeedback: () => void;
  onLoveChainDay: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onWhatsNew: () => void;
}

export function SettingsSections(p: SettingsSectionsProps) {
  return (
    <>
      <Animated.View entering={sectionEnterAnim(0)}>
        <ProfileHeroCard isPremium={p.isPremium} onPress={p.onOpenAccount} />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(1)}>
        <AppearanceSection
          compactView={p.compactView}
          darkModePreference={p.darkModePreference}
          onChangeCompactView={p.onChangeCompactView}
          onChangeDarkModePreference={p.onChangeDarkModePreference}
          onOpenCalendarLook={p.onOpenCalendarLook}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(2)}>
        <HabitsSection
          archivedHabitsCount={p.archivedHabitsCount}
          completionSoundEnabled={p.completionSoundEnabled}
          completionSoundType={p.completionSoundType}
          habitSortMode={p.habitSortMode}
          streakReminderTime={p.streakReminderTime}
          streakRemindersEnabled={p.streakRemindersEnabled}
          onChangeCompletionSoundEnabled={p.onChangeCompletionSoundEnabled}
          onChangeCompletionSoundType={p.onChangeCompletionSoundType}
          onChangeHabitSortMode={p.onChangeHabitSortMode}
          onChangeStreakReminderTime={p.onChangeStreakReminderTime}
          onOpenArchivedHabits={p.onOpenArchivedHabits}
          onToggleStreakReminders={p.onToggleStreakReminders}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(3)}>
        <DataAboutSection
          onExportHabitsData={p.onExportHabitsData}
          onFeedback={p.onFeedback}
          onLoveChainDay={p.onLoveChainDay}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(4)}>
        <AppVersionFooter
          onPrivacy={p.onPrivacy}
          onTerms={p.onTerms}
          onWhatsNew={p.onWhatsNew}
        />
      </Animated.View>
    </>
  );
}
