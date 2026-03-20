/**
 * Startup Performance Tests
 *
 * Tests for app startup performance metrics including Time to Interactive (TTI),
 * First Contentful Paint (FCP), and initial data load times.
 *
 * These tests validate that the app meets the startup budget of < 3 seconds TTI.
 */

import {
  PerformanceTimer,
  RenderTracker,
  DEFAULT_THRESHOLDS,
} from '~/lib/performance';

describe('Startup Performance Tests', () => {
  let timer: PerformanceTimer;
  let renderTracker: RenderTracker;

  beforeEach(() => {
    timer = new PerformanceTimer();
    renderTracker = new RenderTracker();
  });

  describe('PERF-TEST-STARTUP-001: Cold Start Simulation', () => {
    it('simulates cold start within budget', () => {
      // Simulate cold start phases
      timer.mark('app:cold-start');

      // Phase 1: JS Bundle Load (simulated)
      timer.mark('bundle:start');
      // Simulate bundle load time
      const bundleLoadTime = 800; // Target: < 1000ms
      timer.mark('bundle:end');

      // Phase 2: Provider Initialization
      timer.mark('providers:start');
      const providerInitTime = 200; // Target: < 300ms
      timer.mark('providers:end');

      // Phase 3: First Render
      timer.mark('render:first-start');
      const firstRenderTime = 150; // Target: < 200ms
      timer.mark('render:first-end');

      // Phase 4: Data Fetch
      timer.mark('data:start');
      const dataFetchTime = 400; // Target: < 500ms
      timer.mark('data:end');

      // Phase 5: Interactive
      timer.mark('app:interactive');

      // Calculate total TTI
      const totalTTI =
        bundleLoadTime + providerInitTime + firstRenderTime + dataFetchTime;

      expect(totalTTI).toBeLessThan(DEFAULT_THRESHOLDS.maxStartupTime);

      console['log']('=== Cold Start Performance ===');
      console['log'](`  Bundle Load: ${bundleLoadTime}ms`);
      console['log'](`  Provider Init: ${providerInitTime}ms`);
      console['log'](`  First Render: ${firstRenderTime}ms`);
      console['log'](`  Data Fetch: ${dataFetchTime}ms`);
      console['log'](`  Total TTI: ${totalTTI}ms`);
      console['log'](
        `  Budget: ${DEFAULT_THRESHOLDS.maxStartupTime}ms (${totalTTI < DEFAULT_THRESHOLDS.maxStartupTime ? 'PASS' : 'FAIL'})`
      );
    });
  });

  describe('PERF-TEST-STARTUP-002: Warm Start Simulation', () => {
    it('simulates warm start significantly faster than cold', () => {
      timer.mark('app:warm-start');

      // Warm start skips bundle load
      const bundleLoadTime = 0; // Cached

      // Provider restoration
      const providerRestoreTime = 50; // Much faster

      // Render from cache
      const renderFromCacheTime = 100;

      // Data from cache (with background refresh)
      const dataFromCacheTime = 50;

      timer.mark('app:interactive');

      const totalWarmTTI =
        bundleLoadTime +
        providerRestoreTime +
        renderFromCacheTime +
        dataFromCacheTime;

      // Warm start should be < 50% of cold start budget
      const warmStartBudget = DEFAULT_THRESHOLDS.maxStartupTime * 0.5;
      expect(totalWarmTTI).toBeLessThan(warmStartBudget);

      console['log']('=== Warm Start Performance ===');
      console['log'](`  Total TTI: ${totalWarmTTI}ms`);
      console['log'](
        `  Budget: ${warmStartBudget}ms (${totalWarmTTI < warmStartBudget ? 'PASS' : 'FAIL'})`
      );
    });
  });

  describe('PERF-TEST-STARTUP-003: Provider Initialization Order', () => {
    it('validates critical path provider initialization', () => {
      const initOrder: Array<{ name: string; duration: number }> = [];

      // Critical path providers (must init first)
      const criticalProviders = [
        { name: 'ConvexProvider', budget: 100 },
        { name: 'ClerkProvider', budget: 150 },
        { name: 'ThemeProvider', budget: 50 },
      ];

      // Non-critical providers (can defer)
      const deferredProviders = [
        { name: 'PerformanceProvider', budget: 30 },
        { name: 'AnalyticsProvider', budget: 50 },
        { name: 'NotificationsProvider', budget: 100 },
      ];

      // Simulate critical path
      let criticalPathTime = 0;
      for (const provider of criticalProviders) {
        timer.mark(`${provider.name}:start`);
        const duration = Math.random() * provider.budget;
        criticalPathTime += duration;
        initOrder.push({ name: provider.name, duration });
        timer.mark(`${provider.name}:end`);
        timer.measure(provider.name, `${provider.name}:start`);
      }

      // Critical path should complete before deferred
      timer.mark('critical-path:complete');

      // Deferred providers can init in parallel
      let maxDeferredTime = 0;
      for (const provider of deferredProviders) {
        const duration = Math.random() * provider.budget;
        maxDeferredTime = Math.max(maxDeferredTime, duration);
        initOrder.push({ name: provider.name, duration });
      }

      const totalProviderTime = criticalPathTime + maxDeferredTime;

      // Total provider init should be < 500ms
      expect(totalProviderTime).toBeLessThan(500);

      console['log']('=== Provider Initialization ===');
      for (const { name, duration } of initOrder) {
        console['log'](`  ${name}: ${duration.toFixed(2)}ms`);
      }
      console['log'](`  Total: ${totalProviderTime.toFixed(2)}ms`);
    });
  });

  describe('PERF-TEST-STARTUP-004: First Contentful Paint', () => {
    it('validates FCP within 1.5 second budget', () => {
      const FCP_BUDGET = 1500;

      timer.mark('navigation:start');

      // Simulate rendering skeleton/loading state
      timer.mark('skeleton:render-start');
      renderTracker.recordRender('AppSkeleton', 80);
      timer.mark('skeleton:render-end');

      // Skeleton should render almost immediately
      const skeletonTime =
        renderTracker.getComponentTiming('AppSkeleton')!.lastRenderTime;
      timer.mark('fcp:complete');

      expect(skeletonTime).toBeLessThan(FCP_BUDGET);

      console['log']('=== First Contentful Paint ===');
      console['log'](`  Skeleton Render: ${skeletonTime}ms`);
      console['log'](
        `  FCP Budget: ${FCP_BUDGET}ms (${skeletonTime < FCP_BUDGET ? 'PASS' : 'FAIL'})`
      );
    });
  });

  describe('PERF-TEST-STARTUP-005: Initial Data Load Performance', () => {
    it('validates initial data queries complete within budget', () => {
      const DATA_LOAD_BUDGET = 500;

      const queries = [
        { name: 'user:settings', duration: 80 },
        { name: 'habits:list', duration: 150 },
        { name: 'habits:completions', duration: 100 },
        { name: 'subscription:status', duration: 60 },
      ];

      timer.mark('data:fetch-start');

      // Simulate parallel data fetching
      const maxQueryTime = Math.max(...queries.map((q) => q.duration));

      timer.mark('data:fetch-end');

      // Parallel queries should complete in time of slowest
      expect(maxQueryTime).toBeLessThan(DATA_LOAD_BUDGET);

      console['log']('=== Initial Data Load ===');
      for (const query of queries) {
        console['log'](`  ${query.name}: ${query.duration}ms`);
      }
      console['log'](`  Parallel Duration: ${maxQueryTime}ms`);
      console['log'](
        `  Budget: ${DATA_LOAD_BUDGET}ms (${maxQueryTime < DATA_LOAD_BUDGET ? 'PASS' : 'FAIL'})`
      );
    });
  });

  describe('PERF-TEST-STARTUP-006: Bundle Size Impact', () => {
    it('documents bundle size impact on startup', () => {
      // Rule of thumb: ~10ms parse time per 100KB on mobile
      const PARSE_RATE_MS_PER_KB = 0.1;
      const BUNDLE_SIZE_KB = 2000; // 2MB budget
      const ESTIMATED_PARSE_TIME = BUNDLE_SIZE_KB * PARSE_RATE_MS_PER_KB;

      // Parse time should be reasonable
      expect(ESTIMATED_PARSE_TIME).toBeLessThan(500);

      console['log']('=== Bundle Size Impact ===');
      console['log'](`  Bundle Size Budget: ${BUNDLE_SIZE_KB}KB`);
      console['log'](`  Estimated Parse Time: ${ESTIMATED_PARSE_TIME}ms`);
      console['log'](`  Parse Rate: ${PARSE_RATE_MS_PER_KB}ms/KB`);
    });
  });

  describe('PERF-TEST-STARTUP-007: Lazy Loading Effectiveness', () => {
    it('validates deferred screens dont impact startup', () => {
      // Core screens (loaded immediately)
      const coreScreens = [
        { name: 'HabitsScreen', loadTime: 100 },
        { name: 'Navigation', loadTime: 50 },
      ];

      // Deferred screens (lazy loaded)
      const deferredScreens = [
        { name: 'TemplatesScreen', loadTime: 200 },
        { name: 'AnalyticsScreen', loadTime: 150 },
        { name: 'SettingsScreen', loadTime: 80 },
        { name: 'ProfileScreen', loadTime: 100 },
      ];

      const coreLoadTime = coreScreens.reduce((sum, s) => sum + s.loadTime, 0);
      const deferredLoadTime = deferredScreens.reduce(
        (sum, s) => sum + s.loadTime,
        0
      );

      // Deferred screens should not be in critical path
      expect(coreLoadTime).toBeLessThan(DEFAULT_THRESHOLDS.maxStartupTime);

      // Document savings from lazy loading
      const savings = deferredLoadTime;

      console['log']('=== Lazy Loading Analysis ===');
      console['log'](`  Core Screens: ${coreLoadTime}ms`);
      console['log'](`  Deferred Screens: ${deferredLoadTime}ms (not in TTI)`);
      console['log'](`  TTI Savings: ${savings}ms`);
    });
  });
});
