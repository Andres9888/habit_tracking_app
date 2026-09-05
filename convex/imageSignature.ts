/**
 * Byte-signature ("magic number") sniffing for uploaded images.
 * A client-declared Content-Type is just a header; this checks the actual
 * leading bytes so an HTML/SVG/anything payload can't slip in as `image/png`.
 */

const HEIC_BRANDS = new Set([
  'heic',
  'heix',
  'hevc',
  'hevx',
  'heim',
  'heis',
  'avic',
]);
const HEIF_BRANDS = new Set(['mif1', 'msf1', 'heif']);
const HEIC_HEIF_TYPES = new Set(['image/heic', 'image/heif']);
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function asciiAt(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.slice(start, end));
}

/** Returns the MIME type implied by the leading bytes, or null if unrecognised. */
export function detectImageContentType(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  if (PNG_SIGNATURE.every((byte, i) => bytes[i] === byte)) {
    return 'image/png';
  }

  if (asciiAt(bytes, 0, 4) === 'RIFF' && asciiAt(bytes, 8, 12) === 'WEBP') {
    return 'image/webp';
  }

  if (asciiAt(bytes, 4, 8) === 'ftyp') {
    const brand = asciiAt(bytes, 8, 12);
    if (HEIC_BRANDS.has(brand)) return 'image/heic';
    if (HEIF_BRANDS.has(brand)) return 'image/heif';
  }

  return null;
}

/** True when the declared type and the sniffed type agree (HEIC/HEIF are interchangeable). */
export function declaredTypeMatchesBytes(
  declared: string,
  bytes: Uint8Array
): boolean {
  const detected = detectImageContentType(bytes);
  if (detected === null) return false;
  if (detected === declared) return true;
  return HEIC_HEIF_TYPES.has(detected) && HEIC_HEIF_TYPES.has(declared);
}

/** Concatenates the first `count` bytes across chunks (a chunk may be shorter than `count`). */
export function leadingBytes(
  chunks: Uint8Array[],
  count: number
): Uint8Array {
  const head = new Uint8Array(count);
  let offset = 0;
  for (const chunk of chunks) {
    if (offset >= count) break;
    const take = Math.min(chunk.length, count - offset);
    head.set(chunk.subarray(0, take), offset);
    offset += take;
  }
  return offset < count ? head.subarray(0, offset) : head;
}
