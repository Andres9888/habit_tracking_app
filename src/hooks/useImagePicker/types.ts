/**
 * Types for useImagePicker hook
 * Image picker type definitions and interfaces
 */

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
