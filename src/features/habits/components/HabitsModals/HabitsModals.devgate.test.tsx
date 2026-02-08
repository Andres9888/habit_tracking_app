/**
 * HabitsModals - __DEV__ gating tests
 *
 * Verifies that the HapticTest diagnostic tool is only rendered in dev mode.
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('HabitsModals __DEV__ gating', () => {
  it('HapticTestModalSection render is wrapped in __DEV__ guard', () => {
    const filePath = path.resolve(__dirname, 'HabitsModals.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Should wrap the render in {__DEV__ && (...)}
    expect(content).toMatch(/\{__DEV__\s*&&\s*\(/);
    expect(content).toMatch(/HapticTestModalSection/);
  });

  it('SettingsModalSection gates onOpenHapticTest behind __DEV__', () => {
    const filePath = path.resolve(__dirname, 'SettingsModalSection.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Should use __DEV__ ternary for the haptic test prop
    expect(content).toMatch(/__DEV__\s*\?\s*openHapticTest\s*:\s*undefined/);
  });

  it('buildModalsStateReturnValue gates openHapticTest behind __DEV__', () => {
    const filePath = path.resolve(
      __dirname,
      '../../hooks/buildModalsStateReturnValue.ts'
    );
    const content = fs.readFileSync(filePath, 'utf-8');

    // openHapticTest handler should be gated behind __DEV__
    expect(content).toMatch(/openHapticTest:\s*__DEV__/);
  });

  it('HabitsModals.helpers gates openHapticTest behind __DEV__', () => {
    const filePath = path.resolve(__dirname, 'HabitsModals.helpers.ts');
    const content = fs.readFileSync(filePath, 'utf-8');

    // openHapticTest should be conditionally passed
    expect(content).toMatch(/__DEV__\s*\?\s*state\.openHapticTest/);
  });
});
