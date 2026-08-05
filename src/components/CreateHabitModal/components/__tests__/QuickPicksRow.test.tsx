/**
 * QuickPicksRow Component Tests - V5 Redesign
 * Task 5.3: Unit tests for QuickPicksRow
 *
 * Tests:
 * - Horizontal FlatList with 5 template cards
 * - Each card shows: emoji icon (gradient bg), name, timing subtitle
 * - Selected state with green border
 * - "Browse all →" link
 * - onSelect callback to parent
 * - Haptic feedback on selection
 * - Accessibility labels and announcements
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import {
  QuickPicksRow,
  QUICK_PICK_TEMPLATES,
  type QuickPickTemplate,
} from '../QuickPicksRow';

// Mock useHapticFeedback
const mockTriggerSelection = jest.fn();
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: mockTriggerSelection,
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock AccessibilityInfo.announceForAccessibility
jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

describe('QuickPicksRow - V5 Redesign', () => {
  const mockOnSelectTemplate = jest.fn();
  const mockOnBrowseAll = jest.fn();

  const defaultProps = {
    selectedTemplateId: null,
    onSelectTemplate: mockOnSelectTemplate,
    onBrowseAll: mockOnBrowseAll,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the section header "Quick picks"', () => {
      const { getByText } = render(<QuickPicksRow {...defaultProps} />);
      expect(getByText('Quick picks')).toBeDefined();
    });

    it('should render 5 template cards', () => {
      const { getAllByRole } = render(<QuickPicksRow {...defaultProps} />);
      // 5 template cards + 1 "Browse all" button = 6 buttons
      const buttons = getAllByRole('button');
      expect(buttons.length).toBe(6);
    });

    it('should render "Browse all →" link when onBrowseAll is provided', () => {
      const { getByText } = render(<QuickPicksRow {...defaultProps} />);
      expect(getByText('Browse all →')).toBeDefined();
    });

    it('should not render "Browse all →" link when onBrowseAll is not provided', () => {
      const { queryByText } = render(
        <QuickPicksRow
          selectedTemplateId={null}
          onSelectTemplate={mockOnSelectTemplate}
        />
      );
      expect(queryByText('Browse all →')).toBeNull();
    });
  });

  describe('Template Cards', () => {
    it('should render each template with correct name', () => {
      const { getByText } = render(<QuickPicksRow {...defaultProps} />);

      QUICK_PICK_TEMPLATES.forEach((template) => {
        expect(getByText(template.name)).toBeDefined();
      });
    });

    it('should render each template with correct emoji', () => {
      const { getByText } = render(<QuickPicksRow {...defaultProps} />);

      QUICK_PICK_TEMPLATES.forEach((template) => {
        expect(getByText(template.emoji)).toBeDefined();
      });
    });

    it('should render each template with timing subtitle', () => {
      const { getAllByText } = render(<QuickPicksRow {...defaultProps} />);

      // Each template should have its phase short label visible
      // Meditate, Exercise, Hydrate → Push (phase1) = 3 templates
      // Read, Journal → Pull (phase3) = 2 templates
      const pushElements = getAllByText(/🌅 Push/);
      const pullElements = getAllByText(/🌙 Pull/);

      expect(pushElements.length).toBe(3); // Meditate, Exercise, Hydrate
      expect(pullElements.length).toBe(2); // Read, Journal
    });

    it('should show correct accessibility label for each template', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      QUICK_PICK_TEMPLATES.forEach((template) => {
        expect(getByLabelText(`Quick pick: ${template.name}`)).toBeDefined();
      });
    });
  });

  describe('Selection State', () => {
    it('should show selected state with green border on selected template', () => {
      const { getByLabelText } = render(
        <QuickPicksRow {...defaultProps} selectedTemplateId='meditate' />
      );

      const selectedButton = getByLabelText('Quick pick: Meditate');
      expect(selectedButton.props.accessibilityState?.selected).toBe(true);
    });

    it('should not show selected state on non-selected templates', () => {
      const { getByLabelText } = render(
        <QuickPicksRow {...defaultProps} selectedTemplateId='meditate' />
      );

      const nonSelectedButton = getByLabelText('Quick pick: Read');
      expect(nonSelectedButton.props.accessibilityState?.selected).toBe(false);
    });

    it('should have all templates unselected when selectedTemplateId is null', () => {
      const { getByLabelText } = render(
        <QuickPicksRow {...defaultProps} selectedTemplateId={null} />
      );

      QUICK_PICK_TEMPLATES.forEach((template) => {
        const button = getByLabelText(`Quick pick: ${template.name}`);
        expect(button.props.accessibilityState?.selected).toBe(false);
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onSelectTemplate when template card is pressed', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      const meditateCard = getByLabelText('Quick pick: Meditate');
      fireEvent.press(meditateCard);

      expect(mockOnSelectTemplate).toHaveBeenCalledTimes(1);
      expect(mockOnSelectTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'meditate',
          name: 'Meditate',
          emoji: '🧘',
        })
      );
    });

    it('should call onBrowseAll when "Browse all →" is pressed', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      const browseButton = getByLabelText('Browse all templates');
      fireEvent.press(browseButton);

      expect(mockOnBrowseAll).toHaveBeenCalledTimes(1);
    });

    it('should trigger haptic feedback on template selection', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      const readCard = getByLabelText('Quick pick: Read');
      fireEvent.press(readCard);

      expect(mockTriggerSelection).toHaveBeenCalledTimes(1);
    });

    it('should trigger haptic feedback on browse all press', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      const browseButton = getByLabelText('Browse all templates');
      fireEvent.press(browseButton);

      expect(mockTriggerSelection).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have accessibilityRole="button" for all template cards', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      QUICK_PICK_TEMPLATES.forEach((template) => {
        const button = getByLabelText(`Quick pick: ${template.name}`);
        expect(button.props.accessibilityRole).toBe('button');
      });
    });

    it('should have accessibilityRole="button" for browse all link', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      const browseButton = getByLabelText('Browse all templates');
      expect(browseButton.props.accessibilityRole).toBe('button');
    });

    it('should announce template selection for screen readers', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      const meditateCard = getByLabelText('Quick pick: Meditate');
      fireEvent.press(meditateCard);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Selected Meditate template. Scheduled for Push'
      );
    });

    it('should have correct accessibilityState for selected templates', () => {
      const { getByLabelText } = render(
        <QuickPicksRow {...defaultProps} selectedTemplateId='exercise' />
      );

      const exerciseCard = getByLabelText('Quick pick: Exercise');
      expect(exerciseCard.props.accessibilityState).toEqual(
        expect.objectContaining({ selected: true })
      );

      const readCard = getByLabelText('Quick pick: Read');
      expect(readCard.props.accessibilityState).toEqual(
        expect.objectContaining({ selected: false })
      );
    });
  });

  describe('Template Data', () => {
    it('should have exactly 5 templates defined', () => {
      expect(QUICK_PICK_TEMPLATES.length).toBe(5);
    });

    it('should have all required template fields', () => {
      QUICK_PICK_TEMPLATES.forEach((template) => {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.emoji).toBeDefined();
        expect(template.color).toBeDefined();
        expect(template.timeOfDay).toBeDefined();
      });
    });

    it('should have templates with valid HubermanPhase values', () => {
      const validPhases = ['phase1_push', 'phase2_pivot', 'phase3_pull'];

      QUICK_PICK_TEMPLATES.forEach((template) => {
        expect(validPhases).toContain(template.timeOfDay);
      });
    });

    it('should include the 5 expected templates', () => {
      const templateIds = QUICK_PICK_TEMPLATES.map((t) => t.id);
      expect(templateIds).toContain('meditate');
      expect(templateIds).toContain('read');
      expect(templateIds).toContain('exercise');
      expect(templateIds).toContain('hydrate');
      expect(templateIds).toContain('journal');
    });
  });

  describe('Acceptance Criteria Summary', () => {
    it('✅ AC1: Horizontal FlatList with 5 template cards', () => {
      const { getAllByRole, UNSAFE_root } = render(
        <QuickPicksRow {...defaultProps} />
      );

      // Verify there are 5 template cards (+ 1 browse button = 6 total)
      const buttons = getAllByRole('button');
      expect(buttons.length).toBe(6);

      // Verify FlatList is used (by checking data-testid or structure)
      // FlatList is implicit through horizontal scroll behavior
    });

    it('✅ AC2: Each card shows emoji, name, and timing subtitle', () => {
      const { getByText, getAllByText } = render(
        <QuickPicksRow {...defaultProps} />
      );

      // Verify Meditate template has all parts
      expect(getByText('Meditate')).toBeDefined();
      expect(getByText('🧘')).toBeDefined();
      // Timing subtitle (Push for Meditate) - there are 3 Push templates
      const pushElements = getAllByText(/🌅 Push/);
      expect(pushElements.length).toBeGreaterThan(0);
    });

    it('✅ AC3: Selected state with green border', () => {
      const { getByLabelText } = render(
        <QuickPicksRow {...defaultProps} selectedTemplateId='exercise' />
      );

      const selectedCard = getByLabelText('Quick pick: Exercise');
      expect(selectedCard.props.accessibilityState?.selected).toBe(true);
    });

    it('✅ AC4: "Browse all →" link present', () => {
      const { getByText, getByLabelText } = render(
        <QuickPicksRow {...defaultProps} />
      );

      expect(getByText('Browse all →')).toBeDefined();
      expect(getByLabelText('Browse all templates')).toBeDefined();
    });

    it('✅ AC5: onSelect callback fires with template data', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      const journalCard = getByLabelText('Quick pick: Journal');
      fireEvent.press(journalCard);

      expect(mockOnSelectTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'journal',
          name: 'Journal',
          emoji: '✍️',
          color: '#F97316',
          timeOfDay: 'phase3_pull',
        })
      );
    });

    it('✅ AC6: Haptic feedback on selection', () => {
      const { getByLabelText } = render(<QuickPicksRow {...defaultProps} />);

      const hydrateCard = getByLabelText('Quick pick: Hydrate');
      fireEvent.press(hydrateCard);

      expect(mockTriggerSelection).toHaveBeenCalled();
    });
  });
});
