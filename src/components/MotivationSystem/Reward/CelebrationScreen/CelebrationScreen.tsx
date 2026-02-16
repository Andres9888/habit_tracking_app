/**
 * CelebrationScreen - Post-completion celebration and reflection flow
 *
 * Part of the Motivation System - Reward phase
 * Scientific Basis: BJ Fogg (Stanford) - Celebration immediately after behavior
 * is the most important part of habit formation.
 */

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from '../../../Modal';
import { AnimatedContent, ModalHeader, DoneButton } from './components';
import { CelebrationScreenContent } from './CelebrationScreenContent';
import { useCelebrationScreen } from './useCelebrationScreen';
import { useIsDark } from '../../../../theme/ThemeContext';
import type { CelebrationScreenProps } from './types';

/** Dark mode and light mode gradient colors for celebration background */
const GRADIENT_COLORS = {
  light: ['#ecfdf5', '#fafaf9'] as [string, string],
  dark: ['#064e3b', '#1c1917'] as [string, string],
};

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
  const isDark = useIsDark();
  const gradientColors = isDark ? GRADIENT_COLORS.dark : GRADIENT_COLORS.light;

  if (!habit) return null;

  return (
    <Modal
      accessibilityViewIsModal
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
          className={`border-t px-4 pt-4 ${isDark ? 'border-emerald-800 bg-stone-900' : 'border-emerald-100 bg-white'}`}
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
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
