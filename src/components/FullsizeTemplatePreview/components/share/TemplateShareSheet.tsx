/**
 * Themed Share bottom sheet for a library template: a shareable preview card
 * plus Copy link / Message / Share card / More actions.
 */

import React from 'react';
import { Text, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import {
  Copy,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  X,
} from 'lucide-react-native';

import { colors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import Modal from '../../../Modal';
import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import { scienceTheme } from '../science/scienceTheme';
import { useTemplateShare } from './useTemplateShare';
import { shareSheetStyles as s } from './shareSheet.styles';
import type { Template } from '../../../../types/template';

interface TemplateShareSheetProps {
  template: Template;
  visible: boolean;
  onClose: () => void;
}

export function TemplateShareSheet({
  template,
  visible,
  onClose,
}: TemplateShareSheetProps) {
  const t = scienceTheme(template);
  const share = useTemplateShare(template);
  const actions = [
    { Icon: Copy, key: 'copy', label: 'Copy link', onPress: share.copyLink },
    { Icon: MessageCircle, key: 'msg', label: 'Message', onPress: share.message },
    { Icon: ImageIcon, key: 'card', label: 'Share card', onPress: share.shareCard },
    { Icon: MoreHorizontal, key: 'more', label: 'More', onPress: share.more },
  ];

  return (
    <Modal variant='bottomSheet' visible={visible} onClose={onClose}>
      <View style={s.body}>
        <View style={s.titleRow}>
          <Text style={s.title}>Share habit</Text>
          <AnimatedPressable
            accessibilityLabel='Close'
            accessibilityRole='button'
            style={s.close}
            onPress={onClose}
          >
            <X color={colors.gray[600]} size={iconSizes.small} strokeWidth={2.4} />
          </AnimatedPressable>
        </View>
        <ViewShot ref={share.viewShotRef} options={{ format: 'png', quality: 1 }}>
          <View style={s.card}>
            <View style={[s.cardIcon, { backgroundColor: t.gradientStart }]}>
              <Text style={s.cardEmoji}>{template?.icon ?? '✨'}</Text>
            </View>
            <View style={s.cardText}>
              <Text numberOfLines={1} style={s.cardName}>
                {template?.name ?? 'Habit'}
              </Text>
              <Text numberOfLines={1} style={s.cardUrl}>
                {share.url.replace('https://', '')}
              </Text>
            </View>
            <Text style={[s.brand, { color: t.accent }]}>Chain Day</Text>
          </View>
        </ViewShot>
        <View style={s.actions}>
          {actions.map(({ Icon, key, label, onPress }) => (
            <AnimatedPressable
              key={key}
              accessibilityLabel={label}
              accessibilityRole='button'
              style={s.action}
              onPress={onPress}
            >
              <View style={s.actionIcon}>
                <Icon color={t.accent} size={iconSizes.medium} strokeWidth={2} />
              </View>
              <Text style={s.actionLabel}>{label}</Text>
            </AnimatedPressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}
