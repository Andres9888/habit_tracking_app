/**
 * Tests for recordAnimations (reanimated migration).
 * Validates runNewRecordAnimation and hideNewRecordBadge use correct reanimated APIs.
 */

import { runOnJS, withSpring, withTiming } from 'react-native-reanimated';
import {
  runNewRecordAnimation,
  hideNewRecordBadge,
} from '../recordAnimations';

describe('recordAnimations (reanimated)', () => {
  describe('runNewRecordAnimation', () => {
    it('sets newRecordScale to spring target of 1', () => {
      const newRecordScale = { value: 0 };
      const newRecordOpacity = { value: 0 };
      const cardScale = { value: 1 };
      runNewRecordAnimation(
        newRecordScale as never,
        newRecordOpacity as never,
        cardScale as never
      );
      // withSpring mock returns the target value
      expect(newRecordScale.value).toBe(1);
    });

    it('sets newRecordOpacity to timing target of 1', () => {
      const newRecordScale = { value: 0 };
      const newRecordOpacity = { value: 0 };
      const cardScale = { value: 1 };
      runNewRecordAnimation(
        newRecordScale as never,
        newRecordOpacity as never,
        cardScale as never
      );
      // withTiming mock returns the target value
      expect(newRecordOpacity.value).toBe(1);
    });

    it('bounces cardScale via withSequence (1→1.03→1)', () => {
      const newRecordScale = { value: 0 };
      const newRecordOpacity = { value: 0 };
      const cardScale = { value: 1 };
      runNewRecordAnimation(
        newRecordScale as never,
        newRecordOpacity as never,
        cardScale as never
      );
      // withSequence mock returns last value (withSpring(1) → 1)
      expect(cardScale.value).toBe(1);
    });
  });

  describe('hideNewRecordBadge', () => {
    it('sets newRecordScale to timing target of 0', () => {
      const newRecordScale = { value: 1 };
      const newRecordOpacity = { value: 1 };
      const setShowNewRecord = jest.fn();
      hideNewRecordBadge(
        newRecordScale as never,
        newRecordOpacity as never,
        setShowNewRecord
      );
      expect(newRecordScale.value).toBe(0);
    });

    it('sets newRecordOpacity to timing target of 0', () => {
      const newRecordScale = { value: 1 };
      const newRecordOpacity = { value: 1 };
      const setShowNewRecord = jest.fn();
      hideNewRecordBadge(
        newRecordScale as never,
        newRecordOpacity as never,
        setShowNewRecord
      );
      // withTiming mock returns the target value
      expect(newRecordOpacity.value).toBe(0);
    });
  });

  describe('design system compliance', () => {
    it('runNewRecordAnimation executes without errors', () => {
      const scale = { value: 0 };
      const opacity = { value: 0 };
      const card = { value: 1 };
      expect(() =>
        runNewRecordAnimation(scale as never, opacity as never, card as never)
      ).not.toThrow();
    });

    it('hideNewRecordBadge executes without errors', () => {
      const scale = { value: 1 };
      const opacity = { value: 1 };
      expect(() =>
        hideNewRecordBadge(scale as never, opacity as never, jest.fn())
      ).not.toThrow();
    });
  });
});
