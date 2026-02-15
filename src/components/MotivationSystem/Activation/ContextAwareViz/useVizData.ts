/**
 * useVizData - Hook to derive visualization data and type from props
 */

import type { MotivationLevel } from '../MotivationCheck';
import type { VisualizationData, VizType } from './types';
import { shouldShowFailureViz } from '../MotivationCheck';

interface UseVizDataProps {
  motivationLevel: MotivationLevel | undefined;
  visualization: VisualizationData | undefined;
  forceType?: 'success' | 'failure';
}

interface UseVizDataResult {
  vizType: VizType;
  isSuccess: boolean;
  body: string | undefined;
  mind: string | undefined;
  emotion: string | undefined;
}

export function useVizData({
  motivationLevel,
  visualization,
  forceType,
}: UseVizDataProps): UseVizDataResult {
  const showFailure = forceType
    ? forceType === 'failure'
    : shouldShowFailureViz(motivationLevel);
  const vizType: VizType = showFailure ? 'failure' : 'success';
  const isSuccess = vizType === 'success';

  const body = isSuccess
    ? visualization?.successBody
    : visualization?.failureBody;
  const mind = isSuccess
    ? visualization?.successMind
    : visualization?.failureMind;
  const emotion = isSuccess
    ? visualization?.successEmotion
    : visualization?.failureEmotion;

  return { body, emotion, isSuccess, mind, vizType };
}
