/**
 * Library picker handler
 * Pick images from photo library
 */

import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { DEFAULT_OPTIONS } from './constants';
import type { ImagePickerOptions, PickedImage } from './types';

interface UseLibraryPickerParams {
  convertAsset: (asset: ImagePicker.ImagePickerAsset) => PickedImage;
  requestPermissions: (source: 'library') => Promise<boolean>;
  setError: (error: string | null) => void;
  setImage: (image: PickedImage | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useLibraryPicker({
  convertAsset,
  requestPermissions,
  setError,
  setImage,
  setIsLoading,
}: UseLibraryPickerParams) {
  return useCallback(
    async (options: ImagePickerOptions = {}): Promise<PickedImage | null> => {
      setError(null);
      setIsLoading(true);
      try {
        const hasPermission = await requestPermissions('library');
        if (!hasPermission) {
          setIsLoading(false);
          return null;
        }
        const merged = { ...DEFAULT_OPTIONS, ...options };
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: merged.allowsEditing,
          aspect: merged.aspect,
          base64: merged.base64,
          mediaTypes: ['images'],
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
          error instanceof Error ? error.message : 'Failed to pick image';
        setError(msg);
        setIsLoading(false);
        if (__DEV__) console.error('Image picker error:', error);
        return null;
      }
    },
    [requestPermissions, convertAsset, setError, setImage, setIsLoading]
  );
}
