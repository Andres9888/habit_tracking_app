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
import { Alert, Linking, Platform } from 'react-native';

export type ImageSource = 'camera' | 'library';

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
  type: 'image';
  mimeType: string;
  fileSize?: number;
}

export interface ImagePickerOptions {
  /** Aspect ratio for cropping [width, height] */
  aspect?: [number, number];
  /** Image quality 0-1 */
  quality?: number;
  /** Allow editing/cropping */
  allowsEditing?: boolean;
  /** Base64 encoding (increases memory usage) */
  base64?: boolean;
}

export interface UseImagePickerReturn {
  /** Currently picked image */
  image: PickedImage | null;
  /** Loading state during permission check or image selection */
  isLoading: boolean;
  /** Error message if something went wrong */
  error: string | null;
  /** Pick an image from the photo library */
  pickFromLibrary: (
    options?: ImagePickerOptions
  ) => Promise<PickedImage | null>;
  /** Take a photo with the camera */
  pickFromCamera: (options?: ImagePickerOptions) => Promise<PickedImage | null>;
  /** Show action sheet to choose source */
  pickWithChoice: (options?: ImagePickerOptions) => Promise<PickedImage | null>;
  /** Clear the current image */
  clearImage: () => void;
  /** Check and request permissions */
  requestPermissions: (source: ImageSource) => Promise<boolean>;
  /** Whether camera permission is granted */
  hasCameraPermission: boolean | null;
  /** Whether library permission is granted */
  hasLibraryPermission: boolean | null;
}

// Default options for image picking
const DEFAULT_OPTIONS: ImagePickerOptions = {
  allowsEditing: true,
  aspect: [1, 1],
  base64: false,
  quality: 0.8,
};

/**
 * Opens the device settings app for permission management
 */
function openSettings() {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
}

/**
 * Shows an alert when permission is denied
 */
function showPermissionDeniedAlert(source: ImageSource) {
  const sourceText = source === 'camera' ? 'camera' : 'photo library';
  Alert.alert(
    'Permission Required',
    `To add images to your Vision Board, please allow access to your ${sourceText} in Settings.`,
    [
      { style: 'cancel', text: 'Cancel' },
      { onPress: openSettings, text: 'Open Settings' },
    ]
  );
}

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

  /**
   * Check and request permissions for the specified source
   */
  const requestPermissions = useCallback(
    async (source: ImageSource): Promise<boolean> => {
      try {
        if (source === 'camera') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          const granted = status === 'granted';
          setHasCameraPermission(granted);
          if (!granted) {
            showPermissionDeniedAlert('camera');
          }
          return granted;
        } else {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          const granted = status === 'granted';
          setHasLibraryPermission(granted);
          if (!granted) {
            showPermissionDeniedAlert('library');
          }
          return granted;
        }
      } catch (error_) {
        console.error('Permission request error:', error_);
        setError('Failed to request permissions');
        return false;
      }
    },
    []
  );

  /**
   * Convert ImagePicker result to our PickedImage format
   */
  const convertAsset = useCallback(
    (asset: ImagePicker.ImagePickerAsset): PickedImage => {
      return {
        fileSize: asset.fileSize,
        height: asset.height,
        mimeType: asset.mimeType || 'image/jpeg',
        type: 'image',
        uri: asset.uri,
        width: asset.width,
      };
    },
    []
  );

  /**
   * Pick an image from the photo library
   */
  const pickFromLibrary = useCallback(
    async (options: ImagePickerOptions = {}): Promise<PickedImage | null> => {
      setError(null);
      setIsLoading(true);

      try {
        // Check permissions
        const hasPermission = await requestPermissions('library');
        if (!hasPermission) {
          setIsLoading(false);
          return null;
        }

        // Merge options with defaults
        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: mergedOptions.allowsEditing,
          aspect: mergedOptions.aspect,
          base64: mergedOptions.base64,
          mediaTypes: ['images'],
          quality: mergedOptions.quality,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
          setIsLoading(false);
          return null;
        }

        const pickedImage = convertAsset(result.assets[0]);
        setImage(pickedImage);
        setIsLoading(false);
        return pickedImage;
      } catch (error_) {
        const errorMessage =
          error_ instanceof Error ? error_.message : 'Failed to pick image';
        setError(errorMessage);
        setIsLoading(false);
        console.error('Image picker error:', error_);
        return null;
      }
    },
    [requestPermissions, convertAsset]
  );

  /**
   * Take a photo with the camera
   */
  const pickFromCamera = useCallback(
    async (options: ImagePickerOptions = {}): Promise<PickedImage | null> => {
      setError(null);
      setIsLoading(true);

      try {
        // Check permissions
        const hasPermission = await requestPermissions('camera');
        if (!hasPermission) {
          setIsLoading(false);
          return null;
        }

        // Merge options with defaults
        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

        // Launch camera
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: mergedOptions.allowsEditing,
          aspect: mergedOptions.aspect,
          base64: mergedOptions.base64,
          quality: mergedOptions.quality,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
          setIsLoading(false);
          return null;
        }

        const pickedImage = convertAsset(result.assets[0]);
        setImage(pickedImage);
        setIsLoading(false);
        return pickedImage;
      } catch (error_) {
        const errorMessage =
          error_ instanceof Error ? error_.message : 'Failed to capture photo';
        setError(errorMessage);
        setIsLoading(false);
        console.error('Camera error:', error_);
        return null;
      }
    },
    [requestPermissions, convertAsset]
  );

  /**
   * Show action sheet to let user choose between camera and library
   */
  const pickWithChoice = useCallback(
    async (options: ImagePickerOptions = {}): Promise<PickedImage | null> => {
      return new Promise((resolve) => {
        Alert.alert(
          'Add Image',
          'Choose how to add an image to your Vision Board',
          [
            {
              onPress: async () => {
                const result = await pickFromCamera(options);
                resolve(result);
              },
              text: 'Take Photo',
            },
            {
              onPress: async () => {
                const result = await pickFromLibrary(options);
                resolve(result);
              },
              text: 'Choose from Library',
            },
            {
              onPress: () => resolve(null),
              style: 'cancel',
              text: 'Cancel',
            },
          ]
        );
      });
    },
    [pickFromCamera, pickFromLibrary]
  );

  /**
   * Clear the current image
   */
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
