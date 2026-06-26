/**
 * Header action cluster — bookmark (save) + share, right-aligned in the top bar.
 * Bookmark fills gold when saved; reads/writes via useSavedTemplates.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Bookmark, Share2 } from 'lucide-react-native';

import { colors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { useSavedTemplates } from '@/screens/TemplatesScreen/hooks/useSavedTemplates';
import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import type { Template } from '../../../../types/template';

interface HeaderActionClusterProps {
  template: Template;
  onShare: () => void;
}

export function HeaderActionCluster({
  template,
  onShare,
}: HeaderActionClusterProps) {
  const { isSaved, toggleSave } = useSavedTemplates();
  const saved = isSaved(template._id);
  return (
    <View style={s.cluster}>
      <AnimatedPressable
        accessibilityLabel={saved ? 'Remove from saved' : 'Save habit'}
        accessibilityRole='button'
        style={s.btn}
        onPress={() => toggleSave(template._id)}
      >
        <Bookmark
          color={saved ? colors.streak[700] : colors.gray[500]}
          fill={saved ? colors.streak[300] : 'transparent'}
          size={iconSizes.medium}
          strokeWidth={2}
        />
      </AnimatedPressable>
      <AnimatedPressable
        accessibilityLabel='Share habit'
        accessibilityRole='button'
        style={s.btn}
        onPress={onShare}
      >
        <Share2 color={colors.gray[500]} size={iconSizes.medium} strokeWidth={2} />
      </AnimatedPressable>
    </View>
  );
}

const s = StyleSheet.create({
  btn: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  cluster: { alignItems: 'center', flexDirection: 'row' },
});
