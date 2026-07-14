import { useUser } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  hasCustomProfileImage,
  resolveProfileImageUrl,
} from './profileImage.helpers';

export function useProfileDisplayImage() {
  const { user } = useUser();
  const convexUser = useQuery(api.users.currentUser);

  const imageUrl = resolveProfileImageUrl(convexUser, user?.imageUrl);
  const canRemoveCustomPhoto = hasCustomProfileImage(convexUser);

  return {
    canRemoveCustomPhoto,
    convexUser,
    imageUrl,
  };
}
