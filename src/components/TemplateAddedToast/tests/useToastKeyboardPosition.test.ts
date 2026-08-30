import {
  computeKeyboardOverlap,
  computeToastKeyboardClearance,
} from '../toastKeyboardGeometry';

describe('computeKeyboardOverlap', () => {
  it('measures the keyboard obstruction from its screen frame', () => {
    expect(computeKeyboardOverlap(844, 508)).toBe(336);
  });

  it('clamps a keyboard frame below the screen', () => {
    expect(computeKeyboardOverlap(844, 900)).toBe(0);
  });
});

describe('computeToastKeyboardClearance', () => {
  it('lifts an iOS toast by the keyboard height outside the safe area', () => {
    expect(computeToastKeyboardClearance(34, 336, true)).toBe(302);
  });

  it('does not lift when the keyboard is hidden', () => {
    expect(computeToastKeyboardClearance(34, 0, true)).toBe(0);
  });

  it('clamps clearance when the safe area is taller than the keyboard', () => {
    expect(computeToastKeyboardClearance(34, 20, true)).toBe(0);
  });

  it('does not double-lift an Android adjustResize viewport', () => {
    expect(computeToastKeyboardClearance(34, 336, false)).toBe(0);
  });

  it('clamps invalid negative geometry', () => {
    expect(computeToastKeyboardClearance(-10, -20, true)).toBe(0);
  });
});
