/** IdentityCard — one elevated shell holding the account row + setup sentence */
import { View } from 'react-native';
import { airy } from '@/theme/airyScale';
import { useThemeColors } from '../../../theme/ThemeContext';
import { ProfileIdentityRow } from './ProfileIdentityRow';
import { SetupSummary } from '../SetupSummary';
import { getProfileCardShellStyle } from '../profileCardShellStyle';
import type { SettingsContentProps } from '../SettingsContent.types';

type Props = Pick<
  SettingsContentProps,
  | 'isPremium'
  | 'onOpenAccount'
  | 'darkModePreference'
  | 'habitSortMode'
  | 'streakRemindersEnabled'
  | 'streakReminderTime'
  | 'completionSoundEnabled'
  | 'completionSoundType'
>;

export function IdentityCard(p: Props) {
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View
      className='overflow-hidden'
      style={[
        getProfileCardShellStyle(themeColors, isDark),
        { borderRadius: airy.cardRadius },
      ]}
    >
      <ProfileIdentityRow isPremium={p.isPremium} onPress={p.onOpenAccount} />
      <SetupSummary
        completionSoundEnabled={p.completionSoundEnabled}
        completionSoundType={p.completionSoundType}
        darkModePreference={p.darkModePreference}
        habitSortMode={p.habitSortMode}
        streakReminderTime={p.streakReminderTime}
        streakRemindersEnabled={p.streakRemindersEnabled}
      />
    </View>
  );
}
