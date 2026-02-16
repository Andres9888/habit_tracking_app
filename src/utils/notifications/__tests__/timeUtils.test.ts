/**
 * Tests for notification time utilities
 */
import { normalizeDSTTime, validateReminderTime } from '../timeUtils';

describe('normalizeDSTTime', () => {
  it('leaves safe times unchanged', () => {
    const safeTime = new Date();
    safeTime.setHours(14, 30, 0, 0); // 2:30 PM - safe

    const result = normalizeDSTTime(safeTime);

    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });

  it('adjusts 1am to 9am (DST risk window)', () => {
    const riskTime = new Date();
    riskTime.setHours(1, 0, 0, 0); // 1:00 AM - DST risk

    const result = normalizeDSTTime(riskTime);

    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(0);
  });

  it('adjusts 2am to 9am (DST risk window)', () => {
    const riskTime = new Date();
    riskTime.setHours(2, 30, 0, 0); // 2:30 AM - DST spring forward

    const result = normalizeDSTTime(riskTime);

    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(0);
  });

  it('adjusts 3am to 9am (DST risk window)', () => {
    const riskTime = new Date();
    riskTime.setHours(3, 0, 0, 0); // 3:00 AM - DST risk

    const result = normalizeDSTTime(riskTime);

    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(0);
  });

  it('leaves 4am unchanged (outside DST risk)', () => {
    const safeTime = new Date();
    safeTime.setHours(4, 0, 0, 0);

    const result = normalizeDSTTime(safeTime);

    expect(result.getHours()).toBe(4);
    expect(result.getMinutes()).toBe(0);
  });

  it('leaves 0am (midnight) unchanged (outside DST risk)', () => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);

    const result = normalizeDSTTime(midnight);

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });
});

describe('validateReminderTime', () => {
  it('accepts normal daytime hours', () => {
    const time = new Date();
    time.setHours(14, 0, 0, 0);

    expect(validateReminderTime(time)).toBeNull();
  });

  it('accepts early morning (unusual but valid)', () => {
    const time = new Date();
    time.setHours(2, 0, 0, 0);

    expect(validateReminderTime(time)).toBeNull();
  });

  it('accepts late night (unusual but valid)', () => {
    const time = new Date();
    time.setHours(23, 30, 0, 0);

    expect(validateReminderTime(time)).toBeNull();
  });

  it('rejects invalid hours', () => {
    const time = new Date();
    time.setHours(25, 0, 0, 0); // Invalid hour

    expect(validateReminderTime(time)).toBe('Time out of valid range');
  });

  it('handles NaN gracefully', () => {
    const time = new Date('invalid');

    const result = validateReminderTime(time);

    expect(result).toBe('Invalid time');
  });
});
