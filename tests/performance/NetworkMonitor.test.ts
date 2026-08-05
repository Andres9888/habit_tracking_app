/**
 * Network Monitor Tests
 * Baseline tests for network performance tracking.
 */

import { NetworkMonitor } from '~/lib/performance';

describe('NetworkMonitor', () => {
  let monitor: NetworkMonitor;

  beforeEach(() => {
    monitor = new NetworkMonitor();
  });

  describe('startRequest/endRequest()', () => {
    it('tracks request timing', () => {
      const requestId = monitor.startRequest('/api/habits', 'GET');
      const timing = monitor.endRequest(requestId, 200, 1024);

      expect(timing).not.toBeNull();
      expect(timing!.url).toBe('/api/habits');
      expect(timing!.method).toBe('GET');
      expect(timing!.status).toBe(200);
      expect(timing!.size).toBe(1024);
      expect(timing!.duration).toBeGreaterThanOrEqual(0);
    });

    it('returns null for unknown request', () => {
      const timing = monitor.endRequest('unknown');
      expect(timing).toBeNull();
    });
  });

  describe('recordRequest()', () => {
    it('records completed request with known timing', () => {
      monitor.recordRequest('/api/test', 'POST', 150, 201, 512);

      const timings = monitor.getAllTimings();
      expect(timings.length).toBe(1);
      expect(timings[0].duration).toBe(150);
    });
  });

  describe('getAverageLatency()', () => {
    it('calculates average latency', () => {
      monitor.recordRequest('/a', 'GET', 100, 200);
      monitor.recordRequest('/b', 'GET', 200, 200);
      monitor.recordRequest('/c', 'GET', 300, 200);

      expect(monitor.getAverageLatency()).toBe(200);
    });

    it('returns 0 for no requests', () => {
      expect(monitor.getAverageLatency()).toBe(0);
    });
  });

  describe('getP95Latency()', () => {
    it('calculates P95 latency', () => {
      for (let i = 1; i <= 100; i++) {
        monitor.recordRequest(`/api/${i}`, 'GET', i, 200);
      }

      const p95 = monitor.getP95Latency();
      expect(p95).toBeGreaterThanOrEqual(95);
      expect(p95).toBeLessThanOrEqual(100);
    });
  });

  describe('getErrorRate()', () => {
    it('calculates error rate', () => {
      monitor.recordRequest('/a', 'GET', 100, 200);
      monitor.recordRequest('/b', 'GET', 100, 500);
      monitor.recordRequest('/c', 'GET', 100, 404);
      monitor.recordRequest('/d', 'GET', 100, 200);

      expect(monitor.getErrorRate()).toBe(0.5);
    });

    it('returns 0 for all successful requests', () => {
      monitor.recordRequest('/a', 'GET', 100, 200);
      monitor.recordRequest('/b', 'GET', 100, 201);

      expect(monitor.getErrorRate()).toBe(0);
    });
  });

  describe('getSlowestRequests()', () => {
    it('returns slowest requests ordered by duration', () => {
      monitor.recordRequest('/fast', 'GET', 50, 200);
      monitor.recordRequest('/slow', 'GET', 500, 200);
      monitor.recordRequest('/medium', 'GET', 150, 200);

      const slowest = monitor.getSlowestRequests(2);
      expect(slowest.length).toBe(2);
      expect(slowest[0].url).toBe('/slow');
      expect(slowest[1].url).toBe('/medium');
    });
  });

  describe('getRequestsByPattern()', () => {
    it('filters requests by URL pattern', () => {
      monitor.recordRequest('/api/habits', 'GET', 100, 200);
      monitor.recordRequest('/api/users', 'GET', 100, 200);
      monitor.recordRequest('/auth/login', 'POST', 100, 200);

      const apiRequests = monitor.getRequestsByPattern(/^\/api/);
      expect(apiRequests.length).toBe(2);
    });
  });

  describe('getStats()', () => {
    it('returns comprehensive statistics', () => {
      monitor.recordRequest('/a', 'GET', 100, 200);
      monitor.recordRequest('/b', 'GET', 200, 500);

      const stats = monitor.getStats();
      expect(stats.totalRequests).toBe(2);
      expect(stats.averageLatency).toBe(150);
      expect(stats.errorRate).toBe(0.5);
      expect(stats.pendingCount).toBe(0);
    });
  });

  describe('clear()', () => {
    it('removes all data', () => {
      monitor.recordRequest('/test', 'GET', 100, 200);
      monitor.startRequest('/pending', 'GET');
      monitor.clear();

      expect(monitor.getAllTimings().length).toBe(0);
      expect(monitor.getStats().pendingCount).toBe(0);
    });
  });
});
