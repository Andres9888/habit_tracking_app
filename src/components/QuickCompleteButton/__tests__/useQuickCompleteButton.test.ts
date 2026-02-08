/**
 * useQuickCompleteButton - setTimeout cleanup verification tests
 *
 * Verifies that:
 * - Timeout IDs are stored in refs (confettiTimeoutRef, toggleTimeoutRef)
 * - A cleanup useEffect clears both timeouts on unmount
 * - useRef is imported from react
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const HOOK_PATH = path.resolve(__dirname, '../useQuickCompleteButton.ts');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(HOOK_PATH, 'utf-8');
});

describe('useQuickCompleteButton - setTimeout cleanup', () => {
  it('should import useRef from react', () => {
    expect(source).toMatch(/import.*useRef.*from 'react'/);
  });

  it('should create confettiTimeoutRef with useRef', () => {
    expect(source).toContain('const confettiTimeoutRef = useRef');
  });

  it('should create toggleTimeoutRef with useRef', () => {
    expect(source).toContain('const toggleTimeoutRef = useRef');
  });

  it('should store confetti setTimeout ID in confettiTimeoutRef', () => {
    expect(source).toContain(
      'confettiTimeoutRef.current = setTimeout(() => setShowConfetti(false), 700)'
    );
  });

  it('should store toggle setTimeout ID in toggleTimeoutRef', () => {
    expect(source).toContain(
      'toggleTimeoutRef.current = setTimeout(() => setIsToggling(false), 300)'
    );
  });

  it('should clear confettiTimeoutRef in cleanup', () => {
    expect(source).toContain('clearTimeout(confettiTimeoutRef.current)');
  });

  it('should clear toggleTimeoutRef in cleanup', () => {
    expect(source).toContain('clearTimeout(toggleTimeoutRef.current)');
  });

  it('should have a useEffect with cleanup that clears both timeouts', () => {
    // Verify both clears happen inside a return () => { ... } pattern
    const cleanupMatch = source.match(
      /useEffect\(\(\) => \{\s*return \(\) => \{[\s\S]*?clearTimeout\(confettiTimeoutRef[\s\S]*?clearTimeout\(toggleTimeoutRef[\s\S]*?\};[\s\S]*?\}, \[\]\)/
    );
    expect(cleanupMatch).not.toBeNull();
  });
});
