/**
 * useImageUpload Hook
 * Handles uploading images to Convex file storage
 *
 * Flow:
 * 1. Resize image to max dimensions (1200px) for memory/bandwidth optimization
 * 2. Get signed upload URL from Convex
 * 3. Fetch processed file as blob
 * 4. POST blob to signed URL
 * 5. Return storage ID for persistence
 *
 * Story T12.3: Image upload to storage for Vision Board
 * App Store Compliance: Images resized to prevent memory issues and excessive bandwidth
 */

import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import * as ImageManipulator from 'expo-image-manipulator';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import {
  ALLOWED_IMAGE_CONTENT_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
} from '../../convex/storageValidation';
import type { PickedImage } from './useImagePicker';

/** Maximum image dimension (width or height) - balances quality and performance */
const MAX_IMAGE_DIMENSION = 1200;

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
 * Custom hook for uploading images to Convex file storage.
 * Handles the complete upload flow: getting signed URL, fetching local file,
 * and uploading to storage.
 *
 * @returns Object containing upload function and state
 *
 * @example
 * ```ts
 * const { uploadImage, isUploading, error } = useImageUpload();
 * const result = await uploadImage(pickedImage);
 * if (result) {
 *   console.log('Uploaded:', result.storageId);
 * }
 * ```
 */
export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Convex mutation for generating upload URL
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const validateImageUpload = useMutation(api.storage.validateImageUpload);

  /**
   * Resize image if dimensions exceed MAX_IMAGE_DIMENSION
   * Maintains aspect ratio and reduces memory/bandwidth usage
   */
  const resizeImageIfNeeded = useCallback(
    async (image: PickedImage): Promise<string> => {
      const maxDimension = Math.max(image.width, image.height);

      // No resize needed if already within limits
      if (maxDimension <= MAX_IMAGE_DIMENSION) {
        return image.uri;
      }

      // Calculate resize ratio to fit within MAX_IMAGE_DIMENSION
      const ratio = MAX_IMAGE_DIMENSION / maxDimension;
      const newWidth = Math.round(image.width * ratio);
      const newHeight = Math.round(image.height * ratio);

      if (__DEV__) {
        console.log(
          `Resizing image from ${image.width}x${image.height} to ${newWidth}x${newHeight}`
        );
      }

      // Resize using expo-image-manipulator
      const resizedImage = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      return resizedImage.uri;
    },
    []
  );

  /**
   * Upload an image to Convex storage
   * Automatically resizes large images before upload for App Store compliance
   */
  const uploadImage = useCallback(
    async (image: PickedImage): Promise<UploadResult | null> => {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      try {
        // Step 1: Resize image if needed (App Store compliance)
        const processedUri = await resizeImageIfNeeded(image);

        // Step 2: Get signed upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // Step 3: Fetch the processed file as a blob
        const fileResponse = await fetch(processedUri);
        if (!fileResponse.ok) {
          throw new Error(`Failed to read local file: ${fileResponse.status}`);
        }
        const blob = await fileResponse.blob();
        const contentType = blob.type || image.mimeType || 'image/jpeg';

        if (!ALLOWED_IMAGE_CONTENT_TYPES.has(contentType)) {
          throw new Error(
            'Unsupported image format. Use JPEG, PNG, WebP, or HEIC.'
          );
        }

        // Validate blob size (Convex has no hard limit but we set a reasonable one)
        if (blob.size > MAX_IMAGE_UPLOAD_BYTES) {
          throw new Error(
            `Image too large. Maximum size is ${MAX_IMAGE_UPLOAD_BYTES / 1024 / 1024}MB`
          );
        }

        // Step 4: Upload the blob to Convex storage
        const uploadResponse = await fetch(uploadUrl, {
          body: blob,
          headers: {
            'Content-Type': contentType,
          },
          method: 'POST',
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(
            `Upload failed: ${uploadResponse.status} - ${errorText}`
          );
        }

        // Step 5: Parse the storage ID from the response
        const { storageId } = await uploadResponse.json();
        const validation = await validateImageUpload({ storageId });
        if (!validation.ok) {
          throw new Error(validation.error);
        }

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
        if (__DEV__) console.error('Image upload error:', error_);
        return null;
      }
    },
    [generateUploadUrl, resizeImageIfNeeded, validateImageUpload]
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
