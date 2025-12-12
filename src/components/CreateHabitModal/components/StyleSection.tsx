import { useCallback, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Palette } from 'lucide-react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface StyleSectionProps {
  colors: string[];
  emojis: string[];
  onCustomColorPress: () => void;
  onSelectColor: (color: string) => void;
  onSelectEmoji: (emoji: string | null) => void;
  selectedColor: string;
  selectedEmoji: string | null;
  suggestedEmojis?: string[];
}

// Animated touchable for emoji/color buttons
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
  const { triggerSelection } = useHapticFeedback();

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

// Premium gradient colors (locked)
const PREMIUM_GRADIENTS = [
  { colors: ['#FF6B6B', '#FFA500'], id: 'sunset', name: 'Sunset' },
  { colors: ['#667EEA', '#764BA2'], id: 'ocean', name: 'Ocean' },
  { colors: ['#11998e', '#38ef7d'], id: 'aurora', name: 'Aurora' },
];

export const StyleSection = ({
  colors,
  emojis,
  onCustomColorPress,
  onSelectColor,
  onSelectEmoji,
  selectedColor,
  selectedEmoji,
  suggestedEmojis = [],
}: StyleSectionProps) => {
  const { triggerSelection } = useHapticFeedback();
  const [showAllEmojis, setShowAllEmojis] = useState(false);

  // Combine suggested emojis (first) with default emojis
  const displayEmojis = showAllEmojis
    ? emojis
    : [...new Set([...suggestedEmojis, ...emojis])].slice(0, 8);

  return (
    <View className="mb-6 rounded-2xl bg-white p-4">
      <Text className="mb-4 text-base font-bold text-slate-800">🎨 Style it</Text>

      {/* Emoji Picker */}
      <View className="mb-5">
        <Text className="mb-3 text-sm font-semibold text-slate-600">Icon</Text>
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', gap: 10 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {/* None option */}
          <AnimatedButton
            accessibilityLabel="No icon"
            isSelected={selectedEmoji === null}
            onPress={() => onSelectEmoji(null)}
            style={{
              alignItems: 'center',
              backgroundColor: selectedEmoji === null ? '#f1f5f9' : '#ffffff',
              borderColor: selectedEmoji === null ? '#3b82f6' : '#e2e8f0',
              borderRadius: 12,
              borderWidth: selectedEmoji === null ? 2 : 1,
              height: 48,
              justifyContent: 'center',
              paddingHorizontal: 12,
            }}
          >
            <Text className="text-xs font-medium text-slate-500">None</Text>
          </AnimatedButton>

          {/* Emoji options */}
          {displayEmojis.map((emoji) => (
            <AnimatedButton
              key={emoji}
              accessibilityLabel={`Select ${emoji} icon`}
              isSelected={selectedEmoji === emoji}
              onPress={() => onSelectEmoji(emoji)}
              style={{
                alignItems: 'center',
                backgroundColor: selectedEmoji === emoji ? '#f1f5f9' : '#ffffff',
                borderColor: selectedEmoji === emoji ? '#3b82f6' : '#e2e8f0',
                borderRadius: 12,
                borderWidth: selectedEmoji === emoji ? 2 : 1,
                height: 48,
                justifyContent: 'center',
                width: 48,
              }}
            >
              <Text className="text-2xl">{emoji}</Text>
            </AnimatedButton>
          ))}

          {/* More button */}
          {!showAllEmojis && (
            <Pressable
              accessibilityLabel="Show more emojis"
              className="h-12 items-center justify-center rounded-xl bg-slate-100 px-4"
              onPress={() => {
                triggerSelection();
                setShowAllEmojis(true);
              }}
            >
              <Text className="text-sm font-medium text-slate-600">More</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>

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

        {/* Premium Gradients (Teaser) */}
        <View className="mb-4">
          <View className="mb-2 flex-row items-center">
            <Text className="text-xs font-semibold text-amber-600">✨ Premium</Text>
            <View className="ml-2 rounded-full bg-amber-100 px-2 py-0.5">
              <Text className="text-[10px] font-bold text-amber-700">PRO</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            {PREMIUM_GRADIENTS.map((gradient) => (
              <Pressable
                key={gradient.id}
                accessibilityLabel={`${gradient.name} gradient - Premium feature`}
                className="relative h-10 w-16 items-center justify-center overflow-hidden rounded-xl"
                style={{
                  backgroundColor: gradient.colors[0],
                  opacity: 0.7,
                }}
                onPress={() => {
                  triggerSelection();
                  // TODO: Navigate to premium screen
                }}
              >
                <View className="absolute inset-0 items-center justify-center bg-black/20">
                  <Text className="text-sm">🔒</Text>
                </View>
              </Pressable>
            ))}
          </View>
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
