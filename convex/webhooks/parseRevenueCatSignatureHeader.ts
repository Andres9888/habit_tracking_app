import { isValidRevenueCatSignatureHex } from './revenuecatSignatureCrypto';

export interface ParsedRevenueCatSignatureHeader {
  signatureHex: string;
  timestamp: number;
}

export function parseRevenueCatSignatureHeader(
  signatureHeader: string
): ParsedRevenueCatSignatureHeader | undefined {
  const fields = parseFields(signatureHeader);
  if (!fields || fields.size !== 2) return undefined;

  const timestampValue = fields.get('t');
  const signatureHex = fields.get('v1');
  if (!timestampValue || !signatureHex || !/^\d+$/.test(timestampValue)) {
    return undefined;
  }

  const timestamp = Number(timestampValue);
  if (
    !Number.isSafeInteger(timestamp) ||
    !isValidRevenueCatSignatureHex(signatureHex)
  ) {
    return undefined;
  }

  return { signatureHex: signatureHex.toLowerCase(), timestamp };
}

function parseFields(signatureHeader: string): Map<string, string> | undefined {
  if (!signatureHeader) return undefined;

  const fields = new Map<string, string>();
  for (const entry of signatureHeader.split(',')) {
    if (!addField(fields, entry.trim())) return undefined;
  }
  return fields;
}

function addField(fields: Map<string, string>, entry: string): boolean {
  const separatorIndex = entry.indexOf('=');
  if (separatorIndex <= 0 || separatorIndex !== entry.lastIndexOf('=')) {
    return false;
  }

  const key = entry.slice(0, separatorIndex);
  const value = entry.slice(separatorIndex + 1);
  if (!value || fields.has(key) || (key !== 't' && key !== 'v1')) {
    return false;
  }

  fields.set(key, value);
  return true;
}
