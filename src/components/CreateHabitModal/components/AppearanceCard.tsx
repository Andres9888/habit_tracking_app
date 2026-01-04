/**
 * AppearanceCard Component - Cards V1 Improved Spec
 * Task 5: Create AppearanceCard Component
 *
 * Features:
 * - Card wrapper for emoji and color selection
 * - Header displays palette icon, title, optional badge, and completion checkmark
 * - Integrates EmojiPicker component
 * - Integrates ColorPickerSection component
 * - Smart emoji suggestion appears when keyword detected in habitName
 * - Suggestion includes lightbulb icon + contextual text
 * - Completion checkmark appears when both emoji + color selected
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette, CheckCircle, Circle, Lightbulb } from 'lucide-react-native';
import { CompletionBadge } from './CompletionBadge';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';

/**
 * Emoji keyword mapping for smart suggestions
 * Maps habit name keywords to corresponding emojis and suggestion text
 */
const EMOJI_KEYWORDS: Record<string, { emoji: string; keyword: string }> = {
  read: { emoji: '📖', keyword: 'reading' },
  book: { emoji: '📚', keyword: 'book' },
  study: { emoji: '📝', keyword: 'studying' },
  write: { emoji: '✍️', keyword: 'writing' },
  exercise: { emoji: '💪', keyword: 'exercise' },
  workout: { emoji: '🏋️', keyword: 'workout' },
  run: { emoji: '🏃', keyword: 'running' },
  jog: { emoji: '🏃', keyword: 'jogging' },
  yoga: { emoji: '🧘', keyword: 'yoga' },
  meditate: { emoji: '🧘', keyword: 'meditation' },
  meditation: { emoji: '🧘', keyword: 'meditation' },
  mindful: { emoji: '🧘', keyword: 'mindfulness' },
  water: { emoji: '💧', keyword: 'water' },
  hydrate: { emoji: '💧', keyword: 'hydration' },
  drink: { emoji: '💧', keyword: 'drinking' },
  sleep: { emoji: '😴', keyword: 'sleep' },
  rest: { emoji: '😴', keyword: 'rest' },
  nap: { emoji: '😴', keyword: 'nap' },
  code: { emoji: '💻', keyword: 'coding' },
  program: { emoji: '💻', keyword: 'programming' },
  dev: { emoji: '💻', keyword: 'development' },
  clean: { emoji: '🧹', keyword: 'cleaning' },
  organize: { emoji: '📦', keyword: 'organizing' },
  cook: { emoji: '🍳', keyword: 'cooking' },
  meal: { emoji: '🍽️', keyword: 'meal prep' },
  walk: { emoji: '🚶', keyword: 'walking' },
  bike: { emoji: '🚴', keyword: 'biking' },
  swim: { emoji: '🏊', keyword: 'swimming' },
  stretch: { emoji: '🤸', keyword: 'stretching' },
  pray: { emoji: '🙏', keyword: 'prayer' },
  guitar: { emoji: '🎸', keyword: 'guitar' },
  music: { emoji: '🎵', keyword: 'music' },
  draw: { emoji: '🎨', keyword: 'drawing' },
  paint: { emoji: '🎨', keyword: 'painting' },
  art: { emoji: '🎨', keyword: 'art' },
  garden: { emoji: '🌱', keyword: 'gardening' },
  plant: { emoji: '🌱', keyword: 'plants' },
};

/**
 * Props for AppearanceCard component
 */
export interface AppearanceCardProps {
  /**
   * Currently selected emoji (null if none selected)
   */
  selectedEmoji: string | null;
  /**
   * Currently selected color
   */
  selectedColor: string;
  /**
   * Habit name for smart emoji suggestions
   */
  habitName: string;
  /**
   * Available colors for color picker
   */
  colors: readonly string[];
  /**
   * Callback when emoji changes
   */
  onEmojiChange: (emoji: string | null) => void;
  /**
   * Callback when color changes
   */
  onColorChange: (color: string) => void;
  /**
   * Callback when custom color picker should open
   */
  onCustomColorPress: () => void;
  /**
   * Whether the card section is complete
   * True if both emoji and color are selected
   */
  isComplete: boolean;
}

/**
 * AppearanceCard displays emoji and color selection within a card wrapper
 * with completion tracking and smart suggestions
 *
 * Design specs:
 * - Card wrapper matching BasicInfoCard styling
 * - Header with Palette icon, "APPEARANCE" title, optional badge, completion state
 * - Smart emoji suggestion with lightbulb icon when keyword detected
 * - Completion checkmark appears when both emoji and color selected
 *
 * @param props - AppearanceCard component props
 * @returns JSX.Element
 */
export const AppearanceCard = React.memo<AppearanceCardProps>(
  ({
    selectedEmoji,
    selectedColor,
    habitName,
    colors,
    onEmojiChange,
    onColorChange,
    onCustomColorPress,
    isComplete,
  }) => {
    /**
     * Get smart emoji suggestion based on habit name
     * Returns suggestion text if keyword found, null otherwise
     */
    const smartSuggestion = useMemo(() => {
      if (!habitName.trim()) {
        return null;
      }

      const lowerName = habitName.toLowerCase();

      // Find first matching keyword
      for (const [keyword, { emoji, keyword: displayKeyword }] of Object.entries(
        EMOJI_KEYWORDS
      )) {
        if (lowerName.includes(keyword)) {
          return {
            emoji,
            text: `Smart pick based on "${displayKeyword}"`,
          };
        }
      }

      return null;
    }, [habitName]);

    return (
      <View
        style={styles.card}
        accessibilityRole="group"
        accessibilityLabel="Appearance section"
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          {/* Left side: Icon and title */}
          <View style={styles.headerLeft}>
            <Palette size={18} color="#10B981" strokeWidth={2} />
            <Text style={styles.cardTitle}>Appearance</Text>
          </View>

          {/* Right side: Badge and completion state */}
          <View style={styles.headerRight}>
            <CompletionBadge type="optional" />
            {isComplete ? (
              <CheckCircle
                size={20}
                color="#10B981"
                fill="#10B981"
                strokeWidth={2}
                accessibilityLabel="Section complete"
              />
            ) : (
              <Circle
                size={20}
                color="#D6D3D1"
                strokeWidth={2}
                accessibilityLabel="Section incomplete"
              />
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Emoji Picker */}
          <EmojiPicker
            selectedEmoji={selectedEmoji}
            onSelect={onEmojiChange}
            habitName={habitName}
          />

          {/* Smart Suggestion Hint */}
          {smartSuggestion && (
            <View
              style={styles.smartHint}
              accessibilityRole="text"
              accessibilityLabel={smartSuggestion.text}
            >
              <Lightbulb size={12} color="#10B981" strokeWidth={2} />
              <Text style={styles.smartHintText}>
                {smartSuggestion.text}
              </Text>
            </View>
          )}

          {/* Color Picker */}
          <ColorPickerSection
            colors={colors}
            selectedColor={selectedColor}
            onSelectColor={onColorChange}
            onCustomPress={onCustomColorPress}
          />
        </View>
      </View>
    );
  }
);

AppearanceCard.displayName = 'AppearanceCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
    marginBottom: 20, // mb-5
    // Shadow configuration for iOS and Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // mb-4
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#1C1917', // stone-900
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    // Content area styles
  },
  smartHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -8, // Reduce gap between emoji picker and hint
    marginBottom: 12, // mb-3
  },
  smartHintText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981', // emerald-600
  },
});
