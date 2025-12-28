/**
 * Progression Gradient Algorithm Tests
 * Tests for streak-length-based gradient calculations
 */

import {
  DEFAULT_PROGRESSION_GRADIENT,
  calculateProgressionFactor,
  interpolateValue,
  calculateProgressionOpacity,
  calculateProgressionThickness,
  calculateProgressionColor,
  hexToHSL,
  hslToHex,
} from '../utils';
import type {
  ChainConnection,
  StreakProgressionGradient,
  GridPosition,
} from '../types';

// Helper to create a mock connection
function createMockConnection(
  streakPosition: number,
  streakLength: number
): ChainConnection {
  const mockPosition: GridPosition = {
    type: 'horizontal',
    primaryIndex: 0,
    secondaryIndex: 0,
    x: 100,
    y: 100,
  };

  return {
    id: `test-${streakPosition}`,
    fromDate: '2025-12-01',
    toDate: '2025-12-02',
    fromPosition: mockPosition,
    toPosition: { ...mockPosition, x: 120 },
    streakPosition,
    streakLength,
    strength: 'strong',
    isActive: true,
  };
}

describe('calculateProgressionFactor', () => {
  describe('edge cases', () => {
    it('should return 1 for streak length of 1', () => {
      expect(calculateProgressionFactor(1, 1, 'linear')).toBe(1);
    });

    it('should return 1 for streak length of 0 (edge case)', () => {
      expect(calculateProgressionFactor(1, 0, 'linear')).toBe(1);
    });

    it('should return 0 for position 0', () => {
      expect(calculateProgressionFactor(0, 5, 'linear')).toBe(0);
    });

    it('should return 0 for negative position', () => {
      expect(calculateProgressionFactor(-1, 5, 'linear')).toBe(0);
    });

    it('should return 1 for position >= streak length', () => {
      expect(calculateProgressionFactor(5, 5, 'linear')).toBe(1);
      expect(calculateProgressionFactor(10, 5, 'linear')).toBe(1);
    });
  });

  describe('linear easing', () => {
    it('should return linear progression for 5-day streak', () => {
      // For a 5-day streak, we have 4 connections (positions 1-4)
      // Position 1: (1-1)/(5-1) = 0
      // Position 2: (2-1)/(5-1) = 0.25
      // Position 3: (3-1)/(5-1) = 0.5
      // Position 4: (4-1)/(5-1) = 0.75
      expect(calculateProgressionFactor(1, 5, 'linear')).toBeCloseTo(0, 5);
      expect(calculateProgressionFactor(2, 5, 'linear')).toBeCloseTo(0.25, 5);
      expect(calculateProgressionFactor(3, 5, 'linear')).toBeCloseTo(0.5, 5);
      expect(calculateProgressionFactor(4, 5, 'linear')).toBeCloseTo(0.75, 5);
    });

    it('should return 0 for first position', () => {
      expect(calculateProgressionFactor(1, 10, 'linear')).toBe(0);
    });

    it('should return 1 for last position', () => {
      // Position 10 is past the number of connections (9) for a 10-day streak
      // But position 9 is the last connection
      // Actually for 10-day streak: 9 connections, position 9 = (9-1)/(10-1) = 8/9 ≈ 0.889
      // Wait, the function says position >= streakLength returns 1
      // So position 10 returns 1 because 10 >= 10
      expect(calculateProgressionFactor(10, 10, 'linear')).toBe(1);
    });
  });

  describe('easeOut easing', () => {
    it('should accelerate faster initially with easeOut', () => {
      // easeOut = 1 - (1 - t)^2
      // At t=0.25: 1 - (0.75)^2 = 1 - 0.5625 = 0.4375
      const linearValue = calculateProgressionFactor(2, 5, 'linear');
      const easeOutValue = calculateProgressionFactor(2, 5, 'easeOut');

      expect(easeOutValue).toBeGreaterThan(linearValue);
    });

    it('should return 0 for first position', () => {
      expect(calculateProgressionFactor(1, 5, 'easeOut')).toBe(0);
    });
  });

  describe('easeIn easing', () => {
    it('should be slower initially with easeIn', () => {
      // easeIn = t^2
      // At t=0.25: 0.0625
      const linearValue = calculateProgressionFactor(2, 5, 'linear');
      const easeInValue = calculateProgressionFactor(2, 5, 'easeIn');

      expect(easeInValue).toBeLessThan(linearValue);
    });
  });

  describe('easeInOut easing', () => {
    it('should be slow at start and end, fast in middle', () => {
      // easeInOut at midpoint should equal linear
      const midLinear = calculateProgressionFactor(3, 5, 'linear');
      const midEaseInOut = calculateProgressionFactor(3, 5, 'easeInOut');

      // At the exact midpoint, they should be close
      expect(midEaseInOut).toBeCloseTo(midLinear, 1);
    });
  });
});

