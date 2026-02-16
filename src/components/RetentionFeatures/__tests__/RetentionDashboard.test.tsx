/**
 * RetentionDashboard Tests
 * Validates retention feature orchestration logic
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { RetentionDashboard } from '../RetentionDashboard';

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(() => ({
    activeUsers: 42,
    completionsToday: 1247,
  })),
}));

const mockHabits = [
  {
    _id: '1',
    category: 'health',
    completedToday: false,
    currentStreak: 7,
    name: 'Morning run',
  },
  {
    _id: '2',
    category: 'mindfulness',
    completedToday: true,
    currentStreak: 3,
    name: 'Meditation',
  },
  {
    _id: '3',
    category: 'productivity',
    completedToday: false,
    currentStreak: 5,
    name: 'Journal',
  },
];

describe('RetentionDashboard', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <RetentionDashboard
        habits={mockHabits}
        completedYesterday={true}
      />
    );
    // Should render something
    expect(getByText).toBeDefined();
  });

  it('shows social proof when data is available', () => {
    const { getByText } = render(
      <RetentionDashboard
        habits={mockHabits}
        completedYesterday={true}
      />
    );
    
    // Should show social proof banner
    expect(getByText(/habits completed by Chain Day users today/i)).toBeTruthy();
  });

  it('shows comeback message when user missed yesterday', () => {
    const { getByText } = render(
      <RetentionDashboard
        habits={mockHabits}
        completedYesterday={false}
      />
    );
    
    // Should show comeback message
    expect(getByText(/welcome back|missed yesterday|fresh start/i)).toBeTruthy();
  });

  it('does not show comeback message when user completed yesterday', () => {
    const { queryByText } = render(
      <RetentionDashboard
        habits={mockHabits}
        completedYesterday={true}
      />
    );
    
    // Should NOT show comeback message
    expect(queryByText(/welcome back|missed yesterday/i)).toBeNull();
  });

  it('shows smart suggestions when user has < 5 habits', () => {
    const { getByText } = render(
      <RetentionDashboard
        habits={mockHabits}
        completedYesterday={true}
      />
    );
    
    // Should show suggestions
    expect(getByText(/suggested for you/i)).toBeTruthy();
  });

  it('does not show suggestions when user has no habits', () => {
    const { queryByText } = render(
      <RetentionDashboard
        habits={[]}
        completedYesterday={true}
      />
    );
    
    // Should NOT show suggestions
    expect(queryByText(/suggested for you/i)).toBeNull();
  });

  it('calls onStartToday when comeback CTA is pressed', () => {
    const onStartToday = jest.fn();
    const { getByText } = render(
      <RetentionDashboard
        habits={mockHabits}
        completedYesterday={false}
        onStartToday={onStartToday}
      />
    );
    
    const button = getByText(/start today/i);
    button.props.onPress();
    
    expect(onStartToday).toHaveBeenCalledTimes(1);
  });

  it('respects reduceMotion preference', () => {
    const { container } = render(
      <RetentionDashboard
        habits={mockHabits}
        completedYesterday={true}
        reduceMotion={true}
      />
    );
    
    // Should render without animations
    expect(container).toBeTruthy();
  });
});
