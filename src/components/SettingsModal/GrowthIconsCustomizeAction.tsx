/** Customize/Done text action for the Default growth icons settings row. */
import { Pressable, Text, View } from 'react-native';

import { fontWeights, typography } from '@/theme/typography';

import { useThemeColors } from '../../theme/ThemeContext';
import type { ProgressEmojiSet } from '../../utils/progressEmojis';

interface Props {
  expanded: boolean;
  onToggle: () => void;
}

interface AccessoryProps extends Props {
  /** Current set; a glanceable sample renders inline while collapsed. */
  emojis: ProgressEmojiSet;
}

/** Inline current-set sample (start → mid → peak) plus the Customize action. */
export function GrowthIconsRowAccessory({
  emojis,
  expanded,
  onToggle,
}: AccessoryProps) {
  return (
    <View className='flex-row items-center gap-3'>
      {expanded ? null : (
        <Text
          accessibilityElementsHidden
          importantForAccessibility='no-hide-descendants'
          style={{ fontSize: 14, letterSpacing: 3 }}
        >
          {`${emojis.starting}${emojis.developing}${emojis.automatic}`}
        </Text>
      )}
      <GrowthIconsCustomizeAction expanded={expanded} onToggle={onToggle} />
    </View>
  );
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
