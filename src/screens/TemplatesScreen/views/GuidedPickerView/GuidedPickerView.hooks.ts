import { useMemo, useState } from 'react';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { rankTemplatesForUser } from '../../utils/recommendation';
import type { StylePreference, TimeBucket } from '../../utils/recommendation';

export function useGuidedPicker(allTemplates: Doc<'templates'>[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeBucket, setTimeBucket] = useState<TimeBucket | undefined>();
  const [stylePreference, setStylePreference] = useState<StylePreference | undefined>();

  const results = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    return rankTemplatesForUser(allTemplates, {
      selectedCategories,
      timeBucket: timeBucket ?? 'any',
      stylePreference: stylePreference ?? 'either',
      limit: 3,
    });
  }, [allTemplates, selectedCategories, timeBucket, stylePreference]);

  const hasResults = results.length > 0;
  const isRefined = timeBucket !== undefined || stylePreference !== undefined;

  return {
    currentStep,
    hasResults,
    isRefined,
    results,
    selectedCategories,
    setCurrentStep,
    setSelectedCategories,
    setStylePreference,
    setTimeBucket,
    stylePreference,
    timeBucket,
  };
}
