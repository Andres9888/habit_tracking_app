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

import { checkBundleBudgets, formatBytes } from './bundle-budget.mjs';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const outputDirectory = mkdtempSync(join(tmpdir(), 'habit-app-ios-export-'));
const expoBinary = join(projectRoot, 'node_modules', '.bin', 'expo');

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
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
      // NODE_ENV must be production *before* Babel loads: the lucide
      // direct-import rewrite and react-native-paper/babel plugins in
      // babel.config.cjs are gated on it at config-load time. Without this we
      // would measure a bundle that is not what ships.
      env: { ...process.env, NODE_ENV: 'production' },
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

  const { failures, lines } = checkBundleBudgets({
    assets: assetBytes,
    javascript: bundleBytes,
    total: bundleBytes + assetBytes,
  });

  console.log('\nBudgets');
  for (const line of lines) console.log(line);

  if (failures.length > 0) {
    console.error(`\n${failures.length} budget failure(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
  }
} finally {
  rmSync(outputDirectory, { force: true, recursive: true });
}
