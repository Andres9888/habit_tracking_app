/**
 * useImagePicker Hook
 * Handles image selection from camera and library using expo-image-picker
 *
 * Features:
 * - Pick from photo library
 * - Capture from camera
 * - Permission handling with graceful fallback
 * - Configurable aspect ratio and quality
 * - Error handling with descriptive messages
 *
 * Story T12.2: Image picker integration for Vision Board
 */

import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { showPermissionDeniedAlert } from './helpers';
import { useImagePickerHandlers } from './useImagePickerHandlers';
import type { ImageSource, PickedImage, UseImagePickerReturn } from './types';

/**
 * Custom hook for image picking with expo-image-picker
 */
export function useImagePicker(): UseImagePickerReturn {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasLibraryPermission, setHasLibraryPermission] = useState<
    boolean | null
  >(null);

  /** Check and request permissions for the specified source */
  const requestPermissions = useCallback(
    async (source: ImageSource): Promise<boolean> => {
      try {
        if (source === 'camera') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          const granted = status === ImagePicker.PermissionStatus.GRANTED;
          setHasCameraPermission(granted);
          if (!granted) showPermissionDeniedAlert('camera');
          return granted;
        } else {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          const granted = status === ImagePicker.PermissionStatus.GRANTED;
          setHasLibraryPermission(granted);
          if (!granted) showPermissionDeniedAlert('library');
          return granted;
        }
      } catch (error_) {
        if (__DEV__) console.error('Permission request error:', error_);
        setError('Failed to request permissions');
        return false;
      }
    },
    []
  );

  /** Convert ImagePicker result to our PickedImage format */
  const convertAsset = useCallback(
    (asset: ImagePicker.ImagePickerAsset): PickedImage => ({
      fileSize: asset.fileSize,
      height: asset.height,
      mimeType: asset.mimeType || 'image/jpeg',
      type: 'image',
      uri: asset.uri,
      width: asset.width,
    }),
    []
  );

  const { pickFromCamera, pickFromLibrary, pickWithChoice } =
    useImagePickerHandlers({
      convertAsset,
      requestPermissions,
      setError,
      setImage,
      setIsLoading,
    });

  /** Clear the current image */
  const clearImage = useCallback(() => {
    setImage(null);
    setError(null);
  }, []);

  return {
    clearImage,
    error,
    hasCameraPermission,
    hasLibraryPermission,
    image,
    isLoading,
    pickFromCamera,
    pickFromLibrary,
    pickWithChoice,
    requestPermissions,
  };
}

export default useImagePicker;
