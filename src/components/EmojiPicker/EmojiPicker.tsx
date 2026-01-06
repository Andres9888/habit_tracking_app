import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  findNodeHandle,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { getAllEmojis } from '../../utils/emojiData';
import { HABIT_CATEGORIES } from '../../constants/habitEmojis';
import {
  searchEmojisByKeyword,
  suggestEmojisForHabitName,
} from '../../utils/emojiKeywords';
import { addRecentEmoji, getRecentEmojis } from '../../utils/recentEmojis';

interface EmojiPickerProps {
  onClose: () => void;
  onSelect: (emoji: string | null) => void;
  selectedEmoji?: string | null;
  visible: boolean;
  /** Ref to the trigger element for focus management on modal close */
  triggerRef?: React.RefObject<View>;
  /** Optional habit name to generate emoji suggestions */
  habitName?: string;
}

const EMOJIS_PER_ROW = 7;

const EmojiItem = memo(
  ({
    emoji,
    isSelected,
    onPress,
  }: {
    emoji: string;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        bounciness: 4,
        speed: 50,
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        bounciness: 4,
        speed: 50,
        toValue: isSelected ? 1.1 : 1,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim, isSelected]);

    return (
      <Pressable
        accessibilityLabel={`Select ${emoji} emoji`}
        accessibilityRole='button'
        style={{
          aspectRatio: 1,
          padding: 2,
          width: `${100 / EMOJIS_PER_ROW}%`,
        }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            {
              alignItems: 'center',
              backgroundColor: isSelected ? '#f5f5f4' : '#fafaf9', // stone-100 : stone-50
              borderColor: isSelected ? '#10b981' : 'transparent', // emerald-500
              borderRadius: 12,
              borderWidth: isSelected ? 2 : 0,
              flex: 1,
              justifyContent: 'center',
              minHeight: 44,
              minWidth: 44,
            },
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={{ fontSize: 28 }}>{emoji}</Text>
        </Animated.View>
      </Pressable>
    );
  }
);

EmojiItem.displayName = 'EmojiItem';

// Emoji item for Recently Used and Suggested sections with selection indicator
const QuickAccessEmojiItem = memo(
  ({
    emoji,
    isSelected,
    onPress,
    accessibilityLabelSuffix = '',
  }: {
    emoji: string;
    isSelected: boolean;
    onPress: () => void;
    accessibilityLabelSuffix?: string;
  }) => {
    const scaleAnim = useRef(new Animated.Value(isSelected ? 1.1 : 1)).current;

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        bounciness: 4,
        speed: 50,
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        bounciness: 4,
        speed: 50,
        toValue: isSelected ? 1.1 : 1,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim, isSelected]);

    const accessibilityLabel = accessibilityLabelSuffix
      ? `Select ${emoji} emoji ${accessibilityLabelSuffix}`
      : `Select ${emoji} emoji`;

    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            {
              alignItems: 'center',
              backgroundColor: isSelected ? '#f5f5f4' : 'white', // stone-100 when selected
              borderColor: isSelected ? '#10b981' : 'transparent', // emerald-500
              borderRadius: 12,
              borderWidth: isSelected ? 2 : 0,
              elevation: 1,
              height: 44,
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { height: 1, width: 0 },
              width: 44,
              shadowOpacity: 0.05,
              shadowRadius: 2,
            },
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
        </Animated.View>
      </Pressable>
    );
  }
);

QuickAccessEmojiItem.displayName = 'QuickAccessEmojiItem';

// Alias for backward compatibility in tests
const RecentEmojiItem = QuickAccessEmojiItem;

