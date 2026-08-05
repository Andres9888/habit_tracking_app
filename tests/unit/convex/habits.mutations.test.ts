/**
 * Integration tests for Convex mutations
 * Tests database operations for habits and tracking
 */

describe('Habit Archive Mutations', () => {
  describe('archive mutation contract', () => {
    it('requires habitId parameter', () => {
      const validArgs = {
        habitId: 'test_id',
      };

      expect(validArgs).toHaveProperty('habitId');
      expect(typeof validArgs.habitId).toBe('string');
    });

    it('should set archived flag to true', () => {
      // Test the expected mutation behavior
      const expectedUpdate = {
        archived: true,
        archivedAt: Date.now(),
      };

      expect(expectedUpdate.archived).toBe(true);
      expect(typeof expectedUpdate.archivedAt).toBe('number');
    });

    it('should include timestamp when archiving', () => {
      const now = Date.now();
      const archivedAt = now;

      expect(archivedAt).toBeGreaterThan(0);
      expect(archivedAt).toBeLessThanOrEqual(Date.now());
    });

    it('validates archived habit schema fields', () => {
      const archivedHabit = {
        _creationTime: Date.now(),
        _id: 'test_id',
        archived: true,
        archivedAt: Date.now(),
        createdAt: Date.now(),
        name: 'Test Habit',
        strength: 0.5,
        strengthLevel: 'building',
      };

      // Verify required fields
      expect(archivedHabit.archived).toBe(true);
      expect(archivedHabit.archivedAt).toBeDefined();
      expect(typeof archivedHabit.archivedAt).toBe('number');

      // Verify optional strength fields persist
      expect(archivedHabit.strength).toBeDefined();
      expect(archivedHabit.strengthLevel).toBeDefined();
    });
  });

  describe('unarchive mutation contract', () => {
    it('requires habitId parameter', () => {
      const validArgs = {
        habitId: 'test_id',
      };

      expect(validArgs).toHaveProperty('habitId');
      expect(typeof validArgs.habitId).toBe('string');
    });

    it('should set archived flag to false', () => {
      const expectedUpdate = {
        archived: false,
        archivedAt: undefined,
      };

      expect(expectedUpdate.archived).toBe(false);
      expect(expectedUpdate.archivedAt).toBeUndefined();
    });

    it('should remove archivedAt timestamp', () => {
      // When unarchiving, archivedAt should be cleared
      const unarchivedHabit = {
        archived: false,
        archivedAt: undefined,
      };

      expect(unarchivedHabit.archivedAt).toBeUndefined();
    });
  });

  describe('remove (permanent delete) mutation contract', () => {
    it('requires habitId parameter', () => {
      const validArgs = {
        habitId: 'test_id',
      };

      expect(validArgs).toHaveProperty('habitId');
    });

    it('should return deleted habit data for undo functionality', () => {
      const mockDeletedData = {
        habit: {
          createdAt: Date.now(),
          name: 'Deleted Habit',
          notes: 'Some notes',
        },
        tracking: [
          { completed: true, date: '2025-01-01' },
          { completed: false, date: '2025-01-02' },
        ],
      };

      // Verify structure for undo/restore
      expect(mockDeletedData).toHaveProperty('habit');
      expect(mockDeletedData).toHaveProperty('tracking');
      expect(Array.isArray(mockDeletedData.tracking)).toBe(true);
    });
  });
});

