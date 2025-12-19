import { memo, useCallback, useEffect } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Search, X, Sparkles } from 'lucide-react-native';
import { useMemo, useState, useRef } from 'react';
import { HABIT_CATEGORIES } from '../../constants/habitEmojis';
import { getAllEmojis } from '../../utils/emojiData';
import { searchEmojisByKeyword, suggestEmojisForHabitName } from '../../utils/emojiKeywords';
import { addRecentEmoji, getRecentEmojis } from '../../utils/recentEmojis';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;
const EMOJIS_PER_ROW = 6;

interface EmojiPickerSheetProps {
  visible: boolean;
  habitName: string;
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  onClose: () => void;
}

// Memoized emoji cell component
const EmojiCell = memo(
  ({
    emoji,
    isSelected,
    onPress,
    size = 'normal',
  }: {
    emoji: string;
    isSelected: boolean;
    onPress: () => void;
    size?: 'normal' | 'large';
  }) => {
    const cellSize = size === 'large' ? 56 : undefined;
    const fontSize = size === 'large' ? 32 : 28;

    return (
      <Pressable
        accessibilityLabel={`Select ${emoji} emoji`}
        accessibilityRole="button"
        style={[
          styles.emojiCell,
          isSelected && styles.emojiCellSelected,
          cellSize ? { width: cellSize, height: cellSize } : undefined,
        ]}
        onPress={onPress}
      >
        <Text style={{ fontSize }}>{emoji}</Text>
      </Pressable>
    );
  }
);

EmojiCell.displayName = 'EmojiCell';

