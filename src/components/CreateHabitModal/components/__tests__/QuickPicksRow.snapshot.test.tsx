/**
 * QuickPicksRow Snapshot Tests - V5 Redesign
 * Task 5.3: Snapshot tests for visual regression
 *
 * Tests visual consistency of:
 * - Default unselected state
 * - Selected template state
 * - Without browse button
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { QuickPicksRow } from '../QuickPicksRow';

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

describe('QuickPicksRow Snapshots', () => {
  const mockOnSelectTemplate = jest.fn();
  const mockOnBrowseAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot with default unselected state', () => {
    const tree = render(
      <QuickPicksRow
        selectedTemplateId={null}
        onSelectTemplate={mockOnSelectTemplate}
        onBrowseAll={mockOnBrowseAll}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with selected template (Meditate)', () => {
    const tree = render(
      <QuickPicksRow
        selectedTemplateId='meditate'
        onSelectTemplate={mockOnSelectTemplate}
        onBrowseAll={mockOnBrowseAll}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with selected template (Exercise)', () => {
    const tree = render(
      <QuickPicksRow
        selectedTemplateId='exercise'
        onSelectTemplate={mockOnSelectTemplate}
        onBrowseAll={mockOnBrowseAll}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot without browse button', () => {
    const tree = render(
      <QuickPicksRow
        selectedTemplateId={null}
        onSelectTemplate={mockOnSelectTemplate}
        // No onBrowseAll prop
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
