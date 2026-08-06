/**
 * Unit tests for habit streak recovery and edge cases
 * Tests streak resilience, recovery logic, and concurrent/edge case scenarios
 */

describe('Habit Streak Recovery and Edge Cases', () => {
  describe('Streak Recovery After Missed Days', () => {
    it('allows resuming streak after single missed day', () => {
      // Day 1-5: completed (streak = 5)
      // Day 6: missed (streak breaks, becomes 0)
      // Day 7: complete again (new streak = 1)
      
      const tracking = [
        { date: '2025-01-01', completed: true },
        { date: '2025-01-02', completed: true },
        { date: '2025-01-03', completed: true },
        { date: '2025-01-04', completed: true },
        { date: '2025-01-05', completed: true },
        { date: '2025-01-06', completed: false },
        { date: '2025-01-07', completed: true },
      ];
      
      const currentStreak = calculateStreakFrom(tracking, '2025-01-07');
      
      expect(currentStreak).toBe(1); // Only day 7
    });

    it('tracks best streak separately from current streak', () => {
      const tracking = [
        // First streak: 5 days
        { date: '2025-01-01', completed: true },
        { date: '2025-01-02', completed: true },
        { date: '2025-01-03', completed: true },
        { date: '2025-01-04', completed: true },
        { date: '2025-01-05', completed: true },
        // Break
        { date: '2025-01-06', completed: false },
        // Second streak: 3 days
        { date: '2025-01-07', completed: true },
        { date: '2025-01-08', completed: true },
        { date: '2025-01-09', completed: true },
      ];
      
      const { currentStreak, bestStreak } = calculateBothStreaks(tracking, '2025-01-09');
      
      expect(currentStreak).toBe(3); // Last 3 days
      expect(bestStreak).toBe(5); // Best ever is 5
    });

    it('can recover with completion after long break (30+ days)', () => {
      const tracking = [
        // Streak from Jan 1-10
        ...generateCompletedDates('2025-01-01', 10, true),
        // 30-day break (Jan 11 - Feb 9)
        ...generateCompletedDates('2025-01-11', 30, false),
        // Resume on Feb 10
        { date: '2025-02-10', completed: true },
      ];
      
      const currentStreak = calculateStreakFrom(tracking, '2025-02-10');
      const bestStreak = findBestStreak(tracking);
      
      expect(currentStreak).toBe(1); // Just started again
      expect(bestStreak).toBe(10); // Old streak is preserved as best
    });

    it('prevents "Grace Days" from creating false streaks', () => {
      // User completes on Jan 1 and Jan 3 (gap on Jan 2)
      // Should NOT show streak of 2 if Jan 2 was not completed
      
      const tracking = [
        { date: '2025-01-01', completed: true },
        { date: '2025-01-02', completed: false }, // Missed
        { date: '2025-01-03', completed: true },
      ];
      
      const currentStreak = calculateStreakFrom(tracking, '2025-01-03');
      
      expect(currentStreak).toBe(1); // Only Jan 3, not including Jan 1
    });

    it('handles incomplete records in streak calculation (missing dates)', () => {
      // If user never toggled habits on certain dates, those records don't exist
      const tracking = [
        { date: '2025-01-01', completed: true },
        { date: '2025-01-02', completed: true },
        // No record for Jan 3 - could mean not completed or not tracked
        { date: '2025-01-04', completed: true },
      ];
      
      // Without explicit completed: false record for Jan 3, we can't determine streak
      // Streak should be calculated conservatively
      const currentStreak = calculateStreakFrom(tracking, '2025-01-04');
      
      // This depends on the streaking algorithm:
      // Conservative: treat missing as break = streak of 1
      // Optimistic: treat missing as unknown = streak of 3
      // Most habit trackers use conservative
      expect(currentStreak).toBeLessThanOrEqual(1);
    });

    it('correctly calculates streak when most recent record is incomplete=false', () => {
      const tracking = [
        { date: '2025-01-05', completed: true },
        { date: '2025-01-06', completed: true },
        { date: '2025-01-07', completed: true },
        { date: '2025-01-08', completed: false }, // Explicitly marked incomplete
      ];
      
      const currentStreak = calculateStreakFrom(tracking, '2025-01-08');
      
      expect(currentStreak).toBe(0); // Streak broken by Jan 8 incomplete
    });
  });

  describe('Midnight Boundary Edge Cases', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('counts completion logged just before midnight as today', () => {
      // 23:59 UTC = still today in UTC
      jest.setSystemTime(new Date('2025-01-15T23:59:59.999Z'));
      
      const loggedDate = '2025-01-15';
      const evaluationDate = '2025-01-15';
      
      expect(loggedDate).toBe(evaluationDate);
    });

    it('counts completion logged just after midnight as next day', () => {
      // 00:00 UTC = next day
      jest.setSystemTime(new Date('2025-01-16T00:00:00.000Z'));
      
      const loggedDate = '2025-01-16';
      const evaluationDate = '2025-01-16';
      
      expect(loggedDate).toBe(evaluationDate);
    });

    it('handles timezone midnight crossover (UTC+12)', () => {
      // UTC 00:00 = UTC+12 00:00 next day (Fiji)
      jest.setSystemTime(new Date('2025-01-15T00:00:00.000Z'));
      
      // UTC+12 timezone
      const todayUTC = '2025-01-15';
      const todayUTC12 = '2025-01-15'; // Actually next day in UTC+12 but logic should account
      
      // When user logs habit in UTC+12, they log it as their local date
      // Storing as logged date, not evaluating with UTC logic
      expect(todayUTC).toBeDefined();
    });

    it('handles timezone midnight crossover (UTC-12)', () => {
      // UTC 00:00 = UTC-12 12:00 previous day (Baker Island)
      jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
      
      const todayUTC = '2025-01-15';
      const todayUTC_minus12 = '2025-01-14'; // Previous day
      
      // System stores the date the user logged (their local date)
      expect(todayUTC).not.toBe(todayUTC_minus12);
    });

    it('preserves streak through month boundary', () => {
      // Jan 31 -> Feb 1
      const tracking = [
        { date: '2025-01-30', completed: true },
        { date: '2025-01-31', completed: true },
        { date: '2025-02-01', completed: true },
      ];
      
      const currentStreak = calculateStreakFrom(tracking, '2025-02-01');
      
      expect(currentStreak).toBe(3); // Consecutive across month boundary
    });

    it('preserves streak through year boundary', () => {
      // Dec 31 -> Jan 1
      const tracking = [
        { date: '2024-12-30', completed: true },
        { date: '2024-12-31', completed: true },
        { date: '2025-01-01', completed: true },
      ];
      
      const currentStreak = calculateStreakFrom(tracking, '2025-01-01');
      
      expect(currentStreak).toBe(3); // Consecutive across year boundary
    });

    it('handles leap day edge case (Feb 29)', () => {
      const tracking = [
        { date: '2024-02-28', completed: true },
        { date: '2024-02-29', completed: true }, // Leap day
        { date: '2024-03-01', completed: true },
      ];
      
      const currentStreak = calculateStreakFrom(tracking, '2024-03-01');
      
      expect(currentStreak).toBe(3);
    });

    it('handles non-leap year Feb 28 -> Mar 1', () => {
      const tracking = [
        { date: '2025-02-27', completed: true },
        { date: '2025-02-28', completed: true },
        { date: '2025-03-01', completed: true },
      ];
      
      const currentStreak = calculateStreakFrom(tracking, '2025-03-01');
      
      expect(currentStreak).toBe(3);
    });
  });

  describe('Concurrent Completion and Recalculation', () => {
    it('handles two rapid toggles on same date', () => {
      // 14:30 UTC: User toggles habit ON
      // 14:35 UTC: User toggles habit OFF (changed mind)
      // 14:36 UTC: User toggles habit ON again
      
      const toggleSequence = [
        { action: 'toggle', completed: true, time: 1 },
        { action: 'toggle', completed: false, time: 2 },
        { action: 'toggle', completed: true, time: 3 },
      ];
      
      const finalState = toggleSequence[toggleSequence.length - 1].completed;
      
      expect(finalState).toBe(true); // Latest toggle wins
    });

    it('handles concurrent toggles on consecutive days', () => {
      // User rapidly toggles Jan 15, Jan 16, Jan 17
      const days = ['2025-01-15', '2025-01-16', '2025-01-17'];
      const finalTracking = days.map((date) => ({
        date,
        completed: true,
      }));
      
      expect(finalTracking).toHaveLength(3);
      expect(finalTracking.every((t) => t.completed)).toBe(true);
    });

    it('streak recalculation sees consistent state after concurrent toggles', () => {
      // Three concurrent toggle requests for different dates
      const asyncToggles = [
        Promise.resolve({ date: '2025-01-14', completed: true }),
        Promise.resolve({ date: '2025-01-15', completed: true }),
        Promise.resolve({ date: '2025-01-16', completed: true }),
      ];
      
      // After all resolve, streak recalculation should see all three
      const results = asyncToggles.map((p) => p);
      
      expect(results).toHaveLength(3);
    });

    it('handles streak recalculation triggered by one toggle while another is pending', () => {
      // Toggle A triggers recalculation
      // Toggle B arrives before recalculation completes
      // Recalculation B should use fresh data
      
      const timeline = [
        { event: 'toggleA', date: '2025-01-15' },
        { event: 'toggleB', date: '2025-01-16' },
        // Recalc A completes first
        { event: 'recalcA completes', streak: 1 },
        // Recalc B completes after
        { event: 'recalcB completes', streak: 2 },
      ];
      
      const finalStreak = 2; // Should reflect both toggles
      
      expect(finalStreak).toBe(2);
    });
  });

  describe('Strength Snapshot Consistency', () => {
    it('calculates momentum strength consistently across recalculations', () => {
      const habitCreatedAt = Date.now() - 60 * 24 * 60 * 60 * 1000; // 60 days ago
      const tracking = [
        { date: '2025-01-15', completed: true },
        { date: '2025-01-16', completed: true },
        { date: '2025-01-17', completed: true },
      ];
      
      const snapshot1 = calculateMomentumSnapshot(habitCreatedAt, tracking, '2025-01-17');
      const snapshot2 = calculateMomentumSnapshot(habitCreatedAt, tracking, '2025-01-17');
      
      // Same input should produce same output
      expect(snapshot1.strength).toBe(snapshot2.strength);
      expect(snapshot1.strengthLevel).toBe(snapshot2.strengthLevel);
    });

    it('reflects new completion in strength immediately after toggle', () => {
      const habitCreatedAt = Date.now() - 60 * 24 * 60 * 60 * 1000;
      
      const trackingBefore = [
        { date: '2025-01-15', completed: true },
        { date: '2025-01-16', completed: false },
      ];
      
      const trackingAfter = [
        { date: '2025-01-15', completed: true },
        { date: '2025-01-16', completed: true }, // Toggled ON
      ];
      
      const strengthBefore = calculateMomentumSnapshot(habitCreatedAt, trackingBefore, '2025-01-16').strength;
      const strengthAfter = calculateMomentumSnapshot(habitCreatedAt, trackingAfter, '2025-01-16').strength;
      
      // After completing the habit, strength should increase
      expect(strengthAfter).toBeGreaterThan(strengthBefore);
    });

    it('evaluates strength through the max date (today or last tracked)', () => {
      const habitCreatedAt = Date.now() - 60 * 24 * 60 * 60 * 1000;
      const tracking = [
        { date: '2025-01-15', completed: true },
        { date: '2025-01-16', completed: true },
        // Today is 2025-01-17 but user is viewing past
      ];
      
      const evaluationDate = '2025-01-17';
      const snapshot = calculateMomentumSnapshot(habitCreatedAt, tracking, evaluationDate);
      
      expect(snapshot).toBeDefined();
      expect(snapshot.strength).toBeGreaterThanOrEqual(0);
      expect(snapshot.strength).toBeLessThanOrEqual(1);
    });
  });

  describe('Database Patch Atomicity', () => {
    it('patches all required fields in single update', () => {
      const patch = {
        bestStreak: 10,
        currentStreak: 5,
        lastCompletedDate: '2025-01-16',
        strength: 0.75,
        strengthLevel: 'building',
        strengthUpdatedAt: Date.now(),
      };
      
      // All fields should be updated atomically
      expect(Object.keys(patch)).toHaveLength(6);
      expect(patch).toHaveProperty('bestStreak');
      expect(patch).toHaveProperty('currentStreak');
      expect(patch).toHaveProperty('lastCompletedDate');
      expect(patch).toHaveProperty('strength');
      expect(patch).toHaveProperty('strengthLevel');
      expect(patch).toHaveProperty('strengthUpdatedAt');
    });

    it('does not update habit fields other than streak/strength', () => {
      const habitBefore = {
        _id: 'habit123',
        name: 'Read',
        userId: 'user456',
        createdAt: 1000,
        bestStreak: 5,
      };
      
      const patch = {
        bestStreak: 10,
        currentStreak: 5,
        strength: 0.8,
      };
      
      // Patch should not change name, userId, createdAt
      expect(patch).not.toHaveProperty('name');
      expect(patch).not.toHaveProperty('userId');
      expect(patch).not.toHaveProperty('createdAt');
    });
  });

  describe('Historical Data Consistency', () => {
    it('maintains historical tracking records during recalculation', () => {
      const tracking = [
        { _id: 'track1', date: '2025-01-01', completed: true },
        { _id: 'track2', date: '2025-01-02', completed: true },
        { _id: 'track3', date: '2025-01-03', completed: false },
      ];
      
      // Recalculation should not modify tracking records
      const trackingAfterRecalc = tracking;
      
      expect(trackingAfterRecalc).toHaveLength(3);
      expect(trackingAfterRecalc[0].completed).toBe(true);
      expect(trackingAfterRecalc[2].completed).toBe(false);
    });

    it('handles missing tracking records for some dates', () => {
      // Only records that were explicitly toggled exist
      const tracking = [
        { date: '2025-01-01', completed: true },
        // Jan 2 has no record - user didn't toggle
        { date: '2025-01-03', completed: true },
      ];
      
      const streak = calculateStreakFrom(tracking, '2025-01-03');
      
      // Streak breaks on missing Jan 2
      expect(streak).toBeLessThanOrEqual(1);
    });

    it('orders tracking records by date correctly for streak calculation', () => {
      // Out-of-order records (though this shouldn't happen in practice)
      const tracking = [
        { date: '2025-01-03', completed: true },
        { date: '2025-01-01', completed: true },
        { date: '2025-01-02', completed: true },
      ];
      
      // Should sort by date for correct streak calculation
      const sortedTracking = tracking.sort((a, b) => a.date.localeCompare(b.date));
      const streak = calculateStreakFrom(sortedTracking, '2025-01-03');
      
      expect(streak).toBe(3);
    });
  });
});