// Category pill component
const CategoryPill = memo(
  ({
    icon,
    name,
    isSelected,
    onPress,
  }: {
    icon: string;
    name: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      accessibilityLabel={`Filter by ${name} category`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
      onPress={onPress}
    >
      <Text style={styles.categoryPillIcon}>{icon}</Text>
      <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
        {name}
      </Text>
    </Pressable>
  )
);

CategoryPill.displayName = 'CategoryPill';

export const EmojiPickerSheet = memo(
  ({ visible, habitName, selectedEmoji, onSelect, onClose }: EmojiPickerSheetProps) => {
    // Animation values
    const translateY = useSharedValue(SHEET_HEIGHT);
    const backdropOpacity = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('fitness');
    const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Compute suggested emojis based on habit name
    const suggestedEmojis = useMemo(() => {
      if (!habitName?.trim()) return [];
      return suggestEmojisForHabitName(habitName, 5);
    }, [habitName]);

    // Debounce search query
    useEffect(() => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, 150);

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, [searchQuery]);

    // Get all emojis (cached)
    const allEmojis = useMemo(() => getAllEmojis(), []);

    // Get emojis to display based on category and search
    const displayedEmojis = useMemo(() => {
      if (debouncedQuery.trim()) {
        return searchEmojisByKeyword(debouncedQuery, allEmojis);
      }

      if (selectedCategory === 'all') {
        return allEmojis;
      }

      const category = HABIT_CATEGORIES.find((cat) => cat.id === selectedCategory);
      return category?.emojis ?? [];
    }, [selectedCategory, debouncedQuery, allEmojis]);

    // Group emojis into rows
    const emojiRows = useMemo(() => {
      const rows: string[][] = [];
      for (let i = 0; i < displayedEmojis.length; i += EMOJIS_PER_ROW) {
        rows.push(displayedEmojis.slice(i, i + EMOJIS_PER_ROW));
      }
      return rows;
    }, [displayedEmojis]);

    // Load recent emojis on mount
    useEffect(() => {
      if (visible) {
        getRecentEmojis().then(setRecentEmojis);
      }
    }, [visible]);

    // Sheet open/close animations
    useEffect(() => {
      if (visible) {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
        backdropOpacity.value = withTiming(1, { duration: 300 });
      } else {
        translateY.value = withSpring(SHEET_HEIGHT, {
          damping: 20,
          stiffness: 200,
        });
        backdropOpacity.value = withTiming(0, { duration: 300 });
      }
    }, [visible, translateY, backdropOpacity]);

    // Close handler with animation
    const closeSheet = useCallback(() => {
      translateY.value = withSpring(SHEET_HEIGHT, {
        damping: 20,
        stiffness: 200,
      });
      backdropOpacity.value = withTiming(0, { duration: 200 });
      setTimeout(onClose, 200);
    }, [onClose, translateY, backdropOpacity]);

    // Gesture handler for drag dismissal
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        // Only allow dragging down
        translateY.value = Math.max(context.value.y + event.translationY, 0);
      })
      .onEnd((event) => {
        // If dragged more than 25% down or velocity is high, dismiss
        if (translateY.value > SHEET_HEIGHT * 0.25 || event.velocityY > 500) {
          runOnJS(closeSheet)();
        } else {
          translateY.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
          });
        }
      });

    // Animated styles
    const sheetAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(backdropOpacity.value, [0, 1], [0, 0.4], Extrapolation.CLAMP),
    }));

    // Handlers
    const handleEmojiSelect = useCallback(
      async (emoji: string) => {
        await addRecentEmoji(emoji);
        onSelect(emoji);
        closeSheet();
      },
      [onSelect, closeSheet]
    );

    const handleCategorySelect = useCallback((categoryId: string) => {
      setSelectedCategory(categoryId);
      setSearchQuery('');
      setDebouncedQuery('');
    }, []);

    const handleClearSearch = useCallback(() => {
      setSearchQuery('');
      setDebouncedQuery('');
    }, []);

    const handleNoIcon = useCallback(() => {
      onSelect(null);
      closeSheet();
    }, [onSelect, closeSheet]);

    const renderEmojiRow = useCallback(
      ({ item }: { item: string[] }) => (
        <View style={styles.emojiRow}>
          {item.map((emoji) => (
            <View key={emoji} style={styles.emojiCellWrapper}>
              <EmojiCell
                emoji={emoji}
                isSelected={selectedEmoji === emoji}
                onPress={() => handleEmojiSelect(emoji)}
              />
            </View>
          ))}
        </View>
      ),
      [selectedEmoji, handleEmojiSelect]
    );

    // Get current category name for header
    const currentCategoryName = useMemo(() => {
      const category = HABIT_CATEGORIES.find((cat) => cat.id === selectedCategory);
      return category ? `${category.icon} ${category.name.toUpperCase()}` : '';
    }, [selectedCategory]);

    if (!visible) return null;

    return (
      <View style={styles.container} pointerEvents="box-none">
        {/* Backdrop overlay with tap-to-close */}
        <Pressable
          accessibilityLabel="Close emoji picker"
          accessibilityRole="button"
          style={StyleSheet.absoluteFill}
          onPress={closeSheet}
        >
          <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
        </Pressable>

        {/* Bottom Sheet */}
        <GestureDetector gesture={gesture}>
          <Animated.View
            accessibilityViewIsModal={true}
            style={[styles.sheet, sheetAnimatedStyle]}
          >
            {/* Drag Handle */}
            <View
              style={styles.handleContainer}
              accessibilityLabel="Drag to dismiss"
              accessibilityRole="adjustable"
            >
              <View style={styles.handle} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search color="#9ca3af" size={20} />
                <TextInput
                  accessibilityLabel="Search emojis"
                  accessibilityHint="Type keywords to search for emojis"
                  style={styles.searchInput}
                  placeholder="Search or type habit name..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <Pressable
                    accessibilityLabel="Clear search"
                    accessibilityRole="button"
                    onPress={handleClearSearch}
                  >
                    <X color="#9ca3af" size={18} />
                  </Pressable>
                )}
              </View>
            </View>

            {/* AI Suggestions Section */}
            {!searchQuery && suggestedEmojis.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionsHeader}>
                  <Sparkles color="#f59e0b" size={16} />
                  <Text style={styles.suggestionsHeaderText}>
                    Perfect for "{habitName}"
                  </Text>
                </View>
                <View style={styles.suggestionsGrid}>
                  {suggestedEmojis.map((emoji) => (
                    <EmojiCell
                      key={`suggested-${emoji}`}
                      emoji={emoji}
                      isSelected={selectedEmoji === emoji}
                      onPress={() => handleEmojiSelect(emoji)}
                      size="large"
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Category Pills */}
            {!searchQuery && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContent}
                style={styles.categoriesScroll}
              >
                {HABIT_CATEGORIES.map((category) => (
                  <CategoryPill
                    key={category.id}
                    icon={category.icon}
                    name={category.name}
                    isSelected={selectedCategory === category.id}
                    onPress={() => handleCategorySelect(category.id)}
                  />
                ))}
              </ScrollView>
            )}

            {/* Emoji Grid */}
            <View style={styles.emojiGridContainer}>
              {displayedEmojis.length === 0 ? (
                <View style={styles.emptyState}>
                  <Search color="#9ca3af" size={48} />
                  <Text style={styles.emptyStateTitle}>No emojis found</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Try a different search term
                  </Text>
                </View>
              ) : (
                <>
                  {/* Category Header */}
                  {!searchQuery && (
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryHeaderText}>{currentCategoryName}</Text>
                    </View>
                  )}
                  <FlatList
                    data={emojiRows}
                    keyExtractor={(_, index) => `row-${index}`}
                    renderItem={renderEmojiRow}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={styles.emojiGridContent}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}
                  />
                </>
              )}
            </View>

            {/* No Icon Button */}
            <View style={styles.noIconContainer}>
              <Pressable
                accessibilityLabel="Select no icon for this habit"
                accessibilityRole="button"
                style={styles.noIconButton}
                onPress={handleNoIcon}
              >
                <Text style={styles.noIconText}>No icon</Text>
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

EmojiPickerSheet.displayName = 'EmojiPickerSheet';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  suggestionsContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fcd34d',
    // Gradient effect approximation
    backgroundColor: '#fef3c7',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionsHeaderText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#b45309',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#f3f4f6',
  },
  categoryPillActive: {
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryPillIcon: {
    fontSize: 14,
  },
  categoryPillText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
  emojiGridContainer: {
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
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  emojiGridContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  noIconContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  noIconButton: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  noIconText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
});

export default EmojiPickerSheet;
