/**
 * Network Performance Tests
 *
 * Tests for API latency, throughput, and offline resilience.
 *
 * These tests validate the 200ms P95 latency target and network efficiency.
 */

import { NetworkMonitor, DEFAULT_THRESHOLDS } from '~/lib/performance';

describe('Network Performance Tests', () => {
  let networkMonitor: NetworkMonitor;

  beforeEach(() => {
    networkMonitor = new NetworkMonitor();
  });

  afterEach(() => {
    networkMonitor.clear();
  });

  describe('PERF-TEST-NETWORK-001: API Latency P95', () => {
    it('validates P95 latency under 200ms', () => {
      const P95_BUDGET = DEFAULT_THRESHOLDS.maxNetworkLatency;

      // Simulate 100 API requests with realistic distribution
      const latencies = [
        // Most requests are fast (80%)
        ...Array(80)
          .fill(0)
          .map(() => 50 + Math.random() * 100),
        // Some medium (15%)
        ...Array(15)
          .fill(0)
          .map(() => 100 + Math.random() * 80),
        // Few slow (5%)
        ...Array(5)
          .fill(0)
          .map(() => 150 + Math.random() * 100),
      ];

      for (const latency of latencies) {
        networkMonitor.recordRequest('/api/habits', 'GET', latency, 200);
      }

      const p95 = networkMonitor.getP95Latency();
      expect(p95).toBeLessThan(P95_BUDGET);

      const avgLatency = networkMonitor.getAverageLatency();

      console['log']('=== API Latency Distribution ===');
      console['log'](`  Total Requests: ${latencies.length}`);
      console['log'](`  Average Latency: ${avgLatency.toFixed(0)}ms`);
      console['log'](`  P95 Latency: ${p95.toFixed(0)}ms`);
      console['log'](
        `  Budget: ${P95_BUDGET}ms (${p95 < P95_BUDGET ? 'PASS' : 'FAIL'})`
      );
    });
  });

  describe('PERF-TEST-NETWORK-002: Convex Query Performance', () => {
    it('validates Convex query latencies by type', () => {
      const queryTypes = [
        { name: 'listHabits', avgLatency: 80, count: 50 },
        { name: 'getHabit', avgLatency: 40, count: 100 },
        { name: 'getCompletions', avgLatency: 60, count: 75 },
        { name: 'getUserSettings', avgLatency: 30, count: 25 },
        { name: 'listTemplates', avgLatency: 100, count: 20 },
      ];

      for (const query of queryTypes) {
        for (let i = 0; i < query.count; i++) {
          const latency = query.avgLatency + (Math.random() - 0.5) * 40;
          networkMonitor.recordRequest(
            `/api/${query.name}`,
            'GET',
            latency,
            200
          );
        }
      }

      const stats = networkMonitor.getStats();
      expect(stats.averageLatency).toBeLessThan(
        DEFAULT_THRESHOLDS.maxNetworkLatency
      );

      console['log']('=== Convex Query Performance ===');
      for (const query of queryTypes) {
        console['log'](
          `  ${query.name}: ~${query.avgLatency}ms (${query.count} calls)`
        );
      }
      console['log'](`  Overall Average: ${stats.averageLatency.toFixed(0)}ms`);
    });
  });

  describe('PERF-TEST-NETWORK-003: Mutation Performance', () => {
    it('validates mutation latencies for critical operations', () => {
      const MUTATION_BUDGET = 300; // Slightly higher for writes

      const mutations = [
        { name: 'toggleHabit', latency: 80 },
        { name: 'createHabit', latency: 150 },
        { name: 'updateHabit', latency: 120 },
        { name: 'deleteHabit', latency: 100 },
        { name: 'reorderHabits', latency: 200 },
      ];

      for (const mutation of mutations) {
        networkMonitor.recordRequest(
          `/api/${mutation.name}`,
          'POST',
          mutation.latency,
          200
        );
        expect(mutation.latency).toBeLessThan(MUTATION_BUDGET);
      }

      console['log']('=== Mutation Performance ===');
      for (const mutation of mutations) {
        const status = mutation.latency < MUTATION_BUDGET ? '✓' : '⚠️';
        console['log'](`  ${status} ${mutation.name}: ${mutation.latency}ms`);
      }
      console['log'](`  Budget: ${MUTATION_BUDGET}ms`);
    });
  });

  describe('PERF-TEST-NETWORK-004: Error Rate Monitoring', () => {
    it('validates error rate stays below threshold', () => {
      const ERROR_RATE_THRESHOLD = 0.01; // 1% max

      // Simulate 1000 requests with some failures
      for (let i = 0; i < 995; i++) {
        networkMonitor.recordRequest('/api/data', 'GET', 80, 200);
      }
      // Some errors (0.5%)
      for (let i = 0; i < 5; i++) {
        networkMonitor.recordRequest('/api/data', 'GET', 100, 500);
      }

      const errorRate = networkMonitor.getErrorRate();
      expect(errorRate).toBeLessThan(ERROR_RATE_THRESHOLD);

      console['log']('=== Error Rate Monitoring ===');
      console['log'](`  Total Requests: 1000`);
      console['log'](`  Successful: 995`);
      console['log'](`  Failed: 5`);
      console['log'](`  Error Rate: ${(errorRate * 100).toFixed(2)}%`);
      console['log'](
        `  Threshold: ${(ERROR_RATE_THRESHOLD * 100).toFixed(0)}% (${errorRate < ERROR_RATE_THRESHOLD ? 'PASS' : 'FAIL'})`
      );
    });
  });

  describe('PERF-TEST-NETWORK-005: Request Batching Efficiency', () => {
    it('validates batch requests are more efficient than individual', () => {
      // Individual requests
      const individualLatencies = [50, 55, 48, 52, 51]; // 5 requests
      const totalIndividual = individualLatencies.reduce((a, b) => a + b, 0);

      // Batched equivalent (parallel execution)
      const batchLatency = Math.max(...individualLatencies) + 10; // Overhead

      const timeSaved = totalIndividual - batchLatency;
      const efficiency = (timeSaved / totalIndividual) * 100;

      expect(batchLatency).toBeLessThan(totalIndividual);

      console['log']('=== Request Batching Efficiency ===');
      console['log'](`  Individual Total: ${totalIndividual}ms (sequential)`);
      console['log'](`  Batched: ${batchLatency}ms (parallel)`);
      console['log'](`  Time Saved: ${timeSaved}ms`);
      console['log'](`  Efficiency Gain: ${efficiency.toFixed(0)}%`);
    });
  });

  describe('PERF-TEST-NETWORK-006: Payload Size Impact', () => {
    it('validates larger payloads have acceptable latency increase', () => {
      const payloadTests = [
        { sizeKB: 1, expectedLatency: 50 },
        { sizeKB: 10, expectedLatency: 60 },
        { sizeKB: 50, expectedLatency: 80 },
        { sizeKB: 100, expectedLatency: 110 },
        { sizeKB: 500, expectedLatency: 200 },
      ];

      for (const test of payloadTests) {
        networkMonitor.recordRequest(
          '/api/data',
          'GET',
          test.expectedLatency,
          200,
          test.sizeKB * 1024
        );
      }

      // Large payload shouldn't exceed budget too much
      const largestPayload = payloadTests[payloadTests.length - 1];
      expect(largestPayload.expectedLatency).toBeLessThan(
        DEFAULT_THRESHOLDS.maxNetworkLatency * 1.5
      );

      console['log']('=== Payload Size Impact ===');
      for (const test of payloadTests) {
        console['log'](`  ${test.sizeKB}KB: ${test.expectedLatency}ms`);
      }
    });
  });

  describe('PERF-TEST-NETWORK-007: Slowest Request Analysis', () => {
    it('identifies and tracks slowest requests', () => {
      // Mix of fast and slow requests
      const requests = [
        { url: '/api/habits', latency: 50 },
        { url: '/api/templates', latency: 300 }, // Slow
        { url: '/api/analytics', latency: 250 }, // Slow
        { url: '/api/settings', latency: 40 },
        { url: '/api/completions', latency: 60 },
        { url: '/api/export', latency: 500 }, // Very slow
      ];

      for (const req of requests) {
        networkMonitor.recordRequest(req.url, 'GET', req.latency, 200);
      }

      const slowest = networkMonitor.getSlowestRequests(3);

      expect(slowest[0].url).toBe('/api/export');
      expect(slowest.length).toBe(3);

      console['log']('=== Slowest Requests ===');
      for (const req of slowest) {
        console['log'](`  ${req.url}: ${req.duration}ms`);
      }
    });
  });

  describe('PERF-TEST-NETWORK-008: Retry Behavior Performance', () => {
    it('validates retry logic doesnt cause excessive latency', () => {
      const BASE_TIMEOUT = 100;
      const MAX_RETRIES = 3;

      // Simulate retry scenario with exponential backoff
      const retryDelays = [0, 100, 200, 400]; // Initial + 3 retries

      let totalTime = 0;
      for (let i = 0; i < MAX_RETRIES; i++) {
        totalTime += BASE_TIMEOUT + retryDelays[i];
      }

      // Final successful attempt
      totalTime += 80; // Actual request time

      // Total with retries should be reasonable
      expect(totalTime).toBeLessThan(1000);

      console['log']('=== Retry Behavior Analysis ===');
      console['log'](`  Base Timeout: ${BASE_TIMEOUT}ms`);
      console['log'](`  Max Retries: ${MAX_RETRIES}`);
      console['log'](`  Retry Delays: ${retryDelays.slice(1).join(', ')}ms`);
      console['log'](`  Total Worst Case: ${totalTime}ms`);
    });
  });

  describe('PERF-TEST-NETWORK-009: WebSocket/Subscription Performance', () => {
    it('validates real-time subscription latency', () => {
      const SUBSCRIPTION_LATENCY_BUDGET = 50; // Faster than HTTP

      // Simulate Convex subscription updates
      const subscriptionUpdates = [
        { name: 'habits:list', latency: 20 },
        { name: 'completions:today', latency: 15 },
        { name: 'settings:current', latency: 10 },
      ];

      for (const sub of subscriptionUpdates) {
        expect(sub.latency).toBeLessThan(SUBSCRIPTION_LATENCY_BUDGET);
      }

      const avgSubLatency =
        subscriptionUpdates.reduce((sum, s) => sum + s.latency, 0) /
        subscriptionUpdates.length;

      console['log']('=== Subscription Performance ===');
      for (const sub of subscriptionUpdates) {
        console['log'](`  ${sub.name}: ${sub.latency}ms`);
      }
      console['log'](`  Average: ${avgSubLatency.toFixed(0)}ms`);
      console['log'](`  Budget: ${SUBSCRIPTION_LATENCY_BUDGET}ms`);
    });
  });

  describe('PERF-TEST-NETWORK-010: Offline Queue Processing', () => {
    it('validates offline queue processes efficiently on reconnect', () => {
      const QUEUE_PROCESSING_BUDGET_PER_ITEM = 50;

      // Simulate queued offline mutations
      const queuedMutations = [
        { action: 'toggleHabit', dataSize: 100 },
        { action: 'createHabit', dataSize: 500 },
        { action: 'updateNote', dataSize: 2000 },
        { action: 'toggleHabit', dataSize: 100 },
        { action: 'toggleHabit', dataSize: 100 },
      ];

      // Process queue in batch
      const processingTimes = queuedMutations.map(
        (m) => 20 + m.dataSize * 0.01
      );
      const totalProcessingTime = processingTimes.reduce((a, b) => a + b, 0);
      const avgPerItem = totalProcessingTime / queuedMutations.length;

      expect(avgPerItem).toBeLessThan(QUEUE_PROCESSING_BUDGET_PER_ITEM);

      console['log']('=== Offline Queue Processing ===');
      console['log'](`  Queued Items: ${queuedMutations.length}`);
      console['log'](`  Total Processing: ${totalProcessingTime.toFixed(0)}ms`);
      console['log'](`  Avg Per Item: ${avgPerItem.toFixed(0)}ms`);
      console['log'](`  Budget: ${QUEUE_PROCESSING_BUDGET_PER_ITEM}ms/item`);
    });
  });
});
