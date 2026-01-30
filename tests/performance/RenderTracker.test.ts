/**
 * Render Tracker Tests
 * Baseline tests for component render tracking.
 */

import { RenderTracker } from '~/lib/performance';

describe('RenderTracker', () => {
  let tracker: RenderTracker;

  beforeEach(() => {
    tracker = new RenderTracker();
  });

  describe('recordRender()', () => {
    it('records single render', () => {
      tracker.recordRender('TestComponent', 5);

      const timing = tracker.getComponentTiming('TestComponent');
      expect(timing).not.toBeNull();
      expect(timing!.renderCount).toBe(1);
      expect(timing!.totalRenderTime).toBe(5);
      expect(timing!.averageRenderTime).toBe(5);
    });

    it('accumulates multiple renders', () => {
      tracker.recordRender('TestComponent', 5);
      tracker.recordRender('TestComponent', 10);
      tracker.recordRender('TestComponent', 15);

      const timing = tracker.getComponentTiming('TestComponent');
      expect(timing!.renderCount).toBe(3);
      expect(timing!.totalRenderTime).toBe(30);
      expect(timing!.averageRenderTime).toBe(10);
      expect(timing!.lastRenderTime).toBe(15);
    });
  });

  describe('startRender/endRender()', () => {
    it('measures render duration', () => {
      tracker.startRender('MyComponent');
      const duration = tracker.endRender('MyComponent');

      expect(duration).toBeGreaterThanOrEqual(0);
      expect(tracker.getComponentTiming('MyComponent')?.renderCount).toBe(1);
    });

    it('returns 0 for unstarted render', () => {
      const duration = tracker.endRender('Unknown');
      expect(duration).toBe(0);
    });
  });

  describe('getSlowComponents()', () => {
    it('returns components above threshold', () => {
      tracker.recordRender('FastComponent', 5);
      tracker.recordRender('SlowComponent', 25);
      tracker.recordRender('MediumComponent', 15);

      const slow = tracker.getSlowComponents(16);
      expect(slow.length).toBe(1);
      expect(slow[0].componentName).toBe('SlowComponent');
    });

    it('uses default threshold of 16ms', () => {
      tracker.recordRender('FastComponent', 10);
      tracker.recordRender('SlowComponent', 20);

      const slow = tracker.getSlowComponents();
      expect(slow.length).toBe(1);
    });
  });

  describe('getMostRendered()', () => {
    it('returns most frequently rendered components', () => {
      tracker.recordRender('A', 5);
      tracker.recordRender('B', 5);
      tracker.recordRender('B', 5);
      tracker.recordRender('C', 5);
      tracker.recordRender('C', 5);
      tracker.recordRender('C', 5);

      const top = tracker.getMostRendered(2);
      expect(top.length).toBe(2);
      expect(top[0].componentName).toBe('C');
      expect(top[0].renderCount).toBe(3);
      expect(top[1].componentName).toBe('B');
      expect(top[1].renderCount).toBe(2);
    });
  });

  describe('getTotalRenderCount()', () => {
    it('sums all component render counts', () => {
      tracker.recordRender('A', 5);
      tracker.recordRender('A', 5);
      tracker.recordRender('B', 5);

      expect(tracker.getTotalRenderCount()).toBe(3);
    });
  });

  describe('getAllTimings()', () => {
    it('returns all tracked components', () => {
      tracker.recordRender('A', 5);
      tracker.recordRender('B', 10);

      const all = tracker.getAllTimings();
      expect(all.length).toBe(2);
    });
  });

  describe('clear()', () => {
    it('removes all tracking data', () => {
      tracker.recordRender('Test', 5);
      tracker.clear();

      expect(tracker.getAllTimings().length).toBe(0);
      expect(tracker.getTotalRenderCount()).toBe(0);
    });
  });
});
