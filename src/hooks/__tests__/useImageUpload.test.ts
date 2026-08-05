/**
 * Tests for useImageUpload hook
 *
 * Story T12.3: Image upload to Convex storage for Vision Board
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

// Mock Convex
const mockGenerateUploadUrl = jest.fn();
const mockValidateImageUpload = jest.fn();

jest.mock('convex/react', () => ({
  useMutation: (reference: string) => {
    if (reference === 'storage:validateImageUpload') {
      return mockValidateImageUpload;
    }

    return mockGenerateUploadUrl;
  },
}));

// Mock convex API
jest.mock('../../../convex/_generated/api', () => ({
  api: {
    storage: {
      generateUploadUrl: 'storage:generateUploadUrl',
      validateImageUpload: 'storage:validateImageUpload',
    },
  },
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { useImageUpload } from '../useImageUpload';
import type { PickedImage } from '../useImagePicker';

describe('useImageUpload', () => {
  const mockImage: PickedImage = {
    uri: 'file://test-image.jpg',
    width: 1000,
    height: 1000,
    type: 'image',
    mimeType: 'image/jpeg',
    fileSize: 50000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateImageUpload.mockResolvedValue({
      contentType: 'image/jpeg',
      ok: true,
      size: 50000,
      storageId: 'storage-id-123',
    });
  });

  describe('initial state', () => {
    it('is not uploading initially', () => {
      const { result } = renderHook(() => useImageUpload());
      expect(result.current.isUploading).toBe(false);
    });

    it('has zero progress initially', () => {
      const { result } = renderHook(() => useImageUpload());
      expect(result.current.progress).toBe(0);
    });

    it('has no error initially', () => {
      const { result } = renderHook(() => useImageUpload());
      expect(result.current.error).toBeNull();
    });
  });

  describe('uploadImage', () => {
    it('generates upload URL from Convex', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      // Mock file fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
      });

      // Mock upload fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.uploadImage(mockImage);
      });

      expect(mockGenerateUploadUrl).toHaveBeenCalled();
      expect(mockValidateImageUpload).toHaveBeenCalledWith({
        storageId: 'storage-id-123',
      });
    });

    it('fetches local file as blob', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.uploadImage(mockImage);
      });

      // First fetch should be to the local file URI
      expect(mockFetch).toHaveBeenNthCalledWith(1, 'file://test-image.jpg');
    });

    it('uploads blob to Convex storage', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      const mockBlob = new Blob(['test-data'], { type: 'image/jpeg' });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.uploadImage(mockImage);
      });

      // Second fetch should be POST to upload URL
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'https://upload-url.test',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: mockBlob,
        })
      );
    });

    it('returns storage ID on success', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      const { result } = renderHook(() => useImageUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadImage(mockImage);
      });

      expect(uploadResult).toEqual({
        storageId: 'storage-id-123',
        url: 'https://upload-url.test',
      });
    });

    it('rejects unsupported blob content types', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () =>
          Promise.resolve(new Blob(['test'], { type: 'application/pdf' })),
      });

      const { result } = renderHook(() => useImageUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadImage(mockImage);
      });

      expect(uploadResult).toBeNull();
      expect(result.current.error).toBe(
        'Unsupported image format. Use JPEG, PNG, WebP, or HEIC.'
      );
      expect(mockValidateImageUpload).not.toHaveBeenCalled();
    });

    it('sets progress to 1 on completion', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.uploadImage(mockImage);
      });

      expect(result.current.progress).toBe(1);
    });

    it('sets isUploading during upload', async () => {
      let resolveUploadUrl: (value: string) => void;
      const uploadUrlPromise = new Promise<string>((resolve) => {
        resolveUploadUrl = resolve;
      });

      mockGenerateUploadUrl.mockReturnValueOnce(uploadUrlPromise);

      const { result } = renderHook(() => useImageUpload());

      // Start upload (don't await)
      let uploadPromise: Promise<unknown>;
      act(() => {
        uploadPromise = result.current.uploadImage(mockImage);
      });

      // Should be uploading now
      expect(result.current.isUploading).toBe(true);

      // Complete the flow
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      await act(async () => {
        resolveUploadUrl!('https://upload-url.test');
        await uploadPromise;
      });

      expect(result.current.isUploading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('sets error when file fetch fails', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() => useImageUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadImage(mockImage);
      });

      expect(uploadResult).toBeNull();
      expect(result.current.error).toBe('Failed to read local file: 404');
      expect(result.current.isUploading).toBe(false);
    });

    it('sets error when upload fails', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Server error'),
      });

      const { result } = renderHook(() => useImageUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadImage(mockImage);
      });

      expect(uploadResult).toBeNull();
      expect(result.current.error).toBe('Upload failed: 500 - Server error');
    });

    it('sets error when server-side validation fails', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');
      mockValidateImageUpload.mockResolvedValueOnce({
        error: 'Unsupported image format. Use JPEG, PNG, WebP, or HEIC.',
        ok: false,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      const { result } = renderHook(() => useImageUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadImage(mockImage);
      });

      expect(uploadResult).toBeNull();
      expect(result.current.error).toBe(
        'Unsupported image format. Use JPEG, PNG, WebP, or HEIC.'
      );
    });

    it('sets error when file is too large', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      // Create a blob larger than 10MB
      const largeBlob = new Blob(['x'.repeat(11 * 1024 * 1024)], {
        type: 'image/jpeg',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(largeBlob),
      });

      const { result } = renderHook(() => useImageUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadImage(mockImage);
      });

      expect(uploadResult).toBeNull();
      expect(result.current.error).toBe(
        'Image too large. Maximum size is 10MB'
      );
    });

    it('resets progress on error', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.uploadImage(mockImage);
      });

      expect(result.current.progress).toBe(0);
    });
  });

  describe('clearError', () => {
    it('clears the error state', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.uploadImage(mockImage);
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('mimeType handling', () => {
    it('uses provided mimeType in upload headers', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      const pngImage: PickedImage = {
        ...mockImage,
        mimeType: 'image/png',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/png' })),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.uploadImage(pngImage);
      });

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'https://upload-url.test',
        expect.objectContaining({
          headers: {
            'Content-Type': 'image/png',
          },
        })
      );
    });

    it('defaults to image/jpeg when no mimeType provided', async () => {
      mockGenerateUploadUrl.mockResolvedValueOnce('https://upload-url.test');

      const imageWithoutMime: PickedImage = {
        uri: 'file://test.jpg',
        width: 100,
        height: 100,
        type: 'image',
        mimeType: '', // Empty string
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ storageId: 'storage-id-123' }),
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.uploadImage(imageWithoutMime);
      });

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'https://upload-url.test',
        expect.objectContaining({
          headers: {
            'Content-Type': 'image/jpeg',
          },
        })
      );
    });
  });
});
