import { memo, useCallback, useMemo, useState } from 'react';
import {
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
import {
  EMOJI_CATEGORIES,
  POPULAR_EMOJIS,
  getAllEmojis,
  getEmojisByCategory,
  searchEmojis,
} from '../../utils/emojiData';

interface EmojiPickerProps {
  onClose: () => void;
  onSelect: (emoji: string | null) => void;
  selectedEmoji?: string | null;
  visible: boolean;
}

const EMOJIS_PER_ROW = 8;

const EmojiItem = memo(
  ({
    emoji,
    isSelected,
    onPress,
  }: {
    emoji: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      accessibilityLabel={`Select ${emoji} emoji`}
      accessibilityRole='button'
      className='items-center justify-center p-2'
      style={{
        borderColor: '#1a1a1a',
        borderRadius: 12,
        borderWidth: isSelected ? 2 : 0,
        transform: isSelected ? [{ scale: 1.1 }] : [{ scale: 1 }],
        width: `${100 / EMOJIS_PER_ROW}%`,
      }}
      onPress={onPress}
    >
      <Text className='text-[32px]'>{emoji}</Text>
    </TouchableOpacity>
  )
);

EmojiItem.displayName = 'EmojiItem';

export const EmojiPicker = memo(
  ({ onClose, onSelect, selectedEmoji, visible }: EmojiPickerProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('popular');
    const [searchQuery, setSearchQuery] = useState('');

    // Get emojis to display based on category and search
    const displayedEmojis = useMemo(() => {
      if (searchQuery.trim()) {
        return searchEmojis(searchQuery);
      }

      if (selectedCategory === 'popular') {
        return POPULAR_EMOJIS;
      }

      if (selectedCategory === 'all') {
        return getAllEmojis();
      }

      return getEmojisByCategory(selectedCategory);
    }, [selectedCategory, searchQuery]);

    const handleEmojiSelect = useCallback(
      (emoji: string) => {
        onSelect(emoji);
        onClose();
      },
      [onSelect, onClose]
    );

    const handleCategorySelect = useCallback((categoryId: string) => {
      setSelectedCategory(categoryId);
      setSearchQuery('');
    }, []);

    const handleClearSearch = useCallback(() => {
      setSearchQuery('');
    }, []);

    const renderEmojiItem = useCallback(
      ({ item }: { item: string[] }) => (
        <View className='flex-row'>
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

    const categories = useMemo(
      () => [
        { category: 'Popular', icon: '⭐', id: 'popular' },
        { category: 'All', icon: '🌐', id: 'all' },
        ...EMOJI_CATEGORIES.filter((cat) => cat.id !== 'frequent'),
      ],
      []
    );

    if (!visible) return null;

    return (
      <Modal
        animationType='slide'
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View className='flex-1 bg-black/50'>
          <View className='mt-16 flex-1 overflow-hidden rounded-t-3xl bg-[#f8f5f1] shadow-2xl'>
            {/* Header */}
            <View className='flex-row items-center justify-between border-b border-gray-200 px-4 pb-3 pt-4'>
              <Text className='text-[22px] font-semibold text-[#1a1a1a]'>
                Choose an Icon
              </Text>
              <TouchableOpacity
                accessibilityLabel='Close emoji picker'
                accessibilityRole='button'
                className='h-10 w-10 items-center justify-center rounded-full bg-gray-200'
                onPress={onClose}
              >
                <X color='#1a1a1a' size={20} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className='px-4 pb-3 pt-3'>
              <View className='flex-row items-center rounded-xl bg-white px-3 py-2'>
                <Search color='#8a8a8a' size={20} />
                <TextInput
                  className='ml-2 flex-1 text-base text-[#1a1a1a]'
                  placeholder='Search emojis...'
                  placeholderTextColor='#adaebc'
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

            {/* Category Tabs */}
            {!searchQuery && (
              <ScrollView
                className='border-b border-gray-200'
                contentContainerClassName='gap-2 px-4 py-3'
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.id;
                  return (
                    <Pressable
                      key={category.id}
                      accessibilityLabel={`Filter by ${category.category}`}
                      accessibilityRole='button'
                      accessibilityState={{ selected: isSelected }}
                      className={`flex-row items-center gap-1 rounded-full px-3 py-2 ${
                        isSelected ? 'bg-[#1a1a1a]' : 'bg-white'
                      }`}
                      onPress={() => handleCategorySelect(category.id)}
                    >
                      <Text className='text-base'>{category.icon}</Text>
                      <Text
                        className={`text-sm font-medium ${
                          isSelected ? 'text-white' : 'text-[#1a1a1a]'
                        }`}
                      >
                        {category.category}
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
                  <Text className='text-4xl'>🔍</Text>
                  <Text className='mt-2 text-base font-medium text-[#1a1a1a]'>
                    No emojis found
                  </Text>
                  <Text className='mt-1 text-sm text-[#8a8a8a]'>
                    Try a different search term
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={emojiRows}
                  keyExtractor={(item, index) => `row-${index}`}
                  renderItem={renderEmojiItem}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={{ padding: 8 }}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  removeClippedSubviews={true}
                />
              )}
            </View>

            {/* No Icon Option */}
            <View className='border-t border-gray-200 bg-white px-4 py-3'>
              <TouchableOpacity
                accessibilityLabel='Select no icon'
                accessibilityRole='button'
                className={`flex-row items-center justify-center rounded-xl py-3 ${
                  selectedEmoji === null ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                }`}
                onPress={() => {
                  onSelect(null);
                  onClose();
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