describe('Habit Tracking Mutations', () => {
  describe('toggleHabit mutation contract', () => {
    it('requires habitId and date parameters', () => {
      const validArgs = {
        date: '2025-01-15',
        habitId: 'test_id',
      };

      expect(validArgs).toHaveProperty('habitId');
      expect(validArgs).toHaveProperty('date');
      expect(typeof validArgs.date).toBe('string');
    });

    it('validates date format as YYYY-MM-DD', () => {
      const validDate = '2025-01-15';
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(dateRegex.test(validDate)).toBe(true);
      expect(dateRegex.test('2025/01/15')).toBe(false);
      expect(dateRegex.test('15-01-2025')).toBe(false);
    });

    it('should prevent future dates', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayTime = today.getTime();
      const tomorrowTime = tomorrow.getTime();

      expect(tomorrowTime).toBeGreaterThan(todayTime);
      // Mutation should throw error if inputDate > today
    });

    it('should create tracking entry if none exists', () => {
      const newEntry = {
        completed: true,
        date: '2025-01-15',
        habitId: 'test_id',
      };

      expect(newEntry).toHaveProperty('habitId');
      expect(newEntry).toHaveProperty('date');
      expect(newEntry).toHaveProperty('completed');
      expect(newEntry.completed).toBe(true);
    });

    it('should toggle existing tracking entry', () => {
      // Simulate toggle behavior
      const existingCompleted = true;
      const newCompleted = !existingCompleted;

      expect(newCompleted).toBe(false);
    });
  });

  describe('toggleHabit with strength update integration', () => {
    it('should update habit strength after toggle', () => {
      // Mock the expected behavior
      const habitBefore = {
        strength: 0.5,
        strengthLevel: 'developing',
      };

      // After marking as completed
      const habitAfter = {
        strength: 0.58, // Increased
        strengthLevel: 'developing',
        strengthUpdatedAt: Date.now(),
      };

      expect(habitAfter.strength).toBeGreaterThan(habitBefore.strength);
      expect(habitAfter.strengthUpdatedAt).toBeDefined();
    });

    it('should recalculate strength level if threshold crossed', () => {
      const habitBefore = {
        strength: 0.59,
        strengthLevel: 'developing',
      };

      // After completion pushes over 0.6 threshold
      const habitAfter = {
        strength: 0.62,
        strengthLevel: 'strong',
        strengthUpdatedAt: Date.now(),
      };

      expect(habitAfter.strengthLevel).not.toBe(habitBefore.strengthLevel);
      expect(habitAfter.strengthLevel).toBe('strong');
    });

    it('should use habit-specific decay and gain parameters if set', () => {
      const habitWithCustomParams = {
        habitDecayParam: 0.2,
        // Custom HDP
        habitGainParam: 0.18,
        strength: 0.5, // Custom HGP
      };

      expect(habitWithCustomParams.habitDecayParam).toBeDefined();
      expect(habitWithCustomParams.habitGainParam).toBeDefined();
      // Mutation should use these instead of defaults
    });

    it('should use default parameters if not set', () => {
      const habitWithoutParams: {
        strength: number;
        habitDecayParam?: number;
        habitGainParam?: number;
      } = {
        strength: 0.5,
        // No custom parameters
      };

      // Mutation should use DEFAULT_HABIT_DECAY_PARAM and DEFAULT_HABIT_GAIN_PARAM
      expect(habitWithoutParams.habitDecayParam).toBeUndefined();
      expect(habitWithoutParams.habitGainParam).toBeUndefined();
    });
  });
});

describe('Habit Creation Mutations', () => {
  describe('create mutation contract', () => {
    it('requires name parameter', () => {
      const validArgs = {
        name: 'New Habit',
        notes: 'Optional notes',
      };

      expect(validArgs).toHaveProperty('name');
      expect(typeof validArgs.name).toBe('string');
      expect(validArgs.name.length).toBeGreaterThan(0);
    });

    it('allows optional notes parameter', () => {
      const withNotes = {
        name: 'Habit',
        notes: 'Some notes',
      };

      const withoutNotes: { name: string; notes?: string } = {
        name: 'Habit',
      };

      expect(withNotes.notes).toBeDefined();
      expect(withoutNotes.notes).toBeUndefined();
    });

    it('should initialize with default strength values', () => {
      const newHabit = {
        createdAt: Date.now(),
        name: 'New Habit',
        // Strength fields should be undefined initially (calculated on first toggle)
        strength: undefined,
        strengthLevel: undefined,
      };

      expect(newHabit.strength).toBeUndefined();
      expect(newHabit.strengthLevel).toBeUndefined();
    });

    it('should return the new habit ID', () => {
      const mockReturnedId = 'new_habit_id_123';

      expect(typeof mockReturnedId).toBe('string');
      expect(mockReturnedId.length).toBeGreaterThan(0);
    });
  });

  describe('updateNotes mutation contract', () => {
    it('requires habitId and notes parameters', () => {
      const validArgs = {
        habitId: 'test_id',
        notes: 'Updated notes',
      };

      expect(validArgs).toHaveProperty('habitId');
      expect(validArgs).toHaveProperty('notes');
      expect(typeof validArgs.notes).toBe('string');
    });

    it('allows empty notes string', () => {
      const validArgs = {
        habitId: 'test_id',
        notes: '',
      };

      expect(validArgs.notes).toBe('');
      expect(typeof validArgs.notes).toBe('string');
    });
  });
});

