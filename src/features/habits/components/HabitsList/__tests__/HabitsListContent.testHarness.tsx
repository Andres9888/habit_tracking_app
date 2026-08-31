import { jest } from '@jest/globals';
import React from 'react';
import { HabitsListContent } from '../HabitsListContent';
import type { HabitsListContentProps } from '../HabitsList.types';

const capturedListProps: Array<Record<string, unknown>> = [];

jest.mock('react-native-draggable-flatlist', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    capturedListProps.push(props);
    return null;
  },
}));

jest.mock('../HabitsListRenders', () => ({
  renderHabitsListHeader: () => null,
  renderHabitRow: () => null,
}));

jest.mock('../HabitsListModals', () => ({
  HabitsListModals: () => null,
}));

jest.mock('../useStickyHeader', () => ({
  useStickyHeader: () => ({ contextValue: {}, scrollHandler: undefined }),
}));

export function buildProps(
  overrides: {
    deferHeavyFocusContent?: boolean;
    justCreatedHabitId?: string | null;
    pendingFocusHabitId?: string | null;
  } = {}
): HabitsListContentProps {
  const pendingFocusHabitId = overrides.pendingFocusHabitId ?? null;
  const list = {
    contentPadding: { paddingBottom: 0, paddingHorizontal: 16 },
    getHabitStatus: jest.fn(),
    habits: pendingFocusHabitId
      ? [{ _id: pendingFocusHabitId, name: 'Focused habit' }]
      : [],
    handleDragEnd: jest.fn(),
    reduceMotionPreference: true,
    toggleHabit: jest.fn(),
  };
  const modals = { pendingFocusHabitId, settings: undefined };
  const state = {
    closeDaySheet: jest.fn(),
    daySheetDate: null,
    habitRowOpacity: { setValue: jest.fn() },
    habitRowTranslateY: { setValue: jest.fn() },
    initialEntranceDoneRef: { current: true },
    justCreatedHabitId: overrides.justCreatedHabitId ?? null,
  };
  const handlers = {
    handleDragBegin: jest.fn(),
    isReorderingEnabled: false,
    keyExtractor: (h: { _id: string }) => h._id,
  };

  return {
    deferHeavyFocusContent: overrides.deferHeavyFocusContent ?? false,
    focusEstimatedRowLength: 184,
    handlers,
    listRef: React.createRef(),
    props: {
      list,
      modals,
      onUpgradeConfirm: jest.fn(),
      onUpgradeDismiss: jest.fn(),
      upgradePromptVisible: false,
    },
    renderItem: jest.fn(),
    state,
  } as unknown as HabitsListContentProps;
}

export function lastExtraData(): unknown {
  return capturedListProps[capturedListProps.length - 1]?.extraData;
}

export function lastListProps(): Record<string, unknown> {
  return capturedListProps[capturedListProps.length - 1] ?? {};
}

export function resetCapturedListProps(): void {
  capturedListProps.length = 0;
}

export { HabitsListContent };
