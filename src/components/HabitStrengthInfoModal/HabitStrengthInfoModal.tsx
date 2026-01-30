/**
 * HabitStrengthInfoModal Component
 *
 * Educational modal explaining how habit strength is calculated.
 */

import React from 'react';
import { View } from 'react-native';

import Modal from '../Modal';
import { ModalHeader, ModalContent } from './components';
import type { HabitStrengthInfoModalProps } from './types';

export function HabitStrengthInfoModal({
  visible,
  onClose,
}: HabitStrengthInfoModalProps) {
  return (
    <Modal variant='bottomSheet' visible={visible} onClose={onClose}>
      <View className='max-h-[85%] px-5 pb-8 pt-2'>
        <ModalHeader onClose={onClose} />
        <ModalContent />
      </View>
    </Modal>
  );
}

export default HabitStrengthInfoModal;
