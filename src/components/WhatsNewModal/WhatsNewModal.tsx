/**
 * WhatsNewModal — Changelog modal shown after OTA updates.
 * Displays the latest 3 changes with emoji bullets.
 * Dismissing stores the version in AsyncStorage so it won't show again.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Modal } from '../Modal';
import type { ChangelogVersion } from './changelog';

interface WhatsNewModalProps {
  visible: boolean;
  onDismiss: () => void;
  changelog: ChangelogVersion | undefined;
}

export function WhatsNewModal({
  visible,
  onDismiss,
  changelog,
}: WhatsNewModalProps) {
  if (!changelog) return null;

  return (
    <Modal variant="centerAlert" visible={visible} onClose={onDismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>🎉 What&apos;s New</Text>
        <Text style={styles.version}>v{changelog.version}</Text>

        <View style={styles.entries}>
          {changelog.entries.slice(0, 3).map((entry, index) => (
            <View key={index} style={styles.entry}>
              <Text style={styles.emoji}>{entry.emoji}</Text>
              <View style={styles.entryText}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryDescription}>
                  {entry.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onDismiss}
        >
          <Text style={styles.buttonText}>Got it!</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '600',
  },
  container: {
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 22,
    marginRight: 12,
    marginTop: 2,
  },
  entries: {
    gap: 16,
    marginTop: 20,
    width: '100%',
  },
  entry: {
    flexDirection: 'row',
  },
  entryDescription: {
    color: '#6B7280',
    fontFamily: 'System',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  entryText: {
    flex: 1,
  },
  entryTitle: {
    color: '#1F2937',
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    color: '#1F2937',
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '700',
  },
  version: {
    color: '#9CA3AF',
    fontFamily: 'System',
    fontSize: 13,
    marginTop: 4,
  },
});
