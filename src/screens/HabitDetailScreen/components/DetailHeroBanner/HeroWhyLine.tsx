/**
 * HeroWhyLine — the why, compressed to one line.
 *
 * The full `HeroWhyPill` owns the neutral ready state. In recovery and after a
 * completion the state card takes that slot, which used to hide the why at the
 * two moments it is most useful: the reason you started is the strongest
 * counterweight to a miss, and the quiet confirmation of a day kept. One
 * truncated italic line, never a block — the card above it stays the headline.
 */
import { Text } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { fontFamilies } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { RECOVERY_INK_SMALL } from '../../insightPalette.tokens';
import { resolveWhy } from '../resolveWhy';

interface HeroWhyLineProps {
  habit: Habit;
  /** Amber ink under the recovery card; secondary ink after a completion. */
  isRecovery: boolean;
  palette: InsightPalette;
}

export function HeroWhyLine({ habit, isRecovery, palette }: HeroWhyLineProps) {
  const resolved = resolveWhy(habit);
  if (resolved === null) return null;

  return (
    <Text
      accessibilityRole='text'
      numberOfLines={1}
      style={{
        color: isRecovery ? RECOVERY_INK_SMALL : palette.textSecondary,
        fontFamily: fontFamilies.primary.display,
        fontSize: 13.5,
        fontStyle: 'italic',
        lineHeight: 19,
        marginTop: 8,
        paddingHorizontal: 4,
      }}
    >
      {`${resolved.label} · ${resolved.value}`}
    </Text>
  );
}
