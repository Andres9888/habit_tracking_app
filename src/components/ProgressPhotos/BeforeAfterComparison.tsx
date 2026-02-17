/**
 * BeforeAfterComparison - Side-by-side comparison of first and latest photos
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme';
import type { BeforeAfterComparisonProps } from './ProgressPhotos.types';

export function BeforeAfterComparison({
  afterPhoto,
  beforePhoto,
  onClose,
}: BeforeAfterComparisonProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();

  const beforeDate = new Date(beforePhoto.createdAt);
  const afterDate = new Date(afterPhoto.createdAt);

  const beforeDateStr = beforeDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const afterDateStr = afterDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate days between
  const daysBetween = Math.floor(
    (afterPhoto.createdAt - beforePhoto.createdAt) / (1000 * 60 * 60 * 24)
  );

  return (
    <Modal animationType='slide' transparent visible onRequestClose={onClose}>
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
            Progress Comparison
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView bounces className='flex-1'>
          {/* Progress Stats */}
          <View
            className='mx-4 mb-4 rounded-xl p-4'
            style={{
              backgroundColor: isDark ? colors.primary[900] : colors.primary[50],
              borderColor: colors.primary[500],
              borderWidth: 1,
            }}
          >
            <View className='flex-row items-center justify-center gap-2'>
              <Ionicons color={colors.primary[500]} name='trending-up' size={24} />
              <Text
                className='text-[22px] font-bold'
                style={{ color: colors.primary[500] }}
              >
                {daysBetween} Days
              </Text>
            </View>
            <Text
              className='text-[13px] text-center mt-1'
              style={{ color: colors.text.secondary }}
            >
              of consistent progress
            </Text>
          </View>

          {/* Before Photo */}
          <View className='px-4 mb-6'>
            <View className='flex-row items-center gap-2 mb-2'>
              <Ionicons color={colors.text.tertiary} name='arrow-back' size={20} />
              <Text
                className='text-[17px] font-semibold'
                style={{ color: colors.text.primary }}
              >
                Before
              </Text>
              <Text
                className='text-[13px]'
                style={{ color: colors.text.tertiary }}
              >
                {beforeDateStr}
              </Text>
            </View>
            <View
              className='aspect-[3/4] w-full rounded-xl overflow-hidden'
              style={{ backgroundColor: colors.gray[800] }}
            >
              {beforePhoto.imageUrl && (
                <Image
                  resizeMode='cover'
                  source={{ uri: beforePhoto.imageUrl }}
                  style={{ height: '100%', width: '100%' }}
                />
              )}
            </View>
            {beforePhoto.caption && (
              <Text
                className='text-[13px] mt-2'
                style={{ color: colors.text.secondary }}
              >
                {beforePhoto.caption}
              </Text>
            )}
          </View>

          {/* After Photo */}
          <View className='px-4 mb-6'>
            <View className='flex-row items-center gap-2 mb-2'>
              <Ionicons color={colors.primary[500]} name='arrow-forward' size={20} />
              <Text
                className='text-[17px] font-semibold'
                style={{ color: colors.text.primary }}
              >
                After
              </Text>
              <Text
                className='text-[13px]'
                style={{ color: colors.text.tertiary }}
              >
                {afterDateStr}
              </Text>
            </View>
            <View
              className='aspect-[3/4] w-full rounded-xl overflow-hidden'
              style={{ backgroundColor: colors.gray[800] }}
            >
              {afterPhoto.imageUrl && (
                <Image
                  resizeMode='cover'
                  source={{ uri: afterPhoto.imageUrl }}
                  style={{ height: '100%', width: '100%' }}
                />
              )}
            </View>
            {afterPhoto.caption && (
              <Text
                className='text-[13px] mt-2'
                style={{ color: colors.text.secondary }}
              >
                {afterPhoto.caption}
              </Text>
            )}
          </View>

          {/* Motivational Message */}
          <View
            className='mx-4 mb-6 rounded-xl p-4'
            style={{
              backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
            }}
          >
            <Text
              className='text-[17px] font-semibold text-center'
              style={{ color: colors.text.primary }}
            >
              Amazing Progress! 🎉
            </Text>
            <Text
              className='text-[13px] text-center mt-2'
              style={{ color: colors.text.secondary }}
            >
              You've stayed committed for {daysBetween} days. Keep up the great
              work and watch your transformation unfold!
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
