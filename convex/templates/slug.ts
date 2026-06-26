/**
 * Deterministic template slug derived from the template name.
 *
 * Slugs are NOT stored — they are derived on read (see getBySlug) and built
 * client-side for share links. Keep this logic identical to the client mirror
 * at src/utils/templateSlug.ts.
 */

export function toSlug(name: string): string {
  return name
    .normalize('NFD')
    .replaceAll(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-') // non-alphanumeric runs → hyphen
    .replaceAll(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}