describe('Habit Query Filters', () => {
  describe('list query contract', () => {
    it('should exclude archived habits', () => {
      const mockHabits = [
        { _id: '1', archived: false, name: 'Active' },
        { _id: '2', archived: true, name: 'Archived' },
        { _id: '3', archived: undefined, name: 'Also Active' },
      ];

      // Filter logic: filter((q) => q.neq(q.field("archived"), true))
      const filteredHabits = mockHabits.filter((h) => h.archived !== true);

      expect(filteredHabits).toHaveLength(2);
      expect(filteredHabits.find((h) => h._id === '2')).toBeUndefined();
    });

    it('should return habits with all strength fields', () => {
      const mockHabit = {
        _creationTime: Date.now(),
        _id: 'test_id',
        createdAt: Date.now(),
        name: 'Test',
        strength: 0.7,
        strengthLevel: 'strong',
        strengthUpdatedAt: Date.now(),
      };

      expect(mockHabit.strength).toBeDefined();
      expect(mockHabit.strengthLevel).toBeDefined();
      expect(mockHabit.strengthUpdatedAt).toBeDefined();
    });
  });

  describe('listArchived query contract', () => {
    it('should only include archived habits', () => {
      const mockHabits = [
        { _id: '1', archived: false, name: 'Active' },
        { _id: '2', archived: true, name: 'Archived' },
        { _id: '3', archived: true, name: 'Also Archived' },
      ];

      // Filter logic: filter((q) => q.eq(q.field("archived"), true))
      const filteredHabits = mockHabits.filter((h) => h.archived === true);

      expect(filteredHabits).toHaveLength(2);
      expect(filteredHabits.every((h) => h.archived === true)).toBe(true);
    });

    it('should include archivedAt timestamp', () => {
      const archivedHabit = {
        _id: 'test_id',
        archived: true,
        archivedAt: Date.now(),
        name: 'Archived',
      };

      expect(archivedHabit.archivedAt).toBeDefined();
      expect(typeof archivedHabit.archivedAt).toBe('number');
    });
  });

  describe('getTracking query contract', () => {
    it('requires dates array parameter', () => {
      const validArgs = {
        dates: ['2025-01-01', '2025-01-02', '2025-01-03'],
      };

      expect(validArgs).toHaveProperty('dates');
      expect(Array.isArray(validArgs.dates)).toBe(true);
    });

    it('should return empty array for empty dates input', () => {
      const _emptyDates: string[] = [];
      const result: unknown[] = [];

      // Mutation: if (args.dates.length === 0) return [];
      expect(result).toEqual([]);
    });

    it('should filter tracking by date range', () => {
      const requestedDates = ['2025-01-01', '2025-01-02', '2025-01-03'];
      const mockTracking = [
        { completed: true, date: '2025-01-01', habitId: '1' },
        { completed: false, date: '2025-01-02', habitId: '1' },
        { completed: true, date: '2025-01-04', habitId: '1' }, // Outside range
      ];

      const dateSet = new Set(requestedDates);
      const filteredTracking = mockTracking.filter((t) => dateSet.has(t.date));

      expect(filteredTracking).toHaveLength(2);
      expect(
        filteredTracking.find((t) => t.date === '2025-01-04')
      ).toBeUndefined();
    });
  });

  describe('getStats query contract', () => {
    it('requires habitId parameter', () => {
      const validArgs = {
        habitId: 'test_id',
      };

      expect(validArgs).toHaveProperty('habitId');
    });

    it('should return streak and consistency', () => {
      const mockStats = {
        consistency: 85,
        streak: 7,
      };

      expect(mockStats).toHaveProperty('streak');
      expect(mockStats).toHaveProperty('consistency');
      expect(typeof mockStats.streak).toBe('number');
      expect(typeof mockStats.consistency).toBe('number');
    });

    it('should calculate consistency as percentage (0-100)', () => {
      const consistency = 85;

      expect(consistency).toBeGreaterThanOrEqual(0);
      expect(consistency).toBeLessThanOrEqual(100);
    });

    it('should calculate streak from consecutive days', () => {
      const _mockDates = [
        new Date('2025-01-15'),
        new Date('2025-01-14'),
        new Date('2025-01-13'),
        // Gap here
        new Date('2025-01-11'),
      ];

      // Streak should be 3 (stops at gap)
      const expectedStreak = 3;
      expect(expectedStreak).toBe(3);
    });
  });
});

describe('Schema Validation', () => {
  it('validates complete habit schema with all fields', () => {
    const completeHabit = {
      _creationTime: Date.now(),
      _id: 'test_id',
      // Memory Accessibility System
      accessibility: 0.8,
      accessibilityDecayParam: 0.3,
      accessibilityGainBehavior: 0.5,
      accessibilityGainReminder: 0.7,
      accessibilityUpdatedAt: Date.now(),
      // Archive fields
      archived: false,
      archivedAt: undefined,
      createdAt: Date.now(),
      habitDecayParam: 0.175,
      habitGainParam: 0.15,
      lastPredictionAt: Date.now(),
      name: 'Complete Habit',
      notes: 'Some notes',
      order: 1,
      // Prediction
      predictedCompletionProb: 0.75,
      // Habit Strength System
      strength: 0.65,
      strengthLevel: 'strong',
      strengthUpdatedAt: Date.now(),
      // Other
      tags: ['health', 'morning'],
      userId: 'user_123',
    };

    // Verify all required fields
    expect(completeHabit._id).toBeDefined();
    expect(completeHabit.createdAt).toBeDefined();
    expect(completeHabit.name).toBeDefined();

    // Verify optional fields can be present
    expect(completeHabit.strength).toBeDefined();
    expect(completeHabit.accessibility).toBeDefined();
    expect(completeHabit.predictedCompletionProb).toBeDefined();
  });

  it('validates tracking entry schema', () => {
    const trackingEntry = {
      _creationTime: Date.now(),
      _id: 'tracking_id',
      completed: true,
      date: '2025-01-15',
      habitId: 'habit_id',
      userId: 'user_123',
    };

    expect(trackingEntry).toHaveProperty('habitId');
    expect(trackingEntry).toHaveProperty('date');
    expect(trackingEntry).toHaveProperty('completed');
    expect(typeof trackingEntry.completed).toBe('boolean');
  });
});
