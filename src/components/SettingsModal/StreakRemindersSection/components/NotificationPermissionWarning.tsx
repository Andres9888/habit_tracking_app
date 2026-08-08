/** NotificationPermissionWarning — amber guard shown ONLY when reminders are on
 *  but the OS has notifications denied, so nothing can actually be delivered.
 *  "Fix" deep-links to the system settings page for this app. */
import { AlertTriangle } from 'lucide-react-native';
import { Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useThemeColors } from '@/theme/ThemeContext';
import { SettingsRow } from '../../SettingsRow';

const SETTINGS_APP_NAME =
  Platform.OS === 'ios' ? 'iOS Settings' : 'system settings';

interface NotificationPermissionWarningProps {
  onFix: () => void;
}

export function NotificationPermissionWarning({
  onFix,
}: NotificationPermissionWarningProps) {
  const { colors: themeColors } = useThemeColors();
  const reduceMotion = useReduceMotion();

  const handleFix = () => {
    void triggerHaptic('tap');
    onFix();
  };

  return (
    <Animated.View
      className='px-4 pt-3'
      entering={
        reduceMotion
          ? undefined
          : FadeIn.duration(durations.enter).easing(enterEasing)
      }
    >
      <SettingsRow
        icon={
          <AlertTriangle color={themeColors.status.warning} size={iconSizes.small} />
        }
        iconBackgroundColor={themeColors.status.warningLight}
        label='Reminder delivery blocked'
        subtitle={`Allow notifications in ${SETTINGS_APP_NAME} to resume reminders.`}
        type='info'
        value='Open settings'
        onPress={handleFix}
      />
    </Animated.View>
  );
}
