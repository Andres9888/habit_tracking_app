/**
 * Layout for one ladder mark. Marks in the middle of the track centre their
 * label under the dot. Marks pinned to either end anchor the label to the
 * track edge instead, so "today" at 0% and the goal at 100% never spill past
 * the bar.
 */
import type { TextStyle, ViewStyle } from 'react-native';

export const DOT_SIZE = 18;
const MARK_WIDTH = 48;
const EDGE_PCT = 2;

export type LadderAnchor = 'start' | 'center' | 'end';

export function ladderAnchor(leftPct: number): LadderAnchor {
  if (leftPct <= EDGE_PCT) return 'start';
  if (leftPct >= 100 - EDGE_PCT) return 'end';
  return 'center';
}

export function ladderMarkContainerStyle(leftPct: number): ViewStyle {
  const base: ViewStyle = {
    gap: 5,
    position: 'absolute',
    top: 0,
    width: MARK_WIDTH,
  };
  switch (ladderAnchor(leftPct)) {
    case 'start':
      return {
        ...base,
        alignItems: 'flex-start',
        left: 0,
        marginLeft: -DOT_SIZE / 2,
      };
    case 'end':
      return {
        ...base,
        alignItems: 'flex-end',
        marginRight: -DOT_SIZE / 2,
        right: 0,
      };
    default:
      return {
        ...base,
        alignItems: 'center',
        left: `${leftPct}%`,
        marginLeft: -MARK_WIDTH / 2,
      };
  }
}

/** Label offset so its outer edge lines up with the track edge, not the dot. */
export function ladderLabelStyle(leftPct: number): TextStyle {
  switch (ladderAnchor(leftPct)) {
    case 'start':
      return { paddingLeft: DOT_SIZE / 2 };
    case 'end':
      return { paddingRight: DOT_SIZE / 2 };
    default:
      return {};
  }
}
