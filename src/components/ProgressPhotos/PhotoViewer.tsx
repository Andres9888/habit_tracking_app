/**
 * PhotoViewer - Full-screen modal for viewing and editing progress photos
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme';
import type { PhotoViewerProps } from './ProgressPhotos.types';

export function PhotoViewer({
  isOpen,
  onClose,
  onDelete,
  onUpdateCaption,
  photo,
}: PhotoViewerProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const [caption, setCaption] = useState(photo?.caption ?? '');
  const [isEditingCaption, setIsEditingCaption] = useState(false);

  if (!photo) return null;

  const date = new Date(photo.createdAt);
  const dateStr = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  const handleSaveCaption = async () => {
    await onUpdateCaption(caption.trim() || undefined);
    setIsEditingCaption(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            await onDelete();
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  };

  return (
    <Modal
      animationType='slide'
      transparent
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View
        className='flex-1'
        style={{ backgroundColor: isDark ? '#000' : '#fff' }}
      >
        {/* Header */}
        <View
          className='px-4 py-3 flex-row items-center justify-between'
          style={{ paddingTop: Math.max(insets.top, 12) }}
        >
          <TouchableOpacity
            className='p-2'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={onClose}
          >
            <Ionicons color={colors.text.primary} name='close' size={28} />
          </TouchableOpacity>
          <Text
            className='text-[17px] font-semibold'
            style={{ color: colors.text.primary }}
          >
            Progress Photo
          </Text>
          <TouchableOpacity
            className='p-2'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={handleDelete}
          >
            <Ionicons color={colors.error[500]} name='trash-outline' size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView bounces className='flex-1'>
          {/* Image */}
          <View className='aspect-[3/4] w-full bg-gray-900'>
            {photo.imageUrl && (
              <Image
                resizeMode='cover'
                source={{ uri: photo.imageUrl }}
                style={{ height: '100%', width: '100%' }}
              />
            )}
          </View>

          {/* Date */}
          <View className='px-4 py-4'>
            <Text
              className='text-[13px] font-medium'
              style={{ color: colors.text.tertiary }}
            >
              {dateStr}
            </Text>

            {/* Caption */}
            <View className='mt-4'>
              {isEditingCaption ? (
                <>
                  <TextInput
                    autoFocus
                    multiline
                    className='rounded-xl p-3 text-[17px] min-h-[100px]'
                    maxLength={200}
                    placeholder='Add a caption...'
                    placeholderTextColor={colors.text.tertiary}
                    style={{
                      backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
                      color: colors.text.primary,
                    }}
                    value={caption}
                    onChangeText={setCaption}
                  />
                  <View className='flex-row gap-2 mt-3'>
                    <TouchableOpacity
                      className='flex-1 rounded-xl p-3 items-center'
                      style={{ backgroundColor: colors.gray[600] }}
                      onPress={() => {
                        setCaption(photo.caption ?? '');
                        setIsEditingCaption(false);
                      }}
                    >
                      <Text className='text-white text-[17px] font-semibold'>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className='flex-1 rounded-xl p-3 items-center'
                      style={{ backgroundColor: colors.primary[500] }}
                      onPress={handleSaveCaption}
                    >
                      <Text className='text-white text-[17px] font-semibold'>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  className='rounded-xl p-3'
                  style={{
                    backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
                  }}
                  onPress={() => setIsEditingCaption(true)}
                >
                  {photo.caption ? (
                    <Text
                      className='text-[17px]'
                      style={{ color: colors.text.primary }}
                    >
                      {photo.caption}
                    </Text>
                  ) : (
                    <Text
                      className='text-[17px]'
                      style={{ color: colors.text.tertiary }}
                    >
                      Add a caption...
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
