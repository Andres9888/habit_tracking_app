import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useImageUpload } from '../../hooks/useImageUpload';
import { triggerHaptic } from '@/utils/haptics';
import { hasCustomProfileImage } from './profileImage.helpers';
import { useProfileDisplayImage } from './useProfileDisplayImage';

const PICKER_OPTIONS = { aspect: [1, 1] as [number, number], quality: 0.85 };

export function useChangeProfileImage() {
  const { convexUser } = useProfileDisplayImage();
  const [isUpdating, setIsUpdating] = useState(false);
  const { pickFromCamera, pickFromLibrary } = useImagePicker();
  const { uploadImage } = useImageUpload();
  const updateProfileImage = useMutation(
    api.usersProfileImage.updateProfileImage
  );
  const clearProfileImage = useMutation(
    api.usersProfileImage.clearProfileImage
  );

  const applyPickedImage = useCallback(
    async (source: 'camera' | 'library') => {
      setIsUpdating(true);
      try {
        const picked =
          source === 'camera'
            ? await pickFromCamera(PICKER_OPTIONS)
            : await pickFromLibrary(PICKER_OPTIONS);

        if (!picked) {
          return;
        }

        const uploaded = await uploadImage(picked);
        if (!uploaded) {
          throw new Error('Failed to upload image');
        }

        await updateProfileImage({ storageId: uploaded.storageId });
        triggerHaptic('success');
      } catch (error) {
        if (__DEV__)
          console.error('[useChangeProfileImage] update failed:', error);
        Alert.alert(
          'Upload Failed',
          ERROR_MESSAGES.DATA_OPS.UPLOAD_IMAGE_FAILED
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [pickFromCamera, pickFromLibrary, updateProfileImage, uploadImage]
  );

  const handleRemovePhoto = useCallback(async () => {
    setIsUpdating(true);
    try {
      await clearProfileImage({});
      triggerHaptic('success');
    } catch (error) {
      if (__DEV__)
        console.error('[useChangeProfileImage] remove failed:', error);
      Alert.alert('Could not update photo', 'Please try again in a moment.');
    } finally {
      setIsUpdating(false);
    }
  }, [clearProfileImage]);

  const openPhotoPicker = useCallback(() => {
    const buttons: Array<{
      text: string;
      style?: 'cancel' | 'destructive';
      onPress?: () => void;
    }> = [
      { onPress: () => void applyPickedImage('camera'), text: 'Take Photo' },
      {
        onPress: () => void applyPickedImage('library'),
        text: 'Choose from Library',
      },
    ];

    if (hasCustomProfileImage(convexUser)) {
      buttons.push({
        onPress: () => void handleRemovePhoto(),
        style: 'destructive',
        text: 'Remove Photo',
      });
    }

    buttons.push({ style: 'cancel', text: 'Cancel' });

    Alert.alert('Profile Photo', 'Update your profile picture', buttons);
  }, [applyPickedImage, convexUser, handleRemovePhoto]);

  return { isUpdating, openPhotoPicker };
}
