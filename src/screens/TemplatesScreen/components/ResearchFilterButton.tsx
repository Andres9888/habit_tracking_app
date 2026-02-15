/**
 * Research-only filter button component
 */

import { Pressable, Text } from 'react-native';

import { Filter } from 'lucide-react-native';

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
  return (
    <Pressable
      accessibilityLabel='Toggle research-only filter'
      accessibilityRole='button'
      style={[styles.controlButton, researchOnly && styles.controlButtonActive]}
      onPress={onToggle}
    >
      <Filter color={researchOnly ? '#fff' : '#1c1917'} size={16} />
      <Text
        style={[
          styles.controlButtonText,
          { color: researchOnly ? '#fff' : '#1c1917' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
