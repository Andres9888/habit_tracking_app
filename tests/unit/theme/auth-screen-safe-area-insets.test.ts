/**
 * Auth Screen Safe Area Inset Standardization Tests
 * Verifies WelcomeScreen (OAuth-only) uses consistent insets.top + 24 for content.
 * SignInScreen and SignUpScreen were removed in the OAuth-only migration.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('WelcomeScreen safe area handling', () => {
  const source = readSource('screens/auth/WelcomeScreen.tsx');

  it('imports useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('calls useSafeAreaInsets hook', () => {
    expect(source).toMatch(/const\s+insets\s*=\s*useSafeAreaInsets\(\)/);
  });

  it('uses insets.top + 24 for welcome content area', () => {
    expect(source).toMatch(/insets\.top\s*\+\s*24/);
  });

  it('does not use old insets.top + 60', () => {
    expect(source).not.toMatch(/insets\.top\s*\+\s*60/);
  });
});
