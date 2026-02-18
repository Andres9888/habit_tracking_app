/**
 * Onboarding page configuration data.
 */

import type React from 'react';
import { ChainVisualization } from './ChainVisualization';
import { StrengthMeter } from './StrengthMeter';
import { TemplateGrid } from './TemplateGrid';

export interface PageData {
  id: string;
  title: string;
  subtitle: string;
  Visual: (props: { reduceMotion: boolean }) => React.JSX.Element;
}

export const PAGES: PageData[] = [
  {
    id: 'chain',
    subtitle:
      'Complete your habits daily and watch your chain grow — every link counts.',
    title: "Don't Break the Chain",
    Visual: ChainVisualization,
  },
  {
    id: 'strength',
    subtitle:
      'Your habits get stronger over time — backed by behavioral science.',
    title: 'Science-Backed Strength',
    Visual: StrengthMeter,
  },
  {
    id: 'templates',
    subtitle:
      'Pick from science-backed templates or create your own in seconds.',
    title: '200+ Ready-Made Templates',
    Visual: TemplateGrid,
  },
];

export const ONBOARDING_KEY = '@chainday_onboarding_complete';