export const EmojiPicker = memo(
  ({
    onClose,
    onSelect,
    selectedEmoji,
    visible,
    triggerRef,
    habitName,
  }: EmojiPickerProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('fitness');
    const [searchQuery, setSearchQuery] = useState('');
    const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Compute suggested emojis based on habit name
    const suggestedEmojis = useMemo(() => {
      if (!habitName?.trim()) return [];
      return suggestEmojisForHabitName(habitName, 5);
    }, [habitName]);

    // Focus management: return focus to trigger on close
    const returnFocusToTrigger = useCallback(() => {
      if (triggerRef?.current) {
        const reactTag = findNodeHandle(triggerRef.current);
        if (reactTag) {
          AccessibilityInfo.setAccessibilityFocus(reactTag);
        }
      }
    }, [triggerRef]);

    // Load recent emojis on mount
    useEffect(() => {
      if (visible) {
        getRecentEmojis().then(setRecentEmojis);
      }
    }, [visible]);

    // Debounce search query (150ms)
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

      const category = HABIT_CATEGORIES.find(
        (cat) => cat.id === selectedCategory
      );
      return category?.emojis ?? [];
    }, [selectedCategory, debouncedQuery, allEmojis]);

    // Wrapper for onClose that returns focus to trigger
    const handleClose = useCallback(() => {
      onClose();
      // Small delay to ensure modal animation completes before focus shift
      setTimeout(returnFocusToTrigger, 100);
    }, [onClose, returnFocusToTrigger]);

    const handleEmojiSelect = useCallback(
      async (emoji: string) => {
        // Add to recent emojis
        await addRecentEmoji(emoji);
        onSelect(emoji);
        handleClose();
      },
      [onSelect, handleClose]
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

    const renderEmojiItem = useCallback(
      ({ item }: { item: string[] }) => (
        <View style={{ flexDirection: 'row' }}>
          {item.map((emoji) => (
            <EmojiItem
              key={emoji}
              emoji={emoji}
              isSelected={selectedEmoji === emoji}
              onPress={() => handleEmojiSelect(emoji)}
            />
          ))}
        </View>
      ),
      [selectedEmoji, handleEmojiSelect]
    );

    // Group emojis into rows for better performance
    const emojiRows = useMemo(() => {
      const rows: string[][] = [];
      for (let i = 0; i < displayedEmojis.length; i += EMOJIS_PER_ROW) {
        rows.push(displayedEmojis.slice(i, i + EMOJIS_PER_ROW));
      }
      return rows;
    }, [displayedEmojis]);

    // Get current category name for header
    const currentCategoryName = useMemo(() => {
      const category = HABIT_CATEGORIES.find(
        (cat) => cat.id === selectedCategory
      );
      return category ? `${category.icon} ${category.name.toUpperCase()}` : '';
    }, [selectedCategory]);

    if (!visible) return null;

    return (
      <Modal
        transparent
        animationType='slide'
        visible={visible}
        onRequestClose={handleClose}
      >
        <View className='flex-1 bg-black/50'>
          <View
            className='overflow-hidden rounded-t-3xl bg-[#faf9f7] shadow-2xl'
            style={{ height: '85%', marginTop: 'auto' }}
          >
            {/* Header */}
            <View className='flex-row items-center justify-between border-b border-stone-200 px-4 pb-3 pt-4'>
              <Text className='text-[24px] font-bold tracking-tight text-stone-800'>
                Choose Icon
              </Text>
              <TouchableOpacity
                accessibilityLabel='Close emoji picker'
                accessibilityRole='button'
                className='h-10 w-10 items-center justify-center rounded-full bg-stone-200'
                onPress={handleClose}
              >
                <X color='#1c1917' size={20} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className='px-4 pb-3 pt-3'>
              <View className='flex-row items-center rounded-xl bg-white px-3 py-2 shadow-sm'>
                <Search color='#78716c' size={20} />
                <TextInput
                  accessibilityHint='Type keywords like run, water, or sleep to find emojis'
                  accessibilityLabel='Search emojis'
                  className='ml-2 flex-1 text-base text-stone-800'
                  placeholder='Search "run", "water", "sleep"...'
                  placeholderTextColor='#a8a29e'
                  returnKeyType='search'
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    accessibilityLabel='Clear search'
                    accessibilityRole='button'
                    onPress={handleClearSearch}
                  >
                    <X color='#78716c' size={18} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Suggested Emojis Section - based on habit name */}
            {!searchQuery && suggestedEmojis.length > 0 && (
              <View className='px-4 pb-2'>
                <Text className='mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500'>
                  Suggested for "{habitName}"
                </Text>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ gap: 8 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {suggestedEmojis.map((emoji) => (
                    <QuickAccessEmojiItem
                      key={`suggested-${emoji}`}
                      accessibilityLabelSuffix='from suggestions'
                      emoji={emoji}
                      isSelected={selectedEmoji === emoji}
                      onPress={() => handleEmojiSelect(emoji)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Recently Used Section */}
            {!searchQuery && recentEmojis.length > 0 && (
              <View className='px-4 pb-2'>
                <Text className='mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500'>
                  Recently Used
                </Text>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ gap: 8 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {recentEmojis.map((emoji) => (
                    <QuickAccessEmojiItem
                      key={emoji}
                      accessibilityLabelSuffix='from recently used'
                      emoji={emoji}
                      isSelected={selectedEmoji === emoji}
                      onPress={() => handleEmojiSelect(emoji)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Category Chips */}
            {!searchQuery && (
              <ScrollView
                horizontal
                className='border-b border-stone-200'
                contentContainerStyle={{
                  gap: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
                showsHorizontalScrollIndicator={false}
              >
                {HABIT_CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category.id;
                  return (
                    <Pressable
                      key={category.id}
                      accessibilityLabel={`Filter by ${category.name} category`}
                      accessibilityRole='button'
                      accessibilityState={{ selected: isSelected }}
                      style={[
                        {
                          alignItems: 'center',
                          backgroundColor: isSelected ? '#1c1917' : 'white', // stone-800 : white
                          borderRadius: 9999,
                          elevation: 1,
                          flexDirection: 'row',
                          gap: 4,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          shadowColor: '#000',
                          shadowOffset: { height: 1, width: 0 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                        },
                      ]}
                      onPress={() => handleCategorySelect(category.id)}
                    >
                      <Text style={{ fontSize: 14 }}>{category.icon}</Text>
                      <Text
                        style={[
                          {
                            color: isSelected ? 'white' : '#1c1917', // stone-800
                            fontSize: 14,
                            fontWeight: '500',
                          },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {/* Emoji Grid */}
            <View className='flex-1 bg-white'>
              {displayedEmojis.length === 0 ? (
                <View className='flex-1 items-center justify-center'>
                  <Search color='#78716c' size={48} />
                  <Text className='mt-3 text-base font-medium text-stone-800'>
                    No emojis found
                  </Text>
                  <Text className='mt-1 text-sm text-stone-500'>
                    Try a different search term
                  </Text>
                </View>
              ) : (
                <>
                  {/* Category Header */}
                  {!searchQuery && (
                    <View className='px-4 pb-2 pt-3'>
                      <Text className='text-xs font-semibold uppercase tracking-wider text-stone-500'>
                        {currentCategoryName}
                      </Text>
                    </View>
                  )}
                  <FlatList
                    removeClippedSubviews
                    showsVerticalScrollIndicator
                    contentContainerStyle={{
                      paddingBottom: 16,
                      paddingHorizontal: 8,
                    }}
                    data={emojiRows}
                    initialNumToRender={10}
                    keyExtractor={(_, index) => `row-${index}`}
                    maxToRenderPerBatch={10}
                    renderItem={renderEmojiItem}
                    windowSize={5}
                  />
                </>
              )}
            </View>

            {/* No Icon Option */}
            <View className='border-t border-stone-200 bg-white px-4 py-3'>
              <TouchableOpacity
                accessibilityLabel='Select no icon for this habit'
                accessibilityRole='button'
                className={`flex-row items-center justify-center rounded-xl py-3 ${
                  selectedEmoji === null ? 'bg-stone-800' : 'bg-stone-100'
                }`}
                onPress={() => {
                  onSelect(null);
                  handleClose();
                }}
              >
                <Text
                  className={`text-base font-semibold ${
                    selectedEmoji === null ? 'text-white' : 'text-stone-800'
                  }`}
                >
                  No Icon
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

EmojiPicker.displayName = 'EmojiPicker';
