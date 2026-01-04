/**
 * LivePreviewCard Component Tests
 * Task 9: Update LivePreviewCard Component
 *
 * Test Coverage:
 * - Component rendering and structure
 * - Preview label and Live badge display
 * - Emoji, color, and habit name display
 * - Frequency text generation (Daily, Weekdays, Weekends, custom)
 * - Time of day display with Huberman phases
 * - Reminder time display when enabled
 * - Badge row layout and separators
 * - Default values for empty states
 * - Accessibility labels and roles
 * - Component memoization
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { LivePreviewCard } from '../LivePreviewCard';
import type { HubermanPhase } from '../../../../constants/hubermanPhases';

// Mock LinearGradient since it requires native modules
jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  return ({ children, ...props }: any) =>
    React.createElement('View', props, children);
});

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Sparkles: () => null,
}));

describe('LivePreviewCard', () => {
  const defaultProps = {
    habitName: 'Morning Meditation',
    emoji: '🧘',
    color: '#10B981',
    timeOfDay: 'phase1_push' as HubermanPhase,
    selectedDays: [true, true, true, true, true, true, true], // Daily
    reminderEnabled: true,
    reminderTime: '7:00 AM',
  };

  describe('Rendering and Structure', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByText('Morning Meditation')).toBeTruthy();
    });

    it('renders Preview label', () => {
      const { getByText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByText('PREVIEW')).toBeTruthy();
    });

    it('renders Live badge text', () => {
      const { getByText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByText('Live')).toBeTruthy();
    });

    it('renders emoji icon', () => {
      const { getByText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByText('🧘')).toBeTruthy();
    });

    it('renders habit name', () => {
      const { getByText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByText('Morning Meditation')).toBeTruthy();
    });
  });

  describe('Default Values (Empty State)', () => {
    it('shows default emoji when null', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} emoji={null} />
      );
      expect(getByText('🎯')).toBeTruthy();
    });

    it('shows default habit name when empty', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} habitName="" />
      );
      expect(getByText('Your new habit')).toBeTruthy();
    });

    it('shows default habit name when only whitespace', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} habitName="   " />
      );
      expect(getByText('Your new habit')).toBeTruthy();
    });

    it('uses default color when empty string', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} color="" />
      );
      const emojiContainer = getByText('🧘').parent;
      expect(emojiContainer?.props.style).toMatchObject({
        backgroundColor: '#10B981',
      });
    });
  });

  describe('Frequency Text Generation', () => {
    it('shows "Daily" for all days selected', () => {
      const { getByText } = render(
        <LivePreviewCard
          {...defaultProps}
          selectedDays={[true, true, true, true, true, true, true]}
        />
      );
      expect(getByText('Daily')).toBeTruthy();
    });

    it('shows "Weekdays" for Mon-Fri selected', () => {
      const { getByText } = render(
        <LivePreviewCard
          {...defaultProps}
          selectedDays={[false, true, true, true, true, true, false]}
        />
      );
      expect(getByText('Weekdays')).toBeTruthy();
    });

    it('shows "Weekends" for Sat-Sun selected', () => {
      const { getByText } = render(
        <LivePreviewCard
          {...defaultProps}
          selectedDays={[true, false, false, false, false, false, true]}
        />
      );
      expect(getByText('Weekends')).toBeTruthy();
    });

    it('shows "3 days/week" for custom pattern', () => {
      const { getByText } = render(
        <LivePreviewCard
          {...defaultProps}
          selectedDays={[true, false, true, false, true, false, false]}
        />
      );
      expect(getByText('3 days/week')).toBeTruthy();
    });

    it('shows "No days" when no days selected', () => {
      const { getByText } = render(
        <LivePreviewCard
          {...defaultProps}
          selectedDays={[false, false, false, false, false, false, false]}
        />
      );
      expect(getByText('No days')).toBeTruthy();
    });

    it('shows "1 days/week" for single day', () => {
      const { getByText } = render(
        <LivePreviewCard
          {...defaultProps}
          selectedDays={[false, true, false, false, false, false, false]}
        />
      );
      expect(getByText('1 days/week')).toBeTruthy();
    });
  });

  describe('Time of Day Display', () => {
    it('shows Phase 1 Push with correct icon', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} timeOfDay="phase1_push" />
      );
      expect(getByText(/🌅 Push/)).toBeTruthy();
    });

    it('shows Phase 2 Pivot with correct icon', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} timeOfDay="phase2_pivot" />
      );
      expect(getByText(/☀️ Pivot/)).toBeTruthy();
    });

    it('shows Phase 3 Pull with correct icon', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} timeOfDay="phase3_pull" />
      );
      expect(getByText(/🌙 Pull/)).toBeTruthy();
    });

    it('does not show time of day when null', () => {
      const { queryByText } = render(
        <LivePreviewCard {...defaultProps} timeOfDay={null} />
      );
      expect(queryByText(/Push/)).toBeNull();
      expect(queryByText(/Pivot/)).toBeNull();
      expect(queryByText(/Pull/)).toBeNull();
    });

    it('does not show separator before time of day when null', () => {
      const { queryAllByText } = render(
        <LivePreviewCard {...defaultProps} timeOfDay={null} reminderEnabled={false} />
      );
      const separators = queryAllByText('•');
      // Should have no separators when only frequency badge is shown
      expect(separators.length).toBe(0);
    });
  });

  describe('Reminder Time Display', () => {
    it('shows reminder time when enabled', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} reminderEnabled reminderTime="7:00 AM" />
      );
      expect(getByText(/🔔 7:00 AM/)).toBeTruthy();
    });

    it('does not show reminder when disabled', () => {
      const { queryByText } = render(
        <LivePreviewCard {...defaultProps} reminderEnabled={false} />
      );
      expect(queryByText(/🔔/)).toBeNull();
    });

    it('shows reminder with different time format', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} reminderEnabled reminderTime="12:30 PM" />
      );
      expect(getByText(/🔔 12:30 PM/)).toBeTruthy();
    });
  });

  describe('Badge Row Layout', () => {
    it('shows frequency badge only when no time of day or reminder', () => {
      const { getByText, queryByText } = render(
        <LivePreviewCard
          {...defaultProps}
          timeOfDay={null}
          reminderEnabled={false}
        />
      );
      expect(getByText('Daily')).toBeTruthy();
      expect(queryByText('•')).toBeNull();
    });

    it('shows frequency and time of day with separator', () => {
      const { getByText, getAllByText } = render(
        <LivePreviewCard
          {...defaultProps}
          timeOfDay="phase1_push"
          reminderEnabled={false}
        />
      );
      expect(getByText('Daily')).toBeTruthy();
      expect(getByText(/Push/)).toBeTruthy();
      expect(getAllByText('•').length).toBe(1);
    });

    it('shows all three badges with two separators', () => {
      const { getByText, getAllByText } = render(
        <LivePreviewCard {...defaultProps} />
      );
      expect(getByText('Daily')).toBeTruthy();
      expect(getByText(/Push/)).toBeTruthy();
      expect(getByText(/🔔 7:00 AM/)).toBeTruthy();
      expect(getAllByText('•').length).toBe(2);
    });

    it('shows frequency and reminder without time of day (one separator)', () => {
      const { getByText, getAllByText } = render(
        <LivePreviewCard
          {...defaultProps}
          timeOfDay={null}
          reminderEnabled
        />
      );
      expect(getByText('Daily')).toBeTruthy();
      expect(getByText(/🔔 7:00 AM/)).toBeTruthy();
      expect(getAllByText('•').length).toBe(1);
    });
  });

  describe('Styling and Visual Elements', () => {
    it('applies correct color to emoji container', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} color="#EF4444" />
      );
      const emojiContainer = getByText('🧘').parent;
      expect(emojiContainer?.props.style).toMatchObject({
        backgroundColor: '#EF4444',
      });
    });

    it('truncates long habit names with ellipsis', () => {
      const longName = 'This is a very long habit name that should be truncated';
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} habitName={longName} />
      );
      const nameElement = getByText(longName);
      expect(nameElement.props.numberOfLines).toBe(1);
      expect(nameElement.props.ellipsizeMode).toBe('tail');
    });

    it('renders Preview label in uppercase', () => {
      const { getByText } = render(<LivePreviewCard {...defaultProps} />);
      const previewLabel = getByText('PREVIEW');
      expect(previewLabel.props.style).toMatchObject({
        textTransform: 'uppercase',
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible role summary', () => {
      const { getByLabelText } = render(<LivePreviewCard {...defaultProps} />);
      const container = getByLabelText(/Live preview/);
      expect(container.props.accessibilityRole).toBe('summary');
    });

    it('includes habit name in accessibility label', () => {
      const { getByLabelText } = render(<LivePreviewCard {...defaultProps} />);
      expect(
        getByLabelText(/Live preview:.*Morning Meditation/)
      ).toBeTruthy();
    });

    it('includes emoji in accessibility label', () => {
      const { getByLabelText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByLabelText(/with icon 🧘/)).toBeTruthy();
    });

    it('includes frequency in accessibility label', () => {
      const { getByLabelText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByLabelText(/Frequency: Daily/)).toBeTruthy();
    });

    it('includes time of day in accessibility label', () => {
      const { getByLabelText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByLabelText(/Time: Push/)).toBeTruthy();
    });

    it('includes reminder in accessibility label when enabled', () => {
      const { getByLabelText } = render(<LivePreviewCard {...defaultProps} />);
      expect(getByLabelText(/Reminder at 7:00 AM/)).toBeTruthy();
    });

    it('does not include reminder in label when disabled', () => {
      const { queryByLabelText } = render(
        <LivePreviewCard {...defaultProps} reminderEnabled={false} />
      );
      expect(queryByLabelText(/Reminder at/)).toBeNull();
    });

    it('child elements are not individually accessible', () => {
      const { getByText } = render(<LivePreviewCard {...defaultProps} />);
      const emojiElement = getByText('🧘');
      const nameElement = getByText('Morning Meditation');
      expect(emojiElement.parent?.props.accessible).toBe(false);
      expect(nameElement.props.accessible).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty habit name gracefully', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} habitName="" />
      );
      expect(getByText('Your new habit')).toBeTruthy();
    });

    it('handles null emoji gracefully', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} emoji={null} />
      );
      expect(getByText('🎯')).toBeTruthy();
    });

    it('handles null timeOfDay gracefully', () => {
      const { queryByText } = render(
        <LivePreviewCard {...defaultProps} timeOfDay={null} />
      );
      // Should not crash and should not show time of day
      expect(queryByText(/Push|Pivot|Pull/)).toBeNull();
    });

    it('handles all days deselected', () => {
      const { getByText } = render(
        <LivePreviewCard
          {...defaultProps}
          selectedDays={[false, false, false, false, false, false, false]}
        />
      );
      expect(getByText('No days')).toBeTruthy();
    });

    it('handles reminder time with AM/PM', () => {
      const { getByText } = render(
        <LivePreviewCard
          {...defaultProps}
          reminderEnabled
          reminderTime="11:59 PM"
        />
      );
      expect(getByText(/🔔 11:59 PM/)).toBeTruthy();
    });

    it('handles very short habit name', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} habitName="A" />
      );
      expect(getByText('A')).toBeTruthy();
    });

    it('handles special characters in habit name', () => {
      const { getByText } = render(
        <LivePreviewCard {...defaultProps} habitName="Read & Write 📚" />
      );
      expect(getByText('Read & Write 📚')).toBeTruthy();
    });
  });

  describe('Component Memoization', () => {
    it('is a memoized component', () => {
      expect(LivePreviewCard.type).toBeTruthy();
    });

    it('has correct display name', () => {
      expect(LivePreviewCard.displayName).toBe('LivePreviewCard');
    });
  });

  describe('Integration Scenarios', () => {
    it('renders complete preview with all features', () => {
      const { getByText } = render(
        <LivePreviewCard
          habitName="Morning Run"
          emoji="🏃"
          color="#3B82F6"
          timeOfDay="phase1_push"
          selectedDays={[false, true, true, true, true, true, false]}
          reminderEnabled
          reminderTime="6:00 AM"
        />
      );

      expect(getByText('PREVIEW')).toBeTruthy();
      expect(getByText('Live')).toBeTruthy();
      expect(getByText('Morning Run')).toBeTruthy();
      expect(getByText('🏃')).toBeTruthy();
      expect(getByText('Weekdays')).toBeTruthy();
      expect(getByText(/🌅 Push/)).toBeTruthy();
      expect(getByText(/🔔 6:00 AM/)).toBeTruthy();
    });

    it('renders minimal preview (no optional features)', () => {
      const { getByText, queryByText } = render(
        <LivePreviewCard
          habitName="Simple Habit"
          emoji="✅"
          color="#10B981"
          timeOfDay={null}
          selectedDays={[true, true, true, true, true, true, true]}
          reminderEnabled={false}
          reminderTime=""
        />
      );

      expect(getByText('PREVIEW')).toBeTruthy();
      expect(getByText('Live')).toBeTruthy();
      expect(getByText('Simple Habit')).toBeTruthy();
      expect(getByText('✅')).toBeTruthy();
      expect(getByText('Daily')).toBeTruthy();
      expect(queryByText(/Push|Pivot|Pull/)).toBeNull();
      expect(queryByText(/🔔/)).toBeNull();
    });
  });
});
