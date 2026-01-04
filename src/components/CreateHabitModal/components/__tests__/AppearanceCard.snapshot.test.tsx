/**
 * AppearanceCard Snapshot Tests
 * Task 5: Create AppearanceCard Component
 *
 * Visual regression tests for all states of the AppearanceCard component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { AppearanceCard, AppearanceCardProps } from '../AppearanceCard';

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Palette: 'Palette',
  CheckCircle: 'CheckCircle',
  Circle: 'Circle',
  Lightbulb: 'Lightbulb',
}));

// Mock child components
jest.mock('../CompletionBadge', () => ({
  CompletionBadge: ({ type }: { type: string }) => `CompletionBadge-${type}`,
}));

jest.mock('../EmojiPicker', () => ({
  EmojiPicker: ({
    selectedEmoji,
    habitName,
  }: {
    selectedEmoji: string | null;
    habitName: string;
  }) => `EmojiPicker-${selectedEmoji}-${habitName}`,
}));

jest.mock('../ColorPickerSection', () => ({
  ColorPickerSection: ({
    selectedColor,
  }: {
    selectedColor: string;
  }) => `ColorPickerSection-${selectedColor}`,
}));

const MOCK_COLORS = [
  '#10B981',
  '#EF4444',
  '#3B82F6',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
] as const;

const defaultProps: AppearanceCardProps = {
  selectedEmoji: null,
  selectedColor: '#10B981',
  habitName: '',
  colors: MOCK_COLORS,
  onEmojiChange: jest.fn(),
  onColorChange: jest.fn(),
  onCustomColorPress: jest.fn(),
  isComplete: false,
};

describe('AppearanceCard Snapshots', () => {
  it('renders incomplete state correctly', () => {
    const { toJSON } = render(
      <AppearanceCard {...defaultProps} isComplete={false} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders complete state correctly', () => {
    const { toJSON } = render(
      <AppearanceCard
        {...defaultProps}
        selectedEmoji="📖"
        selectedColor="#10B981"
        isComplete={true}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with smart suggestion for reading', () => {
    const { toJSON } = render(
      <AppearanceCard {...defaultProps} habitName="Daily reading" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with smart suggestion for exercise', () => {
    const { toJSON } = render(
      <AppearanceCard {...defaultProps} habitName="Morning exercise" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with smart suggestion for meditation', () => {
    const { toJSON } = render(
      <AppearanceCard {...defaultProps} habitName="Evening meditation" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders without smart suggestion', () => {
    const { toJSON } = render(
      <AppearanceCard {...defaultProps} habitName="Random habit" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with only emoji selected', () => {
    const { toJSON } = render(
      <AppearanceCard
        {...defaultProps}
        selectedEmoji="💪"
        selectedColor=""
        isComplete={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with only color selected', () => {
    const { toJSON } = render(
      <AppearanceCard
        {...defaultProps}
        selectedEmoji={null}
        selectedColor="#EF4444"
        isComplete={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with different color', () => {
    const { toJSON } = render(
      <AppearanceCard
        {...defaultProps}
        selectedEmoji="🎯"
        selectedColor="#3B82F6"
        isComplete={true}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with long habit name and suggestion', () => {
    const { toJSON } = render(
      <AppearanceCard
        {...defaultProps}
        habitName="I want to read more books and improve my reading skills"
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with empty habit name', () => {
    const { toJSON } = render(
      <AppearanceCard {...defaultProps} habitName="" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with multiple keyword matches (first match wins)', () => {
    const { toJSON } = render(
      <AppearanceCard
        {...defaultProps}
        habitName="Read books and exercise daily"
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
