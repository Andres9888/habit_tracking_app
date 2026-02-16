/**
 * WorkshopTab - Motivation System Workshop Tab
 * Displays all motivation tools: Affirmations, Vision Board, Letters, WOOP
 *
 * Integrated into HabitDetailScreen as a tab for habit-specific motivation
 * 
 * Features:
 * - Affirmations: Positive self-talk with AI generation
 * - Vision Board: Motivational images
 * - Letters to Self: Temporal self-continuity (time-locked letters)
 * - WOOP: Mental contrasting + implementation intentions
 * - Your Why: Self-determination theory
 * - Identity: James Clear's identity-based habits
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../theme';
import {
  YourWhySection,
  IdentitySection,
  CueTriggerSection,
  WOOPSection,
  VisionBoardSection,
  AffirmationsSection,
  LettersSection,
} from '../../../components/MotivationSystem/Workshop';
import type { Habit } from '../../../features/habits/types';

interface WorkshopTabProps {
  habit: Habit;
  isPremium: boolean;
  onPremiumRequired: () => void;
  reduceMotion?: boolean;
  shouldAnimate?: boolean;
}

const anim = (delay: number) =>
  Animated.FadeInUp.duration(280).delay(delay).springify().damping(18);

export function WorkshopTab({
  habit,
  isPremium,
  onPremiumRequired,
  reduceMotion = false,
  shouldAnimate = true,
}: WorkshopTabProps) {
  const { colors, isDark } = useThemeColors();
  const [, setRefresh] = useState(0);

  // Motivation data from habit (using optional chaining for Convex compatibility)
  const motivation = (habit as any)?.motivation || {};
  const yourWhy = motivation.yourWhy || '';
  const identity = motivation.identity || '';
  const cueTrigger = motivation.cueTrigger || null;
  const woop = motivation.woop || null;
  const visionBoard = motivation.visionBoard || [];
  const affirmations = motivation.affirmations || [];
  const letters = motivation.letters || [];

  const handlePremiumRequired = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onPremiumRequired();
  };

  // Stub handlers - would be connected to actual data mutations
  const handleSaveYourWhy = async (_text: string) => {
    console.log('Save Your Why:', _text);
    setRefresh((prev) => prev + 1);
  };

  const handleSaveIdentity = async (_text: string) => {
    console.log('Save Identity:', _text);
    setRefresh((prev) => prev + 1);
  };

  const handleSaveWOOP = async (_woop: any) => {
    console.log('Save WOOP:', _woop);
    setRefresh((prev) => prev + 1);
  };

  // Affirmations handlers
  const handleSaveAffirmation = async (_text: string) => {
    console.log('Save Affirmation:', _text);
    setRefresh((prev) => prev + 1);
  };

  const handleDeleteAffirmation = async (_id: string) => {
    console.log('Delete Affirmation:', _id);
    setRefresh((prev) => prev + 1);
  };

  // Vision Board handlers
  const handleAddImage = async (_imageData: any) => {
    console.log('Add Image:', _imageData);
    setRefresh((prev) => prev + 1);
  };

  const handleDeleteImage = async (_imageId: string) => {
    console.log('Delete Image:', _imageId);
    setRefresh((prev) => prev + 1);
  };

  // Letters handlers
  const handleSaveLetter = async (_letterData: any) => {
    console.log('Save Letter:', _letterData);
    setRefresh((prev) => prev + 1);
  };

  const cardBg = isDark ? colors.card : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#1c1917';

  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      {/* Intro Card - Why Motivation Matters */}
      <Animated.View entering={anim(0)}>
        <View
          className='mb-6 rounded-xl p-4'
          style={{
            backgroundColor: colors.primary[50],
            borderLeftColor: colors.primary[700],
            borderLeftWidth: 4,
          }}
        >
          <Text
            className='text-sm font-semibold'
            style={{ color: colors.primary[700] }}
          >
            💡 Science-Backed Motivation
          </Text>
          <Text
            className='mt-2 text-xs leading-relaxed'
            style={{ color: colors.text.secondary }}
          >
            Use the Workshop tools to deepen your connection to this habit.
            Combine why, identity, planning, and inspiration for 2x better
            results.
          </Text>
        </View>
      </Animated.View>

      {/* Your Why - Why does this habit matter? */}
      <Animated.View entering={anim(60)}>
        <YourWhySection
          habitName={habit.name}
          yourWhy={yourWhy}
          onSave={handleSaveYourWhy}
          shouldAnimate={shouldAnimate}
          reduceMotion={reduceMotion}
          sectionIndex={0}
        />
      </Animated.View>

      {/* Identity - Who do you want to become? */}
      <Animated.View entering={anim(120)}>
        <IdentitySection
          identity={identity}
          onSave={handleSaveIdentity}
          shouldAnimate={shouldAnimate}
          reduceMotion={reduceMotion}
          sectionIndex={1}
        />
      </Animated.View>

      {/* WOOP - Mental contrasting + implementation intentions */}
      <Animated.View entering={anim(180)}>
        <WOOPSection
          woop={woop}
          onPress={() => console.log('Edit WOOP')}
          shouldAnimate={shouldAnimate}
          reduceMotion={reduceMotion}
          sectionIndex={2}
        />
      </Animated.View>

      {/* Cue Trigger - Implementation Intentions */}
      <Animated.View entering={anim(240)}>
        <CueTriggerSection
          cueTrigger={cueTrigger}
          onSave={() => console.log('Save Cue')}
          shouldAnimate={shouldAnimate}
          reduceMotion={reduceMotion}
          sectionIndex={3}
        />
      </Animated.View>

      {/* Vision Board - Visual motivation */}
      <Animated.View entering={anim(300)}>
        <VisionBoardSection
          images={visionBoard}
          imageCount={visionBoard.length}
          isPremium={isPremium}
          onAddImage={handleAddImage}
          onUpdateCaption={() => console.log('Update caption')}
          onDeleteImage={handleDeleteImage}
          onPremiumRequired={handlePremiumRequired}
          shouldAnimate={shouldAnimate}
          reduceMotion={reduceMotion}
          sectionIndex={4}
        />
      </Animated.View>

      {/* Affirmations - Positive self-talk */}
      <Animated.View entering={anim(360)}>
        <AffirmationsSection
          affirmations={affirmations}
          affirmationCount={affirmations.length}
          isPremium={isPremium}
          onSaveAffirmation={handleSaveAffirmation}
          onUpdateAffirmation={async () => console.log('Update')}
          onDeleteAffirmation={handleDeleteAffirmation}
          onScheduleAffirmation={async () => console.log('Schedule')}
          onCancelSchedule={async () => console.log('Cancel')}
          onGenerateAffirmations={async () => console.log('Generate')}
          onPremiumRequired={handlePremiumRequired}
          hasHabitContext={Boolean(habit.name)}
          shouldAnimate={shouldAnimate}
          reduceMotion={reduceMotion}
          sectionIndex={5}
        />
      </Animated.View>

      {/* Letters to Self - Temporal self-continuity */}
      <Animated.View entering={anim(420)}>
        <LettersSection
          letters={letters}
          letterCount={letters.length}
          isPremium={isPremium}
          onSaveLetter={handleSaveLetter}
          onReadLetter={() => console.log('Read letter')}
          onViewAllLetters={() => console.log('View all')}
          onPremiumRequired={handlePremiumRequired}
          shouldAnimate={shouldAnimate}
          reduceMotion={reduceMotion}
          sectionIndex={6}
          habitName={habit.name}
        />
      </Animated.View>

      {/* Premium Upsell */}
      {!isPremium && (
        <Animated.View
          entering={anim(480)}
          className='mt-6 rounded-xl p-4'
          style={{
            backgroundColor: isDark ? colors.card : '#FDF2F8',
            borderColor: colors.primary[200],
            borderWidth: 1,
          }}
        >
          <Text
            className='text-sm font-semibold'
            style={{ color: colors.text.primary }}
          >
            🚀 Unlock Premium Motivation
          </Text>
          <Text
            className='mt-2 text-xs leading-relaxed'
            style={{ color: colors.text.secondary }}
          >
            Get access to Voice Notes, Letters to Self, and advanced features.
          </Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

export default WorkshopTab;
