import { useState, useMemo, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import { X, Search } from 'lucide-react-native';
import { EMOJI_CATEGORIES, ALL_EMOJIS } from '../../utils/emojiData';

interface EmojiPickerProps {
  visible: boolean;
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  onClose: () => void;
}

const EMOJI_COLORS = [
  '#DBEAFE', // blue-100
  '#FFEDD5', // orange-100
  '#DCFCE7', // green-100
  '#F3E8FF', // purple-100
  '#FCE7F3', // pink-100
  '#FEF3C7', // yellow-100
  '#E0E7FF', // indigo-100
  '#CCFBF1', // teal-100
  '#FEE2E2', // red-100
  '#F3F4F6', // gray-100
];

const getEmojiColor = (index: number): string => {
  return EMOJI_COLORS[index % EMOJI_COLORS.length];
};

export const EmojiPicker = ({
  visible,
  selectedEmoji,
  onSelect,
  onClose,
}: EmojiPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter emojis based on search and category
  const filteredEmojis = useMemo(() => {
    let emojis: string[] = [];

    if (selectedCategory === 'all') {
      emojis = ALL_EMOJIS;
    } else {
      const category = EMOJI_CATEGORIES.find((cat) => cat.id === selectedCategory);
      emojis = category?.emojis || [];
    }

    if (searchQuery.trim()) {
      // Simple search - can be enhanced with emoji name matching
      const query = searchQuery.toLowerCase();
      return emojis.filter((emoji) => {
        // For now, just return all if query exists (can be enhanced)
        // In a real implementation, you'd match against emoji names/descriptions
        return true;
      });
    }

    return emojis;
  }, [searchQuery, selectedCategory]);

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      onSelect(emoji);
      onClose();
    },
    [onSelect, onClose]
  );

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search when changing category
  }, []);

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50'>
        <View className='mt-12 flex-1 overflow-hidden rounded-t-3xl bg-[#f8f5f1]'>
          {/* Header */}
          <View className='flex-row items-center justify-between border-b border-gray-200 px-4 pb-4 pt-4'>
            <Text className='text-[20px] font-bold text-[#1a1a1a]'>
              Choose Emoji
            </Text>
            <TouchableOpacity
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full'
              onPress={onClose}
            >
              <X color='#1a1a1a' size={24} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className='border-b border-gray-200 px-4 py-3'>
            <View className='flex-row items-center rounded-xl bg-white px-3 py-2'>
              <Search color='#8a8a8a' size={18} strokeWidth={2} />
              <TextInput
                className='ml-2 flex-1 text-base text-[#1a1a1a]'
                placeholder='Search emojis...'
                placeholderTextColor='#adaebc'
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize='none'
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  accessibilityLabel='Clear search'
                  accessibilityRole='button'
                  onPress={() => setSearchQuery('')}
                  className='h-6 w-6 items-center justify-center rounded-full bg-gray-200'
                >
                  <X color='#1a1a1a' size={14} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='border-b border-gray-200'
            contentContainerClassName='px-3 py-3 gap-2'
          >
            <Pressable
              onPress={() => handleCategorySelect('all')}
              className={`flex-row items-center gap-1 rounded-full px-3 py-2 ${
                selectedCategory === 'all' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
              }`}
              accessibilityLabel='All categories'
              accessibilityRole='button'
              accessibilityState={{ selected: selectedCategory === 'all' }}
            >
              <Text className='text-sm'>✨</Text>
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === 'all' ? 'text-white' : 'text-[#1a1a1a]'
                }`}
              >
                All
              </Text>
            </Pressable>
            {EMOJI_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => handleCategorySelect(category.id)}
                  className={`flex-row items-center gap-1 rounded-full px-3 py-2 ${
                    isSelected ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                  }`}
                  accessibilityLabel={`Filter by ${category.name}`}
                  accessibilityRole='button'
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text className='text-sm'>{category.icon}</Text>
                  <Text
                    className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-[#1a1a1a]'
                    }`}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Emoji Grid */}
          <FlatList
            data={filteredEmojis}
            numColumns={8}
            keyExtractor={(item, index) => `${item}-${index}`}
            contentContainerClassName='p-4'
            showsVerticalScrollIndicator={true}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                accessibilityLabel={`Select ${item} emoji`}
                accessibilityRole='button'
                className={`m-1 h-12 w-12 items-center justify-center rounded-xl ${
                  selectedEmoji === item ? 'border-2 border-blue-500' : ''
                }`}
                style={{
                  backgroundColor: selectedEmoji === item
                    ? '#DBEAFE'
                    : getEmojiColor(index),
                }}
                onPress={() => handleEmojiSelect(item)}
              >
                <Text className='text-2xl'>{item}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className='items-center justify-center py-12'>
                <Text className='text-2xl'>🔍</Text>
                <Text className='mt-2 text-base font-medium text-[#1a1a1a]'>
                  No emojis found
                </Text>
                <Text className='mt-1 text-sm text-[#8a8a8a]'>
                  Try a different search or category
                </Text>
              </View>
            }
          />

          {/* No Icon Option */}
          <View className='border-t border-gray-200 px-4 py-3'>
            <TouchableOpacity
              accessibilityLabel='No icon'
              accessibilityRole='button'
              className='h-12 w-full items-center justify-center rounded-xl bg-white'
              style={{
                borderColor: '#1a1a1a',
                borderWidth: selectedEmoji === null ? 2 : 1,
              }}
              onPress={() => {
                onSelect(null);
                onClose();
              }}
            >
              <Text className='text-base font-medium text-[#8a8a8a]'>
                No Icon
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
