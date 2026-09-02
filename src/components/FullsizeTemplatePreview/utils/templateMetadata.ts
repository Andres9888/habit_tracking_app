type MetadataLookup = Readonly<Record<string, string>> | undefined;

/** Resolve display metadata without indexing an unavailable lookup table/key. */
export function resolveMetadataValue(
  lookup: MetadataLookup,
  value: unknown,
  fallback: string
): string {
  if (typeof value !== 'string' || value.length === 0) {
    return fallback;
  }

  return lookup?.[value] ?? value;
}
