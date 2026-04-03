export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_IMAGE_CONTENT_TYPES = new Set([
  'image/heic',
  'image/heif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

interface UploadMetadata {
  contentType?: string | null;
  size: number;
}

export function getInvalidImageUploadReason(
  metadata: UploadMetadata | null
): string | null {
  if (!metadata) {
    return 'Uploaded file was not found';
  }

  if (
    !metadata.contentType ||
    !ALLOWED_IMAGE_CONTENT_TYPES.has(metadata.contentType)
  ) {
    return 'Unsupported image format. Use JPEG, PNG, WebP, or HEIC.';
  }

  if (metadata.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `Image too large. Maximum size is ${MAX_IMAGE_UPLOAD_BYTES / 1024 / 1024}MB`;
  }

  return null;
}
