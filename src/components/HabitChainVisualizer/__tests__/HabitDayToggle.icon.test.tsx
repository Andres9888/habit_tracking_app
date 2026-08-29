import React from 'react';
import { act, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { HabitDayToggle } from '../HabitDayToggle';
import { baseProps } from './HabitDayToggle.testUtils';

jest.mock('@/hooks/useReduceMotion');
const mockReduceMotion = jest.mocked(useReduceMotion);

describe('HabitDayToggle completion icon', () => {
  beforeEach(() => mockReduceMotion.mockReturnValue(false));

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
    let parent = getByTestId('lucide-icon-Link2').parent;
    while (parent && StyleSheet.flatten(parent.props.style)?.opacity === undefined) {
      parent = parent.parent;
    }
    const style = StyleSheet.flatten(parent?.props.style);
    expect(style?.opacity).toBe(1);
    expect(style?.transform).toBeUndefined();
  });

  it('keeps the icon through exit and unmounts after the timing callback', () => {
    const view = render(<HabitDayToggle {...baseProps} completed />);
    expect(view.getAllByTestId('lucide-icon-Link2')).toHaveLength(1);
    act(() => view.rerender(<HabitDayToggle {...baseProps} completed={false} />));
    expect(view.queryAllByTestId('lucide-icon-Link2')).toHaveLength(0);
  });
});
