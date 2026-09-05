/** NotificationPermissionWarning — shown ONLY when reminders are on but the OS
 *  has notifications denied, so nothing can actually be delivered.
 *  "Fix" deep-links to the system settings page for this app.
 *
 *  Uses the ERROR token pair, not amber: amber is the PRO marker, and a banner
 *  that means "this feature cannot work right now" reading in the same colour
 *  as the premium badge taught people to skim past both. */
import { AlertTriangle } from 'lucide-react-native';
import { Linking, Platform, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';

const SETTINGS_APP_NAME =
  Platform.OS === 'ios' ? 'iOS Settings' : 'system settings';

export function NotificationPermissionWarning() {
  const { colors: themeColors } = useThemeColors();
  const reduceMotion = useReducedMotion();

  const handleFix = () => {
    void triggerHaptic('tap');
    void Linking.openSettings();
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
      <View
        className='flex-row items-center rounded-xl px-3 py-2.5'
        style={{
          backgroundColor: themeColors.status.errorLight,
          gap: 10,
        }}
      >
        <AlertTriangle
          color={themeColors.status.error}
          size={iconSizes.small}
        />
        <Text
          style={{
            ...typography.caption,
            color: themeColors.status.errorText,
            flex: 1,
            lineHeight: 18,
          }}
        >
          Notifications are off in {SETTINGS_APP_NAME} — reminders can&apos;t be
          delivered.
        </Text>
        <Pressable
          accessibilityLabel='Open notification settings'
          accessibilityRole='button'
          hitSlop={10}
          onPress={handleFix}
        >
          <Text
            style={{
              ...typography.caption,
              color: themeColors.status.error,
              fontWeight: fontWeights.bold,
            }}
          >
            Fix ›
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