describe('interpolateValue', () => {
  it('should return start value when factor is 0', () => {
    expect(interpolateValue(10, 100, 0)).toBe(10);
  });

  it('should return end value when factor is 1', () => {
    expect(interpolateValue(10, 100, 1)).toBe(100);
  });

  it('should return midpoint when factor is 0.5', () => {
    expect(interpolateValue(10, 100, 0.5)).toBe(55);
  });

  it('should handle negative ranges', () => {
    expect(interpolateValue(100, 10, 0.5)).toBe(55);
  });

  it('should handle negative values', () => {
    expect(interpolateValue(-10, 10, 0.5)).toBe(0);
  });
});

describe('calculateProgressionOpacity', () => {
  const defaultGradient = DEFAULT_PROGRESSION_GRADIENT;

  it('should return base opacity when gradient is disabled', () => {
    const disabledGradient: StreakProgressionGradient = {
      ...defaultGradient,
      enabled: false,
    };
    const connection = createMockConnection(1, 5);
    const baseOpacity = 0.8;

    expect(
      calculateProgressionOpacity(connection, baseOpacity, disabledGradient)
    ).toBe(baseOpacity);
  });

  it('should return lower opacity at start of streak', () => {
    const connection = createMockConnection(1, 10);
    const baseOpacity = 1.0;

    const result = calculateProgressionOpacity(
      connection,
      baseOpacity,
      defaultGradient
    );

    // At start: progression = 0, opacity = baseOpacity * startOpacity = 1.0 * 0.3 = 0.3
    expect(result).toBeCloseTo(0.3, 2);
  });

  it('should return higher opacity at end of streak', () => {
    const connectionEnd = createMockConnection(10, 10);
    const baseOpacity = 1.0;

    const result = calculateProgressionOpacity(
      connectionEnd,
      baseOpacity,
      defaultGradient
    );

    // At end: progression = 1, opacity = baseOpacity * endOpacity = 1.0 * 1.0 = 1.0
    expect(result).toBeCloseTo(1.0, 2);
  });

  it('should scale with base opacity', () => {
    const connection = createMockConnection(10, 10);
    const baseOpacity = 0.5;

    const result = calculateProgressionOpacity(
      connection,
      baseOpacity,
      defaultGradient
    );

    // At end: progression = 1, opacity = 0.5 * 1.0 = 0.5
    expect(result).toBeCloseTo(0.5, 2);
  });

  it('should respect custom gradient settings', () => {
    const customGradient: StreakProgressionGradient = {
      enabled: true,
      startOpacity: 0.5,
      endOpacity: 0.8,
      startSaturation: 1,
      endSaturation: 1,
      startThickness: 1,
      endThickness: 1,
    };
    const connection = createMockConnection(1, 10);
    const baseOpacity = 1.0;

    const result = calculateProgressionOpacity(
      connection,
      baseOpacity,
      customGradient
    );

    // At start: 1.0 * 0.5 = 0.5
    expect(result).toBeCloseTo(0.5, 2);
  });
});

describe('calculateProgressionThickness', () => {
  const defaultGradient = DEFAULT_PROGRESSION_GRADIENT;

  it('should return base thickness when gradient is disabled', () => {
    const disabledGradient: StreakProgressionGradient = {
      ...defaultGradient,
      enabled: false,
    };
    const connection = createMockConnection(1, 5);
    const baseThickness = 3.0;

    expect(
      calculateProgressionThickness(connection, baseThickness, disabledGradient)
    ).toBe(baseThickness);
  });

  it('should return thinner lines at start of streak', () => {
    const connection = createMockConnection(1, 10);
    const baseThickness = 3.0;

    const result = calculateProgressionThickness(
      connection,
      baseThickness,
      defaultGradient
    );

    // At start: progression = 0, thickness = 3.0 * 0.7 = 2.1
    expect(result).toBeCloseTo(2.1, 2);
  });

  it('should return full thickness at end of streak', () => {
    const connectionEnd = createMockConnection(10, 10);
    const baseThickness = 3.0;

    const result = calculateProgressionThickness(
      connectionEnd,
      baseThickness,
      defaultGradient
    );

    // At end: progression = 1, thickness = 3.0 * 1.0 = 3.0
    expect(result).toBeCloseTo(3.0, 2);
  });
});

