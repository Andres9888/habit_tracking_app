// Structural equality for JSON-serializable Convex values. Used to collapse
// content-identical query results (fresh instance, same data) back onto the
// prior reference so useSyncExternalStore readers can bail on re-render.
// Assumes acyclic JSON (Convex payloads) — no cycle guard.

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function arraysEqual(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, i) => structuralEqual(item, b[i]));
}

function objectsEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!structuralEqual(a[key], b[key])) return false;
  }
  return true;
}

export function structuralEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray || bIsArray) {
    return aIsArray && bIsArray && arraysEqual(a, b);
  }

  if (isPlainObject(a) && isPlainObject(b)) return objectsEqual(a, b);

  // Non-plain objects (Date, Map, class instances) and primitives that failed
  // Object.is are treated as unequal — Convex values are plain JSON.
  return false;
}
