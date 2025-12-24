import { memo, useCallback, useMemo, useRef } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Text,
  ListRenderItemInfo,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Search } from 'lucide-react-native';

const EMOJIS_PER_ROW = 6;

interface EmojiGridProps {
  emojis: string[];
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string) => void;
  categoryName?: string;
  showCategoryHeader?: boolean;
}

// Animated Pressable wrapper for press animations
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Memoized emoji cell component with press animation
const EmojiCell = memo(
  ({
    emoji,
    isSelected,
    onPress,
  }: {
    emoji: string;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const scale = useSharedValue(1);

    const handlePressIn = useCallback(() => {
      scale.value = withTiming(0.92, { duration: 50 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSequence(
        withTiming(1.05, { duration: 80 }),
        withTiming(1, { duration: 100 })
      );
    }, [scale]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <AnimatedPressable
        accessibilityLabel={`Select ${emoji} emoji`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        style={[
          styles.emojiCell,
          isSelected && styles.emojiCellSelected,
          animatedStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.emojiText}>{emoji}</Text>
      </AnimatedPressable>
    );
  }
);

EmojiCell.displayName = 'EmojiCell';

// Memoized emoji row component
const EmojiRow = memo(
  ({
    emojis,
    selectedEmoji,
    onEmojiSelect,
  }: {
    emojis: string[];
    selectedEmoji: string | null;
    onEmojiSelect: (emoji: string) => void;
  }) => {
    return (
      <View style={styles.emojiRow}>
        {emojis.map((emoji, index) => (
          <View key={`${emoji}-${index}`} style={styles.emojiCellWrapper}>
            <EmojiCell
              emoji={emoji}
              isSelected={selectedEmoji === emoji}
              onPress={() => onEmojiSelect(emoji)}
            />
          </View>
        ))}
        {/* Fill remaining cells with empty placeholders to maintain grid */}
        {emojis.length < EMOJIS_PER_ROW &&
          Array.from({ length: EMOJIS_PER_ROW - emojis.length }).map((_, i) => (
            <View key={`placeholder-${i}`} style={styles.emojiCellWrapper}>
              <View style={styles.placeholderCell} />
            </View>
          ))}
      </View>
    );
  }
);

EmojiRow.displayName = 'EmojiRow';

/**
 * EmojiGrid - A virtualized 6-column emoji grid with press animations
 *
 * Features:
 * - 6-column responsive layout
 * - Virtualized FlatList for performance
 * - Press animations (scale 0.92 on press, bounce on release)
 * - Selection state with blue ring
 * - Optional category header
 */
export const EmojiGrid = memo(
  ({
    emojis,
    selectedEmoji,
    onEmojiSelect,
    categoryName,
    showCategoryHeader = true,
  }: EmojiGridProps) => {
    const flatListRef = useRef<FlatList>(null);

    // Group emojis into rows of 6
    const emojiRows = useMemo(() => {
      const rows: string[][] = [];
      for (let i = 0; i < emojis.length; i += EMOJIS_PER_ROW) {
        rows.push(emojis.slice(i, i + EMOJIS_PER_ROW));
      }
      return rows;
    }, [emojis]);

    // Render each row
    const renderRow = useCallback(
      ({ item, index }: ListRenderItemInfo<string[]>) => (
        <EmojiRow
          emojis={item}
          selectedEmoji={selectedEmoji}
          onEmojiSelect={onEmojiSelect}
        />
      ),
      [selectedEmoji, onEmojiSelect]
    );

    // Row key extractor
    const keyExtractor = useCallback(
      (_: string[], index: number) => `emoji-row-${index}`,
      []
    );

    // Get item layout for optimized scrolling
    const getItemLayout = useCallback(
      (_: ArrayLike<string[]> | null | undefined, index: number) => ({
        length: 56, // Row height (cell + gap)
        offset: 56 * index,
        index,
      }),
      []
    );

    // Empty state
    if (emojis.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Search color="#9ca3af" size={48} />
          <Text style={styles.emptyStateTitle}>No emojis found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try a different search term
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Category Header */}
        {showCategoryHeader && categoryName && (
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryHeaderText}>{categoryName}</Text>
          </View>
        )}

        {/* Virtualized Grid */}
        <FlatList
          ref={flatListRef}
          data={emojiRows}
          keyExtractor={keyExtractor}
          renderItem={renderRow}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.gridContent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={getItemLayout}
          // Maintain scroll position when items change
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
      </View>
    );
  }
);

EmojiGrid.displayName = 'EmojiGrid';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  categoryHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716c',
    letterSpacing: 0.5,
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  emojiCellWrapper: {
    flex: 1,
    aspectRatio: 1,
  },
  emojiCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    minHeight: 44,
    minWidth: 44,
  },
  emojiCellSelected: {
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  emojiText: {
    fontSize: 28,
  },
  placeholderCell: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  emptyStateSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default EmojiGrid;
