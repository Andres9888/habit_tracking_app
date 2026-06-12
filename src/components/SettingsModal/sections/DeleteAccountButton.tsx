/** DeleteAccountButton — Standalone danger action, last item in settings */
import { Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { shadows } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  isDeletingAccount: boolean;
  onDeleteAccount: () => void;
}

export function DeleteAccountButton({
  isDeletingAccount,
  onDeleteAccount,
}: Props) {
  const { colors: themeColors, isDark } = useThemeColors();
  const cardBackground = isDark ? 'rgba(248,113,113,0.08)' : '#f7f2ee';
  const borderColor = isDark
    ? 'rgba(248,113,113,0.16)'
    : 'rgba(181,48,48,0.14)';

  return (
    <View className='gap-2'>
      <Text
        className='px-4'
        style={{ ...typography.overline, color: themeColors.text.tertiary }}
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
            ...shadows.card,
          }}
        >
          <View className='flex-row items-center px-4 py-4' style={{ gap: 16 }}>
            <View
              className='items-center justify-center rounded-xl'
              style={{
                backgroundColor: themeColors.status.errorLight,
                height: 40,
                width: 40,
              }}
            >
              <Trash2 color={themeColors.status.error} size={iconSizes.small} />
            </View>
            <View className='flex-1'>
              <Text
                style={{
                  ...typography.body,
                  fontWeight: fontWeights.semibold,
                  color: themeColors.status.errorText,
                }}
              >
                {isDeletingAccount ? 'Deleting account...' : 'Delete account'}
              </Text>
              <Text
                className='mt-1'
                style={{
                  ...typography.caption,
                  color: themeColors.text.secondary,
                }}
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
