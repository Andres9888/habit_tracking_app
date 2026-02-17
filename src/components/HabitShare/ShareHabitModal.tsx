/**
 * Share Habit Modal
 * Displays share options including QR code and copy link
 */
import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Share,
  Alert,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { generateShareLink, generateWebShareLink } from '../../lib/habitShare';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { QRCodeSVG } from './QRCodeSVG';

interface ShareHabitModalProps {
  visible: boolean;
  habit: any;
  onClose: () => void;
}

export function ShareHabitModal({ visible, habit, onClose }: ShareHabitModalProps) {
  const [copied, setCopied] = useState(false);

  const shareLink = generateShareLink(habit);
  const webShareLink = generateWebShareLink(habit);

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my "${habit.name}" habit on ChainDay!\n\n${webShareLink}`,
        url: webShareLink, // iOS will use this
        title: `Share "${habit.name}" Habit`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (!habit) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Share Habit</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.habitName}>{habit.name}</Text>
            {habit.icon && <Text style={styles.habitIcon}>{habit.icon}</Text>}

            <View style={styles.qrContainer}>
              <QRCodeSVG value={webShareLink} size={200} />
            </View>

            <Text style={styles.instructions}>
              Scan this QR code or use the buttons below to share this habit
              template with friends!
            </Text>

            <View style={styles.buttons}>
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={handleShare}
              >
                <Text style={styles.primaryButtonText}>Share Link</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={handleCopyLink}
              >
                <Text style={styles.secondaryButtonText}>
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 14,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: colors.gray[600],
    fontSize: 22,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  habitIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  habitName: {
    color: colors.gray[900],
    fontSize: typography.sizes.title,
    fontWeight: '600',
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.gray[200],
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  instructions: {
    color: colors.gray[600],
    fontSize: typography.sizes.body,
    marginTop: 16,
    textAlign: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxWidth: 400,
    width: '90%',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary[600],
  },
  primaryButtonText: {
    color: 'white',
    fontSize: typography.sizes.body,
    fontWeight: '600',
  },
  qrContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 24,
    padding: 16,
  },
  secondaryButton: {
    backgroundColor: colors.gray[100],
  },
  secondaryButtonText: {
    color: colors.gray[900],
    fontSize: typography.sizes.body,
    fontWeight: '600',
  },
  title: {
    color: colors.gray[900],
    fontSize: typography.sizes.title,
    fontWeight: '600',
  },
});
