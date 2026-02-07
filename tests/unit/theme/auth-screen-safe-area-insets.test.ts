/**
 * Auth Screen Safe Area Inset Standardization Tests (Phase 7 Task 3)
 * Verifies auth screens use consistent insets.top + 24 for content areas
 * and insets.top + 8 for back buttons / nav elements.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('SignInScreen safe area handling', () => {
  const source = readSource('screens/auth/SignInScreen.tsx');

  it('imports useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('calls useSafeAreaInsets hook', () => {
    expect(source).toMatch(/const\s+insets\s*=\s*useSafeAreaInsets\(\)/);
  });

  it('uses insets.top + 24 for content paddingTop', () => {
    expect(source).toMatch(/insets\.top\s*\+\s*24/);
  });

  it('does not use old insets.top + 40', () => {
    expect(source).not.toMatch(/insets\.top\s*\+\s*40/);
  });
});

describe('SignUpScreen safe area handling', () => {
  const source = readSource('screens/auth/SignUpScreen.tsx');

  it('imports useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('calls useSafeAreaInsets hook', () => {
    expect(source).toMatch(/const\s+insets\s*=\s*useSafeAreaInsets\(\)/);
  });

  it('uses insets.top + 24 for content paddingTop', () => {
    expect(source).toMatch(/insets\.top\s*\+\s*24/);
  });

  it('does not use old insets.top + 16', () => {
    expect(source).not.toMatch(/insets\.top\s*\+\s*16/);
  });
});

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

  it('keeps BackButton at insets.top + 8', () => {
    expect(source).toMatch(/insets\.top\s*\+\s*8/);
  });
});

describe('Consistent auth screen inset formula', () => {
  const signIn = readSource('screens/auth/SignInScreen.tsx');
  const signUp = readSource('screens/auth/SignUpScreen.tsx');
  const welcome = readSource('screens/auth/WelcomeScreen.tsx');

  it('all auth screens use insets.top + 24 for content', () => {
    const contentFormula = /insets\.top\s*\+\s*24/;
    expect(signIn).toMatch(contentFormula);
    expect(signUp).toMatch(contentFormula);
    expect(welcome).toMatch(contentFormula);
  });

  it('WelcomeScreen BackButton uses insets.top + 8 (nav standard)', () => {
    expect(welcome).toMatch(/insets\.top\s*\+\s*8/);
  });
});
