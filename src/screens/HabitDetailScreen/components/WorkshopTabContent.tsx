/**
 * WorkshopTabContent - Workshop/Motivation tab for HabitDetailScreen
 *
 * Wires the 4 workshop features (Affirmations, Vision Board, Letters to Self, WOOP)
 * to Convex backend and renders them in a scrollable view.
 */

import React, { useCallback } from 'react';
import { ScrollView, Text, View, Alert, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import ErrorBoundary from '../../../components/ErrorBoundary';
import {
  AffirmationsSection,
  VisionBoardSection,
  LettersSection,
  WOOPSection,
} from '../../../components/MotivationSystem/Workshop';
import type { AffirmationType } from '../../../components/MotivationSystem/Workshop';
import { usePremium } from '../../../hooks/usePremium/usePremium';
import { useThemeColors } from '../../../theme';
import type { Habit } from '../HabitDetailScreen.types';

interface WorkshopTabContentProps {
  habit: Habit;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function WorkshopTabContent({ habit }: WorkshopTabContentProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const { isPremium } = usePremium();
  // ── Convex queries ──
  const affirmations = useQuery(api.affirmations.listByHabit, {
    habitId: habit._id,
  });
  const visionBoardImages = useQuery(api.visionBoardImages.listByHabit, {
    habitId: habit._id,
  });
  const letters = useQuery(api.letters.listByHabit, {
    habitId: habit._id,
    limit: 5,
  });

  // ── Convex mutations ──
  const createAffirmation = useMutation(api.affirmations.create);
  const updateAffirmation = useMutation(api.affirmations.update);
  const deleteAffirmation = useMutation(api.affirmations.remove);

  const createVisionBoardImage = useMutation(api.visionBoardImages.create);
  const updateVisionBoardCaption = useMutation(
    api.visionBoardImages.updateCaption
  );
  const deleteVisionBoardImage = useMutation(api.visionBoardImages.remove);

  const createLetter = useMutation(api.letters.create);
  const markLetterAsRead = useMutation(api.letters.markAsRead);

  const updateHabit = useMutation(api.habits.update);

  // ── Image upload hook (used by VisionBoardSection internally) ──

  // ── Premium gate ──
  const handlePremiumRequired = useCallback(() => {
    Alert.alert(
      'Premium Feature',
      'Upgrade to Chain Day Pro to unlock unlimited workshop features.',
      [{ text: 'OK' }]
    );
  }, []);

  // ── Affirmation handlers ──
  const handleSaveAffirmation = useCallback(
    async (text: string, type?: AffirmationType) => {
      await createAffirmation({
        habitId: habit._id,
        text,
        type: type ?? 'motivational',
      });
    },
    [createAffirmation, habit._id]
  );

  const handleUpdateAffirmation = useCallback(
    async (id: string, text: string, type?: AffirmationType) => {
      await updateAffirmation({
        id: id as Id<'affirmations'>,
        text,
        type,
      });
    },
    [updateAffirmation]
  );

  const handleDeleteAffirmation = useCallback(
    async (id: string) => {
      await deleteAffirmation({
        id: id as Id<'affirmations'>,
      });
    },
    [deleteAffirmation]
  );

  // ── Vision Board handlers ──
  const handleAddImage = useCallback(
    async (storageId: Id<'_storage'>, caption?: string) => {
      await createVisionBoardImage({
        habitId: habit._id,
        storageId,
        caption,
      });
    },
    [createVisionBoardImage, habit._id]
  );

  const handleUpdateCaption = useCallback(
    async (imageId: string, caption?: string) => {
      await updateVisionBoardCaption({
        imageId: imageId as Id<'visionBoardImages'>,
        caption,
      });
    },
    [updateVisionBoardCaption]
  );

  const handleDeleteImage = useCallback(
    async (imageId: string) => {
      await deleteVisionBoardImage({
        imageId: imageId as Id<'visionBoardImages'>,
      });
    },
    [deleteVisionBoardImage]
  );

  // ── Letters handlers ──
  const handleSaveLetter = useCallback(
    async (content: string, unlockDays: number, title?: string) => {
      await createLetter({
        habitId: habit._id,
        content,
        unlockDays,
        title,
      });
    },
    [createLetter, habit._id]
  );

  const handleMarkAsRead = useCallback(
    async (letterId: string) => {
      await markLetterAsRead({
        letterId: letterId as Id<'letters'>,
      });
    },
    [markLetterAsRead]
  );

  // ── WOOP handler ──
  const handleWoopPress = useCallback(() => {
    Alert.alert('WOOP Plan', 'Edit your WOOP plan in the Edit screen.', [
      { text: 'OK' },
    ]);
  }, []);

  // ── Loading state ──
  if (affirmations === undefined || visionBoardImages === undefined || letters === undefined) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
        <Text
          className="mt-3 text-[13px]"
          style={{ color: themeColors.text.secondary }}
        >
          Loading workshop…
        </Text>
      </View>
    );
  }

  // ── Map data to component shapes ──
  const mappedAffirmations = (affirmations ?? []).map((a) => ({
    id: a._id as string,
    text: a.text,
    type: a.type as AffirmationType | undefined,
    createdAt: a._creationTime ?? a.createdAt ?? Date.now(),
  }));

  const mappedImages = (visionBoardImages ?? []).map((img) => ({
    id: img._id as string,
    storageId: img.storageId,
    imageUrl: img.imageUrl ?? null,
    caption: img.caption,
    order: img.order ?? 0,
    createdAt: img._creationTime ?? Date.now(),
  }));

  const mappedLetters = (letters ?? []).map((l) => ({
    id: l._id as string,
    title: l.title,
    content: l.content,
    createdAt: l._creationTime ?? l.createdAt ?? Date.now(),
    unlockAt: l.unlockAt ?? Date.now(),
    isRead: l.isRead ?? false,
  }));

  const woopData = {
    wish: habit.woopWish,
    outcome: habit.woopOutcome,
    obstacle: habit.woopObstacle,
    plan: habit.woopPlan,
  };

  const borderColor = isDark ? themeColors.border : '#DDD8D2';
  const labelColor = isDark ? themeColors.text.tertiary : '#9C958D';

  return (
    <ScrollView
      bounces
      className="flex-1"
      contentContainerClassName="pb-8 px-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Section label */}
      <Animated.View
        className="mb-3 mt-4 flex-row items-center justify-center gap-2"
        entering={anim(60)}
      >
        <View className="h-px flex-1" style={{ backgroundColor: borderColor }} />
        <Text
          className="text-[13px] font-semibold tracking-wider"
          style={{ color: labelColor }}
        >
          WORKSHOP
        </Text>
        <View className="h-px flex-1" style={{ backgroundColor: borderColor }} />
      </Animated.View>

      {/* Affirmations */}
      <ErrorBoundary>
        <AffirmationsSection
          affirmationCount={mappedAffirmations.length}
          affirmations={mappedAffirmations}
          isPremium={isPremium}
          sectionIndex={0}
          shouldAnimate
          onDeleteAffirmation={handleDeleteAffirmation}
          onPremiumRequired={handlePremiumRequired}
          onSaveAffirmation={handleSaveAffirmation}
          onUpdateAffirmation={handleUpdateAffirmation}
        />
      </ErrorBoundary>

      {/* Vision Board */}
      <ErrorBoundary>
        <VisionBoardSection
          imageCount={mappedImages.length}
          images={mappedImages}
          isPremium={isPremium}
          sectionIndex={1}
          shouldAnimate
          onAddImage={handleAddImage}
          onDeleteImage={handleDeleteImage}
          onPremiumRequired={handlePremiumRequired}
          onUpdateCaption={handleUpdateCaption}
        />
      </ErrorBoundary>

      {/* Letters to Self */}
      <ErrorBoundary>
        <LettersSection
          habitName={habit.name}
          isPremium={isPremium}
          letterCount={mappedLetters.length}
          letters={mappedLetters}
          sectionIndex={2}
          shouldAnimate
          onMarkAsRead={handleMarkAsRead}
          onPremiumRequired={handlePremiumRequired}
          onReadLetter={handleMarkAsRead}
          onSaveLetter={handleSaveLetter}
          onViewAllLetters={() => {
            /* TODO: navigate to full letters list */
          }}
        />
      </ErrorBoundary>

      {/* WOOP */}
      <ErrorBoundary>
        <WOOPSection
          sectionIndex={3}
          shouldAnimate
          woop={woopData}
          onPress={handleWoopPress}
        />
      </ErrorBoundary>
    </ScrollView>
  );
}
