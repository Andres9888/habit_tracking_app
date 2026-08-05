/** AckCheckboxRow — tappable row gating the destructive action on an acknowledgment */
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { DELETE_ACCOUNT_ACK_LABEL } from '../constants';

interface Props {
  checked: boolean;
  onToggle: (value: boolean) => void;
}

export function AckCheckboxRow({ checked, onToggle }: Props) {
  const { colors: themeColors } = useThemeColors();

  return (
    <Pressable
      accessibilityRole='checkbox'
      accessibilityState={{ checked }}
      className='mb-4 flex-row items-start gap-3 rounded-2xl border p-3'
      style={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
      }}
      onPress={() => onToggle(!checked)}
    >
      <View
        className='mt-0.5 h-[22px] w-[22px] items-center justify-center rounded-md border'
        style={{
          backgroundColor: checked
            ? themeColors.status.error
            : themeColors.background,
          borderColor: checked ? themeColors.status.error : themeColors.border,
        }}
      >
        {checked ? <Check color='#FFFFFF' size={iconSizes.small} /> : null}
      </View>
      <Text
        className='flex-1'
        style={{
          ...typography.bodySmall,
          fontWeight: fontWeights.medium,
          color: themeColors.text.primary,
        }}
      >
        {DELETE_ACCOUNT_ACK_LABEL}
      </Text>
    </Pressable>
  );
}
