import React from 'react';
import { render } from '@testing-library/react-native';
import { CalendarDayBody } from '../CalendarDayBody';

const BASE_PROPS = {
  cellPopStyle: {},
  connectorStyle: 'full' as const,
  dayNumber: 10,
  fillMounted: true,
  fillStyle: {},
  habitColor: '#10B981',
  joinRight: false,
  showDot: false,
  staticTextColor: '#111111',
  textStyle: {},
  useSolidCompletedFill: false,
};

function flattenStyle(style: unknown): Record<string, unknown> {
  const list = Array.isArray(style) ? style : [style];
  return Object.assign({}, ...list.flat(Infinity).filter(Boolean));
}

describe('CalendarDayBody today border (regression: today cell looked partially filled)', () => {
  it('does not inset a completed today with the 2px today border', () => {
    const { toJSON } = render(
      <CalendarDayBody {...BASE_PROPS} isToday showCompleted />
    );
    const root = toJSON() as { props: { style: unknown } };
    const flat = flattenStyle(root.props.style);
    // The border would inset the absoluteFill fill layer, leaving a gap ring.
    expect(flat.borderWidth).toBeUndefined();
  });

  it('keeps the 2px habit-color border as the today marker while incomplete', () => {
    const { toJSON } = render(
      <CalendarDayBody {...BASE_PROPS} isToday showCompleted={false} />
    );
    const root = toJSON() as { props: { style: unknown } };
    const flat = flattenStyle(root.props.style);
    expect(flat.borderWidth).toBe(2);
    expect(flat.borderColor).toBe('#10B981');
  });
});
