import { memo } from 'react';
import { Modal, View } from 'react-native';
import { useEmojiPicker } from './useEmojiPicker';
import { EmojiPickerHeader } from './components/EmojiPickerHeader';
import { EmojiPickerSearch } from './components/EmojiPickerSearch';
import { SuggestedEmojis } from './components/SuggestedEmojis';
import { RecentEmojis } from './components/RecentEmojis';
import { CategoryChips } from './components/CategoryChips';
import { EmojiGrid } from './components/EmojiGrid';
import { NoIconButton } from './components/NoIconButton';
import { useThemeColors } from '../../theme/ThemeContext';
import { shadows } from '../../theme/spacing';
import type { EmojiPickerProps } from './EmojiPicker.types';

export const EmojiPicker = memo(
  ({
    onClose,
    onSelect,
    selectedEmoji,
    visible,
    triggerRef,
    habitName,
  }: EmojiPickerProps) => {
    const { colors } = useThemeColors();
    const { state, handlers } = useEmojiPicker({
      habitName,
      onClose,
      onSelect,
      triggerRef,
      visible,
    });

    if (!visible) return null;

    return (
      <Modal
        accessibilityViewIsModal
        transparent
        animationType='slide'
        visible={visible}
        onRequestClose={handlers.handleClose}
      >
        <View className='flex-1 bg-black/50'>
          <View
            className='overflow-hidden rounded-t-3xl'
            style={[{ backgroundColor: colors.surface, height: '85%', marginTop: 'auto' }, shadows.alert]}
          >
            <EmojiPickerHeader onClose={handlers.handleClose} />

            <EmojiPickerSearch
              searchQuery={state.searchQuery}
              onChangeText={handlers.setSearchQuery}
              onClear={handlers.handleClearSearch}
            />

            {!state.isSearching &&
              state.suggestedEmojis.length > 0 &&
              habitName ? <SuggestedEmojis
                  habitName={habitName}
                  selectedEmoji={selectedEmoji}
                  suggestedEmojis={state.suggestedEmojis}
                  onEmojiSelect={handlers.handleEmojiSelect}
                /> : null}

            {!state.isSearching && state.recentEmojis.length > 0 ? <RecentEmojis
                recentEmojis={state.recentEmojis}
                selectedEmoji={selectedEmoji}
                onEmojiSelect={handlers.handleEmojiSelect}
              /> : null}

            {state.isSearching ? null : <CategoryChips
                selectedCategory={state.selectedCategory}
                onCategorySelect={handlers.handleCategorySelect}
              />}

            <EmojiGrid
              categoryName={state.currentCategoryName}
              displayedEmojis={state.displayedEmojis}
              isSearching={state.isSearching}
              selectedEmoji={selectedEmoji}
              onEmojiSelect={handlers.handleEmojiSelect}
            />

            <NoIconButton
              isSelected={selectedEmoji === null}
              onPress={handlers.handleNoIconSelect}
            />
          </View>
        </View>
      </Modal>
    );
  }
);

EmojiPicker.displayName = 'EmojiPicker';
