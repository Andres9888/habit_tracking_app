/**
 * AccountabilityCard Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

// Mock convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(() => jest.fn()),
}));

jest.mock('../../../theme', () => ({
  useThemeColors: () => ({
    colors: {
      card: '#FFFFFF',
      gray: { 200: '#DDD8D2' },
      text: { primary: '#2D2A26', secondary: '#6B6560', tertiary: '#6E6660' },
      border: '#DDD8D2',
      primary: { 700: '#047857' },
    },
    isDark: false,
  }),
}));

import { useQuery } from 'convex/react';
import { AccountabilityCard } from '../AccountabilityCard';

const mockUseQuery = useQuery as jest.Mock;

describe('AccountabilityCard', () => {
  const defaultProps = {
    habitId: 'habit123' as any,
    completedToday: false,
    onInvitePartner: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuery.mockReturnValue(null);
  });

  it('renders invite prompt when no partnership exists', () => {
    render(<AccountabilityCard {...defaultProps} />);
    expect(screen.getByText('Get an Accountability Partner')).toBeTruthy();
    expect(screen.getByLabelText('Invite a partner')).toBeTruthy();
  });

  it('renders partner info when partnership is active', () => {
    mockUseQuery
      .mockReturnValueOnce({
        _id: 'p1',
        status: 'active',
        partnerName: 'Alex',
        role: 'inviter',
      })
      .mockReturnValueOnce({
        currentStreak: 7,
        completedToday: false,
        strength: 0.45,
        strengthLevel: 'building',
        habitName: 'Meditate',
      });

    render(<AccountabilityCard {...defaultProps} />);
    expect(screen.getByText('Alex')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
  });

  it('shows celebration when both complete', () => {
    mockUseQuery
      .mockReturnValueOnce({
        _id: 'p1',
        status: 'active',
        partnerName: 'Alex',
        role: 'inviter',
      })
      .mockReturnValueOnce({
        currentStreak: 7,
        completedToday: true,
        strength: 0.6,
        strengthLevel: 'developing',
        habitName: 'Meditate',
      });

    render(<AccountabilityCard {...defaultProps} completedToday={true} />);
    expect(screen.getByText('🎉 You both crushed it today!')).toBeTruthy();
  });
});
