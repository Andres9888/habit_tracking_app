/**
 * catch parameter naming compliance tests
 *
 * Verifies that catch blocks follow the unicorn/catch-error-name rule:
 * - No `catch (e)` — must use `catch (error)` or `catch (error_)` for inner scopes
 * - No `catch (error: any)` — must use `catch (error_: unknown)`
 * - Unused catch bindings should be removed entirely: `catch {`
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('purchases.ts — catch parameter naming', () => {
  let source: string;

  beforeAll(() => {
    const filePath = path.resolve(
      __dirname,
      '../lib/purchases.ts'
    );
    source = fs.readFileSync(filePath, 'utf-8');
  });

  it('should not contain catch (e)', () => {
    expect(source).not.toMatch(/catch\s*\(\s*e\s*\)/);
  });

  it('should use error_ for the inner catch (avoids shadowing outer error)', () => {
    expect(source).toMatch(/catch\s*\(\s*error_\s*\)/);
  });

  it('should use error for the outer catch blocks', () => {
    const outerCatches = source.match(/catch\s*\(\s*error\s*\)/g);
    expect(outerCatches).not.toBeNull();
    expect(outerCatches!.length).toBeGreaterThanOrEqual(1);
  });
});

describe('useReduceMotion.ts — catch parameter naming', () => {
  let source: string;

  beforeAll(() => {
    const filePath = path.resolve(
      __dirname,
      '../hooks/useReduceMotion.ts'
    );
    source = fs.readFileSync(filePath, 'utf-8');
  });

  it('should not contain catch (e)', () => {
    expect(source).not.toMatch(/catch\s*\(\s*e\s*\)/);
  });

  it('should use empty catch binding for unused parameter', () => {
    expect(source).toMatch(/catch\s*\{/);
  });
});

describe('SocialLoginButtons.tsx — catch parameter naming and typing', () => {
  let source: string;

  beforeAll(() => {
    const filePath = path.resolve(
      __dirname,
      '../components/auth/SocialLoginButtons/SocialLoginButtons.tsx'
    );
    source = fs.readFileSync(filePath, 'utf-8');
  });

  it('should not contain catch (error: any)', () => {
    expect(source).not.toMatch(/catch\s*\(\s*error\s*:\s*any\s*\)/);
  });

  it('should use unknown type annotation on both catch blocks', () => {
    const unknownCatches = source.match(
      /catch\s*\(\s*error_\s*:\s*unknown\s*\)/g
    );
    expect(unknownCatches).not.toBeNull();
    expect(unknownCatches!.length).toBe(2);
  });

  it('should use error_ as the catch parameter name', () => {
    const errorUnderscoreCatches = source.match(
      /catch\s*\(\s*error_/g
    );
    expect(errorUnderscoreCatches).not.toBeNull();
    expect(errorUnderscoreCatches!.length).toBe(2);
  });
});

describe('useSignUpFlow.ts — catch parameter naming and typing', () => {
  let source: string;

  beforeAll(() => {
    const filePath = path.resolve(
      __dirname,
      '../screens/auth/hooks/useSignUpFlow.ts'
    );
    source = fs.readFileSync(filePath, 'utf-8');
  });

  it('should not contain catch (error: any)', () => {
    expect(source).not.toMatch(/catch\s*\(\s*error\s*:\s*any\s*\)/);
  });

  it('should use unknown type annotation on both catch blocks', () => {
    const unknownCatches = source.match(
      /catch\s*\(\s*error_\s*:\s*unknown\s*\)/g
    );
    expect(unknownCatches).not.toBeNull();
    expect(unknownCatches!.length).toBe(2);
  });

  it('should use error_ as the catch parameter name', () => {
    const errorUnderscoreCatches = source.match(
      /catch\s*\(\s*error_/g
    );
    expect(errorUnderscoreCatches).not.toBeNull();
    expect(errorUnderscoreCatches!.length).toBe(2);
  });

  it('should type-narrow clerk errors with explicit assertion', () => {
    const clerkAssertions = source.match(
      /as\s*\{\s*errors\?\s*:/g
    );
    expect(clerkAssertions).not.toBeNull();
    expect(clerkAssertions!.length).toBe(2);
  });
});
