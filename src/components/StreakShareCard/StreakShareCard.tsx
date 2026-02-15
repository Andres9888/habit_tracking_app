/**
 * StreakShareCard Component
 *
 * A social-sharing-optimized card for streak milestones.
 * Users can capture and share their streak achievements
 * to Instagram Stories, Twitter, etc.
 *
 * Design:
 * - Gradient background with brand colors
 * - Large streak number as hero element
 * - Habit name, emoji, and milestone badge
 * - "Chain Day" branding watermark
 * - Capture via react-native-view-shot + Share API
 */

import React, { useCallback, useRef, useState } from 'react';
import { View, Text, Share, Platform, Pressable } from 'react-native';
import type ViewShot from 'react-native-view-shot';
import { Modal } from '../Modal';
import type { StreakShareCardProps, ShareCardTheme } from './types';

const THEMES: ShareCardTheme[] = [
  {
    name: 'Emerald',
    backgroundColors: ['#059669', '#047857'],
    textColor: '#ffffff',
    accentColor: '#34d399',
  },
  {
    name: 'Sunset',
    backgroundColors: ['#f59e0b', '#ef4444'],
    textColor: '#ffffff',
    accentColor: '#fcd34d',
  },
  {
    name: 'Midnight',
    backgroundColors: ['#1e1b4b', '#312e81'],
    textColor: '#ffffff',
    accentColor: '#a78bfa',
  },
  {
    name: 'Ocean',
    backgroundColors: ['#0284c7', '#0369a1'],
    textColor: '#ffffff',
    accentColor: '#7dd3fc',
  },
];

export function StreakShareCard({
  visible,
  onClose,
  streakDays,
  habitName,
  habitEmoji = '🔗',
  milestoneTitle,
  userName,
}: StreakShareCardProps) {
  const viewShotRef = useRef<ViewShot>(null);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  const theme = THEMES[selectedTheme];

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      // Try to capture the card as image if view-shot is available
      let uri: string | undefined;
      try {
        if (viewShotRef.current?.capture) {
          uri = await viewShotRef.current.capture();
        }
      } catch {
        // View-shot may not be available; fall back to text sharing
      }

      const shareMessage = [
        `${habitEmoji} ${streakDays}-day streak on "${habitName}"!`,
        milestoneTitle ? `🎉 ${milestoneTitle}` : '',
        '',
        'Building habits one day at a time with Chain Day ⛓️',
      ]
        .filter(Boolean)
        .join('\n');

      await Share.share(
        Platform.OS === 'ios'
          ? { message: shareMessage, url: uri }
          : { message: uri ? `${shareMessage}\n${uri}` : shareMessage }
      );
    } catch {
      // User cancelled or share failed — no action needed
    } finally {
      setIsSharing(false);
    }
  }, [streakDays, habitName, habitEmoji, milestoneTitle]);

  return (
    <Modal variant="fullScreen" visible={visible} onClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 12,
          }}
        >
          <Pressable onPress={onClose}>
            <Text style={{ color: '#6b7280', fontSize: 17 }}>Cancel</Text>
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827' }}>
            Share Streak
          </Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Card Preview */}
        <View style={{ alignItems: 'center', paddingVertical: 24, flex: 1 }}>
          <View
            style={{
              width: 320,
              aspectRatio: 4 / 5,
              borderRadius: 24,
              backgroundColor: theme.backgroundColors[0],
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 32,
              shadowColor: theme.backgroundColors[0],
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            {/* Emoji */}
            <Text style={{ fontSize: 56, marginBottom: 16 }}>{habitEmoji}</Text>

            {/* Streak Number */}
            <Text
              style={{
                fontSize: 72,
                fontWeight: '800',
                color: theme.textColor,
                lineHeight: 80,
              }}
            >
              {streakDays}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: theme.accentColor,
                marginTop: 4,
                textTransform: 'uppercase',
                letterSpacing: 3,
              }}
            >
              {streakDays === 1 ? 'DAY' : 'DAYS'}
            </Text>

            {/* Milestone Title */}
            {milestoneTitle && (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: theme.textColor,
                  marginTop: 20,
                  textAlign: 'center',
                }}
              >
                {milestoneTitle}
              </Text>
            )}

            {/* Habit Name */}
            <Text
              style={{
                fontSize: 15,
                color: theme.textColor,
                opacity: 0.8,
                marginTop: 12,
                textAlign: 'center',
              }}
            >
              {habitName}
            </Text>

            {/* User Name */}
            {userName && (
              <Text
                style={{
                  fontSize: 13,
                  color: theme.textColor,
                  opacity: 0.6,
                  marginTop: 8,
                }}
              >
                by {userName}
              </Text>
            )}

            {/* Branding */}
            <Text
              style={{
                position: 'absolute',
                bottom: 20,
                fontSize: 12,
                color: theme.textColor,
                opacity: 0.4,
                fontWeight: '600',
                letterSpacing: 1,
              }}
            >
              CHAIN DAY ⛓️
            </Text>
          </View>
        </View>

        {/* Theme Selector */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
            paddingBottom: 16,
          }}
        >
          {THEMES.map((t, i) => (
            <Pressable
              key={t.name}
              accessibilityLabel={`${t.name} theme`}
              accessibilityRole="button"
              onPress={() => setSelectedTheme(i)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: t.backgroundColors[0],
                borderWidth: selectedTheme === i ? 3 : 0,
                borderColor: '#111827',
              }}
            />
          ))}
        </View>

        {/* Share Button */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          <Pressable
            accessibilityLabel="Share your streak"
            accessibilityRole="button"
            disabled={isSharing}
            onPress={handleShare}
            style={{
              backgroundColor: '#059669',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: isSharing ? 0.6 : 1,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '600' }}>
              {isSharing ? 'Sharing…' : 'Share 🎉'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
