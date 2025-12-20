import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { ChevronRight, Palette } from 'lucide-react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { EmojiPickerSheet } from '../../EmojiPickerV2';

interface StyleSectionProps {
  colors: string[];
  emojis: string[];
  onCustomColorPress: () => void;
  onSelectColor: (color: string) => void;
  onSelectEmoji: (emoji: string | null) => void;
  selectedColor: string;
  selectedEmoji: string | null;
  suggestedEmojis?: string[];
  habitName?: string;
}

// Animated touchable for color buttons
interface AnimatedButtonProps {
  accessibilityLabel: string;
  children: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
  style?: object;
}

const AnimatedButton = ({
  accessibilityLabel,
  children,
  isSelected,
  onPress,
  style,
}: AnimatedButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const wasSelected = useRef(isSelected);
  const { triggerSelection } = useHapticFeedback();

  // Trigger selection "pop" animation when this color becomes selected
  useEffect(() => {
    if (isSelected && !wasSelected.current) {
      // Animate: quick scale up then settle back
      Animated.sequence([
        Animated.timing(scale, {
          duration: Motion.duration.fast,
          easing: Motion.easing.outEase,
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 12,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
    wasSelected.current = isSelected;
  }, [isSelected, scale]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onPress();
  }, [onPress, triggerSelection]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        style={style}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export const StyleSection = ({
  colors,
  onCustomColorPress,
  onSelectColor,
  onSelectEmoji,
  selectedColor,
  selectedEmoji,
  habitName,
}: StyleSectionProps) => {
  const { triggerSelection } = useHapticFeedback();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const iconRowScale = useRef(new Animated.Value(1)).current;

  const handleOpenEmojiPicker = useCallback(() => {
    triggerSelection();
    setShowEmojiPicker(true);
  }, [triggerSelection]);

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      onSelectEmoji(emoji);
      setShowEmojiPicker(false);
    },
    [onSelectEmoji]
  );

  const handleIconRowPressIn = useCallback(() => {
    Animated.timing(iconRowScale, {
      duration: 100,
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  }, [iconRowScale]);

  const handleIconRowPressOut = useCallback(() => {
    Animated.spring(iconRowScale, {
      toValue: 1,
      damping: 15,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [iconRowScale]);

  return (
    <View className="mb-6 rounded-2xl bg-white p-4">
      <Text className="mb-4 text-base font-bold text-slate-800">🎨 Style it</Text>

      {/* Icon Picker - Tappable Row */}
      <Animated.View style={{ transform: [{ scale: iconRowScale }] }}>
        <Pressable
          accessibilityLabel="Choose icon for habit"
          accessibilityRole="button"
          accessibilityHint="Opens emoji picker"
          className="mb-5 flex-row items-center justify-between rounded-xl bg-slate-50 p-3"
          onPress={handleOpenEmojiPicker}
          onPressIn={handleIconRowPressIn}
          onPressOut={handleIconRowPressOut}
        >
          <View className="flex-row items-center gap-3">
            {/* Icon Preview */}
            <View
              className="h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: selectedColor + '20' }}
            >
              <Text className="text-2xl">{selectedEmoji || '➕'}</Text>
            </View>
            <View>
              <Text className="text-base font-medium text-slate-800">Icon</Text>
              <Text className="text-xs text-slate-500">
                {selectedEmoji ? 'Tap to change' : 'Choose an icon'}
              </Text>
            </View>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </Pressable>
      </Animated.View>

      {/* Full Emoji Picker Modal (V2) */}
      <EmojiPickerSheet
        habitName={habitName || ''}
        selectedEmoji={selectedEmoji}
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={handleEmojiSelect}
      />

      {/* Color Picker */}
      <View>
        <Text className="mb-3 text-sm font-semibold text-slate-600">Color</Text>

        {/* Basic Colors */}
        <View className="mb-4 flex-row flex-wrap gap-3">
          {colors.map((color) => (
            <AnimatedButton
              key={color}
              accessibilityLabel={`Select color ${color}`}
              isSelected={selectedColor === color}
              onPress={() => onSelectColor(color)}
              style={{
                alignItems: 'center',
                backgroundColor: color,
                borderColor: selectedColor === color ? '#1e293b' : 'transparent',
                borderRadius: 20,
                borderWidth: selectedColor === color ? 3 : 0,
                height: 40,
                justifyContent: 'center',
                width: 40,
              }}
            >
              {selectedColor === color && (
                <Text className="text-xs font-bold text-white">✓</Text>
              )}
            </AnimatedButton>
          ))}
        </View>

        {/* Custom Color Button */}
        <Pressable
          accessibilityLabel="Choose custom color"
          accessibilityRole="button"
          className="flex-row items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          onPress={() => {
            triggerSelection();
            onCustomColorPress();
          }}
        >
          <View className="flex-row items-center">
            <Palette color="#475569" size={18} />
            <Text className="ml-3 text-sm font-medium text-slate-700">Custom color</Text>
          </View>
          <View
            className="h-6 w-6 rounded-full border-2 border-white"
            style={{
              backgroundColor: selectedColor,
              shadowColor: '#000',
              shadowOffset: { height: 1, width: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default StyleSection;
