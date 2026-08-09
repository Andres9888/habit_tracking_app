import {
  trackingCompletionPatch,
  type CompletionKind,
} from '../../../convex/habits/trackingCompletionPatch';

describe('trackingCompletionPatch', () => {
  it('stores minimal only when completing as minimal', () => {
    expect(trackingCompletionPatch(true, 'minimal')).toEqual({
      completed: true,
      kind: 'minimal',
    });
  });

  it('leaves kind undefined for full completions (legacy-compatible)', () => {
    expect(trackingCompletionPatch(true)).toEqual({
      completed: true,
      kind: undefined,
    });
    expect(trackingCompletionPatch(true, 'full')).toEqual({
      completed: true,
      kind: undefined,
    });
  });

  it('clears kind when uncompleting', () => {
    expect(trackingCompletionPatch(false, 'minimal')).toEqual({
      completed: false,
      kind: undefined,
    });
  });

  it('treats streak parity: completed flag is identical for full and minimal', () => {
    const kinds: Array<CompletionKind | undefined> = [
      undefined,
      'full',
      'minimal',
    ];
    for (const kind of kinds) {
      expect(trackingCompletionPatch(true, kind).completed).toBe(true);
    }
  });
});
