
import React from 'react';
import { View } from 'react-native';

import type { ContentFlags } from '../RescueModeContent.helpers';
import { AnimatedContent } from '../AnimatedContent';
import { FeaturedWhy } from '../FeaturedWhy';
import { getAnimationIndex } from '../useAnimationIndex';

type WhySectionProps = {
  why: string;
  visible: boolean;
  reduceMotion: boolean;
  flags: ContentFlags;
};

export function WhySection({
  why,
  visible,
  reduceMotion,
  flags,
}: WhySectionProps) {
  return (
    <AnimatedContent
      index={getAnimationIndex(flags, ['streak'])}
      reduceMotion={reduceMotion}
      visible={visible}
    >
      <View className='mt-4'>
        <FeaturedWhy why={why} />
      </View>
    </AnimatedContent>
  );
}
