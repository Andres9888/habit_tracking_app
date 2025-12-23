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
import { searchEmojisByKeyword, suggestEmojisForHabitName } from '../../utils/emojiKeywords';
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
        toValue: 0.9,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1.1 : 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }, [scaleAnim, isSelected]);

    return (
      <Pressable
        accessibilityLabel={`Select ${emoji} emoji`}
        accessibilityRole='button'
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: `${100 / EMOJIS_PER_ROW}%`,
          aspectRatio: 1,
          padding: 2,
        }}
      >
        <Animated.View
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: isSelected ? '#dbeafe' : '#f9fafb',
              borderWidth: isSelected ? 2 : 0,
              borderColor: isSelected ? '#3b82f6' : 'transparent',
              minWidth: 44,
              minHeight: 44,
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
        toValue: 0.9,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1.1 : 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
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
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: isSelected ? '#dbeafe' : 'white',
              borderWidth: isSelected ? 2 : 0,
              borderColor: isSelected ? '#3b82f6' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
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
  ({ onClose, onSelect, selectedEmoji, visible, triggerRef, habitName }: EmojiPickerProps) => {
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

      const category = HABIT_CATEGORIES.find((cat) => cat.id === selectedCategory);
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
      const category = HABIT_CATEGORIES.find((cat) => cat.id === selectedCategory);
      return category ? `${category.icon} ${category.name.toUpperCase()}` : '';
    }, [selectedCategory]);

    if (!visible) return null;

    return (
      <Modal
        animationType='slide'
        transparent
        visible={visible}
        onRequestClose={handleClose}
      >
        <View className='flex-1 bg-black/50'>
          <View
            style={{ height: '85%', marginTop: 'auto' }}
            className='overflow-hidden rounded-t-3xl bg-[#f8f5f1] shadow-2xl'
          >
            {/* Header */}
            <View className='flex-row items-center justify-between border-b border-gray-200 px-4 pb-3 pt-4'>
              <Text className='text-[22px] font-semibold text-[#1a1a1a]'>
                Choose Icon
              </Text>
              <TouchableOpacity
                accessibilityLabel='Close emoji picker'
                accessibilityRole='button'
                className='h-10 w-10 items-center justify-center rounded-full bg-gray-200'
                onPress={handleClose}
              >
                <X color='#1a1a1a' size={20} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className='px-4 pb-3 pt-3'>
              <View className='flex-row items-center rounded-xl bg-white px-3 py-2 shadow-sm'>
                <Search color='#8a8a8a' size={20} />
                <TextInput
                  accessibilityLabel='Search emojis'
                  accessibilityHint='Type keywords like run, water, or sleep to find emojis'
                  className='ml-2 flex-1 text-base text-[#1a1a1a]'
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
                    <X color='#8a8a8a' size={18} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Suggested Emojis Section - based on habit name */}
            {!searchQuery && suggestedEmojis.length > 0 && (
              <View className='px-4 pb-2'>
                <Text className='mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500'>
                  Suggested for "{habitName}"
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {suggestedEmojis.map((emoji) => (
                    <QuickAccessEmojiItem
                      key={`suggested-${emoji}`}
                      emoji={emoji}
                      isSelected={selectedEmoji === emoji}
                      onPress={() => handleEmojiSelect(emoji)}
                      accessibilityLabelSuffix='from suggestions'
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Recently Used Section */}
            {!searchQuery && recentEmojis.length > 0 && (
              <View className='px-4 pb-2'>
                <Text className='mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500'>
                  Recently Used
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {recentEmojis.map((emoji) => (
                    <QuickAccessEmojiItem
                      key={emoji}
                      emoji={emoji}
                      isSelected={selectedEmoji === emoji}
                      onPress={() => handleEmojiSelect(emoji)}
                      accessibilityLabelSuffix='from recently used'
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Category Chips */}
            {!searchQuery && (
              <ScrollView
                className='border-b border-gray-200'
                contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}
                horizontal
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
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 9999,
                          backgroundColor: isSelected ? '#1a1a1a' : 'white',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 1,
                        },
                      ]}
                      onPress={() => handleCategorySelect(category.id)}
                    >
                      <Text style={{ fontSize: 14 }}>{category.icon}</Text>
                      <Text
                        style={[
                          {
                            fontSize: 14,
                            fontWeight: '500',
                            color: isSelected ? 'white' : '#1a1a1a',
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
                  <Search color='#8a8a8a' size={48} />
                  <Text className='mt-3 text-base font-medium text-[#1a1a1a]'>
                    No emojis found
                  </Text>
                  <Text className='mt-1 text-sm text-[#8a8a8a]'>
                    Try a different search term
                  </Text>
                </View>
              ) : (
                <>
                  {/* Category Header */}
                  {!searchQuery && (
                    <View className='px-4 pb-2 pt-3'>
                      <Text className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
                        {currentCategoryName}
                      </Text>
                    </View>
                  )}
                  <FlatList
                    data={emojiRows}
                    keyExtractor={(_, index) => `row-${index}`}
                    renderItem={renderEmojiItem}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}
                  />
                </>
              )}
            </View>

            {/* No Icon Option */}
            <View className='border-t border-gray-200 bg-white px-4 py-3'>
              <TouchableOpacity
                accessibilityLabel='Select no icon for this habit'
                accessibilityRole='button'
                className={`flex-row items-center justify-center rounded-xl py-3 ${
                  selectedEmoji === null ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                }`}
                onPress={() => {
                  onSelect(null);
                  handleClose();
                }}
              >
                <Text
                  className={`text-base font-semibold ${
                    selectedEmoji === null ? 'text-white' : 'text-[#1a1a1a]'
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
