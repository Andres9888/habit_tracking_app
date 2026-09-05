/** @jest-environment node */
import {
  declaredTypeMatchesBytes,
  detectImageContentType,
  leadingBytes,
} from './imageSignature';

function bytes(...values: number[]): Uint8Array {
  return new Uint8Array(values);
}

function ascii(text: string, totalLength = 12): Uint8Array {
  const out = new Uint8Array(totalLength);
  for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i);
  return out;
}

const JPEG = bytes(0xff, 0xd8, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0);
const PNG = bytes(
  0x89,
  0x50,
  0x4e,
  0x47,
  0x0d,
  0x0a,
  0x1a,
  0x0a,
  0,
  0,
  0,
  0
);
function webp(): Uint8Array {
  const out = new Uint8Array(12);
  out.set(ascii('RIFF', 4));
  out.set(ascii('WEBP', 4), 8);
  return out;
}
function heicLike(brand: string): Uint8Array {
  const out = new Uint8Array(12);
  out.set(ascii('ftyp', 4), 4);
  out.set(ascii(brand, 4), 8);
  return out;
}
const HTML = ascii('<!DOCTYPE html>', 15);

describe('detectImageContentType', () => {
  it('detects jpeg from FF D8 FF', () => {
    expect(detectImageContentType(JPEG)).toBe('image/jpeg');
  });

  it('detects png from the 8-byte PNG signature', () => {
    expect(detectImageContentType(PNG)).toBe('image/png');
  });

  it('detects webp from RIFF....WEBP', () => {
    expect(detectImageContentType(webp())).toBe('image/webp');
  });

  it('detects heic from ftyp + heic major brand', () => {
    expect(detectImageContentType(heicLike('heic'))).toBe('image/heic');
  });

  it('detects heif from ftyp + mif1 major brand', () => {
    expect(detectImageContentType(heicLike('mif1'))).toBe('image/heif');
  });

  it('returns null for an HTML payload', () => {
    expect(detectImageContentType(HTML)).toBeNull();
  });

  it('returns null when fewer than 12 bytes are available', () => {
    expect(detectImageContentType(bytes(0x89, 0x50, 0x4e))).toBeNull();
  });
});

describe('declaredTypeMatchesBytes', () => {
  it('treats heic and heif as interchangeable', () => {
    expect(declaredTypeMatchesBytes('image/heif', heicLike('heic'))).toBe(
      true
    );
  });

  it('rejects a declared type that does not match the sniffed bytes', () => {
    expect(declaredTypeMatchesBytes('image/png', JPEG)).toBe(false);
  });
});

describe('leadingBytes', () => {
  it('concatenates across chunks shorter than the requested count', () => {
    const chunks = [bytes(1, 2), bytes(3), bytes(4, 5, 6, 7, 8, 9)];
    expect(Array.from(leadingBytes(chunks, 5))).toEqual([1, 2, 3, 4, 5]);
  });
});