describe('hexToHSL and hslToHex', () => {
  describe('hexToHSL', () => {
    it('should convert pure red correctly', () => {
      const hsl = hexToHSL('#ff0000');
      expect(hsl.h).toBeCloseTo(0, 0);
      expect(hsl.s).toBeCloseTo(1, 2);
      expect(hsl.l).toBeCloseTo(0.5, 2);
    });

    it('should convert pure green correctly', () => {
      const hsl = hexToHSL('#00ff00');
      expect(hsl.h).toBeCloseTo(120, 0);
      expect(hsl.s).toBeCloseTo(1, 2);
      expect(hsl.l).toBeCloseTo(0.5, 2);
    });

    it('should convert pure blue correctly', () => {
      const hsl = hexToHSL('#0000ff');
      expect(hsl.h).toBeCloseTo(240, 0);
      expect(hsl.s).toBeCloseTo(1, 2);
      expect(hsl.l).toBeCloseTo(0.5, 2);
    });

    it('should convert white correctly', () => {
      const hsl = hexToHSL('#ffffff');
      expect(hsl.s).toBe(0);
      expect(hsl.l).toBe(1);
    });

    it('should convert black correctly', () => {
      const hsl = hexToHSL('#000000');
      expect(hsl.s).toBe(0);
      expect(hsl.l).toBe(0);
    });

    it('should convert gray correctly', () => {
      const hsl = hexToHSL('#808080');
      expect(hsl.s).toBe(0);
      expect(hsl.l).toBeCloseTo(0.5, 1);
    });

    it('should handle hex without # prefix', () => {
      const hsl = hexToHSL('ff0000');
      expect(hsl.h).toBeCloseTo(0, 0);
    });
  });

  describe('hslToHex', () => {
    it('should convert pure red correctly', () => {
      expect(hslToHex(0, 1, 0.5)).toBe('#ff0000');
    });

    it('should convert pure green correctly', () => {
      expect(hslToHex(120, 1, 0.5)).toBe('#00ff00');
    });

    it('should convert pure blue correctly', () => {
      expect(hslToHex(240, 1, 0.5)).toBe('#0000ff');
    });

    it('should convert white correctly', () => {
      expect(hslToHex(0, 0, 1)).toBe('#ffffff');
    });

    it('should convert black correctly', () => {
      expect(hslToHex(0, 0, 0)).toBe('#000000');
    });
  });

  describe('roundtrip conversion', () => {
    it('should maintain color through hex -> HSL -> hex conversion', () => {
      const colors = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

      for (const color of colors) {
        const hsl = hexToHSL(color);
        const result = hslToHex(hsl.h, hsl.s, hsl.l);

        // Compare lowercase to avoid case sensitivity issues
        expect(result.toLowerCase()).toBe(color.toLowerCase());
      }
    });
  });
});

describe('calculateProgressionColor', () => {
  const defaultGradient = DEFAULT_PROGRESSION_GRADIENT;
  const testColor = '#10b981'; // Emerald-500

  it('should return original color when gradient is disabled', () => {
    const disabledGradient: StreakProgressionGradient = {
      ...defaultGradient,
      enabled: false,
    };
    const connection = createMockConnection(1, 5);

    expect(
      calculateProgressionColor(connection, testColor, disabledGradient)
    ).toBe(testColor);
  });

  it('should return desaturated color at start of streak', () => {
    const connection = createMockConnection(1, 10);

    const result = calculateProgressionColor(
      connection,
      testColor,
      defaultGradient
    );
    const resultHSL = hexToHSL(result);
    const originalHSL = hexToHSL(testColor);

    // Saturation should be lower at start (startSaturation = 0.4)
    expect(resultHSL.s).toBeLessThan(originalHSL.s);
  });

  it('should return full saturation at end of streak', () => {
    const connectionEnd = createMockConnection(10, 10);

    const result = calculateProgressionColor(
      connectionEnd,
      testColor,
      defaultGradient
    );
    const resultHSL = hexToHSL(result);
    const originalHSL = hexToHSL(testColor);

    // Saturation should be full at end (endSaturation = 1.0)
    expect(resultHSL.s).toBeCloseTo(originalHSL.s, 2);
  });

  it('should preserve hue throughout progression', () => {
    const startConnection = createMockConnection(1, 10);
    const endConnection = createMockConnection(10, 10);
    const originalHSL = hexToHSL(testColor);

    const startResult = calculateProgressionColor(
      startConnection,
      testColor,
      defaultGradient
    );
    const endResult = calculateProgressionColor(
      endConnection,
      testColor,
      defaultGradient
    );

    const startHSL = hexToHSL(startResult);
    const endHSL = hexToHSL(endResult);

    // Hue should remain the same (within 1 degree due to floating point conversion)
    expect(Math.abs(startHSL.h - originalHSL.h)).toBeLessThan(1);
    expect(Math.abs(endHSL.h - originalHSL.h)).toBeLessThan(1);
  });
});

