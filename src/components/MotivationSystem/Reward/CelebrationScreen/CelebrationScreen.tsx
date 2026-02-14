/**
 * CelebrationScreen - Post-completion celebration and reflection flow
 *
 * Part of the Motivation System - Reward phase
 * Scientific Basis: BJ Fogg (Stanford) - Celebration immediately after behavior
 * is the most important part of habit formation.
 *
 * Uses theme-aware colors for dark mode support.
 */

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from '../../../Modal';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { AnimatedContent, ModalHeader, DoneButton } from './components';
import { CelebrationScreenContent } from './CelebrationScreenContent';
import { useCelebrationScreen } from './useCelebrationScreen';
import type { CelebrationScreenProps } from './types';

export function CelebrationScreen(props: CelebrationScreenProps) {
  const {
    visible,
    onClose,
    habit,
    onReflectionSubmit,
    reduceMotion = false,
  } = props;
  const insets = useSafeAreaInsets();
  const state = useCelebrationScreen(props);
  const { colors, isDark } = useThemeColors();

  if (!habit) return null;

  const gradientColors: [string, string] = isDark
    ? [colors.background, colors.surface]
    : ['#ecfdf5', '#fafaf9'];

  return (
    <Modal
      respectReduceMotion={!reduceMotion}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View
        className='flex-1'
        style={{ paddingTop: insets.top }}
      >
        <LinearGradient
          className='absolute inset-0'
          colors={gradientColors}
        />
        <ModalHeader onClose={onClose} />
        <CelebrationScreenContent
          habit={habit}
          handleEmojiSelect={state.handleEmojiSelect}
          handleNoteChange={state.handleNoteChange}
          handleRecordVoice={state.handleRecordVoice}
          handleWriteLetter={state.handleWriteLetter}
          hasStats={state.hasStats}
          hasStreak={state.hasStreak}
          localEmoji={state.localEmoji}
          localNote={state.localNote}
          reduceMotion={reduceMotion}
          visible={visible}
          onReflectionSubmit={onReflectionSubmit}
        />
        <View
          className='border-t px-4 pt-4'
          style={{
            borderTopColor: isDark ? colors.border : '#d1fae5',
            backgroundColor: colors.card,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          <AnimatedContent
            index={7}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <DoneButton
              reduceMotion={reduceMotion}
              onPress={state.handleDone}
            />
          </AnimatedContent>
        </View>
      </View>
    </Modal>
  );
}

export default CelebrationScreen;
