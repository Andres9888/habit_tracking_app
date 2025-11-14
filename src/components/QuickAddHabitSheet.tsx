import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Animated, Modal } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppTheme } from '../theme';
import * as Haptics from 'expo-haptics';

interface QuickAddHabitSheetProps {
  onClose: () => void;
  onOpenFullModal: () => void;
  visible: boolean;
}

// Emoji detection helper
const detectEmojiFromName = (name: string): string => {
  const lowerName = name.toLowerCase();

  const emojiMap: Record<string, string> = {
    cook: '🍳',
    clean: '🧹',
    drink: '💧',
    eat: '🍎',
    exercise: '🏃',
    journal: '📝',
    learn: '🎓',
    meditate: '🧘',
    meditation: '🧘',
    read: '📖',
    run: '🏃',
    sleep: '😴',
    stretch: '🤸',
    study: '📚',
    walk: '🚶',
    water: '💧',
    workout: '💪',
    write: '✍️',
    yoga: '🧘',
  };

  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (lowerName.includes(keyword)) {
      return emoji;
    }
  }

  return '✅'; // Default emoji
};

const QuickAddHabitSheet: React.FC<QuickAddHabitSheetProps> = ({
  onClose,
  onOpenFullModal,
  visible,
}) => {
  const theme = useAppTheme();
  const createHabit = useMutation(api.habits.create);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        friction: 12,
        tension: 80,
        toValue: 0,
        useNativeDriver: true,
      }).start();

      // Auto-focus input after animation starts
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      Animated.timing(slideAnim, {
        duration: 250,
        toValue: 400,
        useNativeDriver: true,
      }).start();
      setName(''); // Clear input when closing
    }
  }, [visible, slideAnim]);

  const handleQuickCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setCreating(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Haptics not available:', error);
    }

    try {
      const emoji = detectEmojiFromName(trimmedName);

      await createHabit({
        icon: emoji,
        iconColor: theme.custom.colors.primary[500],
        name: trimmedName,
        notes: '',
      });

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }

      setName('');
      onClose();
    } catch (error) {
      console.error('Failed to create habit:', error);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (hapticError) {
        console.warn('Haptics not available:', hapticError);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCustomize = () => {
    onClose();
    setTimeout(() => {
      onOpenFullModal();
    }, 100);
  };

  if (!visible) return null;

  return (
    <Modal animationType='none' onRequestClose={onClose} transparent visible={visible}>
      {/* Backdrop */}
      <Pressable
        className='absolute inset-0'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      />

      {/* Bottom Sheet */}
      <Animated.View
        className='absolute bottom-0 left-0 right-0 rounded-t-3xl p-6 pb-8'
        style={{
          backgroundColor: theme.custom.colors.light.surface,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Handle */}
        <View className='mb-6 items-center'>
          <View
            className='h-1 w-12 rounded-full'
            style={{ backgroundColor: theme.custom.colors.gray[300] }}
          />
        </View>

        {/* Title */}
        <Text
          className='mb-1 text-2xl font-bold'
          style={{ color: theme.custom.colors.text.primary }}
        >
          Quick Add Habit
        </Text>

        <Text
          className='mb-5 text-sm'
          style={{ color: theme.custom.colors.text.secondary }}
        >
          Create a habit in seconds with smart defaults
        </Text>

        {/* Input */}
        <TextInput
          ref={inputRef}
          autoCapitalize='sentences'
          className='mb-5 rounded-2xl border px-5 py-4 text-base'
          placeholder='e.g., Drink water, Read, Meditate'
          placeholderTextColor={theme.custom.colors.text.tertiary}
          returnKeyType='done'
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleQuickCreate}
          style={{
            backgroundColor: theme.custom.colors.light.card,
            borderColor: theme.custom.colors.border,
            color: theme.custom.colors.text.primary,
          }}
        />

        {/* Emoji Preview */}
        {name.trim() && (
          <View className='mb-5 flex-row items-center gap-3 rounded-xl bg-gray-50 p-3'>
            <View
              className='h-10 w-10 items-center justify-center rounded-full'
              style={{ backgroundColor: theme.custom.colors.primary[100] }}
            >
              <Text className='text-2xl'>{detectEmojiFromName(name)}</Text>
            </View>
            <Text className='flex-1 text-sm' style={{ color: theme.custom.colors.text.secondary }}>
              Auto-detected emoji for "{name}"
            </Text>
          </View>
        )}

        {/* Buttons */}
        <View className='gap-3'>
          <Pressable
            className='rounded-full py-4'
            disabled={!name.trim() || creating}
            style={{
              backgroundColor: name.trim()
                ? theme.custom.colors.primary[500]
                : theme.custom.colors.gray[300],
              opacity: creating ? 0.6 : 1,
            }}
            onPress={handleQuickCreate}
          >
            <Text className='text-center text-base font-semibold text-white'>
              {creating ? 'Creating...' : 'Create Habit'}
            </Text>
          </Pressable>

          <Pressable className='py-3' onPress={handleCustomize}>
            <Text className='text-center text-sm' style={{ color: theme.custom.colors.text.secondary }}>
              Or customize with color, reminders & more →
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default QuickAddHabitSheet;
