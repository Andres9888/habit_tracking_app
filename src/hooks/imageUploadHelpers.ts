import * as ImageManipulator from 'expo-image-manipulator';
import type { PickedImage } from './useImagePicker';

const MAX_IMAGE_DIMENSION = 1200;

export async function resizeImageIfNeeded(
  image: PickedImage
): Promise<string> {
  const maxDimension = Math.max(image.width, image.height);
  if (maxDimension <= MAX_IMAGE_DIMENSION) {
    return image.uri;
  }

  const ratio = MAX_IMAGE_DIMENSION / maxDimension;
  const newWidth = Math.round(image.width * ratio);
  const newHeight = Math.round(image.height * ratio);

  if (__DEV__) {
    console.log(
      `Resizing image from ${image.width}x${image.height} to ${newWidth}x${newHeight}`
    );
  }

  const resizedImage = await ImageManipulator.manipulateAsync(
    image.uri,
    [{ resize: { height: newHeight, width: newWidth } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  return resizedImage.uri;
}
