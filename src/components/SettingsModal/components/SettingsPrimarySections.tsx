/** Main settings sections: identity → Look&Feel → Reminders → Preferences → Your Data → plan */
import { BellRing, Palette } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useReducedMotion } from 'react-native-reanimated';
import { IdentityCard } from './IdentityCard';
import { SectionEnter } from './SectionEnter';
import { ChainCareRemindersSection } from '../ChainCareRemindersSection';
import {
  AppearanceSection,
  PreferencesSection,
  ProSettingsCard,
  YourDataSection,
} from '../sections';
import type { SettingsContentProps } from '../SettingsContent.types';

interface PrimarySectionsProps extends SettingsContentProps {
  sectionIconColor: string;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
}

export function SettingsPrimarySections(p: PrimarySectionsProps) {
  const iconSize = iconSizes.small;
  const reduceMotion = useReducedMotion();

  return (
    <>
      <SectionEnter index={0} reduceMotion={reduceMotion}>
        <IdentityCard
          completionSoundEnabled={p.completionSoundEnabled}
          completionSoundType={p.completionSoundType}
          darkModePreference={p.darkModePreference}
          habitSortMode={p.habitSortMode}
          isPremium={p.isPremium}
          streakReminderTime={p.streakReminderTime}
          streakRemindersEnabled={p.streakRemindersEnabled}
          onOpenAccount={p.onOpenAccount}
        />
      </SectionEnter>
      <SectionEnter index={1} reduceMotion={reduceMotion}>
        <AppearanceSection
          compactView={p.compactView}
          darkModePreference={p.darkModePreference}
          icon={<Palette color={p.sectionIconColor} size={iconSize} />}
          onChangeCompactView={p.onChangeCompactView}
          onChangeDarkModePreference={p.onChangeDarkModePreference}
          onOpenCalendarLook={p.onOpenCalendarLook}
        />
      </SectionEnter>
      <SectionEnter index={2} reduceMotion={reduceMotion}>
        <ChainCareRemindersSection
          enabled={p.streakRemindersEnabled}
          icon={<BellRing color={p.sectionIconColor} size={iconSize} />}
          isPremium={p.isPremium}
          reminderTime={p.streakReminderTime}
          onChangeTime={p.onChangeStreakReminderTime}
          onPremiumUpsell={p.onPremiumUpsell}
          onToggle={p.onToggleStreakReminders}
        />
      </SectionEnter>
      <SectionEnter index={3} reduceMotion={reduceMotion}>
        <PreferencesSection
          completionSoundEnabled={p.completionSoundEnabled}
          completionSoundType={p.completionSoundType}
          habitSortMode={p.habitSortMode}
          onChangeCompletionSoundEnabled={p.onChangeCompletionSoundEnabled}
          onChangeCompletionSoundType={p.onChangeCompletionSoundType}
          onChangeHabitSortMode={p.onChangeHabitSortMode}
        />
      </SectionEnter>
      <SectionEnter index={4} reduceMotion={reduceMotion}>
        <YourDataSection
          archivedHabitsCount={p.archivedHabitsCount}
          isDeletingAccount={p.isDeletingAccount}
          onDeleteAccount={p.onDeleteAccount}
          onExportHabitsData={p.onExportHabitsData}
          onOpenArchivedHabits={p.onOpenArchivedHabits}
        />
      </SectionEnter>
      <SectionEnter index={5} reduceMotion={reduceMotion}>
        <ProSettingsCard isPremium={p.isPremium} onUpgrade={p.onPremiumUpsell} />
      </SectionEnter>
    </>
  );
}
