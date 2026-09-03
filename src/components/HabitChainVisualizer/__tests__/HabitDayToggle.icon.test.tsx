import React from 'react';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { HabitDayToggle } from '../HabitDayToggle';
import { baseProps } from './HabitDayToggle.testUtils';

jest.mock('@/hooks/useReduceMotion');
const mockReduceMotion = jest.mocked(useReduceMotion);

function findAncestor(
  node: ReactTestInstance | null,
  match: (candidate: ReactTestInstance) => boolean
): ReactTestInstance | null {
  let current = node;
  while (current && !match(current)) current = current.parent;
  return current;
}

describe('HabitDayToggle completion icon', () => {
  beforeEach(() => mockReduceMotion.mockReturnValue(false));
  afterEach(() => jest.restoreAllMocks());

  it.each([
    ['chain', 'lucide-icon-Link2'],
    ['checkbox', 'lucide-icon-Check'],
  ] as const)('renders one crisp %s icon at rest', (completionIcon, testId) => {
    const { getAllByTestId } = render(
      <HabitDayToggle
        {...baseProps}
        completed
        completionIcon={completionIcon}
      />
    );
    expect(getAllByTestId(testId)).toHaveLength(1);
  });

  it('keeps the icon layer opacity-only', () => {
    const { getByTestId } = render(<HabitDayToggle {...baseProps} completed />);
    const layer = findAncestor(
      getByTestId('lucide-icon-Link2').parent,
      (node) => StyleSheet.flatten(node.props.style)?.opacity !== undefined
    );
    const style = StyleSheet.flatten(layer?.props.style);
    expect(style?.opacity).toBe(1);
    expect(style?.transform).toBeUndefined();
  });

  it('leaves the icon through an exiting animation, not a shared value', () => {
    const { getByTestId } = render(<HabitDayToggle {...baseProps} completed />);
    const layer = findAncestor(
      getByTestId('lucide-icon-Link2').parent,
      (node) => node.props.exiting !== undefined
    );
    expect(layer?.props.exiting).toBeDefined();
  });

  it('unmounts the icon as soon as the day is unchecked', () => {
    const view = render(<HabitDayToggle {...baseProps} completed />);
    expect(view.getAllByTestId('lucide-icon-Link2')).toHaveLength(1);

    view.rerender(<HabitDayToggle {...baseProps} completed={false} />);
    expect(view.queryAllByTestId('lucide-icon-Link2')).toHaveLength(0);
  });

  it('remounts the icon when the day is completed again', () => {
    const view = render(<HabitDayToggle {...baseProps} />);
    expect(view.queryAllByTestId('lucide-icon-Link2')).toHaveLength(0);

    view.rerender(<HabitDayToggle {...baseProps} completed />);
    expect(view.getAllByTestId('lucide-icon-Link2')).toHaveLength(1);
  });
});
