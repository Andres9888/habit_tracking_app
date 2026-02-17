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
 * Hook for picking images from camera or photo library.
 * Handles permissions, error states, and provides multiple selection methods.
 *
 * @description
 * Provides three ways to pick images:
 * 1. pickFromCamera() - Take a new photo
 * 2. pickFromLibrary() - Choose from existing photos
 * 3. pickWithChoice() - Show action sheet to choose camera or library
 *
 * Features:
 * - Automatic permission requests with user-friendly alerts
 * - Permission status tracking
 * - Loading states during picker operations
 * - Error handling with descriptive messages
 * - Configurable aspect ratio and quality
 * - Returns standardized image format (URI, dimensions, MIME type)
 *
 * @returns Object with picker methods and state
 * @returns returns.pickFromCamera - Function to launch camera
 * @returns returns.pickFromLibrary - Function to open photo library
 * @returns returns.pickWithChoice - Function to show camera/library choice dialog
 * @returns returns.image - Currently selected image (null if none)
 * @returns returns.isLoading - Whether picker is currently open
 * @returns returns.error - Error message if picker failed
 * @returns returns.hasCameraPermission - Camera permission status
 * @returns returns.hasLibraryPermission - Photo library permission status
 * @returns returns.requestPermissions - Manual permission request function
 * @returns returns.clearImage - Function to clear selected image
 * @returns returns.clearError - Function to clear error state
 *
 * @example
 * ```tsx
 * function VisionBoardImagePicker() {
 *   const {
 *     pickWithChoice,
 *     image,
 *     isLoading,
 *     error,
 *     clearImage
 *   } = useImagePicker();
 *
 *   const handlePick = async () => {
 *     const result = await pickWithChoice();
 *     if (result) {
 *       console.log('Selected image:', result.uri);
 *       uploadImage(result);
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <Button onPress={handlePick} disabled={isLoading}>
 *         {isLoading ? 'Opening...' : 'Pick Image'}
 *       </Button>
 *       {image && <Image source={{ uri: image.uri }} />}
 *       {error && <Text style={styles.error}>{error}</Text>}
 *     </View>
 *   );
 * }
 * ```
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
