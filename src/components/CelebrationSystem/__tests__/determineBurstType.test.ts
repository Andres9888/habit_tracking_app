/**
 * Celebration System Tests
 *
 * Unit tests for the enhanced confetti celebration system.
 */

import { describe, expect, it } from '@jest/globals';

import {
  determineBurstType,
  isStreakMilestone,
  didLevelUp,
  getNextStreakMilestone,
  getNextStrengthLevel,
  isApproachingMilestone,
  type CompletionContext,
} from '../utils/determineBurstType';
import { getBurstConfig, getBurstColors } from '../confetti/burstConfigs';
import type { BurstType } from '../confetti/types';

describe('determineBurstType', () => {
  it('returns perfectWeek for perfect week completion', () => {
    const context: CompletionContext = {
      isPerfectWeek: true,
    };
    expect(determineBurstType(context)).toBe('perfectWeek');
  });

  it('returns streakMilestone for streak milestones', () => {
    const context: CompletionContext = {
      streak: 7,
    };
    expect(determineBurstType(context)).toBe('streakMilestone');
  });

  it('returns levelUp for strength level increases', () => {
    const context: CompletionContext = {
      previousStrength: 18,
      strength: 22,
    };
    expect(determineBurstType(context)).toBe('levelUp');
  });

  it('returns chainCompletion for 3+ in a row', () => {
    const context: CompletionContext = {
      chainCount: 5,
    };
    expect(determineBurstType(context)).toBe('chainCompletion');
  });

  it('returns default for regular completion', () => {
    const context: CompletionContext = {
      streak: 3,
      chainCount: 1,
    };
    expect(determineBurstType(context)).toBe('default');
  });

  it('prioritizes perfectWeek over other triggers', () => {
    const context: CompletionContext = {
      isPerfectWeek: true,
      streak: 7,
      chainCount: 5,
    };
    expect(determineBurstType(context)).toBe('perfectWeek');
  });

  it('prioritizes streakMilestone over levelUp', () => {
    const context: CompletionContext = {
      streak: 14,
      previousStrength: 18,
      strength: 22,
    };
    expect(determineBurstType(context)).toBe('streakMilestone');
  });
});

describe('isStreakMilestone', () => {
  it('returns true for milestone values', () => {
    expect(isStreakMilestone(7)).toBe(true);
    expect(isStreakMilestone(14)).toBe(true);
    expect(isStreakMilestone(30)).toBe(true);
    expect(isStreakMilestone(100)).toBe(true);
  });

  it('returns false for non-milestone values', () => {
    expect(isStreakMilestone(5)).toBe(false);
    expect(isStreakMilestone(15)).toBe(false);
    expect(isStreakMilestone(25)).toBe(false);
  });
});

describe('didLevelUp', () => {
  it('returns true when crossing a level threshold', () => {
    expect(didLevelUp(18, 22)).toBe(true); // Crossed 20%
    expect(didLevelUp(38, 42)).toBe(true); // Crossed 40%
    expect(didLevelUp(58, 62)).toBe(true); // Crossed 60%
    expect(didLevelUp(78, 82)).toBe(true); // Crossed 80%
  });

  it('returns false when not crossing a threshold', () => {
    expect(didLevelUp(15, 18)).toBe(false);
    expect(didLevelUp(25, 28)).toBe(false);
    expect(didLevelUp(85, 90)).toBe(false);
  });

  it('returns false for same values', () => {
    expect(didLevelUp(50, 50)).toBe(false);
  });
});

describe('getNextStreakMilestone', () => {
  it('returns next milestone for given streak', () => {
    expect(getNextStreakMilestone(5)).toBe(7);
    expect(getNextStreakMilestone(10)).toBe(14);
    expect(getNextStreakMilestone(25)).toBe(30);
    expect(getNextStreakMilestone(50)).toBe(60);
  });

  it('returns null for streak beyond last milestone', () => {
    expect(getNextStreakMilestone(400)).toBeNull();
  });
});

describe('getNextStrengthLevel', () => {
  it('returns next level for given strength', () => {
    expect(getNextStrengthLevel(15)).toBe(20);
    expect(getNextStrengthLevel(35)).toBe(40);
    expect(getNextStrengthLevel(55)).toBe(60);
    expect(getNextStrengthLevel(75)).toBe(80);
  });

  it('returns null for strength beyond last level', () => {
    expect(getNextStrengthLevel(85)).toBeNull();
  });
});

describe('isApproachingMilestone', () => {
  it('detects approaching streak milestone', () => {
    const result = isApproachingMilestone({ streak: 5 });
    expect(result.type).toBe('streak');
    expect(result.value).toBe(7);
    expect(result.current).toBe(5);
  });

  it('detects approaching strength level', () => {
    const result = isApproachingMilestone({ strength: 78 });
    expect(result.type).toBe('level');
    expect(result.value).toBe(80);
    expect(result.current).toBe(78);
  });

  it('returns null when not approaching milestone', () => {
    const result = isApproachingMilestone({ streak: 10, strength: 50 });
    expect(result.type).toBeNull();
    expect(result.value).toBeNull();
  });
});

describe('getBurstConfig', () => {
  it('returns correct config for each burst type', () => {
    const defaultConfig = getBurstConfig('default', false);
    expect(defaultConfig.particleCount).toBe(15);
    expect(defaultConfig.duration).toBe(1500);

    const streakConfig = getBurstConfig('streakMilestone', false);
    expect(streakConfig.particleCount).toBe(40);
    expect(streakConfig.duration).toBe(2500);

    const perfectConfig = getBurstConfig('perfectWeek', false);
    expect(perfectConfig.particleCount).toBe(50);
    expect(perfectConfig.duration).toBe(3000);
  });

  it('ignores isDarkMode for config selection', () => {
    const lightConfig = getBurstConfig('default', false);
    const darkConfig = getBurstConfig('default', true);
    expect(lightConfig.particleCount).toBe(darkConfig.particleCount);
    expect(lightConfig.duration).toBe(darkConfig.duration);
  });
});

describe('getBurstColors', () => {
  it('returns light colors for light mode', () => {
    const colors = getBurstColors('default', false);
    expect(colors).toContain('#10B981');
    expect(colors).toContain('#34D399');
  });

  it('returns dark colors for dark mode', () => {
    const colors = getBurstColors('default', true);
    expect(colors).toContain('#34D399');
    expect(colors).toContain('#6EE7B7');
  });

  it('returns different colors for different burst types', () => {
    const defaultColors = getBurstColors('default', false);
    const streakColors = getBurstColors('streakMilestone', false);
    const levelColors = getBurstColors('levelUp', false);

    expect(defaultColors).not.toEqual(streakColors);
    expect(streakColors).not.toEqual(levelColors);
  });

  it('returns rainbow colors for perfectWeek', () => {
    const colors = getBurstColors('perfectWeek', false);
    expect(colors.length).toBe(7);
    expect(colors).toContain('#EF4444'); // Red
    expect(colors).toContain('#3B82F6'); // Blue
    expect(colors).toContain('#8B5CF6'); // Purple
  });
});
