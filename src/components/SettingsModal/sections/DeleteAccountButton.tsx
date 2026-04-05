/** DeleteAccountButton — Standalone danger action, last item in settings */
import { Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { shadows } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrastMode?: boolean;
  isDeletingAccount: boolean;
  onDeleteAccount: () => void;
}

export function DeleteAccountButton({
  highContrastMode = false,
  isDeletingAccount,
  onDeleteAccount,
}: Props) {
  const { colors: themeColors, isDark } = useThemeColors();
  const labelColor = highContrastMode
    ? themeColors.status.error
    : themeColors.status.errorText;
  const sectionLabelColor = highContrastMode
    ? '#facc15'
    : themeColors.text.tertiary;
  const cardBackground = highContrastMode
    ? '#111111'
    : isDark
      ? 'rgba(248,113,113,0.08)'
      : '#f7f2ee';
  const borderColor = highContrastMode
    ? '#2f2f2f'
    : isDark
      ? 'rgba(248,113,113,0.16)'
      : 'rgba(181,48,48,0.14)';
  const iconBackground = highContrastMode
    ? '#1f1f1f'
    : themeColors.status.errorLight;
  const iconColor = themeColors.status.error;

  return (
    <View className='gap-2'>
      <Text
        className='px-4 text-[12px] font-medium uppercase tracking-[1.5px]'
        style={{ color: sectionLabelColor }}
      >
        Danger Zone
      </Text>
      <AnimatedPressable
        accessibilityLabel='Delete Account'
        accessibilityRole='button'
        onPress={onDeleteAccount}
      >
        <View
          className='overflow-hidden rounded-2xl border'
          style={{
            backgroundColor: cardBackground,
            borderColor,
            ...(highContrastMode
              ? { elevation: 0, shadowColor: 'transparent' }
              : shadows.card),
          }}
        >
          <View className='flex-row items-center px-4 py-4' style={{ gap: 16 }}>
            <View
              className='items-center justify-center rounded-xl'
              style={{
                backgroundColor: iconBackground,
                height: 40,
                width: 40,
              }}
            >
              <Trash2 color={iconColor} size={16} />
            </View>
            <View className='flex-1'>
              <Text className='text-[17px] font-semibold' style={{ color: labelColor }}>
                {isDeletingAccount ? 'Deleting account...' : 'Delete account'}
              </Text>
              <Text
                className='mt-1 text-[13px]'
                style={{ color: themeColors.text.secondary }}
              >
                Permanently remove your account and all Chain Day data
              </Text>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </View>
  );
}
