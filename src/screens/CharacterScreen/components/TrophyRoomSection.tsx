/* eslint-disable max-lines */
/**
 * TrophyRoomSection
 * Entry point to the MilestoneGallery from the Character screen.
 * Shows trophy count + a "View All" chevron.
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Trophy, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../theme/ThemeContext';
import { MilestoneGallery } from '../../../components/MilestoneGallery';
import { useMilestoneGalleryData } from '../../../components/MilestoneGallery';
import { GALLERY_MILESTONES } from '../../../components/MilestoneGallery';

const SECTION_DELAY = 580;

const TROPHY_GRADIENT: [string, string] = ['#ff8c00', '#ff6900'];

export function TrophyRoomSection() {
  const { colors } = useThemeColors();
  const [galleryVisible, setGalleryVisible] = useState(false);
  const { achievedCount } = useMilestoneGalleryData();

  const totalMilestones = GALLERY_MILESTONES.length;

  function handleOpen() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setGalleryVisible(true);
  }

  return (
    <>
      <Animated.View
        className='mb-6'
        entering={FadeInDown.delay(SECTION_DELAY).springify().damping(18)}
      >
        {/* Section title */}
        <Text
          className='mb-3 px-1 font-semibold'
          style={{
            color: colors.text.primary,
            fontSize: 17,
            letterSpacing: -0.41,
            lineHeight: 22,
          }}
        >
          Trophy Room
        </Text>

        {/* Card row */}
        <Pressable
          accessible
          accessibilityHint="Opens your milestone trophy gallery"
          accessibilityLabel="Trophy Room"
          accessibilityRole="button"
          style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
          onPress={handleOpen}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderRadius: 16,
              borderWidth: 1,
              overflow: 'hidden',
              shadowColor: colors.text.primary,
              shadowOffset: { height: 4, width: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: 14,
                paddingHorizontal: 20,
                paddingVertical: 16,
              }}
            >
              {/* Icon */}
              <View
                style={{
                  borderRadius: 14,
                  height: 48,
                  overflow: 'hidden',
                  width: 48,
                }}
              >
                <LinearGradient
                  colors={TROPHY_GRADIENT}
                  end={{ x: 1, y: 1 }}
                  start={{ x: 0, y: 0 }}
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <Trophy color="white" size={24} />
                </LinearGradient>
              </View>

              {/* Text */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 17,
                    fontWeight: '600',
                    letterSpacing: -0.41,
                    lineHeight: 22,
                  }}
                >
                  Streak Milestones
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 13,
                    letterSpacing: -0.08,
                    lineHeight: 18,
                  }}
                >
                  {achievedCount} of {totalMilestones} trophies earned
                </Text>
              </View>

              {/* Chevron */}
              <ChevronRight color={colors.text.tertiary} size={20} />
            </View>

            {/* Mini trophy pip row */}
            <View
              style={{
                backgroundColor: colors.gray[100],
                borderTopColor: colors.cardBorder,
                borderTopWidth: 1,
                flexDirection: 'row',
                gap: 6,
                justifyContent: 'center',
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            >
              {GALLERY_MILESTONES.map((m, i) => (
                <View
                  key={m.days}
                  style={{
                    alignItems: 'center',
                    backgroundColor: i < achievedCount ? m.color + '33' : colors.gray[200],
                    borderRadius: 999,
                    height: 28,
                    justifyContent: 'center',
                    width: 28,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>
                    {i < achievedCount ? m.emoji : '🔒'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Pressable>
      </Animated.View>

      <MilestoneGallery
        visible={galleryVisible}
        onClose={() => setGalleryVisible(false)}
      />
    </>
  );
}
