#!/usr/bin/env node

import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const outputDirectory = mkdtempSync(join(tmpdir(), 'habit-app-ios-export-'));
const expoBinary = join(projectRoot, 'node_modules', '.bin', 'expo');
const configuredBudget = Number.parseInt(
  process.env.PERF_IOS_BUNDLE_BUDGET_BYTES ?? '',
  10
);

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

try {
  const result = spawnSync(
    expoBinary,
    [
      'export',
      '--platform',
      'ios',
      '--no-bytecode',
      '--source-maps',
      '--output-dir',
      outputDirectory,
    ],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: 'inherit',
    }
  );

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Expo export failed with status ${result.status ?? 1}.`);
  }

  const files = listFiles(outputDirectory);
  const bundles = files.filter(
    (path) => path.endsWith('.js') && !path.endsWith('.js.map')
  );
  if (bundles.length !== 1) {
    throw new Error(
      `Expected one iOS JavaScript bundle, found ${bundles.length}.`
    );
  }

  const bundlePath = bundles[0];
  const bundle = readFileSync(bundlePath);
  const bundleBytes = bundle.byteLength;
  const assetBytes = files
    .filter((path) => path.includes(`${join('', 'assets')}/`))
    .reduce((total, path) => total + statSync(path).size, 0);
  const measurement = {
    assetBytes,
    bundleBytes,
    bundleGzipBytes: gzipSync(bundle, { level: 9 }).byteLength,
    bundlePath: relative(outputDirectory, bundlePath),
  };

  console.log('\nProduction iOS export measurement');
  console.log(`  JavaScript: ${formatBytes(measurement.bundleBytes)}`);
  console.log(`  JavaScript gzip: ${formatBytes(measurement.bundleGzipBytes)}`);
  console.log(`  Assets: ${formatBytes(measurement.assetBytes)}`);
  console.log(`  Bundle: ${measurement.bundlePath}`);

  if (Number.isFinite(configuredBudget)) {
    console.log(`  Budget: ${formatBytes(configuredBudget)}`);
    if (bundleBytes > configuredBudget) {
      console.error(
        `\nBundle exceeds budget by ${formatBytes(bundleBytes - configuredBudget)}.`
      );
      process.exitCode = 1;
    }
  }
} finally {
  rmSync(outputDirectory, { force: true, recursive: true });
}
