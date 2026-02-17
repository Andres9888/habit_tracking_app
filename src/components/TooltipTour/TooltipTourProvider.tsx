/**
 * TooltipTour Provider
 * 
 * React Context provider that manages the onboarding tooltip tour state.
 * Coordinates showing tooltips one at a time, tracking progress, and
 * persisting completion to AsyncStorage.
 */

import React, { createContext, useContext, useState, useCallback, type PropsWithChildren } from 'react';
import type { TooltipStep, TooltipTourState, TooltipTourContextValue } from './types';
import { hasCompletedTour, markTooltipSeen, markTourCompleted } from './storage';

const TooltipTourContext = createContext<TooltipTourContextValue | null>(null);

const initialState: TooltipTourState = {
  currentStepIndex: null,
  steps: [],
  isVisible: false,
};

export function TooltipTourProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<TooltipTourState>(initialState);

  /**
   * Start the tooltip tour with provided steps
   */
  const startTour = useCallback((steps: TooltipStep[]) => {
    if (steps.length === 0) return;

    setState({
      currentStepIndex: 0,
      steps,
      isVisible: true,
    });
  }, []);

  /**
   * Advance to next step or complete tour
   */
  const nextStep = useCallback(async () => {
    if (state.currentStepIndex === null) return;

    // Mark current tooltip as seen
    const currentStep = state.steps[state.currentStepIndex];
    if (currentStep) {
      await markTooltipSeen(currentStep.id);
    }

    const nextIndex = state.currentStepIndex + 1;

    if (nextIndex >= state.steps.length) {
      // Tour complete
      await markTourCompleted();
      setState(initialState);
    } else {
      // Show next tooltip
      setState(prev => ({
        ...prev,
        currentStepIndex: nextIndex,
      }));
    }
  }, [state.currentStepIndex, state.steps]);

  /**
   * Dismiss entire tour immediately
   */
  const dismissTour = useCallback(async () => {
    // Mark all remaining tooltips as seen
    if (state.currentStepIndex !== null) {
      const remainingSteps = state.steps.slice(state.currentStepIndex);
      await Promise.all(remainingSteps.map(step => markTooltipSeen(step.id)));
    }
    
    await markTourCompleted();
    setState(initialState);
  }, [state.currentStepIndex, state.steps]);

  /**
   * Check if user has already seen the tour
   */
  const hasSeenTour = useCallback(async () => {
    return await hasCompletedTour();
  }, []);

  const value: TooltipTourContextValue = {
    state,
    startTour,
    nextStep,
    dismissTour,
    hasSeenTour,
  };

  return (
    <TooltipTourContext.Provider value={value}>
      {children}
    </TooltipTourContext.Provider>
  );
}

/**
 * Hook to access tooltip tour context
 */
export function useTooltipTour(): TooltipTourContextValue {
  const context = useContext(TooltipTourContext);
  if (!context) {
    throw new Error('useTooltipTour must be used within TooltipTourProvider');
  }
  return context;
}
