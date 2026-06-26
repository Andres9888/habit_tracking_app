/**
 * Share actions for a library template. Copy/Message/More use the native RN
 * Share sheet (no extra native module); Share card captures the preview card to
 * a PNG via react-native-view-shot + expo-sharing. Links use the chainday.app
 * deep-link form so they resolve back through the library once universal links
 * are provisioned (custom scheme works today).
 */

import { useRef } from 'react';
import { Share } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import { triggerHaptic } from '@/utils/haptics';
import { templateShareUrl } from '@/utils/templateSlug';
import type { Template } from '../../../../types/template';

export function useTemplateShare(template: Template) {
  const viewShotRef = useRef<ViewShot>(null);
  const url = templateShareUrl(template?.name ?? '');
  const pitch = `${template?.name ?? 'This habit'} on Chain Day — ${
    template?.tagline ?? 'a science-backed habit'
  }`;

  const copyLink = () => {
    void triggerHaptic('tap');
    void Share.share({ message: url });
  };
  const message = () => {
    void triggerHaptic('tap');
    void Share.share({ message: `${pitch}\n${url}` });
  };
  const more = () => {
    void triggerHaptic('tap');
    void Share.share({ message: `${pitch}\n${url}`, url });
  };
  const shareCard = async () => {
    void triggerHaptic('tap');
    const node = viewShotRef.current;
    if (!node?.capture) return;
    try {
      const uri = await node.capture();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: 'public.png',
          dialogTitle: `Share ${template?.name ?? 'habit'}`,
          mimeType: 'image/png',
        });
      }
    } catch (e) {
      if (__DEV__) console.warn('Share card failed', e);
    }
  };

  return { copyLink, message, more, shareCard, url, viewShotRef };
}
