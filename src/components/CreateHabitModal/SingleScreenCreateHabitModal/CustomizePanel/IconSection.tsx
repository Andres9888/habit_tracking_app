/* eslint-disable max-lines-per-function */
import { memo, useCallback } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { COLORS, CURATED_EMOJIS, SPACING, TYPOGRAPHY } from '../constants';

interface IconSectionProps {
  onMorePress: () => void;
  onSelect: (emoji: string) => void;
  selectedEmoji: string | null;
}

function IconSectionComponent({
  onMorePress,
  onSelect,
  selectedEmoji,
}: IconSectionProps) {
  const { triggerSelection } = useHapticFeedback();

  const handlePress = useCallback(
    (emoji: string) => {
      Keyboard.dismiss();
      triggerSelection();
      onSelect(emoji);
    },
    [onSelect, triggerSelection]
  );

  return (
    <View className='mb-4'>
      <Text
        style={{
          color: COLORS.mutedText,
          fontSize: TYPOGRAPHY.caption.fontSize,
          marginBottom: SPACING.sm,
        }}
      >
        Icon
      </Text>
      <View className='flex-row flex-wrap' style={{ gap: SPACING.sm }}>
        {CURATED_EMOJIS.slice(0, 12).map((emoji) => (
          <Pressable
            key={emoji}
            style={{
              alignItems: 'center',
              backgroundColor:
                selectedEmoji === emoji ? COLORS.cardBackground : 'transparent',
              borderColor: COLORS.accent,
              borderRadius: 8,
              borderWidth: selectedEmoji === emoji ? 2 : 0,
              height: 48,
              justifyContent: 'center',
              width: 48,
            }}
            onPress={() => handlePress(emoji)}
          >
            <Text style={{ fontSize: 24 }}>{emoji}</Text>
          </Pressable>
        ))}
        <Pressable
          style={{
            alignItems: 'center',
            backgroundColor: COLORS.cardBackground,
            borderRadius: 8,
            height: 48,
            justifyContent: 'center',
            width: 48,
          }}
          onPress={onMorePress}
        >
          <Text style={{ color: COLORS.mutedText, fontSize: 12 }}>More</Text>
        </Pressable>
      </View>
    </View>
  );
}

export const IconSection = memo(IconSectionComponent);
