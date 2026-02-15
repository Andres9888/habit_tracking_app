
import React from 'react';
import { View } from 'react-native';

import { Smile } from 'lucide-react-native';

import { PulsingIcon, CompletionCheckmark } from '../../../../animations';

interface ReflectionIconProps {
  hasSelection: boolean;
  reduceMotion: boolean;
  sectionIndex: number;
  shouldAnimate: boolean;
}

export function ReflectionIcon({
  hasSelection,
  reduceMotion,
  sectionIndex,
  shouldAnimate,
}: ReflectionIconProps) {
  return (
    <View className='relative h-10 w-10 items-center justify-center rounded-xl bg-emerald-100'>
      {hasSelection ? (
        <Smile className='text-emerald-500' size={20} />
      ) : (
        <PulsingIcon reduceMotion={reduceMotion}>
          <Smile className='text-emerald-500' size={20} />
        </PulsingIcon>
      )}
      <CompletionCheckmark
        isVisible={hasSelection}
        reduceMotion={reduceMotion}
        sectionIndex={sectionIndex}
        shouldAnimate={shouldAnimate}
      />
    </View>
  );
}
