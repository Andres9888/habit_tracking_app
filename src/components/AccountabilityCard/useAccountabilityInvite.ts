/**
 * useAccountabilityInvite - Hook for generating and sharing invite deep links
 */

import { useMutation } from 'convex/react';
import { useCallback, useState } from 'react';
import { Alert, Share } from 'react-native';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

const APP_SCHEME = 'chainday';
const UNIVERSAL_LINK_BASE = 'https://chainday.app';

export function useAccountabilityInvite(habitId: Id<'habits'>, habitName: string) {
  const [isSharing, setIsSharing] = useState(false);
  const createInvite = useMutation(api.accountability.createInvite);

  const shareInvite = useCallback(async () => {
    setIsSharing(true);
    try {
      const { token } = await createInvite({ habitId });

      const deepLink = `${APP_SCHEME}://accountability/invite?token=${token}`;
      const universalLink = `${UNIVERSAL_LINK_BASE}/accountability/invite?token=${token}`;

      await Share.share({
        title: 'Be My Accountability Partner',
        message: `Hey! I'm building the habit "${habitName}" and I'd love you to be my accountability partner. We'll keep each other on track! 💪\n\n${universalLink}`,
        url: universalLink,
      });
    } catch (error) {
      if ((error as Error).message !== 'User dismissed the dialog') {
        Alert.alert('Oops', 'Could not create invite link. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  }, [habitId, habitName, createInvite]);

  return { shareInvite, isSharing };
}
