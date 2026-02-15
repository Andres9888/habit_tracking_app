/**
 * DualVizSetup Component
 * Displays and allows editing of success/failure visualizations
 *
 * Scientific Basis: Andrew Huberman (Stanford) - Episode #55
 * Key insight: Visualize FAILURE when unmotivated (fear drives action 2x)
 */

import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';

import * as Haptics from 'expo-haptics';

import type { DualVizSetupProps } from './DualVizSetup.types';
import { AnimatedSection } from './components/AnimatedSection';
import { CompletionCheckmark } from '../../../animations';
import { DualVizExplainerModal } from './components/DualVizExplainerModal';
import { DualVizHeader } from './components/DualVizHeader';
import { SectionCard } from './components/SectionCard';
import { VizPreview } from './components/VizPreview';
import { hasVizData, isVizComplete } from './DualVizSetup.utils';

export function DualVizSetup({
  visualization,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 4,
}: DualVizSetupProps) {
  const [showExplainer, setShowExplainer] = useState(false);

  const hasViz = hasVizData(visualization);
  const isComplete = isVizComplete(visualization);

  const handleHelpPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowExplainer(true);
  }, []);

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={
            hasViz ? 'Edit your visualizations' : 'Add your visualizations'
          }
          className='border-l-4 border-l-violet-400'
          onPress={onPress}
        >
          <DualVizHeader hasViz={hasViz} onHelpPress={handleHelpPress} />

          {hasViz ? (
            <View className='flex-row gap-2'>
              <VizPreview
                body={visualization?.successBody}
                emotion={visualization?.successEmotion}
                mind={visualization?.successMind}
                type='success'
              />
              <VizPreview
                body={visualization?.failureBody}
                emotion={visualization?.failureEmotion}
                mind={visualization?.failureMind}
                type='failure'
              />
            </View>
          ) : (
            <Text className='text-sm text-stone-500'>
              Success + Failure feelings
            </Text>
          )}

          <CompletionCheckmark
            isVisible={isComplete}
            reduceMotion={reduceMotion}
            sectionIndex={sectionIndex}
            shouldAnimate={shouldAnimate}
          />
        </SectionCard>
      </AnimatedSection>

      <DualVizExplainerModal
        visible={showExplainer}
        onClose={() => setShowExplainer(false)}
      />
    </>
  );
}

export default DualVizSetup;
