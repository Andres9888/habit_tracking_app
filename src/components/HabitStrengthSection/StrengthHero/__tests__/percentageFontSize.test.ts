import {
  getPercentageFontSize,
  PERCENTAGE_FONT_SIZE,
  PERCENTAGE_FONT_SIZE_COMPACT,
} from '../percentageFontSize';

describe('getPercentageFontSize', () => {
  it('uses the default size for two-digit percentages', () => {
    expect(getPercentageFontSize(84)).toBe(PERCENTAGE_FONT_SIZE);
    expect(getPercentageFontSize(99)).toBe(PERCENTAGE_FONT_SIZE);
  });

  it('uses the compact size at 100%', () => {
    expect(getPercentageFontSize(100)).toBe(PERCENTAGE_FONT_SIZE_COMPACT);
  });
});
