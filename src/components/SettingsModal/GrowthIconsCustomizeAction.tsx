/** Customize/Done text action for the Default growth icons settings row. */
import { Pressable, Text } from 'react-native';

import { fontWeights, typography } from '@/theme/typography';

import { useThemeColors } from '../../theme/ThemeContext';

interface Props {
  expanded: boolean;
  onToggle: () => void;
}

export function GrowthIconsCustomizeAction({ expanded, onToggle }: Props) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={expanded ? 'Collapse picker' : 'Customize growth icons'}
      accessibilityRole='button'
      hitSlop={8}
      onPress={onToggle}
    >
      <Text
        style={{
          ...typography.bodySmall,
          color: colors.primary[600],
          fontWeight: fontWeights.semibold,
        }}
      >
        {expanded ? 'Done' : 'Customize'}
      </Text>
    </Pressable>
  );
}
