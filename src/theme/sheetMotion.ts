/**
 * Sheet motion worklets — canonical source.
 *
 * Promoted verbatim from `NoteSheet.motion.ts` so every bottom sheet shares
 * the same velocity projection and overdrag resistance maths.
 */

/**
 * Projects where a flick would land, given its release velocity.
 * Mirrors the UIScrollView deceleration model used by iOS sheets.
 */
export function project(velocity: number, decelerationRate = 0.998) {
  'worklet';
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Rubberband resistance for dragging past a boundary — the further past the
 * edge, the less the sheet moves.
 */
export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55
) {
  'worklet';
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}
