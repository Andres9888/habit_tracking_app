/**
 * AffirmationScheduleModal Component
 * Modal for setting up scheduled delivery of affirmations
 */

import { triggerHaptic } from '@/utils/haptics';
import React, { useCallback } from 'react';
import { View, Modal, ScrollView } from 'react-native';
import { ScheduleHeader } from './ScheduleHeader';
import {
  AffirmationPreview,
  NextDeliveryPreview,
  ScienceCallout,
} from './InfoCallouts';
import { EnabledToggle } from './EnabledToggle';
import { TimePicker } from './TimePicker';
import { FrequencySelector } from './FrequencySelector';
import { DaySelectorSection } from './DaySelectorSection';
import { ScheduleFooter } from './ScheduleFooter';
import { useScheduleForm } from './useScheduleForm';
import type { AffirmationScheduleModalProps } from './types';

export function AffirmationScheduleModal({
  visible,
  onClose,
  onSave,
  onCancel,
  initialSchedule,
  affirmationText,
  isSaving = false,
}: AffirmationScheduleModalProps) {
  const form = useScheduleForm({ initialSchedule, visible });

  const handleSave = useCallback(() => {
    if (isSaving) return;
    triggerHaptic('toggle');
    void onSave(form.getScheduleData()).then(() => onClose());
  }, [isSaving, form, onSave, onClose]);

  const handleCancelSchedule = useCallback(() => {
    if (isSaving) return;
    triggerHaptic('toggle');
    void onCancel().then(() => onClose());
  }, [isSaving, onCancel, onClose]);

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-white'>
        <ScheduleHeader onClose={onClose} />
        <ScrollView
          className='flex-1'
          contentContainerClassName='p-4 pb-8'
          keyboardShouldPersistTaps='handled'
        >
          <AffirmationPreview text={affirmationText} />
          <EnabledToggle
            isEnabled={form.isEnabled}
            onToggle={form.handleToggleEnabled}
          />
          {form.isEnabled && (
            <>
              <TimePicker
                showPicker={form.showTimePicker}
                time={form.time}
                onShowPicker={() => form.setShowTimePicker(true)}
                onTimeChange={form.handleTimeChange}
              />
              <View className='mb-6'>
                <FrequencySelector
                  frequency={form.frequency}
                  onSelect={form.setFrequency}
                />
              </View>
              {form.frequency === 'weekly' && (
                <DaySelectorSection
                  daysOfWeek={form.daysOfWeek}
                  onToggleDay={form.handleToggleDay}
                />
              )}
              <NextDeliveryPreview nextDelivery={form.nextDelivery} />
              <ScienceCallout />
            </>
          )}
        </ScrollView>
        <ScheduleFooter
          hasExistingSchedule={form.hasExistingSchedule}
          isEnabled={form.isEnabled}
          isSaving={isSaving}
          onCancel={handleCancelSchedule}
          onSave={handleSave}
        />
      </View>
    </Modal>
  );
}

export default AffirmationScheduleModal;
