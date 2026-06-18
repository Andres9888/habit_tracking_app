/** Upper settings sections: profile through notifications */
import { BellRing, Palette } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated from 'react-native-reanimated';
import { AccountHeaderCard } from '../AccountHeaderCard';
import { StreakRemindersSection } from '../StreakRemindersSection';
import { AppearanceSection } from '../sections';
import { DataPrivacySection } from '../sections/DataPrivacySection';
import { BehaviorSection } from './BehaviorSection';
import { sectionEnterAnim } from '../SettingsContent.constants';
import type { SettingsContentProps } from '../SettingsContent.types';

interface PrimarySectionsProps extends SettingsContentProps {
  sectionIconColor: string;
  isSigningOut: boolean;
  onSignOut: () => void;
  onManageSubscription: () => void;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
}

export function SettingsPrimarySections(p: PrimarySectionsProps) {
  const iconSize = iconSizes.small;

  return (
    <>
      <Animated.View entering={sectionEnterAnim(0)}>
        <AccountHeaderCard
          isPremium={p.isPremium}
          isSigningOut={p.isSigningOut}
          onManageSubscription={p.onManageSubscription}
          onOpenAccount={p.onOpenAccount}
          onSignOut={p.onSignOut}
        />
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
          completionSoundEnabled={p.completionSoundEnabled}
          completionSoundType={p.completionSoundType}
          habitSortMode={p.habitSortMode}
          sectionIconColor={p.sectionIconColor}
          stickyCalendarHeader={p.stickyCalendarHeader}
          onChangeCompletionSoundEnabled={p.onChangeCompletionSoundEnabled}
          onChangeCompletionSoundType={p.onChangeCompletionSoundType}
          onChangeHabitSortMode={p.onChangeHabitSortMode}
          onChangeStickyCalendarHeader={p.onChangeStickyCalendarHeader}
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
      <Animated.View entering={sectionEnterAnim(4)}>
        <DataPrivacySection
          archivedHabitsCount={p.archivedHabitsCount}
          isDeletingAccount={p.isDeletingAccount}
          sectionIconColor={p.sectionIconColor}
          onDeleteAccount={p.onDeleteAccount}
          onExportHabitsData={p.onExportHabitsData}
          onOpenArchivedHabits={p.onOpenArchivedHabits}
        />
      </Animated.View>
    </>
  );
}
