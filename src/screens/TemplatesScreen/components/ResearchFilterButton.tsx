/**
 * Research-only filter button component
 */

import { Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Filter } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { iconSizes } from '@/theme/iconSizes';

interface ResearchFilterButtonProps {
  label?: string;
  onToggle: () => void;
  researchOnly: boolean;
}

export function ResearchFilterButton({
  label = 'Research',
  onToggle,
  researchOnly,
}: ResearchFilterButtonProps) {
  const { colors } = useThemeColors();
  const defaultColor = colors.text.primary;

  const activeColor = colors.primary[600];

  return (
    <AnimatedPressable
      accessibilityLabel='Toggle research-only filter'
      accessibilityRole='button'
      style={[
        styles.controlButton,
        { borderColor: colors.border },
        researchOnly && {
          backgroundColor: activeColor,
          borderColor: activeColor,
        },
      ]}
      onPress={onToggle}
    >
      <Filter
        color={researchOnly ? colors.text.inverse : defaultColor}
        size={iconSizes.small}
      />
      <Text
        style={[
          styles.controlButtonText,
          { color: researchOnly ? colors.text.inverse : defaultColor },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
