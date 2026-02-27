/**
 * DualVizSetup Component
 * Displays and allows editing of success/failure visualizations
 *
 * Scientific Basis: Andrew Huberman (Stanford) - Episode #55
 * Key insight: Visualize FAILURE when unmotivated (fear drives action 2x)
 */

import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { CompletionCheckmark } from '../../../animations';
import { SectionCard } from './components/SectionCard';
import { AnimatedSection } from './components/AnimatedSection';
import { VizPreview } from './components/VizPreview';
import { DualVizHeader } from './components/DualVizHeader';
import { DualVizExplainerModal } from './components/DualVizExplainerModal';
import { hasVizData, isVizComplete } from './DualVizSetup.utils';
import type { DualVizSetupProps } from './DualVizSetup.types';
import { triggerHaptic } from '@/utils/haptics';

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
    triggerHaptic('tap');
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
