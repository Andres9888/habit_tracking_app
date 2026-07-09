import React from 'react';
import { render } from '@testing-library/react-native';
import { HeatmapCell } from '../HeatmapCell';
import type { BinaryDay } from '../types';
import { CELL_SIZE } from '../constants';

function makeDay(overrides: Partial<BinaryDay> = {}): BinaryDay {
  return {
    date: '2026-07-15',
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    ...overrides,
  };
}

// NOTE: the brief's original queries used getByLabelText, but HeatmapCell
// (unlike the older BinaryCell) sets no accessibilityLabel — only
// accessibilityRole="button" on its Pressable branch. All days below are
// eligible (not future/beforeCreation) with onCellPress provided, so
// HeatmapCell always renders the Pressable branch; getByRole('button')
// reliably locates it without requiring any production accessibility change.

describe('HeatmapCell — shape="circle"', () => {
  it('renders a fully round cell (borderRadius = CELL_SIZE / 2)', () => {
    const { getByRole } = render(
      <HeatmapCell
        day={makeDay({ completed: true })}
        habitColor='#10B981'
        isDark={false}
        shape='circle'
        onCellPress={() => {}}
      />
    );
    const cell = getByRole('button');
    const styles = cell.props.style;
    const flat = Array.isArray(styles)
      ? Object.assign({}, ...styles.filter(Boolean))
      : styles;
    expect(flat.borderRadius).toBe(CELL_SIZE / 2);
  });

  it('renders a dashed open ring for a missed day', () => {
    const day = makeDay({ completed: false, isFuture: false });
    const { getByRole } = render(
      <HeatmapCell
        day={day}
        habitColor='#10B981'
        isDark={false}
        shape='circle'
        onCellPress={() => {}}
      />
    );
    const cell = getByRole('button');
    const styles = cell.props.style;
    const flat = Array.isArray(styles)
      ? Object.assign({}, ...styles.filter(Boolean))
      : styles;
    expect(flat.borderStyle).toBe('dashed');
  });
});

describe('HeatmapCell — shape="square" (default, unchanged)', () => {
  it('keeps the existing small border radius', () => {
    const { getByRole } = render(
      <HeatmapCell
        day={makeDay({ completed: true })}
        habitColor='#10B981'
        isDark={false}
        shape='square'
        onCellPress={() => {}}
      />
    );
    const cell = getByRole('button');
    const styles = cell.props.style;
    const flat = Array.isArray(styles)
      ? Object.assign({}, ...styles.filter(Boolean))
      : styles;
    expect(flat.borderRadius).not.toBe(CELL_SIZE / 2);
  });
});
