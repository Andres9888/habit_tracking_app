/** Pill — recessed capsule holding a short value ("Classic", "Chime", "v2.4").
 *  The Habit Browser's meta pill, shared so every paper surface states values
 *  the same way: a value sits IN something, it isn't loose grey text. */
import { Text, View } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights } from '@/theme/typography';

interface PillProps {
  label: string;
  /** Recessed fill — usually the canvas colour, so the pill reads as a well. */
  backgroundColor: string;
  color: string;
  /** Caps runaway values before they crowd a chevron. */
  maxWidth?: number;
}

export function Pill({
  label,
  backgroundColor,
  color,
  maxWidth = 140,
}: PillProps) {
  return (
    <View
      style={{
        backgroundColor,
        borderRadius: borderRadius.full,
        flexShrink: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          ...typography.bodySmall,
          color,
          fontWeight: fontWeights.medium,
          maxWidth,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
