/**
 * VizPreview Component
 * Compact preview of success or failure visualization
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Sparkles, AlertTriangle } from 'lucide-react-native';
import { clsx } from 'clsx';

import type { VizPreviewProps } from '../DualVizSetup.types';

export function VizPreview({ type, body, mind, emotion }: VizPreviewProps) {
  const isSuccess = type === 'success';
  const hasAnyField = body || mind || emotion;

  if (!hasAnyField) {
    return (
      <View
        className={clsx(
          'flex-1 rounded-xl p-3',
          isSuccess ? 'bg-emerald-50' : 'bg-rose-50'
        )}
      >
        <View className='mb-2 flex-row items-center gap-2'>
          {isSuccess ? (
            <Sparkles className='text-emerald-600' size={14} />
          ) : (
            <AlertTriangle className='text-rose-500' size={14} />
          )}
          <Text
            className={clsx(
              'text-xs font-semibold',
              isSuccess ? 'text-emerald-700' : 'text-rose-700'
            )}
          >
            {isSuccess ? 'Success' : 'Failure'}
          </Text>
        </View>
        <Text className='text-xs italic text-stone-400'>
          {isSuccess ? 'How will you feel?' : 'What will you avoid?'}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={clsx(
        'flex-1 rounded-xl p-3',
        isSuccess ? 'bg-emerald-50' : 'bg-rose-50'
      )}
    >
      <View className='mb-2 flex-row items-center gap-2'>
        {isSuccess ? (
          <Sparkles className='text-emerald-600' size={14} />
        ) : (
          <AlertTriangle className='text-rose-500' size={14} />
        )}
        <Text
          className={clsx(
            'text-xs font-semibold',
            isSuccess ? 'text-emerald-700' : 'text-rose-700'
          )}
        >
          {isSuccess ? 'Success' : 'Failure'}
        </Text>
      </View>
      <View className='gap-1'>
        {body && (
          <Text
            className={clsx(
              'text-xs',
              isSuccess ? 'text-emerald-800' : 'text-rose-800'
            )}
            numberOfLines={1}
          >
            <Text className='font-medium'>Body:</Text> {body}
          </Text>
        )}
        {mind && (
          <Text
            className={clsx(
              'text-xs',
              isSuccess ? 'text-emerald-800' : 'text-rose-800'
            )}
            numberOfLines={1}
          >
            <Text className='font-medium'>Mind:</Text> {mind}
          </Text>
        )}
        {emotion && (
          <Text
            className={clsx(
              'text-xs',
              isSuccess ? 'text-emerald-800' : 'text-rose-800'
            )}
            numberOfLines={1}
          >
            <Text className='font-medium'>Feel:</Text> {emotion}
          </Text>
        )}
      </View>
    </View>
  );
}
