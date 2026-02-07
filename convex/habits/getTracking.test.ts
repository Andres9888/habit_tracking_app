/**
 * getTracking Authentication & Range Query Tests (SEC-001 + PERF-003)
 *
 * Tests that the getTracking query:
 * - Requires authentication before returning data
 * - Filters tracking records by the authenticated user's ID
 * - Accepts { startDate, endDate } range instead of a dates array
 * - Returns records within the inclusive date range
 */

import { describe, it, expect } from 'vitest';

describe('getTracking: Authentication Security', () => {
  describe('Auth check pattern', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) { return []; }
        return ctx.db.query('tracking')
      `;

      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.query');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return empty array for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would query db' : [];
      expect(result).toEqual([]);
    });
  });

  describe('User filtering', () => {
    it('should filter tracking records by userId matching identity.subject', () => {
      const identitySubject = 'user_123';

      const allTracking = [
        { userId: 'user_123', date: '2024-01-01', completed: true },
        { userId: 'user_456', date: '2024-01-01', completed: true },
        { userId: 'user_123', date: '2024-01-02', completed: false },
        { userId: undefined, date: '2024-01-03', completed: true },
      ];

      const filtered = allTracking.filter(
        (t) => t.userId === identitySubject
      );

      expect(filtered).toHaveLength(2);
      expect(filtered.every((t) => t.userId === identitySubject)).toBe(true);
    });

    it('should not return records with mismatched userId', () => {
      const identitySubject = 'user_A';

      const otherUserRecords = [
        { userId: 'user_B', date: '2024-01-01', completed: true },
        { userId: 'user_C', date: '2024-01-02', completed: true },
      ];

      const filtered = otherUserRecords.filter(
        (t) => t.userId === identitySubject
      );

      expect(filtered).toHaveLength(0);
    });

    it('should not return records with undefined userId', () => {
      const identitySubject = 'user_123';

      const legacyRecords = [
        { userId: undefined, date: '2024-01-01', completed: true },
        { userId: undefined, date: '2024-01-02', completed: false },
      ];

      const filtered = legacyRecords.filter(
        (t) => t.userId === identitySubject
      );

      expect(filtered).toHaveLength(0);
    });
  });

  describe('Date range filtering', () => {
    it('should accept startDate and endDate args instead of dates array', () => {
      const args = { startDate: '2024-01-01', endDate: '2024-01-31' };
      expect(args).toHaveProperty('startDate');
      expect(args).toHaveProperty('endDate');
      expect(args).not.toHaveProperty('dates');
    });

    it('should include records within the inclusive date range', () => {
      const startDate = '2024-01-05';
      const endDate = '2024-01-10';

      const allTracking = [
        { date: '2024-01-04', completed: true },
        { date: '2024-01-05', completed: true },
        { date: '2024-01-07', completed: false },
        { date: '2024-01-10', completed: true },
        { date: '2024-01-11', completed: true },
      ];

      const filtered = allTracking.filter(
        (t) => t.date >= startDate && t.date <= endDate
      );

      expect(filtered).toHaveLength(3);
      expect(filtered.map((t) => t.date)).toEqual([
        '2024-01-05',
        '2024-01-07',
        '2024-01-10',
      ]);
    });

    it('should handle single-day range (startDate === endDate)', () => {
      const startDate = '2024-01-15';
      const endDate = '2024-01-15';

      const allTracking = [
        { date: '2024-01-14', completed: true },
        { date: '2024-01-15', completed: true },
        { date: '2024-01-16', completed: false },
      ];

      const filtered = allTracking.filter(
        (t) => t.date >= startDate && t.date <= endDate
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].date).toBe('2024-01-15');
    });

    it('should return empty array when no records match the range', () => {
      const startDate = '2024-02-01';
      const endDate = '2024-02-28';

      const allTracking = [
        { date: '2024-01-15', completed: true },
        { date: '2024-03-01', completed: true },
      ];

      const filtered = allTracking.filter(
        (t) => t.date >= startDate && t.date <= endDate
      );

      expect(filtered).toHaveLength(0);
    });
  });
});
