import { structuralEqual } from '../equality';

describe('structuralEqual', () => {
  it('compares primitives by value', () => {
    expect(structuralEqual(1, 1)).toBe(true);
    expect(structuralEqual('a', 'a')).toBe(true);
    expect(structuralEqual(1, 2)).toBe(false);
    expect(structuralEqual(1, '1')).toBe(false);
    expect(structuralEqual(null, undefined)).toBe(false);
  });

  it('treats NaN as equal to itself (Object.is semantics)', () => {
    expect(structuralEqual(NaN, NaN)).toBe(true);
  });

  it('is key-order insensitive for objects', () => {
    expect(structuralEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('is length- and order-sensitive for arrays', () => {
    expect(structuralEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(structuralEqual([1, 2, 3], [1, 2])).toBe(false);
    expect(structuralEqual([1, 2, 3], [3, 2, 1])).toBe(false);
  });

  it('recurses into nested structures', () => {
    const a = { items: [{ id: 1, tags: ['x'] }], meta: { n: 2 } };
    const b = { meta: { n: 2 }, items: [{ tags: ['x'], id: 1 }] };
    expect(structuralEqual(a, b)).toBe(true);
    expect(structuralEqual(a, { ...a, meta: { n: 3 } })).toBe(false);
  });

  it('does not treat arrays and objects as equal', () => {
    expect(structuralEqual([], {})).toBe(false);
  });

  it('treats {a: undefined} and {} as unequal', () => {
    expect(structuralEqual({ a: undefined }, {})).toBe(false);
    expect(structuralEqual({}, { a: undefined })).toBe(false);
  });

  it('treats non-plain objects as unequal unless same reference', () => {
    const date = new Date(0);
    expect(structuralEqual(date, new Date(0))).toBe(false);
    expect(structuralEqual(date, date)).toBe(true);
  });
});
