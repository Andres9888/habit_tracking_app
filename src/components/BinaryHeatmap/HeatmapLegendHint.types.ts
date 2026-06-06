export interface LegendHintAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeatmapLegendHintProps {
  visible: boolean;
  habitColor: string;
  anchor: LegendHintAnchor | null;
  onClose: () => void;
}
