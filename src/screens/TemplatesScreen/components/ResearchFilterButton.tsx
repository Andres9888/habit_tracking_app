/**
 * Research-only filter button component
 */

import { Pressable, Text } from 'react-native';
import { Filter } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';

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

  return (
    <Pressable
      accessibilityLabel='Toggle research-only filter'
      accessibilityRole='button'
      style={[styles.controlButton, researchOnly && styles.controlButtonActive]}
      onPress={onToggle}
    >
      <Filter color={researchOnly ? '#fff' : defaultColor} size={16} />
      <Text
        style={[
          styles.controlButtonText,
          { color: researchOnly ? '#fff' : defaultColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
