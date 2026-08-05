/**
 * TimeOfDaySelector Snapshot Tests - V5 Redesign
 * Task 5.3: Snapshot tests for visual regression
 *
 * Tests visual consistency of:
 * - Default unselected state
 * - Each phase selected state
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { TimeOfDaySelector } from '../TimeOfDaySelector';

// Mock useHapticFeedback
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock AccessibilityInfo
jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => ({
    announceForAccessibility: jest.fn(),
  })
);

describe('TimeOfDaySelector Snapshots', () => {
  const mockOnSelectPhase = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot with no selection', () => {
    const tree = render(
      <TimeOfDaySelector
        selectedPhase={null}
        onSelectPhase={mockOnSelectPhase}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with Push (Morning) selected', () => {
    const tree = render(
      <TimeOfDaySelector
        selectedPhase='phase1_push'
        onSelectPhase={mockOnSelectPhase}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with Pivot (Afternoon) selected', () => {
    const tree = render(
      <TimeOfDaySelector
        selectedPhase='phase2_pivot'
        onSelectPhase={mockOnSelectPhase}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with Pull (Evening) selected', () => {
    const tree = render(
      <TimeOfDaySelector
        selectedPhase='phase3_pull'
        onSelectPhase={mockOnSelectPhase}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
