/** Segment options for the Calendar look pickers.
 *  Chain style splits by day shape: circles can only butt up against a full
 *  connector or none, squares also support the short "Dots" gap. */
import type { SegmentOption } from './SegmentedTextPicker';
import type { ConnectorStyle } from '../../../convex/settings/types';

export type DayFill = 'solid' | 'gradient';

export const DAY_SHAPE_OPTIONS: readonly SegmentOption<'circle' | 'square'>[] =
  [
    { key: 'circle', label: 'Circle' },
    { key: 'square', label: 'Square' },
  ];

export const DAY_FILL_OPTIONS: readonly SegmentOption<DayFill>[] = [
  { key: 'solid', label: 'Solid' },
  { key: 'gradient', label: 'Gradient' },
];

const CHAIN_LINE: SegmentOption<ConnectorStyle> = {
  key: 'full',
  label: 'Line',
};
const CHAIN_DOTS: SegmentOption<ConnectorStyle> = {
  key: 'small',
  label: 'Dots',
};
const CHAIN_OFF: SegmentOption<ConnectorStyle> = { key: 'none', label: 'Off' };

export const CHAIN_STYLE_OPTIONS: Record<
  'circle' | 'square',
  readonly SegmentOption<ConnectorStyle>[]
> = {
  circle: [CHAIN_LINE, CHAIN_OFF],
  square: [CHAIN_LINE, CHAIN_DOTS, CHAIN_OFF],
};

export const COMPLETION_ICON_OPTIONS: readonly SegmentOption<
  'chain' | 'checkbox'
>[] = [
  { key: 'chain', label: 'Chain' },
  { key: 'checkbox', label: 'Check' },
];
