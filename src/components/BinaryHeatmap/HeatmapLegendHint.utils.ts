import { Dimensions } from 'react-native';
import type { LegendHintAnchor } from './HeatmapLegendHint.types';
import {
  LEGEND_HINT_ARROW,
  LEGEND_HINT_CARD_WIDTH,
  LEGEND_HINT_GAP,
} from './HeatmapLegendHint.styles';

const HORIZONTAL_INSET = 16;

export function getLegendHintLayout(anchor: LegendHintAnchor) {
  const screenWidth = Dimensions.get('window').width;
  const iconCenterX = anchor.x + anchor.width / 2;
  const left = Math.min(
    Math.max(anchor.x - 12, HORIZONTAL_INSET),
    screenWidth - LEGEND_HINT_CARD_WIDTH - HORIZONTAL_INSET
  );
  const top = anchor.y + anchor.height + LEGEND_HINT_GAP;
  const arrowLeft = iconCenterX - left - LEGEND_HINT_ARROW;

  return { arrowLeft, left, top };
}
