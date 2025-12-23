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
import { Button } from './Button/Button';
import { Modal } from './Modal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Platform-specific dimensions (UX spec lines 597-603)
export type SharePlatform =
  | 'instagram-story'
  | 'instagram-feed'
  | 'twitter'
  | 'facebook';

export interface ShareFormat {
  width: number;
  height: number;
  aspectRatio: number;
}

const SHARE_FORMATS: Record<SharePlatform, ShareFormat> = {
  facebook: { aspectRatio: 1.91, height: 630, width: 1200 },
  'instagram-feed': { aspectRatio: 1, height: 1080, width: 1080 },
  'instagram-story': { aspectRatio: 9 / 16, height: 1920, width: 1080 },
  twitter: { aspectRatio: 16 / 9, height: 675, width: 1200 },
};

const detectInstalledPlatforms = async (): Promise<Record<string, boolean>> => {
  // Note: Actual platform detection requires native code
  // This is a placeholder for the detection logic
  // In production, you'd use Linking.canOpenURL() with platform-specific URLs
  return {
    // await Linking.canOpenURL('twitter://'),
    facebook: true,
    // await Linking.canOpenURL('instagram://'),
    instagram: true,
    twitter: true, // await Linking.canOpenURL('fb://'),
  };
};

// Milestone level emojis and labels (UX spec line 570, 708)
export type MilestoneLevel =
  | 'starting'
  | 'building'
  | 'developing'
  | 'strong'
  | 'automatic';

const MILESTONE_CONFIG: Record<
  MilestoneLevel,
  { emoji: string; label: string; range: string }
> = {
  automatic: { emoji: '⚡', label: 'Automatic', range: '80-100%' },
  building: { emoji: '🌿', label: 'Building', range: '20-40%' },
  developing: { emoji: '🌳', label: 'Developing', range: '40-60%' },
  starting: { emoji: '🌱', label: 'Starting', range: '0-20%' },
  strong: { emoji: '💪', label: 'Strong', range: '60-80%' },
};

