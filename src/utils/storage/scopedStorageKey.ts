export function normalizeStorageScope(
  scope: string | null | undefined
): string | null {
  const trimmed = scope?.trim();
  return trimmed ? trimmed : null;
}

export function buildScopedStorageKey(
  baseKey: string,
  scope: string | null | undefined
): string {
  const normalizedScope = normalizeStorageScope(scope);
  if (!normalizedScope) {
    return baseKey;
  }

  return `${baseKey}:${encodeURIComponent(normalizedScope)}`;
}
