/**
 * useImageUpload Hook
 * Handles uploading images to Convex file storage
 *
 * Flow:
 * 1. Get signed upload URL from Convex
 * 2. Fetch local file as blob
 * 3. POST blob to signed URL
 * 4. Return storage ID for persistence
 *
 * Story T12.3: Image upload to storage for Vision Board
 */

import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import type { PickedImage } from './useImagePicker';

export interface UploadResult {
  storageId: Id<'_storage'>;
  url: string;
}

export interface UseImageUploadReturn {
  /** Upload an image to Convex storage */
  uploadImage: (image: PickedImage) => Promise<UploadResult | null>;
  /** Loading state during upload */
  isUploading: boolean;
  /** Upload progress 0-1 (not supported natively, always 0 or 1) */
  progress: number;
  /** Error message if upload failed */
  error: string | null;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Custom hook for uploading images to Convex file storage
 */
export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Convex mutation for generating upload URL
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  /**
   * Upload an image to Convex storage
   */
  const uploadImage = useCallback(
    async (image: PickedImage): Promise<UploadResult | null> => {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      try {
        // Step 1: Get signed upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // Step 2: Fetch the local file as a blob
        const fileResponse = await fetch(image.uri);
        if (!fileResponse.ok) {
          throw new Error(`Failed to read local file: ${fileResponse.status}`);
        }
        const blob = await fileResponse.blob();

        // Validate blob size (Convex has no hard limit but we set a reasonable one)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
        if (blob.size > MAX_FILE_SIZE) {
          throw new Error(
            `Image too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
          );
        }

        // Step 3: Upload the blob to Convex storage
        const uploadResponse = await fetch(uploadUrl, {
          body: blob,
          headers: {
            'Content-Type': image.mimeType || 'image/jpeg',
          },
          method: 'POST',
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(
            `Upload failed: ${uploadResponse.status} - ${errorText}`
          );
        }

        // Step 4: Parse the storage ID from the response
        const { storageId } = await uploadResponse.json();

        // The URL will be the upload response but we typically get
        // the final URL via a query. For now, return the storage ID.
        setProgress(1);
        setIsUploading(false);

        return {
          storageId: storageId as Id<'_storage'>,
          url: uploadUrl, // Temporary - will be replaced with getUrl result
        };
      } catch (error_) {
        const errorMessage =
          error_ instanceof Error ? error_.message : 'Failed to upload image';
        setError(errorMessage);
        setIsUploading(false);
        setProgress(0);
        console.error('Image upload error:', error_);
        return null;
      }
    },
    [generateUploadUrl]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    clearError,
    error,
    isUploading,
    progress,
    uploadImage,
  };
}

export default useImageUpload;