// Gradient presets using brand colors (UX spec Section 5.1)
const GRADIENT_PRESETS = [
  { colors: ['#10B981', '#059669', '#047857'], name: 'Growth' },
  { colors: ['#34D399', '#10B981', '#059669'], name: 'Achievement' },
  { colors: ['#047857', '#065F46', '#064E3B'], name: 'Excellence' },
  { colors: ['#3B82F6', '#2563EB', '#1D4ED8'], name: 'Sky' },
  { colors: ['#F59E0B', '#D97706', '#B45309'], name: 'Sunset' },
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

export function ShareCardGenerator({
  visible,
  onClose,
  data,
}: ShareCardGeneratorProps) {
  const theme = useAppTheme();
  const viewShotRef = useRef<ViewShot>(null);

  // Customization state
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [personalMessage, setPersonalMessage] = useState('');
  const [showUserName, setShowUserName] = useState(true);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SharePlatform>('instagram-story');
  const [isGenerating, setIsGenerating] = useState(false);

  const milestoneConfig = MILESTONE_CONFIG[data.milestoneLevel];
  const format = SHARE_FORMATS[selectedPlatform];

  // Platform-specific captions (UX spec lines 610-626)
  const getPlatformCaption = (platform: SharePlatform): string => {
    const baseMessage = `Just reached ${milestoneConfig.label} level (${data.strengthPercentage}%) with my ${data.habitName} habit! 💪`;
    const appStoreLink = 'https://apps.apple.com/app/habit-tracker'; // Replace with actual link

    switch (platform) {
      case 'instagram-story':
      case 'instagram-feed': {
        return `${baseMessage}\n\nBuilding better habits with science-backed tracking 📊\n\n#HabitTracking #AtomicHabits #BehaviorChange #SelfImprovement #Productivity\n\n${appStoreLink}`;
      }

      case 'twitter': {
        // Twitter has 280 character limit
        return `${baseMessage}\n\nTracking habits with science 📊 ${appStoreLink}\n\n#HabitTracking #Productivity`;
      }

      case 'facebook': {
        return `${baseMessage}\n\nI've been using this amazing habit tracking app that uses real behavioral science to help build lasting habits. Check it out!\n\n${appStoreLink}`;
      }

      default: {
        return baseMessage;
      }
    }
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
          dialogTitle: `Share your ${milestoneConfig.label} achievement!`,
          mimeType: 'image/png',
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
    const gradientColors = GRADIENT_PRESETS[selectedGradient]
      .colors as unknown as readonly [string, string, ...string[]];

    return (
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          height: format.height,
          quality: 1,
          width: format.width,
        }}
        style={[
          styles.cardContainer,
          {
            aspectRatio: format.aspectRatio,
            height: format.height,
            width: format.width,
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
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
                <Text style={styles.milestoneLabel}>
                  {milestoneConfig.label} Level
                </Text>
                <Text style={styles.strengthPercentage}>
                  {data.strengthPercentage}%
                </Text>
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
            height: previewHeight,
            width: previewWidth,
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
    <Modal variant='fullScreen' visible={visible} onClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: theme.custom.colors.gray[900] }]}
          >
            Share Your Achievement
          </Text>
          <Pressable onPress={onClose}>
            <Text
              style={[
                styles.closeButton,
                { color: theme.custom.colors.primary[500] },
              ]}
            >
              Done
            </Text>
          </Pressable>
        </View>

        {/* Preview */}
        <View style={styles.previewSection}>{renderPreview()}</View>

        {/* Customization Options */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.customizationSection}
        >
          {/* Platform Selection */}
          <View style={styles.optionGroup}>
            <Text
              style={[
                styles.optionLabel,
                { color: theme.custom.colors.gray[700] },
              ]}
            >
              Platform
            </Text>
            <View style={styles.platformButtons}>
              {(Object.keys(SHARE_FORMATS) as SharePlatform[]).map(
                (platform) => (
                  <Pressable
                    key={platform}
                    style={[
                      styles.platformButton,
                      selectedPlatform === platform && {
                        backgroundColor: theme.custom.colors.primary[500],
                      },
                    ]}
                    onPress={() => setSelectedPlatform(platform)}
                  >
                    <Text
                      style={[
                        styles.platformButtonText,
                        selectedPlatform === platform &&
                          styles.platformButtonTextActive,
                      ]}
                    >
                      {platform.replace('-', ' ')}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>

          {/* Gradient Selection */}
          <View style={styles.optionGroup}>
            <Text
              style={[
                styles.optionLabel,
                { color: theme.custom.colors.gray[700] },
              ]}
            >
              Background
            </Text>
            <View style={styles.gradientButtons}>
              {GRADIENT_PRESETS.map((gradient, index) => (
                <Pressable
                  key={gradient.name}
                  style={[
                    styles.gradientButton,
                    selectedGradient === index && styles.gradientButtonSelected,
                  ]}
                  onPress={() => setSelectedGradient(index)}
                >
                  <LinearGradient
                    colors={
                      gradient.colors as unknown as readonly [
                        string,
                        string,
                        ...string[],
                      ]
                    }
                    end={{ x: 1, y: 1 }}
                    start={{ x: 0, y: 0 }}
                    style={styles.gradientButtonInner}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Personal Message Input */}
          <View style={styles.optionGroup}>
            <Text
              style={[
                styles.optionLabel,
                { color: theme.custom.colors.gray[700] },
              ]}
            >
              Personal Message (Optional)
            </Text>
            <TextInput
              multiline
              maxLength={100}
              placeholder='Add a personal touch...'
              placeholderTextColor={theme.custom.colors.gray[400]}
              style={[
                styles.messageInput,
                {
                  backgroundColor: theme.custom.colors.gray[50],
                  borderColor: theme.custom.colors.gray[200],
                  color: theme.custom.colors.gray[900],
                },
              ]}
              value={personalMessage}
              onChangeText={setPersonalMessage}
            />
            <Text
              style={[
                styles.characterCount,
                { color: theme.custom.colors.gray[500] },
              ]}
            >
              {personalMessage.length}/100
            </Text>
          </View>

          {/* User Name Toggle */}
          <View style={styles.optionGroup}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelContainer}>
                <Text
                  style={[
                    styles.optionLabel,
                    { color: theme.custom.colors.gray[700], marginBottom: 0 },
                  ]}
                >
                  Show User Name
                </Text>
                {data.userName && (
                  <Text
                    style={[
                      styles.toggleSubtext,
                      { color: theme.custom.colors.gray[500] },
                    ]}
                  >
                    {data.userName}
                  </Text>
                )}
              </View>
              <Switch
                thumbColor='#FFFFFF'
                trackColor={{
                  false: theme.custom.colors.gray[300],
                  true: theme.custom.colors.primary[500],
                }}
                value={showUserName}
                onValueChange={setShowUserName}
              />
            </View>
          </View>

          {/* Share Button */}
          <Button
            fullWidth
            loading={isGenerating}
            style={styles.shareButton}
            onPress={handleShare}
          >
            Share to {selectedPlatform.replace('-', ' ')}
          </Button>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 48,
  },
  closeButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  emoji: {
    fontSize: 120,
  },
  emojiContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  habitName: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 4,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: '#e7e5e4',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  infoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  milestoneLabel: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
  previewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    gap: 4,
  },
  previewSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    flex: 1,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
  milestoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  customizationSection: {
    borderTopWidth: 1,
    borderTopColor: '#e7e5e4',
    padding: 24,
  },
  personalMessage: {
    color: '#FFFFFF',
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: 32,
    paddingHorizontal: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
  optionGroup: {
    marginBottom: 24,
  },
  progressBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    height: 12,
    overflow: 'hidden',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarContainer: {
    marginTop: 24,
    width: '100%',
  },
  platformButton: {
    backgroundColor: '#f5f5f4',
    borderRadius: 8,
    borderColor: '#e7e5e4',
    paddingHorizontal: 16,
    borderWidth: 1,
    paddingVertical: 8,
  },
  strengthPercentage: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gradientButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  gradientButton: {
    borderRadius: 12,
    height: 56,
    borderWidth: 2,
    width: 56,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  gradientButtonInner: {
    flex: 1,
  },
  scienceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 10,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  scienceBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  gradientButtonSelected: {
    borderColor: '#10B981',
  },
  messageInput: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 80,
    padding: 12,
    textAlignVertical: 'top',
  },
  userName: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  platformButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  platformButtonTextActive: {
    color: '#FFFFFF',
  },
  shareButton: {
    marginTop: 8,
  },
  toggleLabelContainer: {
    flex: 1,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
});

// Named exports for convenience
export { MILESTONE_CONFIG, GRADIENT_PRESETS, SHARE_FORMATS };

export default ShareCardGenerator;
