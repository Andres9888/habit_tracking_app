import { lazy } from 'react';

export const CalendarAndDetailModals = lazy(() =>
  import('./CalendarAndDetailModals').then((module_) => ({
    default: module_.CalendarAndDetailModals,
  }))
);
export const HapticTestModalSection = lazy(() =>
  import('./HapticTestModalSection').then((module_) => ({
    default: module_.HapticTestModalSection,
  }))
);
export const SettingsModalSection = lazy(() =>
  import('./SettingsModalSection').then((module_) => ({
    default: module_.SettingsModalSection,
  }))
);
export const ShareAndPauseModals = lazy(() =>
  import('./ShareAndPauseModals').then((module_) => ({
    default: module_.ShareAndPauseModals,
  }))
);
export const TemplatesModalSection = lazy(() =>
  import('./TemplatesModalSection').then((module_) => ({
    default: module_.TemplatesModalSection,
  }))
);
export const VisualizationModalSection = lazy(() =>
  import('./VisualizationModalSection').then((module_) => ({
    default: module_.VisualizationModalSection,
  }))
);
