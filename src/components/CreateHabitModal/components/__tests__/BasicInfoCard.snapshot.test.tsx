/**
 * BasicInfoCard Component Snapshot Tests
 * Visual regression tests for Cards V1 Improved Spec - Task 4
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { BasicInfoCard } from '../BasicInfoCard';

describe('BasicInfoCard Snapshots', () => {
  const mockOnChange = jest.fn();

  describe('Empty State', () => {
    it('should match snapshot when habitName is empty', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Incomplete State', () => {
    it('should match snapshot with incomplete state', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Complete State', () => {
    it('should match snapshot with complete state and short habitName', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName="Read"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with complete state and medium habitName', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName="Exercise for 30 minutes"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with complete state and long habitName', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName="Read a book for at least 20 minutes every day"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Character Counter Display', () => {
    it('should match snapshot when character counter is not displayed (empty)', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot when character counter is displayed', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName="Meditate"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Auto Focus', () => {
    it('should match snapshot with autoFocus enabled', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
          autoFocus={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with autoFocus disabled', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
          autoFocus={false}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Special Characters', () => {
    it('should match snapshot with emoji in habitName', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName="Read 📖 daily"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with special characters in habitName', () => {
      const { toJSON } = render(
        <BasicInfoCard
          habitName="Wake up @ 6:00 AM!"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
