/**
 * HabitNotesSection Tests
 * Story 1.9.3 - Habit Detail Notes Module
 */

import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { HabitNotesSection } from '../HabitNotesSection';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  StickyNote: () => null,
  Plus: () => null,
  ChevronRight: () => null,
  Edit3: () => null,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

const createMockNote = (overrides: Partial<Doc<'notes'>> = {}): Doc<'notes'> => ({
  _id: 'note_1' as Id<'notes'>,
  _creationTime: Date.now(),
  body: 'This is a test note',
  createdAt: Date.now(),
  date: '2024-01-15',
  habitId: 'habit_1' as Id<'habits'>,
  updatedAt: Date.now(),
  ...overrides,
});

describe('HabitNotesSection', () => {
  const defaultProps = {
    notes: [] as Doc<'notes'>[],
    onAddNote: jest.fn(),
    onViewAll: jest.fn(),
    onEditNote: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AC1: Empty state', () => {
    it('shows empty state with friendly prompt when no notes exist', () => {
      const { getByText } = render(<HabitNotesSection {...defaultProps} />);

      expect(getByText('Notes')).toBeTruthy();
      expect(getByText('Record insights to learn what works best')).toBeTruthy();
      expect(getByText('Add your first note')).toBeTruthy();
    });

    it('allows adding note from empty state', () => {
      const onAddNote = jest.fn();
      const { getByLabelText } = render(
        <HabitNotesSection {...defaultProps} onAddNote={onAddNote} />
      );

      const addButton = getByLabelText('Add your first note');
      fireEvent.press(addButton);

      expect(onAddNote).toHaveBeenCalledTimes(1);
    });
  });

  describe('AC1a: Most recent note preview', () => {
    it('shows most recent note preview when notes exist', () => {
      const notes = [
        createMockNote({ body: 'Most recent note body', date: '2024-01-15' }),
      ];

      const { getByText, queryByText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} />
      );

      expect(getByText('Most recent note body')).toBeTruthy();
      // Check date is displayed (timezone may shift day)
      expect(queryByText(/Jan 1[45], 2024/)).toBeTruthy();
    });

    it('truncates long note preview to 3 lines', () => {
      const longBody = 'This is a very long note body '.repeat(20);
      const notes = [createMockNote({ body: longBody })];

      const { getByText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} />
      );

      // The note text should exist but be truncated
      const noteText = getByText(longBody);
      expect(noteText.props.numberOfLines).toBe(3);
    });
  });

  describe('AC1b: Total note count badge', () => {
    it('shows note count badge when notes exist', () => {
      const notes = [
        createMockNote({ _id: 'note_1' as Id<'notes'> }),
        createMockNote({ _id: 'note_2' as Id<'notes'> }),
        createMockNote({ _id: 'note_3' as Id<'notes'> }),
      ];

      const { getByLabelText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} />
      );

      expect(getByLabelText('3 notes')).toBeTruthy();
    });

    it('does not show count badge when no notes', () => {
      const { queryByLabelText } = render(<HabitNotesSection {...defaultProps} />);

      expect(queryByLabelText(/notes$/)).toBeNull();
    });

    it('shows singular "note" for count of 1', () => {
      const notes = [createMockNote()];

      const { getByLabelText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} />
      );

      expect(getByLabelText('1 note')).toBeTruthy();
    });
  });

  describe('AC1c: Add Note action', () => {
    it('shows Add button in header', () => {
      const { getByLabelText } = render(<HabitNotesSection {...defaultProps} />);

      expect(getByLabelText('Add note')).toBeTruthy();
    });

    it('calls onAddNote when Add button is pressed', () => {
      const onAddNote = jest.fn();
      const { getByLabelText } = render(
        <HabitNotesSection {...defaultProps} onAddNote={onAddNote} />
      );

      fireEvent.press(getByLabelText('Add note'));

      expect(onAddNote).toHaveBeenCalledTimes(1);
    });
  });

  describe('AC2: Note editor flow', () => {
    it('calls onEditNote with note when note preview is tapped', () => {
      const note = createMockNote();
      const onEditNote = jest.fn();

      const { getByText } = render(
        <HabitNotesSection
          {...defaultProps}
          notes={[note]}
          onEditNote={onEditNote}
        />
      );

      fireEvent.press(getByText('This is a test note'));

      expect(onEditNote).toHaveBeenCalledWith(note);
    });
  });

  describe('AC3: View All functionality', () => {
    it('does not show View All when only 1 note exists', () => {
      const notes = [createMockNote()];

      const { queryByText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} />
      );

      expect(queryByText(/View all/)).toBeNull();
    });

    it('shows View All when more than 1 note exists', () => {
      const notes = [
        createMockNote({ _id: 'note_1' as Id<'notes'> }),
        createMockNote({ _id: 'note_2' as Id<'notes'> }),
      ];

      const { getByText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} />
      );

      expect(getByText('View all (2)')).toBeTruthy();
    });

    it('calls onViewAll when View All is pressed', () => {
      const notes = [
        createMockNote({ _id: 'note_1' as Id<'notes'> }),
        createMockNote({ _id: 'note_2' as Id<'notes'> }),
      ];
      const onViewAll = jest.fn();

      const { getByLabelText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} onViewAll={onViewAll} />
      );

      fireEvent.press(getByLabelText('View all 2 notes'));

      expect(onViewAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('AC5: Accessibility', () => {
    it('has accessible Add note button with label', () => {
      const { getByLabelText, getByRole } = render(
        <HabitNotesSection {...defaultProps} />
      );

      const addButton = getByLabelText('Add note');
      expect(addButton).toBeTruthy();
    });

    it('has accessible View All button with note count', () => {
      const notes = [
        createMockNote({ _id: 'note_1' as Id<'notes'> }),
        createMockNote({ _id: 'note_2' as Id<'notes'> }),
        createMockNote({ _id: 'note_3' as Id<'notes'> }),
      ];

      const { getByLabelText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} />
      );

      expect(getByLabelText('View all 3 notes')).toBeTruthy();
    });

    it('has accessible empty state button', () => {
      const { getByLabelText } = render(<HabitNotesSection {...defaultProps} />);

      expect(getByLabelText('Add your first note')).toBeTruthy();
    });

    it('has accessible note preview with truncated content', () => {
      const notes = [createMockNote({ body: 'Short note' })];

      const { getByLabelText } = render(
        <HabitNotesSection {...defaultProps} notes={notes} />
      );

      expect(getByLabelText(/Most recent note:/)).toBeTruthy();
    });
  });
});
