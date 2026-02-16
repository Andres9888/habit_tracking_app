/**
 * VoiceNoteItem - Individual voice note with expandable playback UI
 */
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SPRING_BUTTON } from '../../../../animations';
import { VoiceNotePlaybackUI } from '../../VoiceNotePlaybackUI';
import { VoiceNoteItemHeader } from './VoiceNoteItemHeader';
import type { VoiceNoteSummary } from '../VoiceNotesSection.types';

interface VoiceNoteItemProps {
  note: VoiceNoteSummary;
  reduceMotion?: boolean;
  onPlayStart?: () => void;
  onPlayFinish?: () => void;
}

export const VoiceNoteItem = React.memo(function VoiceNoteItem({
  note,
  reduceMotion = false,
  onPlayStart,
  onPlayFinish,
}: VoiceNoteItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedHeight = useSharedValue(0);
  const rotateIcon = useSharedValue(0);
  const hasPlayback = !!note.audioUrl;

  const handleToggleExpand = useCallback(() => {
    if (!note.audioUrl) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const willExpand = !isExpanded;
    setIsExpanded(willExpand);
    if (reduceMotion) {
      expandedHeight.value = willExpand ? 1 : 0;
      rotateIcon.value = willExpand ? 1 : 0;
    } else {
      expandedHeight.value = withSpring(willExpand ? 1 : 0, SPRING_BUTTON);
      rotateIcon.value = withSpring(willExpand ? 1 : 0, SPRING_BUTTON);
    }
  }, [note.audioUrl, isExpanded, reduceMotion, expandedHeight, rotateIcon]);

  const expandedStyle = useAnimatedStyle(() => ({
    height: expandedHeight.value === 0 ? 0 : 'auto',
    opacity: expandedHeight.value,
    overflow: 'hidden' as const,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.round(rotateIcon.value * 180)}deg` }],
  }));

  return (
    <View className='rounded-lg bg-stone-50'>
      <VoiceNoteItemHeader
        hasPlayback={hasPlayback}
        iconStyle={iconStyle}
        isExpanded={isExpanded}
        note={note}
        onPress={handleToggleExpand}
      />
      {note.audioUrl && isExpanded && (
        <Animated.View style={expandedStyle}>
          <View className='border-t border-stone-100 p-3'>
            <VoiceNotePlaybackUI
              compact
              audioUri={note.audioUrl}
              initialDuration={note.duration}
              isDay1={note.isDay1}
              label={note.label}
              reduceMotion={reduceMotion}
              showSpeedControl={false}
              onPlayFinish={onPlayFinish}
              onPlayStart={onPlayStart}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
});
