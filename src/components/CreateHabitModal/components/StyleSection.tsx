import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View, Keyboard } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { EmojiPickerSheet } from '../../EmojiPickerV2';

interface StyleSectionProps {
  colors: string[];
  emojis: string[];
  onSelectColor: (color: string) => void;
  onSelectEmoji: (emoji: string | null) => void;
  selectedColor: string;
  selectedEmoji: string | null;
  suggestedEmojis?: string[];
  habitName?: string;
  disabled?: boolean;
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
  onSelectColor,
  onSelectEmoji,
  selectedColor,
  selectedEmoji,
  habitName,
  disabled = false,
}: StyleSectionProps) => {
  const { triggerSelection } = useHapticFeedback();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const iconRowScale = useRef(new Animated.Value(1)).current;

  const handleOpenEmojiPicker = useCallback(() => {
    if (disabled) return;
    triggerSelection();
    Keyboard.dismiss();
    setShowEmojiPicker(true);
  }, [triggerSelection, disabled]);

  const handleColorSelect = useCallback((color: string) => {
    if (disabled) return;
    Keyboard.dismiss(); // Dismiss keyboard when tapping color
    onSelectColor(color);
  }, [onSelectColor, disabled]);

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

  // Split colors into rows of 8 for 3-row layout
  const colorRows = [];
  for (let i = 0; i < colors.length; i += 8) {
    colorRows.push(colors.slice(i, i + 8));
  }

  return (
    <Animated.View
      className="mb-6 rounded-2xl bg-white p-4"
      style={{ opacity: disabled ? 0.4 : 1 }}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <Text className="mb-4 text-base font-bold text-slate-800">🎨 Style it</Text>

      {/* Icon Picker - Tappable Row */}
      <Animated.View style={{ transform: [{ scale: iconRowScale }] }}>
        <Pressable
          accessibilityLabel="Choose icon for habit"
          accessibilityRole="button"
          accessibilityHint="Opens emoji picker"
          className="mb-5 flex-row items-center justify-between rounded-xl bg-slate-50 p-3"
          disabled={disabled}
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

      {/* Color Picker - 24 colors in 3 rows of 8 */}
      <View>
        <Text className="mb-3 text-sm font-semibold text-slate-600">Color</Text>

        {colorRows.map((row, rowIndex) => (
          <View
            key={`color-row-${rowIndex}`}
            className="flex-row justify-between mb-2"
          >
            {row.map((color) => (
              <AnimatedButton
                key={color}
                accessibilityLabel={`Select color ${color}`}
                isSelected={selectedColor === color}
                onPress={() => handleColorSelect(color)}
                style={{
                  alignItems: 'center',
                  backgroundColor: color,
                  borderColor: selectedColor === color ? '#1e293b' : 'transparent',
                  borderRadius: 18,
                  borderWidth: selectedColor === color ? 3 : 0,
                  height: 36,
                  justifyContent: 'center',
                  width: 36,
                }}
              >
                {selectedColor === color && (
                  <Text className="text-xs font-bold text-white">✓</Text>
                )}
              </AnimatedButton>
            ))}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default StyleSection;
