import React from 'react';
import { render } from '@testing-library/react-native';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { HabitDayToggle } from '../HabitDayToggle';
import {
  baseProps,
  countStyleMatches,
  findFrameStyle,
  type JsonNode,
} from './HabitDayToggle.testUtils';

jest.mock('@/hooks/useReduceMotion');
const mockReduceMotion = jest.mocked(useReduceMotion);
const AMBER = '#FBBF24';

describe('HabitDayToggle completion frame', () => {
  beforeEach(() => mockReduceMotion.mockReturnValue(false));

  it('renders incomplete and completed endpoints on one permanent frame', () => {
    const view = render(<HabitDayToggle {...baseProps} />);
    expect(findFrameStyle(view.toJSON() as JsonNode).backgroundColor).toBe(
      '#f5f5f5'
    );

    view.rerender(<HabitDayToggle {...baseProps} completed />);
    expect(findFrameStyle(view.toJSON() as JsonNode).backgroundColor).toBe(
      baseProps.accentColor
    );
  });

  it('keeps the border at two pixels in both directions', () => {
    const view = render(<HabitDayToggle {...baseProps} completed />);
    expect(findFrameStyle(view.toJSON() as JsonNode).borderWidth).toBe(2);

    view.rerender(<HabitDayToggle {...baseProps} completed={false} />);
    expect(findFrameStyle(view.toJSON() as JsonNode).borderWidth).toBe(2);
  });

  it('preserves the missed frame without an amber intermediate', () => {
    const { toJSON } = render(<HabitDayToggle {...baseProps} missed />);
    const tree = toJSON() as JsonNode;
    expect(findFrameStyle(tree)).toMatchObject({
      backgroundColor: '#FEF2F2',
      borderColor: '#DC2626',
    });
    expect(countStyleMatches(tree, { backgroundColor: AMBER })).toBe(0);
  });

  it('never paints an amber completion background', () => {
    const view = render(<HabitDayToggle {...baseProps} />);
    view.rerender(<HabitDayToggle {...baseProps} completed />);
    expect(
      countStyleMatches(view.toJSON() as JsonNode, { backgroundColor: AMBER })
    ).toBe(0);
  });

  it('exposes completion as checkbox state', () => {
    const view = render(<HabitDayToggle {...baseProps} />);
    expect(view.getByRole('checkbox').props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });

    view.rerender(<HabitDayToggle {...baseProps} completed />);
    expect(view.getByRole('checkbox').props.accessibilityState.checked).toBe(
      true
    );
  });
});
