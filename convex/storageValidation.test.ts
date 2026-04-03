import {
  MAX_IMAGE_UPLOAD_BYTES,
  getInvalidImageUploadReason,
} from './storageValidation';

describe('getInvalidImageUploadReason', () => {
  it('accepts allowed image metadata', () => {
    expect(
      getInvalidImageUploadReason({
        contentType: 'image/jpeg',
        size: MAX_IMAGE_UPLOAD_BYTES,
      })
    ).toBeNull();
  });

  it('rejects missing metadata', () => {
    expect(getInvalidImageUploadReason(null)).toBe(
      'Uploaded file was not found'
    );
  });

  it('rejects unsupported content types', () => {
    expect(
      getInvalidImageUploadReason({
        contentType: 'application/pdf',
        size: 1024,
      })
    ).toBe('Unsupported image format. Use JPEG, PNG, WebP, or HEIC.');
  });

  it('rejects files larger than the limit', () => {
    expect(
      getInvalidImageUploadReason({
        contentType: 'image/png',
        size: MAX_IMAGE_UPLOAD_BYTES + 1,
      })
    ).toBe('Image too large. Maximum size is 10MB');
  });
});
