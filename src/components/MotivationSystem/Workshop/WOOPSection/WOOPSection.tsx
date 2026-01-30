/**
 * WOOPSection Component
 * Displays and allows editing of the WOOP (Wish-Outcome-Obstacle-Plan) framework
 *
 * Scientific Basis:
 * - Gabriele Oettingen (NYU): 20+ peer-reviewed studies
 * - Mental contrasting + implementation intentions = 2x goal achievement
 */

import React, { useCallback, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { CompletionCheckmark } from '../../../animations';
import { SectionCard } from './SectionCard';
import { AnimatedSection } from './AnimatedSection';
import { WOOPExplainerModal } from './WOOPExplainerModal';
import { WOOPSectionHeader } from './WOOPSectionHeader';
import { WOOPSectionContent } from './WOOPSectionContent';
import { hasWOOPData, isWOOPComplete } from './woopUtils';
import type { WOOPSectionProps } from './WOOPSection.types';

export function WOOPSection({
  woop,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 3,
}: WOOPSectionProps) {
  const [showExplainer, setShowExplainer] = useState(false);
  const hasWoop = hasWOOPData(woop);
  const isComplete = isWOOPComplete(woop);

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
            hasWoop ? 'Edit your WOOP plan' : 'Add your WOOP plan'
          }
          onPress={onPress}
        >
          <WOOPSectionHeader hasWoop={hasWoop} onHelpPress={handleHelpPress} />
          <WOOPSectionContent hasWoop={hasWoop} woop={woop} />
          <CompletionCheckmark
            isVisible={isComplete}
            reduceMotion={reduceMotion}
            sectionIndex={sectionIndex}
            shouldAnimate={shouldAnimate}
          />
        </SectionCard>
      </AnimatedSection>

      <WOOPExplainerModal
        visible={showExplainer}
        onClose={() => setShowExplainer(false)}
      />
    </>
  );
}

export default WOOPSection;
