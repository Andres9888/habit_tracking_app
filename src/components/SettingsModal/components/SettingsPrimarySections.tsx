/** Upper settings sections: Look & Feel → Habits → Reminders → Data & Privacy */
import { BellRing, Palette } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated from 'react-native-reanimated';
import { StreakRemindersSection } from '../StreakRemindersSection';
import { AppearanceSection } from '../sections';
import { DataPrivacySection } from '../sections';
import { BehaviorSection } from './BehaviorSection';
import { sectionEnterAnim } from '../SettingsContent.constants';
import type { SettingsContentProps } from '../SettingsContent.types';
import type { SettingsGroup } from '../search/settingsSearchRegistry';

interface PrimarySectionsProps extends SettingsContentProps {
  sectionIconColor: string;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
  onSectionLayout?: (group: SettingsGroup, y: number) => void;
}

export function SettingsPrimarySections(p: PrimarySectionsProps) {
  const iconSize = iconSizes.small;

  return (
    <>
      <Animated.View
        entering={sectionEnterAnim(1)}
        onLayout={(e) =>
          p.onSectionLayout?.('Look & Feel', e.nativeEvent.layout.y)
        }
      >
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
      <Animated.View
        entering={sectionEnterAnim(2)}
        onLayout={(e) => p.onSectionLayout?.('Habits', e.nativeEvent.layout.y)}
      >
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
      <Animated.View
        entering={sectionEnterAnim(3)}
        onLayout={(e) =>
          p.onSectionLayout?.('Reminders', e.nativeEvent.layout.y)
        }
      >
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
      <Animated.View
        entering={sectionEnterAnim(4)}
        onLayout={(e) =>
          p.onSectionLayout?.('Data & Privacy', e.nativeEvent.layout.y)
        }
      >
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