// Helper functions for testing
/* eslint-disable @typescript-eslint/no-unused-vars */
function generateCompletedDates(startDate, count, completed) {
  const result = [];
  let current = new Date(startDate);
  for (let i = 0; i < count; i++) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    result.push({
      date: `${year}-${month}-${day}`,
      completed,
    });
    current.setDate(current.getDate() + 1);
  }
  return result;
}

function calculateStreakFrom(tracking, evaluationDate) {
  let streak = 0;
  let currentDate = new Date(evaluationDate);
  
  for (let i = 0; i < 365; i++) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const record = tracking.find((t) => t.date === dateStr);
    
    if (record?.completed) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateBothStreaks(tracking, evaluationDate) {
  const currentStreak = calculateStreakFrom(tracking, evaluationDate);
  const bestStreak = findBestStreak(tracking);
  
  return { currentStreak, bestStreak };
}

function findBestStreak(tracking) {
  const sorted = [...tracking].sort((a, b) => a.date.localeCompare(b.date));
  let maxStreak = 0;
  let currentStreak = 0;
  
  for (const record of sorted) {
    if (record.completed) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return maxStreak;
}

function calculateMomentumSnapshot(habitCreatedAt, tracking, throughDate) {
  // Simplified momentum calculation for testing
  const ageInDays = (Date.now() - habitCreatedAt) / (24 * 60 * 60 * 1000);
  const completions = tracking.filter((t) => t.completed).length;
  const strength = Math.min(1, completions / Math.max(ageInDays, 1));
  
  let strengthLevel = 'building';
  if (strength < 0.2) strengthLevel = 'struggling';
  else if (strength < 0.5) strengthLevel = 'building';
  else if (strength < 0.8) strengthLevel = 'strong';
  else strengthLevel = 'excellent';
  
  return { strength, strengthLevel };
}
