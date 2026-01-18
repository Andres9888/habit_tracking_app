/**
 * Constants for useImagePicker hook
 */

import type { ImagePickerOptions } from './types';

/** Default options for image picking */
export const DEFAULT_OPTIONS: ImagePickerOptions = {
  allowsEditing: true,
  aspect: [1, 1],
  base64: false,
  quality: 0.8,
};
