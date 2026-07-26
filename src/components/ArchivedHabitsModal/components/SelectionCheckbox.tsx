import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';

interface SelectionCheckboxProps {
  isDark: boolean;
  isSelected: boolean;
}

export function SelectionCheckbox({ isSelected }: SelectionCheckboxProps) {
  const { colors } = useThemeColors();

  return (
    <View
      accessibilityLabel={isSelected ? 'Selected' : 'Not selected'}
      accessibilityRole='checkbox'
      className='absolute right-3 top-3 z-10 h-6 w-6 items-center justify-center rounded-full border-2'
      style={{
        borderColor: isSelected ? colors.status.success : colors.gray[300],
        backgroundColor: isSelected ? colors.status.success : colors.card,
      }}
    >
      {isSelected ? <Check color={colors.text.inverse} size={iconSizes.small} strokeWidth={3} /> : null}
    </View>
  );
}
