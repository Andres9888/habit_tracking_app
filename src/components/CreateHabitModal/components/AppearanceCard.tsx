import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import { Palette, CheckCircle, Circle, Lightbulb } from 'lucide-react-native';
import { CompletionBadge } from './CompletionBadge';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';

/**
 * Props for AppearanceCard component
 */
interface AppearanceCardProps {
  /** Selected emoji (null if none selected) */
  selectedEmoji: string | null;
  /** Selected color hex string */
  selectedColor: string;
  /** Habit name for smart emoji suggestions */
  habitName: string;
  /** Available colors array */
  colors: string[];
  /** Callback when emoji changes */
  onEmojiChange: (emoji: string) => void;
  /** Callback when color changes */
  onColorChange: (color: string) => void;
  /** Callback when custom color button pressed */
  onCustomPress: () => void;
  /** Whether this section is complete (emoji + color selected) */
  isComplete: boolean;
}

/**
 * Smart emoji keyword mapping
 * Maps keywords in habit names to suggested emojis
 */
const EMOJI_KEYWORDS: Record<string, string> = {
  read: '📖',
  book: '📚',
  study: '📝',
  write: '✍️',
  exercise: '💪',
  workout: '🏋️',
  run: '🏃',
  yoga: '🧘',
  meditate: '🧘',
  mindful: '🧘',
  water: '💧',
  hydrate: '💧',
  drink: '💧',
  sleep: '😴',
  rest: '😴',
  code: '💻',
  program: '💻',
  dev: '💻',
  clean: '🧹',
  organize: '📦',
  cook: '🍳',
  meal: '🍽️',
  eat: '🍽️',
  walk: '🚶',
  journal: '📔',
  learn: '🎓',
  practice: '🎯',
  paint: '🎨',
  draw: '🎨',
  music: '🎵',
};

/**
 * Card wrapper for Appearance section (emoji + color selection)
 *
 * Features:
 * - Card header with Palette icon, "APPEARANCE" title, and completion state
 * - Optional badge (appearance is not required)
 * - Checkmark when complete (emoji + color selected)
 * - Smart emoji suggestions based on habit name keywords
 * - Integrates EmojiPicker and ColorPickerSection components
 *
 * @component
 * @example
 * ```tsx
 * <AppearanceCard
 *   selectedEmoji="📖"
 *   selectedColor="#10B981"
 *   habitName="Read daily"
 *   colors={HABIT_COLORS}
 *   onEmojiChange={setEmoji}
 *   onColorChange={setColor}
 *   onCustomPress={openColorPicker}
 *   isComplete={!!selectedEmoji && !!selectedColor}
 * />
 * ```
 */
const AppearanceCardComponent = ({
  selectedEmoji,
  selectedColor,
  habitName,
  colors,
  onEmojiChange,
  onColorChange,
  onCustomPress,
  isComplete,
}: AppearanceCardProps) => {
  // Detect smart emoji suggestion from habit name
  const smartSuggestion = useMemo(() => {
    const lowerName = habitName.toLowerCase();
    for (const [keyword, emoji] of Object.entries(EMOJI_KEYWORDS)) {
      if (lowerName.includes(keyword)) {
        return `Smart pick based on "${keyword}"`;
      }
    }
    return null;
  }, [habitName]);

  return (
    <View
      className="mb-5 rounded-2xl bg-white p-4 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Card Header */}
      <View className="mb-4 flex-row items-center justify-between">
        {/* Left side: Icon + Title */}
        <View className="flex-row items-center gap-2">
          <Palette color="#10B981" size={18} strokeWidth={2} />
          <Text className="text-sm font-bold uppercase tracking-wide text-stone-900">
            Appearance
          </Text>
        </View>

        {/* Right side: Badge + Completion State */}
        <View className="flex-row items-center gap-2">
          <CompletionBadge type="optional" />
          {isComplete ? (
            <CheckCircle
              accessibilityLabel="Section complete"
              color="#10B981"
              size={20}
              strokeWidth={2}
            />
          ) : (
            <Circle
              accessibilityLabel="Section incomplete"
              color="#D6D3D1"
              size={20}
              strokeWidth={2}
            />
          )}
        </View>
      </View>

      {/* Content: Emoji Picker */}
      <View className="mb-4">
        <EmojiPicker
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiChange}
        />

        {/* Smart Suggestion Hint */}
        {smartSuggestion && (
          <View className="mt-2 flex-row items-center gap-1">
            <Lightbulb color="#10B981" size={12} strokeWidth={2} />
            <Text className="text-xs font-medium text-emerald-600">
              {smartSuggestion}
            </Text>
          </View>
        )}
      </View>

      {/* Content: Color Picker */}
      <ColorPickerSection
        colors={colors}
        selectedColor={selectedColor}
        onCustomPress={onCustomPress}
        onSelectColor={onColorChange}
      />
    </View>
  );
};

/**
 * Memoized AppearanceCard component for performance optimization
 */
export const AppearanceCard = memo(AppearanceCardComponent);
