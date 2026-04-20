import { useEffect } from 'react';

import { StepStub } from '../components/StepStub';
import type { StepProps } from '../QuestionnaireFlow.types';

export function ProcessingStep(props: StepProps) {
  const { onNext } = props;
  useEffect(() => {
    const timeoutId = setTimeout(onNext, 1500);
    return () => clearTimeout(timeoutId);
  }, [onNext]);
  return <StepStub {...props} ctaLabel='Skip' title='Building your plan…' />;
}
