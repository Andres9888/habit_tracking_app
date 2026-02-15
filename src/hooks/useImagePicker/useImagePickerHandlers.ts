/**
 * Image picker handler composition
 * Combines camera and library pickers with choice dialog
 */

import { Alert } from 'react-native';
import { useCallback } from 'react';

import * as ImagePicker from 'expo-image-picker';

import type { ImagePickerOptions, PickedImage } from './types';
import { useCameraPicker } from './useCameraPicker';
import { useLibraryPicker } from './useLibraryPicker';

interface UseHandlersParams {
  convertAsset: (asset: ImagePicker.ImagePickerAsset) => PickedImage;
  requestPermissions: (source: 'camera' | 'library') => Promise<boolean>;
  setError: (error: string | null) => void;
  setImage: (image: PickedImage | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useImagePickerHandlers({
  convertAsset,
  requestPermissions,
  setError,
  setImage,
  setIsLoading,
}: UseHandlersParams) {
  const pickFromLibrary = useLibraryPicker({
    convertAsset,
    requestPermissions,
    setError,
    setImage,
    setIsLoading,
  });

  const pickFromCamera = useCameraPicker({
    convertAsset,
    requestPermissions,
    setError,
    setImage,
    setIsLoading,
  });

  const pickWithChoice = useCallback(
    (options: ImagePickerOptions = {}): Promise<PickedImage | null> =>
      new Promise((resolve) => {
        Alert.alert(
          'Add Image',
          'Choose how to add an image to your Vision Board',
          [
            {
              onPress: () => {
                void pickFromCamera(options)
                  .then(resolve)
                  .catch((error) => {
                    if (__DEV__) console.warn('Error picking from camera:', error);
                    resolve(null);
                  });
              },
              text: 'Take Photo',
            },
            {
              onPress: () => {
                void pickFromLibrary(options)
                  .then(resolve)
                  .catch((error) => {
                    if (__DEV__) console.warn('Error picking from library:', error);
                    resolve(null);
                  });
              },
              text: 'Choose from Library',
            },
            { onPress: () => resolve(null), style: 'cancel', text: 'Cancel' },
          ]
        );
      }),
    [pickFromCamera, pickFromLibrary]
  );

  return { pickFromCamera, pickFromLibrary, pickWithChoice };
}
