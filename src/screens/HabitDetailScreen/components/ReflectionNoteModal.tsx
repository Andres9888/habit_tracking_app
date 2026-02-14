/**
 * ReflectionNoteModal Component
 *
 * Displays completion notes (reflections) for a selected date in the streak calendar.
 * Shows emoji sentiment and optional note text.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { colors } from '../../../theme/colors';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface ReflectionNoteModalProps {
  visible: boolean;
  onClose: () => void;
  habitId: Id<'habits'> | null;
  selectedDate: string | null;
}

const EMOJI_MAP: Record<string, string> = {
  frustrated: '😤',
  neutral: '😐',
  happy: '😊',
  fire: '🔥',
};

export function ReflectionNoteModal({
  visible,
  onClose,
  habitId,
  selectedDate,
}: ReflectionNoteModalProps) {
  const insets = useSafeAreaInsets();
  const [displayDate, setDisplayDate] = useState<string | null>(null);

  // Fetch reflection for the selected date
  const reflection = useQuery(
    habitId && selectedDate
      ? api.reflections.getByHabitAndDate
      : 'skip',
    habitId && selectedDate
      ? { habitId, date: selectedDate }
      : 'skip'
  );

  useEffect(() => {
    if (visible && selectedDate) {
      setDisplayDate(selectedDate);
    }
  }, [visible, selectedDate]);

  const handleClose = () => {
    setDisplayDate(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleClose}
      >
        <Animated.View
          entering={FadeIn.duration(280)}
          style={{
            backgroundColor: colors.light.surface,
            borderRadius: 24,
            padding: 24,
            marginHorizontal: 24,
            maxWidth: 400,
            shadowColor: colors.gray[800],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 8,
          }}
          onStartShouldSetResponder={() => true}
        >
          {/* Header with close button */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.gray[800] }}>
              Completion Note
            </Text>
            <Pressable
              onPress={handleClose}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: colors.light.surfaceMuted,
              }}
            >
              <Ionicons name="close" size={24} color={colors.gray[800]} />
            </Pressable>
          </View>

          {/* Date */}
          <Text
            style={{
              fontSize: 14,
              color: colors.gray[500],
              marginBottom: 16,
              fontWeight: '500',
            }}
          >
            {displayDate ? formatDate(displayDate) : ''}
          </Text>

          {/* Reflection Content */}
          {reflection ? (
            <View>
              {/* Emoji Sentiment */}
              <View
                style={{
                  marginBottom: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 48 }}>
                  {EMOJI_MAP[reflection.emoji] || ''}
                </Text>
              </View>

              {/* Note Text */}
              {reflection.note ? (
                <View
                  style={{
                    backgroundColor: colors.light.surfaceMuted,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.gray[800],
                      lineHeight: 20,
                    }}
                  >
                    {reflection.note}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.gray[400],
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  No note added for this completion
                </Text>
              )}
            </View>
          ) : (
            <Text
              style={{
                fontSize: 14,
                color: colors.gray[400],
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              No reflection recorded for this date
            </Text>
          )}

          {/* Close Button */}
          <Pressable
            onPress={handleClose}
            style={{
              backgroundColor: colors.primary[600],
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 24,
              marginTop: 20,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Done
            </Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
