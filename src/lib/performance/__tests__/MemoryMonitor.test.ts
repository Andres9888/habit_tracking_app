/**
 * MemoryMonitor - Snapshot Pruning Tests
 *
 * Verifies that the snapshots array is bounded to MAX_SNAPSHOTS
 * to prevent unbounded memory growth in long sessions.
 *
 * @see docs/Code-Audit/CODE-AUDIT-05.md Task 7
 */

import { MemoryMonitor, MAX_SNAPSHOTS } from '../MemoryMonitor';

// Mock performance.memory so takeSnapshot() actually pushes snapshots
const mockMemory = {
  jsHeapSizeLimit: 2 * 1024 * 1024 * 1024,
  totalJSHeapSize: 50 * 1024 * 1024,
  usedJSHeapSize: 30 * 1024 * 1024,
};

beforeAll(() => {
  Object.defineProperty(performance, 'memory', {
    configurable: true,
    get: () => mockMemory,
  });
});

describe('MemoryMonitor snapshot pruning', () => {
  let monitor: MemoryMonitor;

  beforeEach(() => {
    monitor = new MemoryMonitor();
  });

  it('should export MAX_SNAPSHOTS as 100', () => {
    expect(MAX_SNAPSHOTS).toBe(100);
  });

  it('should accumulate snapshots up to the limit', () => {
    for (let i = 0; i < MAX_SNAPSHOTS; i++) {
      monitor.takeSnapshot();
    }
    expect(monitor.getSnapshots()).toHaveLength(MAX_SNAPSHOTS);
  });

  it('should not exceed MAX_SNAPSHOTS when more are taken', () => {
    for (let i = 0; i < MAX_SNAPSHOTS + 50; i++) {
      monitor.takeSnapshot();
    }
    expect(monitor.getSnapshots()).toHaveLength(MAX_SNAPSHOTS);
  });

  it('should drop the oldest snapshot when pruning', () => {
    // Take MAX_SNAPSHOTS + 1 snapshots with varying heap to identify order
    for (let i = 0; i < MAX_SNAPSHOTS + 1; i++) {
      mockMemory.usedJSHeapSize = i * 1000;
      monitor.takeSnapshot();
    }
    const snapshots = monitor.getSnapshots();
    expect(snapshots).toHaveLength(MAX_SNAPSHOTS);
    // The first snapshot (usedJSHeapSize = 0) should have been pruned.
    // The oldest remaining should have usedJSHeapSize = 1000 (i=1).
    expect(snapshots[0].jsHeapUsed).toBe(1000);
    // The newest should be the last one taken (i = MAX_SNAPSHOTS)
    expect(snapshots[snapshots.length - 1].jsHeapUsed).toBe(
      MAX_SNAPSHOTS * 1000
    );
  });

  it('should still allow clear() to empty all snapshots', () => {
    for (let i = 0; i < 10; i++) {
      monitor.takeSnapshot();
    }
    expect(monitor.getSnapshots().length).toBeGreaterThan(0);
    monitor.clear();
    expect(monitor.getSnapshots()).toHaveLength(0);
  });

  it('should keep detectLeak() working with bounded snapshots', () => {
    // Fill to capacity with stable usage
    mockMemory.usedJSHeapSize = 30 * 1024 * 1024;
    (monitor as any).baselineUsage = 30 * 1024 * 1024;
    for (let i = 0; i < MAX_SNAPSHOTS; i++) {
      monitor.takeSnapshot();
    }
    // No significant growth - should not detect leak
    expect(monitor.detectLeak(50)).toBe(false);
  });
});