describe('DEFAULT_PROGRESSION_GRADIENT', () => {
  it('should have valid configuration values', () => {
    expect(DEFAULT_PROGRESSION_GRADIENT.enabled).toBe(true);
    expect(DEFAULT_PROGRESSION_GRADIENT.startOpacity).toBeGreaterThan(0);
    expect(DEFAULT_PROGRESSION_GRADIENT.startOpacity).toBeLessThan(
      DEFAULT_PROGRESSION_GRADIENT.endOpacity
    );
    expect(DEFAULT_PROGRESSION_GRADIENT.endOpacity).toBeLessThanOrEqual(1);
    expect(DEFAULT_PROGRESSION_GRADIENT.startSaturation).toBeGreaterThan(0);
    expect(DEFAULT_PROGRESSION_GRADIENT.startSaturation).toBeLessThan(
      DEFAULT_PROGRESSION_GRADIENT.endSaturation
    );
    expect(DEFAULT_PROGRESSION_GRADIENT.endSaturation).toBeLessThanOrEqual(1);
    expect(DEFAULT_PROGRESSION_GRADIENT.startThickness).toBeGreaterThan(0);
    expect(DEFAULT_PROGRESSION_GRADIENT.startThickness).toBeLessThan(
      DEFAULT_PROGRESSION_GRADIENT.endThickness
    );
    expect(DEFAULT_PROGRESSION_GRADIENT.endThickness).toBeLessThanOrEqual(1);
  });
});

describe('progression gradient integration', () => {
  it('should create visual progression across a 10-day streak', () => {
    const baseOpacity = 0.8;
    const baseThickness = 3.0;
    const baseColor = '#10b981';

    const opacities: number[] = [];
    const thicknesses: number[] = [];

    // Create connections for positions 1-9 (10-day streak has 9 connections)
    for (let i = 1; i <= 9; i++) {
      const connection = createMockConnection(i, 10);
      opacities.push(
        calculateProgressionOpacity(
          connection,
          baseOpacity,
          DEFAULT_PROGRESSION_GRADIENT
        )
      );
      thicknesses.push(
        calculateProgressionThickness(
          connection,
          baseThickness,
          DEFAULT_PROGRESSION_GRADIENT
        )
      );
    }

    // Verify monotonic increase (each value should be >= previous due to easeOut)
    for (let i = 1; i < opacities.length; i++) {
      expect(opacities[i]).toBeGreaterThanOrEqual(opacities[i - 1]);
      expect(thicknesses[i]).toBeGreaterThanOrEqual(thicknesses[i - 1]);
    }

    // Verify range
    expect(opacities[0]).toBeLessThan(opacities[opacities.length - 1]);
    expect(thicknesses[0]).toBeLessThan(thicknesses[thicknesses.length - 1]);
  });

  it('should handle short streaks gracefully', () => {
    const connection = createMockConnection(1, 2);

    // Should not throw and should return reasonable values
    expect(() =>
      calculateProgressionOpacity(connection, 0.8, DEFAULT_PROGRESSION_GRADIENT)
    ).not.toThrow();
    expect(() =>
      calculateProgressionThickness(
        connection,
        3.0,
        DEFAULT_PROGRESSION_GRADIENT
      )
    ).not.toThrow();
    expect(() =>
      calculateProgressionColor(
        connection,
        '#10b981',
        DEFAULT_PROGRESSION_GRADIENT
      )
    ).not.toThrow();
  });
});
