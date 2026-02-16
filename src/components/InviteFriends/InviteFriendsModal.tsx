/**
 * InviteFriendsModal Component
 * Allows users to share the app with friends
 * Separate from achievement sharing - always available
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Modal } from '../Modal';
import { Button } from '../Button/Button';
import { useInviteShare } from './useInviteShare';
import type { InviteFriendsModalProps } from './InviteFriendsModal.types';

export function InviteFriendsModal({
  visible,
  onClose,
  userName,
}: InviteFriendsModalProps) {
  const { handleShare, isSharing } = useInviteShare(userName);

  return (
    <Modal variant='fullScreen' visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Invite Friends</Text>
          <Text style={styles.subtitle}>
            Help your friends build better habits
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.appIcon}
              resizeMode='contain'
            />
          </View>

          <Text style={styles.description}>
            Share Chain Day with friends who want to build lasting habits
            through science-backed tracking.
          </Text>

          <View style={styles.benefitsContainer}>
            <BenefitRow emoji='🔗' text='Track unlimited habits' />
            <BenefitRow emoji='📊' text='Science-based insights' />
            <BenefitRow emoji='🎯' text='Proven behavior change' />
            <BenefitRow emoji='✨' text='Beautiful, simple interface' />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            fullWidth
            loading={isSharing}
            onPress={handleShare}
          >
            Share Chain Day
          </Button>
          <Button
            fullWidth
            variant='secondary'
            onPress={onClose}
          >
            Maybe Later
          </Button>
        </View>
      </View>
    </Modal>
  );
}

function BenefitRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.benefitRow}>
      <Text style={styles.benefitEmoji}>{emoji}</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  appIcon: {
    height: 80,
    width: 80,
  },
  benefitEmoji: {
    fontSize: 22,
  },
  benefitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  benefitText: {
    color: '#57534e',
    fontSize: 17,
    lineHeight: 22,
  },
  benefitsContainer: {
    gap: 16,
    marginTop: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  description: {
    color: '#57534e',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 24,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  subtitle: {
    color: '#78716c',
    fontSize: 17,
    lineHeight: 22,
    marginTop: 8,
  },
  title: {
    color: '#1c1917',
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
});

export default InviteFriendsModal;
