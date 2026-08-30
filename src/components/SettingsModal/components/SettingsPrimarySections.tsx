/** Upper settings sections, Quiet Configuration Index order:
 *  Profile hero → Appearance → Behavior (sort + sound) → Notifications.
 *  Grouping follows the index; the visual treatment stays editorial — the
 *  profile hero card and the staggered entrance were kept on purpose. */
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
          icon={<Palette color={p.sectionIconColor} size={iconSize} />}
          onChangeCompactView={p.onChangeCompactView}
          onChangeDarkModePreference={p.onChangeDarkModePreference}
          onOpenCalendarLook={p.onOpenCalendarLook}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(2)}>
        <BehaviorSection
          completionSoundEnabled={p.completionSoundEnabled}
          completionSoundType={p.completionSoundType}
          habitSortMode={p.habitSortMode}
          sectionIconColor={p.sectionIconColor}
          onChangeCompletionSoundEnabled={p.onChangeCompletionSoundEnabled}
          onChangeCompletionSoundType={p.onChangeCompletionSoundType}
          onChangeHabitSortMode={p.onChangeHabitSortMode}
        />
      </Animated.View>
      <Animated.View entering={sectionEnterAnim(3)}>
        <StreakRemindersSection
          enabled={p.streakRemindersEnabled}
          icon={<BellRing color={p.sectionIconColor} size={iconSize} />}
          reminderTime={p.streakReminderTime}
          onChangeTime={p.onChangeStreakReminderTime}
          onToggle={p.onToggleStreakReminders}
        />
      </Animated.View>
    </>
  );
}
