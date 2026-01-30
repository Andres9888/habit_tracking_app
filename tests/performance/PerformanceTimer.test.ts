/**
 * Performance Timer Tests
 * Baseline tests for timing measurement utilities.
 */

import { PerformanceTimer, now, timeSync, timeAsync } from '~/lib/performance';

describe('PerformanceTimer', () => {
  let timer: PerformanceTimer;

  beforeEach(() => {
    timer = new PerformanceTimer();
  });

  describe('now()', () => {
    it('returns a number', () => {
      const timestamp = now();
      expect(typeof timestamp).toBe('number');
    });

    it('returns increasing values', async () => {
      const t1 = now();
      await new Promise((resolve) => setTimeout(resolve, 10));
      const t2 = now();
      expect(t2).toBeGreaterThan(t1);
    });
  });

  describe('mark()', () => {
    it('creates a mark with name and timestamp', () => {
      const mark = timer.mark('test-mark');
      expect(mark.name).toBe('test-mark');
      expect(typeof mark.timestamp).toBe('number');
    });

    it('stores metadata with mark', () => {
      const mark = timer.mark('test-mark', { custom: 'data' });
      expect(mark.metadata).toEqual({ custom: 'data' });
    });

    it('retrieves mark by name', () => {
      timer.mark('my-mark');
      const retrieved = timer.getMark('my-mark');
      expect(retrieved?.name).toBe('my-mark');
    });
  });

  describe('measure()', () => {
    it('measures duration between two marks', async () => {
      timer.mark('start');
      await new Promise((resolve) => setTimeout(resolve, 50));
      timer.mark('end');

      const measure = timer.measure('duration', 'start', 'end');
      expect(measure).not.toBeNull();
      expect(measure!.duration).toBeGreaterThanOrEqual(40);
      expect(measure!.duration).toBeLessThan(150);
    });

    it('measures from mark to now when no end mark', async () => {
      timer.mark('start');
      await new Promise((resolve) => setTimeout(resolve, 25));

      const measure = timer.measure('to-now', 'start');
      expect(measure).not.toBeNull();
      expect(measure!.duration).toBeGreaterThanOrEqual(20);
    });

    it('returns null for missing start mark', () => {
      const measure = timer.measure('invalid', 'nonexistent');
      expect(measure).toBeNull();
    });
  });

  describe('export()', () => {
    it('exports all marks and measures', () => {
      timer.mark('a');
      timer.mark('b');
      timer.measure('a-to-b', 'a', 'b');

      const exported = timer.export();
      expect(exported.marks.length).toBe(2);
      expect(exported.measures.length).toBe(1);
    });
  });

  describe('clear()', () => {
    it('clears all data', () => {
      timer.mark('test');
      timer.measure('test-measure', 'test');
      timer.clear();

      const exported = timer.export();
      expect(exported.marks.length).toBe(0);
      expect(exported.measures.length).toBe(0);
    });
  });
});

describe('timeSync', () => {
  it('times synchronous function', () => {
    const { result, duration } = timeSync('test', () => {
      let sum = 0;
      for (let i = 0; i < 1000; i++) sum += i;
      return sum;
    });

    expect(result).toBe(499500);
    expect(duration).toBeGreaterThanOrEqual(0);
  });
});

describe('timeAsync', () => {
  it('times asynchronous function', async () => {
    const { result, duration } = await timeAsync('test', async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      return 'done';
    });

    expect(result).toBe('done');
    expect(duration).toBeGreaterThanOrEqual(15);
  });
});
