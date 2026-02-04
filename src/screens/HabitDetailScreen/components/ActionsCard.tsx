/**
 * ActionsCard Component
 * Simplified actions: Notes + Archive buttons
 * 
 * @see HABIT-DETAIL-AFTER-SPEC.md for design details
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StickyNote, Archive } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ActionsCardProps {
  notesCount: number;
  onNotesPress: () => void;
  onArchivePress: () => void;
}

export function ActionsCard({
  notesCount,
  onNotesPress,
  onArchivePress,
}: ActionsCardProps) {
  const handleNotesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNotesPress();
  };

  const handleArchivePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onArchivePress();
  };

  return (
    <View
      style={{
        height: 56,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e7e5e4',
        padding: 8,
        flexDirection: 'row',
        gap: 8,
      }}
    >
      {/* Notes Button */}
      <Pressable
        onPress={handleNotesPress}
        accessibilityRole="button"
        accessibilityLabel={notesCount > 0 ? `Notes, ${notesCount} notes` : 'Notes'}
        style={({ pressed }) => ({
          flex: 1,
          height: 40,
          borderRadius: 8,
          backgroundColor: pressed ? '#f5f5f4' : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        })}
      >
        <StickyNote size={18} color="#78716c" strokeWidth={2} />
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#78716c' }}>
          Notes{notesCount > 0 ? ` (${notesCount})` : ''}
        </Text>
      </Pressable>

      {/* Archive Button */}
      <Pressable
        onPress={handleArchivePress}
        accessibilityRole="button"
        accessibilityLabel="Archive habit"
        style={({ pressed }) => ({
          flex: 1,
          height: 40,
          borderRadius: 8,
          backgroundColor: pressed ? '#f5f5f4' : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        })}
      >
        <Archive size={18} color="#a8a29e" strokeWidth={2} />
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#a8a29e' }}>
          Archive
        </Text>
      </Pressable>
    </View>
  );
}
