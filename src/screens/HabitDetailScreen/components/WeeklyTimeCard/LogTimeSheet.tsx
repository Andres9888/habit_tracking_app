import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { formatSheetDate } from './formatSheetDate';
import { LogTimeSheetBody } from './LogTimeSheetBody';

interface LogTimeSheetProps {
  habitId: Id<'habits'>;
  date: string | null;
  initialMinutes: number;
  onClose: () => void;
}

export function LogTimeSheet({ habitId, date, initialMinutes, onClose }: LogTimeSheetProps) {
  const { colors } = useThemeColors();
  const { triggerSelection, triggerSuccess } = useHapticFeedback();
  const setMinutes = useMutation(api.tracking.setHabitMinutes);
  const [value, setValue] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (date) setValue(initialMinutes > 0 ? String(initialMinutes) : '');
  }, [date, initialMinutes]);

  const handleSave = async (mins: number | undefined) => {
    if (!date || saving) return;
    setSaving(true);
    try {
      await setMinutes({ date, habitId, minutes: mins });
      triggerSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const numericValue = Math.max(0, Number.parseInt(value, 10) || 0);

  return (
    <Modal
      animationType='slide'
      presentationStyle='overFullScreen'
      statusBarTranslucent
      transparent
      visible={date !== null}
      onRequestClose={onClose}
    >
      <Pressable className='flex-1 justify-end' style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable
            className='rounded-t-3xl px-5 pb-10 pt-3'
            style={{ backgroundColor: colors.card }}
            onPress={(e) => e.stopPropagation()}
          >
          <View className='mx-auto mb-4 h-1 w-10 rounded-full' style={{ backgroundColor: colors.border }} />
          <Text className='text-center' style={{ ...typography.heading3, color: colors.text.primary }}>
            Log time
          </Text>
          <Text className='mb-4 mt-1 text-center' style={{ ...typography.caption, color: colors.text.secondary }}>
            {date ? formatSheetDate(date) : ''}
          </Text>
          <LogTimeSheetBody
            value={value}
            onChangeValue={setValue}
            onQuickPick={(mins) => {
              triggerSelection();
              setValue(String(mins));
            }}
          />
          <Pressable
            accessibilityRole='button'
            className='mb-2 items-center rounded-xl px-6 py-3.5'
            disabled={saving}
            style={{ backgroundColor: colors.primary[600], opacity: saving ? 0.6 : 1 }}
            onPress={() => void handleSave(numericValue || undefined)}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: fontWeights.semibold }}>
              {saving ? 'Saving…' : 'Save'}
            </Text>
          </Pressable>
          {initialMinutes > 0 ? (
            <Pressable
              accessibilityRole='button'
              className='items-center rounded-xl px-6 py-3'
              disabled={saving}
              onPress={() => void handleSave(undefined)}
            >
              <Text style={{ ...typography.bodySmall, color: colors.status.error, fontWeight: fontWeights.semibold }}>
                Clear
              </Text>
            </Pressable>
          ) : null}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

