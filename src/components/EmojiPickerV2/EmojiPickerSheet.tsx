import { memo, useCallback, useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
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
import { CategoryPills } from './CategoryPills';
import { EmojiGrid } from './EmojiGrid';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

interface EmojiPickerSheetProps {
  visible: boolean;
  habitName: string;
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  onClose: () => void;
}

// Animated Pressable wrapper for press animations
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Memoized emoji cell component with press animation (for AI suggestions)
const SuggestionEmojiCell = memo(
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
        accessibilityLabel={`Suggested emoji ${emoji}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        style={[
          styles.suggestionEmojiCell,
          isSelected && styles.emojiCellSelected,
          animatedStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.suggestionEmojiText}>{emoji}</Text>
      </AnimatedPressable>
    );
  }
);

SuggestionEmojiCell.displayName = 'SuggestionEmojiCell';

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
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchFocusAnim = useSharedValue(0);

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
        // Use Math.round on velocity to avoid precision loss error in Reanimated
        const velocityY = Math.round(event.velocityY);
        // If dragged more than 25% down or velocity is high, dismiss
        if (translateY.value > SHEET_HEIGHT * 0.25 || velocityY > 500) {
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

    // Search bar focus handlers
    const handleSearchFocus = useCallback(() => {
      setIsSearchFocused(true);
      searchFocusAnim.value = withTiming(1, { duration: 200 });
    }, [searchFocusAnim]);

    const handleSearchBlur = useCallback(() => {
      setIsSearchFocused(false);
      searchFocusAnim.value = withTiming(0, { duration: 150 });
    }, [searchFocusAnim]);

    // Animated search bar style for focus ring
    const searchBarAnimatedStyle = useAnimatedStyle(() => ({
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: interpolate(searchFocusAnim.value, [0, 1], [0, 0.2], Extrapolation.CLAMP),
      shadowRadius: interpolate(searchFocusAnim.value, [0, 1], [0, 6], Extrapolation.CLAMP),
      borderColor: interpolate(searchFocusAnim.value, [0, 1], [0, 1], Extrapolation.CLAMP) === 1 ? '#3b82f6' : '#e7e5e4',
    }));

    // Get current category name for header
    const currentCategoryName = useMemo(() => {
      const category = HABIT_CATEGORIES.find((cat) => cat.id === selectedCategory);
      return category ? `${category.icon} ${category.name.toUpperCase()}` : '';
    }, [selectedCategory]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeSheet}
      >
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
                <Animated.View style={[styles.searchBar, searchBarAnimatedStyle]}>
                  <Search color={isSearchFocused ? '#3b82f6' : '#a8a29e'} size={20} />
                  <TextInput
                    accessibilityLabel="Search emojis"
                    accessibilityHint="Type keywords to search for emojis"
                    style={styles.searchInput}
                    placeholder="Search or type habit name..."
                    placeholderTextColor="#a8a29e"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
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
                </Animated.View>
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
                      <SuggestionEmojiCell
                        key={`suggested-${emoji}`}
                        emoji={emoji}
                        isSelected={selectedEmoji === emoji}
                        onPress={() => handleEmojiSelect(emoji)}
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Category Pills */}
              {!searchQuery && (
                <CategoryPills
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                />
              )}

              {/* Emoji Grid */}
              <EmojiGrid
                emojis={displayedEmojis}
                selectedEmoji={selectedEmoji}
                onEmojiSelect={handleEmojiSelect}
                categoryName={!searchQuery ? currentCategoryName : undefined}
                showCategoryHeader={!searchQuery}
              />

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
      </Modal>
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
    borderColor: '#e7e5e4',
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1c1917', // stone-800
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
  suggestionEmojiCell: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  suggestionEmojiText: {
    fontSize: 32,
  },
  emojiCellSelected: {
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#3b82f6',
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
    color: '#78716c', // stone-500
  },
});

export default EmojiPickerSheet;
