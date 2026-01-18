/**
 * CelebrationScreen - Post-completion celebration and reflection flow
 *
 * Part of the Motivation System - Reward phase
 * Scientific Basis: BJ Fogg (Stanford) - Celebration immediately after behavior
 * is the most important part of habit formation.
 */

import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from '../../../Modal';
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

  if (!habit) return null;

  return (
    <Modal
      respectReduceMotion={!reduceMotion}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View
        className='flex-1 bg-gradient-to-b from-emerald-50 to-stone-50'
        style={{ paddingTop: insets.top }}
      >
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
          className='border-t border-emerald-100 bg-white px-4 pt-4'
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
