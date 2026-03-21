/** DeleteAccountButton — Standalone danger action, last item in settings */
import { Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  isDeletingAccount: boolean;
  onDeleteAccount: () => void;
}

export function DeleteAccountButton({
  isDeletingAccount,
  onDeleteAccount,
}: Props) {
  const { isDark } = useThemeColors();
  const color = isDark ? '#f87171' : '#ef4444';

  return (
    <AnimatedPressable
      accessibilityLabel='Delete Account'
      accessibilityRole='button'
      onPress={onDeleteAccount}
    >
      <View className='flex-row items-center justify-center py-3.5' style={{ gap: 6 }}>
        <Trash2 color={color} size={15} />
        <Text className='text-[15px] font-medium' style={{ color }}>
          {isDeletingAccount ? 'Deleting account...' : 'Delete Account'}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
