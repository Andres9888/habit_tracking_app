import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';

import { HabitDayToggle } from '../HabitDayToggle';
import type { HabitDayToggleProps } from '../types';

/**
 * Regression coverage for the stale-color bug: the Reanimated cellStyle must
 * stay attached in EVERY state (completed, uncompleted, missed). Detaching an
 * animated style leaves its natively-set backgroundColor behind, which showed
 * up as a solid accent-colored square after un-completing a day.
 *
 * The jest Reanimated mock executes useAnimatedStyle worklets synchronously,
 * so the cellStyle entry appears in the style array as a plain object. We
 * assert the cell frame carries TWO entries with the expected background
 * (static outerFrame + attached cellStyle); the old buggy code rendered
 * `null` in the cellStyle slot when uncompleted.
 */

type StyleEntry = Record<string, unknown>;

interface JsonNode {
  props?: { style?: unknown };
  children?: (JsonNode | string)[] | null;
}

function collectNodes(node: JsonNode | string | null, out: JsonNode[]): void {
  if (!node || typeof node === 'string') return;
  out.push(node);
  for (const child of node.children ?? []) {
    collectNodes(child, out);
  }
}

function findCellFrameStyles(tree: JsonNode | null): StyleEntry[] {
  const nodes: JsonNode[] = [];
  collectNodes(tree, nodes);
  for (const node of nodes) {
    const style = node.props?.style;
    const flat = StyleSheet.flatten(style as StyleEntry) as
      | StyleEntry
      | undefined;
    if (flat?.height === 44 && flat?.width === 44) {
      return (Array.isArray(style) ? style : [style]).filter(
        Boolean
      ) as StyleEntry[];
    }
  }
  throw new Error('cell frame (44x44) not found in rendered tree');
}

function entriesWithBackground(
  styles: StyleEntry[],
  color: string
): StyleEntry[] {
  return styles.filter((entry) => entry.backgroundColor === color);
}

const baseProps: HabitDayToggleProps = {
  accentColor: '#3B82F6',
  accessibilityHint: 'Toggles completion',
  accessibilityLabel: 'Toggle day',
  completed: false,
  completionIcon: 'chain',
  disabled: false,
  isToday: false,
  missed: false,
  onPress: () => {},
  shape: 'square',
  strengthPercent: 30,
};

describe('HabitDayToggle cellStyle attachment', () => {
  it('keeps the animated cellStyle attached when uncompleted', () => {
    const { toJSON } = render(<HabitDayToggle {...baseProps} />);
    const styles = findCellFrameStyles(toJSON() as JsonNode);

    // outerFrame static + attached cellStyle worklet output
    expect(entriesWithBackground(styles, '#f5f5f5').length).toBe(2);
  });

  it('resets to the uncompleted background after completed -> uncompleted', () => {
    const { rerender, toJSON } = render(
      <HabitDayToggle {...baseProps} completed />
    );

    rerender(<HabitDayToggle {...baseProps} completed={false} />);

    const styles = findCellFrameStyles(toJSON() as JsonNode);
    expect(entriesWithBackground(styles, '#f5f5f5').length).toBe(2);
    // No entry may keep the completed accent background
    expect(entriesWithBackground(styles, baseProps.accentColor).length).toBe(0);
  });

  it('keeps the animated cellStyle attached for missed days', () => {
    const { toJSON } = render(<HabitDayToggle {...baseProps} missed />);
    const styles = findCellFrameStyles(toJSON() as JsonNode);

    expect(entriesWithBackground(styles, '#FEF2F2').length).toBe(2);
  });
});
