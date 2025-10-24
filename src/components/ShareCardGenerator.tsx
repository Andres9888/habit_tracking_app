/**
 * ShareCardGenerator Component
 * Based on UX Specification Flow 5 (lines 560-661)
 *
 * Features:
 * - Gradient backgrounds using brand colors
 * - Platform-specific formats (Instagram Story/Feed, Twitter, Facebook)
 * - Customization options (background color, personal message, user name toggle)
 * - Native share sheet integration
 * - Pre-filled captions per platform
 *
 * Usage: Triggered from Milestone Celebration modal
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform as RNPlatform,
  Pressable,
  TextInput,
  Switch,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useAppTheme } from '../theme';
import { Button } from './Button';
import { Modal } from './Modal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Platform-specific dimensions (UX spec lines 597-603)
export type SharePlatform = 'instagram-story' | 'instagram-feed' | 'twitter' | 'facebook';

export interface ShareFormat {
  width: number;
  height: number;
  aspectRatio: number;
}

const SHARE_FORMATS: Record<SharePlatform, ShareFormat> = {
  'instagram-story': { width: 1080, height: 1920, aspectRatio: 9 / 16 },
  'instagram-feed': { width: 1080, height: 1080, aspectRatio: 1 },
  'twitter': { width: 1200, height: 675, aspectRatio: 16 / 9 },
  'facebook': { width: 1200, height: 630, aspectRatio: 1.91 },
};

// Milestone level emojis and labels (UX spec line 570, 708)
export type MilestoneLevel = 'starting' | 'building' | 'developing' | 'strong' | 'automatic';

const MILESTONE_CONFIG: Record<MilestoneLevel, { emoji: string; label: string; range: string }> = {
  starting: { emoji: '🌱', label: 'Starting', range: '0-20%' },
  building: { emoji: '🌿', label: 'Building', range: '20-40%' },
  developing: { emoji: '🌳', label: 'Developing', range: '40-60%' },
  strong: { emoji: '💪', label: 'Strong', range: '60-80%' },
  automatic: { emoji: '⚡', label: 'Automatic', range: '80-100%' },
};

// Gradient presets using brand colors (UX spec Section 5.1)
const GRADIENT_PRESETS = [
  { name: 'Growth', colors: ['#10B981', '#059669', '#047857'] },
  { name: 'Achievement', colors: ['#34D399', '#10B981', '#059669'] },
  { name: 'Excellence', colors: ['#047857', '#065F46', '#064E3B'] },
  { name: 'Sky', colors: ['#3B82F6', '#2563EB', '#1D4ED8'] },
  { name: 'Sunset', colors: ['#F59E0B', '#D97706', '#B45309'] },
];

export interface ShareCardData {
  habitName: string;
  milestoneLevel: MilestoneLevel;
  strengthPercentage: number;
  userName?: string;
}

export interface ShareCardGeneratorProps {
  visible: boolean;
  onClose: () => void;
  data: ShareCardData;
}

export function ShareCardGenerator({ visible, onClose, data }: ShareCardGeneratorProps) {
  const theme = useAppTheme();
  const viewShotRef = useRef<ViewShot>(null);

  // Customization state
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [personalMessage, setPersonalMessage] = useState('');
  const [showUserName, setShowUserName] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<SharePlatform>('instagram-story');
  const [isGenerating, setIsGenerating] = useState(false);

  const milestoneConfig = MILESTONE_CONFIG[data.milestoneLevel];
  const format = SHARE_FORMATS[selectedPlatform];

  // Platform-specific captions (UX spec lines 610-626)
  const getPlatformCaption = (platform: SharePlatform): string => {
    const baseMessage = `Just reached ${milestoneConfig.label} level (${data.strengthPercentage}%) with my ${data.habitName} habit! 💪`;
    const appStoreLink = 'https://apps.apple.com/app/habit-tracker'; // Replace with actual link

    switch (platform) {
      case 'instagram-story':
      case 'instagram-feed':
        return `${baseMessage}\n\nBuilding better habits with science-backed tracking 📊\n\n#HabitTracking #AtomicHabits #BehaviorChange #SelfImprovement #Productivity\n\n${appStoreLink}`;

      case 'twitter':
        // Twitter has 280 character limit
        return `${baseMessage}\n\nTracking habits with science 📊 ${appStoreLink}\n\n#HabitTracking #Productivity`;

      case 'facebook':
        return `${baseMessage}\n\nI've been using this amazing habit tracking app that uses real behavioral science to help build lasting habits. Check it out!\n\n${appStoreLink}`;

      default:
        return baseMessage;
    }
  };

  // Platform detection helper
  const detectInstalledPlatforms = async (): Promise<Record<string, boolean>> => {
    // Note: Actual platform detection requires native code
    // This is a placeholder for the detection logic
    // In production, you'd use Linking.canOpenURL() with platform-specific URLs
    return {
      instagram: true, // await Linking.canOpenURL('instagram://'),
      twitter: true, // await Linking.canOpenURL('twitter://'),
      facebook: true, // await Linking.canOpenURL('fb://'),
    };
  };

  // Generate and share card image
  const handleShare = async () => {
    if (!viewShotRef.current || !viewShotRef.current.capture) return;

    try {
      setIsGenerating(true);

      // Capture the card as an image
      const uri = await viewShotRef.current.capture();

      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        // Get platform-specific caption
        const caption = getPlatformCaption(selectedPlatform);

        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Share your ${milestoneConfig.label} achievement!`,
          UTI: 'public.png',
        });

        // Note: The caption would need to be copied to clipboard or
        // passed to the specific platform's sharing API
        // For now, we're using the native share sheet which doesn't support pre-filled text on iOS
      } else {
        // Fallback: Alert user that sharing is not available
        // In production, you might want to implement save to camera roll here
        console.warn('Sharing is not available on this device');
        alert('Sharing is not available. Please save the image manually.');
      }
    } catch (error) {
      console.error('Error sharing card:', error);
      alert('Failed to share card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Render the shareable card
  const renderCard = () => {
    const gradientColors = GRADIENT_PRESETS[selectedGradient].colors as unknown as readonly [string, string, ...string[]];

    return (
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 1.0,
          width: format.width,
          height: format.height,
        }}
        style={[
          styles.cardContainer,
          {
            width: format.width,
            height: format.height,
            aspectRatio: format.aspectRatio,
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        >
          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Top Section: Milestone Emoji */}
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{milestoneConfig.emoji}</Text>
            </View>

            {/* Middle Section: Habit Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.habitName}>{data.habitName}</Text>

              <View style={styles.milestoneRow}>
                <Text style={styles.milestoneLabel}>{milestoneConfig.label} Level</Text>
                <Text style={styles.strengthPercentage}>{data.strengthPercentage}%</Text>
              </View>

              {/* Visual Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${data.strengthPercentage}%` },
                    ]}
                  />
                </View>
              </View>

              {/* Personal Message */}
              {personalMessage && (
                <Text style={styles.personalMessage}>{personalMessage}</Text>
              )}
            </View>

            {/* Bottom Section: Science Badge & App Info */}
            <View style={styles.footerContainer}>
              <View style={styles.scienceBadge}>
                <Text style={styles.scienceBadgeText}>
                  Research-backed (Lally et al. 2010)
                </Text>
              </View>

              <View style={styles.appInfo}>
                <Text style={styles.appName}>Habit Tracker</Text>
                {showUserName && data.userName && (
                  <Text style={styles.userName}>by {data.userName}</Text>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
      </ViewShot>
    );
  };

  // Render preview (scaled down for display)
  const renderPreview = () => {
    const previewWidth = SCREEN_WIDTH - 48;
    const previewHeight = previewWidth / format.aspectRatio;

    return (
      <View
        style={[
          styles.previewContainer,
          {
            width: previewWidth,
            height: previewHeight,
          },
        ]}
      >
        <View
          style={{
            transform: [{ scale: previewWidth / format.width }],
            transformOrigin: 'top left',
          }}
        >
          {renderCard()}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="fullScreen"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.custom.colors.gray[900] }]}>
            Share Your Achievement
          </Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.custom.colors.primary[500] }]}>
              Done
            </Text>
          </Pressable>
        </View>

        {/* Preview */}
        <View style={styles.previewSection}>
          {renderPreview()}
        </View>

        {/* Customization Options */}
        <ScrollView style={styles.customizationSection} showsVerticalScrollIndicator={false}>
          {/* Platform Selection */}
          <View style={styles.optionGroup}>
            <Text style={[styles.optionLabel, { color: theme.custom.colors.gray[700] }]}>
              Platform
            </Text>
            <View style={styles.platformButtons}>
              {(Object.keys(SHARE_FORMATS) as SharePlatform[]).map((platform) => (
                <Pressable
                  key={platform}
                  onPress={() => setSelectedPlatform(platform)}
                  style={[
                    styles.platformButton,
                    selectedPlatform === platform && {
                      backgroundColor: theme.custom.colors.primary[500],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.platformButtonText,
                      selectedPlatform === platform && styles.platformButtonTextActive,
                    ]}
                  >
                    {platform.replace('-', ' ')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Gradient Selection */}
          <View style={styles.optionGroup}>
            <Text style={[styles.optionLabel, { color: theme.custom.colors.gray[700] }]}>
              Background
            </Text>
            <View style={styles.gradientButtons}>
              {GRADIENT_PRESETS.map((gradient, index) => (
                <Pressable
                  key={gradient.name}
                  onPress={() => setSelectedGradient(index)}
                  style={[
                    styles.gradientButton,
                    selectedGradient === index && styles.gradientButtonSelected,
                  ]}
                >
                  <LinearGradient
                    colors={gradient.colors as unknown as readonly [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButtonInner}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Personal Message Input */}
          <View style={styles.optionGroup}>
            <Text style={[styles.optionLabel, { color: theme.custom.colors.gray[700] }]}>
              Personal Message (Optional)
            </Text>
            <TextInput
              value={personalMessage}
              onChangeText={setPersonalMessage}
              placeholder="Add a personal touch..."
              placeholderTextColor={theme.custom.colors.gray[400]}
              style={[
                styles.messageInput,
                {
                  backgroundColor: theme.custom.colors.gray[50],
                  borderColor: theme.custom.colors.gray[200],
                  color: theme.custom.colors.gray[900],
                },
              ]}
              multiline
              maxLength={100}
            />
            <Text style={[styles.characterCount, { color: theme.custom.colors.gray[500] }]}>
              {personalMessage.length}/100
            </Text>
          </View>

          {/* User Name Toggle */}
          <View style={styles.optionGroup}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelContainer}>
                <Text style={[styles.optionLabel, { color: theme.custom.colors.gray[700], marginBottom: 0 }]}>
                  Show User Name
                </Text>
                {data.userName && (
                  <Text style={[styles.toggleSubtext, { color: theme.custom.colors.gray[500] }]}>
                    {data.userName}
                  </Text>
                )}
              </View>
              <Switch
                value={showUserName}
                onValueChange={setShowUserName}
                trackColor={{
                  false: theme.custom.colors.gray[300],
                  true: theme.custom.colors.primary[500],
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Share Button */}
          <Button
            onPress={handleShare}
            loading={isGenerating}
            fullWidth
            style={styles.shareButton}
          >
            Share to {selectedPlatform.replace('-', ' ')}
          </Button>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  previewSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    flex: 1,
  },
  previewContainer: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  cardContainer: {
    position: 'relative',
  },
  cardContent: {
    flex: 1,
    padding: 48,
    justifyContent: 'space-between',
  },
  emojiContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emoji: {
    fontSize: 120,
  },
  infoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  habitName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  milestoneLabel: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  strengthPercentage: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 24,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  personalMessage: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footerContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scienceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scienceBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  appInfo: {
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  customizationSection: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  optionGroup: {
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  platformButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  platformButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  platformButtonTextActive: {
    color: '#FFFFFF',
  },
  gradientButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  gradientButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gradientButtonSelected: {
    borderColor: '#10B981',
  },
  gradientButtonInner: {
    flex: 1,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabelContainer: {
    flex: 1,
  },
  toggleSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  shareButton: {
    marginTop: 8,
  },
});

// Named exports for convenience
export {
  MILESTONE_CONFIG,
  GRADIENT_PRESETS,
  SHARE_FORMATS,
};

export default ShareCardGenerator;
