/**
 * DualVizExplainerModal Component
 * Shows explanation of the Huberman visualization protocol
 */

import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Eye, X, Sparkles, AlertTriangle } from 'lucide-react-native';
import type { DualVizExplainerModalProps } from '../DualVizSetup.types';
import { ExplainerHeader } from './ExplainerHeader';
import { ExplainerKeyInsight } from './ExplainerKeyInsight';
import { ExplainerProtocol } from './ExplainerProtocol';
import { ExplainerBreakdown } from './ExplainerBreakdown';

export function DualVizExplainerModal({
  visible,
  onClose,
}: DualVizExplainerModalProps) {
  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel='Close modal'
        accessibilityRole='button'
        className='flex-1 items-center justify-center bg-black/50 px-6'
        onPress={onClose}
      >
        <Pressable
          accessibilityLabel='Visualization protocol explanation'
          accessibilityRole='none'
          className='w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl'
          onPress={(e) => e.stopPropagation()}
        >
          <ExplainerHeader onClose={onClose} />
          <ExplainerKeyInsight />
          <ExplainerProtocol />
          <ExplainerBreakdown />

          {/* Source */}
          <Text className='text-center text-xs italic text-stone-400'>
            Source: Huberman Lab Podcast #55
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
