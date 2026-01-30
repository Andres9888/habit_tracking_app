/**
 * VisualizationGuide Component
 * Based on Andrew Huberman's research on effective goal visualization
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Eye,
  Mountain,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { VisualizationGuideProps } from './VisualizationGuide.types';
import { VISUALIZATION_TECHNIQUES } from './visualizationTechniques';
import { GuideHeader } from './GuideHeader';
import { KeyInsightBox } from './KeyInsightBox';
import { VisualizationCard } from './VisualizationCard';
import { QuickTip } from './QuickTip';

export function VisualizationGuide({ habitName }: VisualizationGuideProps) {
  const [showAllTechniques, setShowAllTechniques] = useState(false);
  const displayedTechniques = showAllTechniques
    ? VISUALIZATION_TECHNIQUES
    : VISUALIZATION_TECHNIQUES.slice(0, 2);

  const handleShowMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAllTechniques(!showAllTechniques);
  };

  return (
    <View className='gap-5'>
      <GuideHeader habitName={habitName} />
      <KeyInsightBox />
      <View className='gap-3'>
        <Text className='text-sm font-semibold uppercase tracking-widest text-stone-500'>
          Techniques to Apply
        </Text>
        {displayedTechniques.map((technique) => (
          <VisualizationCard key={technique.id} technique={technique} />
        ))}
        {VISUALIZATION_TECHNIQUES.length > 2 && (
          <Pressable
            accessibilityLabel={
              showAllTechniques
                ? 'Show less techniques'
                : 'Show more techniques'
            }
            accessibilityRole='button'
            className='flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 py-3 active:bg-violet-100'
            onPress={handleShowMore}
          >
            <Text className='text-sm font-medium text-violet-700'>
              {showAllTechniques
                ? 'Show Less'
                : `Show ${VISUALIZATION_TECHNIQUES.length - 2} More Techniques`}
            </Text>
            {showAllTechniques ? (
              <ChevronUp className='text-violet-600' size={16} />
            ) : (
              <ChevronDown className='text-violet-600' size={16} />
            )}
          </Pressable>
        )}
      </View>
      <Animated.View
        className='gap-3'
        entering={FadeInDown.delay(200).springify()}
      >
        <Text className='text-sm font-semibold uppercase tracking-widest text-stone-500'>
          Quick Practice
        </Text>
        <View className='gap-2'>
          <QuickTip
            description='Spend 30 seconds visualizing yourself doing the habit, not having done it'
            icon={<Eye className='text-amber-600' size={16} />}
            title='Morning Visualization'
          />
          <QuickTip
            description='Identify your biggest obstacle and create an "if-then" plan'
            icon={<Mountain className='text-amber-600' size={16} />}
            title='Obstacle Planning'
          />
          <QuickTip
            description='See yourself taking the first small step of your habit'
            icon={<ArrowRight className='text-amber-600' size={16} />}
            title='Next Action Preview'
          />
        </View>
      </Animated.View>
      <View className='items-center rounded-xl bg-stone-100/50 px-4 py-3'>
        <Text className='text-center text-xs text-stone-500'>
          Based on research by Gabriele Oettingen (Mental Contrasting), Peter
          Gollwitzer (Implementation Intentions), and discussed in the Huberman
          Lab Podcast.
        </Text>
      </View>
    </View>
  );
}

export default VisualizationGuide;
