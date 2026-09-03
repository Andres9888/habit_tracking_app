import { StyleSheet } from 'react-native';

import type { HabitDayToggleProps } from '../types';

export type StyleEntry = Record<string, unknown>;

export interface JsonNode {
  props?: { style?: unknown; testID?: string };
  children?: (JsonNode | string)[] | null;
}

export const baseProps: HabitDayToggleProps = {
  accentColor: '#3B82F6',
  accessibilityHint: 'Toggles completion',
  accessibilityLabel: 'Toggle day',
  completed: false,
  completionIcon: 'chain',
  dateString: '2026-08-28',
  disabled: false,
  isToday: false,
  missed: false,
  onPress: () => {},
  reduceMotionPreference: false,
  shape: 'square',
  strengthPercent: 30,
};

export function collectNodes(
  node: JsonNode | string | null,
  out: JsonNode[]
): void {
  if (!node || typeof node === 'string') return;
  out.push(node);
  for (const child of node.children ?? []) collectNodes(child, out);
}

export function flatStyle(node: JsonNode): StyleEntry {
  return (
    (StyleSheet.flatten(node.props?.style as StyleEntry) as StyleEntry) ?? {}
  );
}

export function countStyleMatches(
  tree: JsonNode | null,
  match: Partial<StyleEntry>
): number {
  const nodes: JsonNode[] = [];
  collectNodes(tree, nodes);
  return nodes.filter((node) => {
    const style = flatStyle(node);
    return Object.entries(match).every(([key, value]) => style[key] === value);
  }).length;
}

export function findFrameStyle(tree: JsonNode | null): StyleEntry {
  const nodes: JsonNode[] = [];
  collectNodes(tree, nodes);
  const frame = nodes.find((node) => flatStyle(node).borderWidth === 2);
  if (!frame) throw new Error('day-toggle frame not found');
  return flatStyle(frame);
}
