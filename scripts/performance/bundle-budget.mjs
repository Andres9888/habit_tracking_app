#!/usr/bin/env node

/**
 * Single source of truth for bundle budgets.
 *
 * `performance.budget.json` holds the *target* budgets. Because the app is
 * currently over those targets, each budget also supports an env override that
 * acts as a ratchet: CI fails if the bundle grows past the ratchet, and the
 * ratchet is tightened toward the target as wins land. Never loosen a ratchet
 * without a note explaining why.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const budgetFile = fileURLToPath(
  new URL('../../performance.budget.json', import.meta.url)
);

const OVERRIDES = {
  assets: 'PERF_IOS_ASSET_BUDGET_BYTES',
  javascript: 'PERF_IOS_BUNDLE_BUDGET_BYTES',
  total: 'PERF_IOS_TOTAL_BUDGET_BYTES',
};

function readOverride(key) {
  const parsed = Number.parseInt(process.env[OVERRIDES[key]] ?? '', 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

/**
 * @returns {Record<'assets'|'javascript'|'total', {enforced: number, target: number, ratcheted: boolean}>}
 */
export function loadBundleBudgets() {
  const { budgets } = JSON.parse(readFileSync(budgetFile, 'utf8'));

  return Object.fromEntries(
    Object.keys(OVERRIDES).map((key) => {
      const target = budgets.bundle[key].maxSizeBytes;
      const override = readOverride(key);
      return [
        key,
        {
          enforced: override ?? target,
          ratcheted: override !== undefined && override !== target,
          target,
        },
      ];
    })
  );
}

/**
 * Compares measured sizes against enforced budgets.
 *
 * @param {Record<string, number>} measured
 * @returns {{failures: string[], lines: string[]}}
 */
export function checkBundleBudgets(measured) {
  const budgets = loadBundleBudgets();
  const failures = [];
  const lines = [];

  for (const [key, { enforced, ratcheted, target }] of Object.entries(
    budgets
  )) {
    const size = measured[key];
    if (!Number.isFinite(size)) continue;

    const over = size > enforced;
    const suffix = ratcheted ? ` (target ${formatBytes(target)})` : '';
    // Exact bytes are printed so the ratchet in package.json can be tightened
    // to the measured value without guessing at rounded MiB.
    lines.push(
      `  ${over ? 'FAIL' : 'ok  '} ${key}: ${formatBytes(size)} / ${formatBytes(enforced)}${suffix} [${size} B]`
    );
    if (over) {
      failures.push(
        `${key} exceeds budget by ${formatBytes(size - enforced)} (${formatBytes(size)} > ${formatBytes(enforced)})`
      );
    }
  }

  return { failures, lines };
}
