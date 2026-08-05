/**
 * PermissionBanner - Inline warning when notification permissions are denied
 *
 * Shows below the reminder toggle with a link to device settings.
 */

import { Linking, Pressable, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

interface PermissionBannerProps {
  visible: boolean;
}

export function PermissionBanner({ visible }: PermissionBannerProps) {
  const { colors } = useThemeColors();

  if (!visible) return null;

  return (
    <Pressable
      accessibilityHint='Opens device settings to enable notifications'
      accessibilityLabel='Notifications are disabled. Tap to open Settings.'
      accessibilityRole='button'
      className='mt-3 flex-row items-center gap-3 rounded-xl px-4 py-3'
      style={{ backgroundColor: colors.status.warningLight }}
      onPress={() => void Linking.openSettings()}
    >
      <AlertTriangle color={colors.status.warning} size={iconSizes.medium} />
      <View className='flex-1'>
        <Text className='text-sm font-medium' style={{ color: colors.status.warningText }}>
          Notifications are disabled
        </Text>
        <Text className='text-xs' style={{ color: colors.status.warning }}>
          Tap to open Settings and enable notifications
        </Text>
      </View>
    </Pressable>
  );
}
