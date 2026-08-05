/**
 * GoalChipLabel — day-count text + optional role sublabel inside a
 * GoalPresetChip. Split out so GoalPresetChip stays under the max-lines gate.
 */
import { Text } from 'react-native';
import { useThemeColors } from '../../../theme';
import { typography, fontWeights } from '../../../theme/typography';

interface GoalChipLabelProps {
  accent: string;
  label: string;
  role?: string;
  selected: boolean;
  showRole: boolean;
}

export function GoalChipLabel({
  accent,
  label,
  role,
  selected,
  showRole,
}: GoalChipLabelProps) {
  const { colors } = useThemeColors();

  return (
    <>
      <Text
        style={{
          ...typography.bodySmall,
          color: selected ? accent : colors.text.secondary,
          fontWeight: selected ? fontWeights.bold : fontWeights.medium,
        }}
      >
        {label}
      </Text>
      {showRole && role ? (
        <Text
          style={{
            ...typography.caption,
            color: selected ? accent : colors.text.tertiary,
            fontWeight: fontWeights.semibold,
            marginTop: 3,
          }}
        >
          {role}
        </Text>
      ) : null}
    </>
  );
}
