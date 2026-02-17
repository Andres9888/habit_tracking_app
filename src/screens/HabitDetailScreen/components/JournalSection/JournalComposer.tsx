import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useThemeColors } from '../../../../theme';
import { MoodPicker } from './MoodPicker';
import type { MoodType } from './types';
import type { Id } from '../../../../convex/_generated/dataModel';

interface JournalComposerProps {
  habitId: Id<'habits'>;
  canAdd: boolean;
  onEntryCreated: () => void;
}

const anim = FadeInUp.duration(280).springify().damping(18);

export function JournalComposer({ habitId, canAdd, onEntryCreated }: JournalComposerProps) {
  const { colors, isDark } = useThemeColors();
  const [mood, setMood] = useState<MoodType | null>(null);
  const [textContent, setTextContent] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatWasHard, setWhatWasHard] = useState('');
  const [whatWillChange, setWhatWillChange] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEntry = useMutation(api.journalEntries.create);

  const cardBg = isDark ? colors.card : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#1c1917';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const placeholderColor = isDark ? '#666' : '#999';

  const canSubmit = mood !== null && textContent.trim().length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !mood) return;

    setIsSubmitting(true);
    try {
      await createEntry({
        habitId,
        mood,
        textContent: textContent.trim(),
        whatWentWell: whatWentWell.trim() || undefined,
        whatWasHard: whatWasHard.trim() || undefined,
        whatWillChange: whatWillChange.trim() || undefined,
      });

      // Reset form
      setMood(null);
      setTextContent('');
      setWhatWentWell('');
      setWhatWasHard('');
      setWhatWillChange('');
      onEntryCreated();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to save journal entry'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canAdd) {
    return (
      <Animated.View
        className='items-center rounded-2xl p-4'
        entering={anim}
        style={{
          backgroundColor: cardBg,
          elevation: 4,
          shadowColor,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
        }}
      >
        <Text className='text-2xl'>🔒</Text>
        <Text
          className='mt-2 text-center text-[15px] font-semibold'
          style={{ color: colors.text.primary }}
        >
          Unlock Unlimited Journal Entries
        </Text>
        <Text
          className='mt-1 text-center text-[13px]'
          style={{ color: colors.text.secondary }}
        >
          Free tier: 3 entries per habit. Upgrade to premium for unlimited reflections.
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      className='rounded-2xl p-4'
      entering={anim}
      style={{
        backgroundColor: cardBg,
        elevation: 4,
        shadowColor,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
      }}
    >
      {/* Mood picker */}
      <Text
        className='mb-2 text-[13px] font-semibold uppercase tracking-wider'
        style={{ color: isDark ? colors.text.tertiary : '#9C958D' }}
      >
        How are you feeling?
      </Text>
      <MoodPicker selected={mood} onSelect={setMood} />

      {/* Main text */}
      <TextInput
        multiline
        className='mt-3 rounded-xl p-3 text-[15px]'
        maxLength={5000}
        placeholder='Write your reflection...'
        placeholderTextColor={placeholderColor}
        style={{
          backgroundColor: inputBg,
          color: colors.text.primary,
          minHeight: 80,
          textAlignVertical: 'top',
        }}
        value={textContent}
        onChangeText={setTextContent}
      />

      {/* Prompted questions */}
      <PromptInput
        inputBg={inputBg}
        label='✨ What went well?'
        placeholder='Celebrate your wins...'
        placeholderColor={placeholderColor}
        textColor={colors.text.primary}
        value={whatWentWell}
        onChangeText={setWhatWentWell}
      />
      <PromptInput
        inputBg={inputBg}
        label='💪 What was hard?'
        placeholder='Acknowledge the struggle...'
        placeholderColor={placeholderColor}
        textColor={colors.text.primary}
        value={whatWasHard}
        onChangeText={setWhatWasHard}
      />
      <PromptInput
        inputBg={inputBg}
        label='🔄 What will you do differently?'
        placeholder='Plan your next move...'
        placeholderColor={placeholderColor}
        textColor={colors.text.primary}
        value={whatWillChange}
        onChangeText={setWhatWillChange}
      />

      {/* Submit button */}
      <TouchableOpacity
        accessibilityLabel='Save journal entry'
        accessibilityRole='button'
        className='mt-4 items-center rounded-xl py-3'
        disabled={!canSubmit}
        style={{
          backgroundColor: canSubmit ? '#059669' : isDark ? '#333' : '#E5E5E5',
          opacity: isSubmitting ? 0.6 : 1,
        }}
        onPress={handleSubmit}
      >
        <Text
          className='text-[15px] font-semibold'
          style={{ color: canSubmit ? '#FFFFFF' : isDark ? '#666' : '#999' }}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function PromptInput({
  label,
  placeholder,
  value,
  onChangeText,
  inputBg,
  textColor,
  placeholderColor,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  inputBg: string;
  textColor: string;
  placeholderColor: string;
}) {
  return (
    <View className='mt-3'>
      <Text className='mb-1 text-[13px] font-medium' style={{ color: textColor }}>
        {label}
      </Text>
      <TextInput
        multiline
        className='rounded-xl p-3 text-[13px]'
        maxLength={5000}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        style={{
          backgroundColor: inputBg,
          color: textColor,
          minHeight: 48,
          textAlignVertical: 'top',
        }}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
