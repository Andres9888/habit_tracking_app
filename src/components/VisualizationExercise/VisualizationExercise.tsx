/**
 * VisualizationExercise Component
 * Interactive exercise based on Andrew Huberman's visualization techniques
 *
 * Key principles:
 * - Visualize positive outcomes (pull motivation)
 * - Visualize negative outcomes/consequences (push motivation - "fear setting")
 * - Mental contrasting creates productive tension that drives action
 *
 * References:
 * - Huberman Lab Podcast: Goal Setting & Neural Mechanisms
 * - Tim Ferriss "Fear Setting" (influenced by Stoic premeditatio malorum)
 * - Gabriele Oettingen's WOOP method (mental contrasting)
 */

import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import {
  StepIndicator,
  IntroStep,
  PositiveStep,
  NegativeStep,
  SummaryStep,
} from './components';
import type {
  VisualizationStep,
  VisualizationData,
  VisualizationExerciseProps,
} from './types';

const STEP_NUMBERS: Record<VisualizationStep, number> = {
  intro: 1,
  negative: 3,
  positive: 2,
  summary: 4,
};

/**
 * Main VisualizationExercise Component
 * Orchestrates the multi-step visualization flow
 */
export function VisualizationExercise({
  habitName,
  onClose,
  onSave,
}: VisualizationExerciseProps) {
  const [step, setStep] = useState<VisualizationStep>('intro');
  const [positiveVisualization, setPositiveVisualization] = useState('');
  const [negativeVisualization, setNegativeVisualization] = useState('');

  const handleSave = () => {
    const data: VisualizationData = {
      habitName,
      negativeVisualization,
      positiveVisualization,
      timestamp: Date.now(),
    };
    onSave?.(data);
    onClose?.();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1'
    >
      <View className='flex-1 gap-6'>
        <StepIndicator currentStep={STEP_NUMBERS[step]} totalSteps={4} />

        {step === 'intro' ? <IntroStep habitName={habitName} onNext={() => setStep('positive')} /> : null}

        {step === 'positive' ? <PositiveStep
            value={positiveVisualization}
            onBack={() => setStep('intro')}
            onNext={() => setStep('negative')}
            onValueChange={setPositiveVisualization}
          /> : null}

        {step === 'negative' ? <NegativeStep
            value={negativeVisualization}
            onBack={() => setStep('positive')}
            onNext={() => setStep('summary')}
            onValueChange={setNegativeVisualization}
          /> : null}

        {step === 'summary' ? <SummaryStep
            habitName={habitName}
            negativeVisualization={negativeVisualization}
            positiveVisualization={positiveVisualization}
            onBack={() => setStep('negative')}
            onSave={handleSave}
          /> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

export default VisualizationExercise;
