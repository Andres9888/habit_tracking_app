/**
 * Camera picker handler
 * Take photos with device camera
 */

import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { DEFAULT_OPTIONS } from './constants';
import type { ImagePickerOptions, PickedImage } from './types';

interface UseCameraPickerParams {
  convertAsset: (asset: ImagePicker.ImagePickerAsset) => PickedImage;
  requestPermissions: (source: 'camera') => Promise<boolean>;
  setError: (error: string | null) => void;
  setImage: (image: PickedImage | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useCameraPicker({
  convertAsset,
  requestPermissions,
  setError,
  setImage,
  setIsLoading,
}: UseCameraPickerParams) {
  return useCallback(
    async (options: ImagePickerOptions = {}): Promise<PickedImage | null> => {
      setError(null);
      setIsLoading(true);
      try {
        const hasPermission = await requestPermissions('camera');
        if (!hasPermission) {
          setIsLoading(false);
          return null;
        }
        const merged = { ...DEFAULT_OPTIONS, ...options };
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: merged.allowsEditing,
          aspect: merged.aspect,
          base64: merged.base64,
          quality: merged.quality,
        });
        if (result.canceled || !result.assets?.length) {
          setIsLoading(false);
          return null;
        }
        const pickedImage = convertAsset(result.assets[0]);
        setImage(pickedImage);
        setIsLoading(false);
        return pickedImage;
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : 'Failed to capture photo';
        setError(msg);
        setIsLoading(false);
        if (__DEV__) console.error('Camera error:', error);
        return null;
      }
    },
    [requestPermissions, convertAsset, setError, setImage, setIsLoading]
  );
}
