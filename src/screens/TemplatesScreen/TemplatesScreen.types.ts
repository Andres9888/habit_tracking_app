/**
 * Type definitions for TemplatesScreen
 */

import type { Doc, Id } from '../../../convex/_generated/dataModel';

// View modes for the screen
export type ViewMode = 'browse' | 'category' | 'search';

// Tab options for main view
export type BrowseTab = 'categories' | 'all';

// Sort options type (re-exported from templates/constants for convenience)
export type { SortOption } from '../templates/constants';

// Template document type alias for convenience
export type TemplateDoc = Doc<'templates'>;
export type TemplateId = Id<'templates'>;

// Category document from Convex
export type CategoryDoc = {
  id: string;
  label: string;
  icon: string;
};

// Scroll metrics for shadow calculation
export interface ScrollMetrics {
  contentHeight: number;
  layoutHeight: number;
}

/** Scroll target when opening the fullsize habit preview. */
export type { TemplatePreviewAnchor } from '../../components/FullsizeTemplatePreview/FullsizeTemplatePreview.types';
import type { TemplatePreviewAnchor } from '../../components/FullsizeTemplatePreview/FullsizeTemplatePreview.types';

export type OnTemplatePreview = (
  template: Doc<'templates'>,
  anchor?: TemplatePreviewAnchor
) => void;

// Template import customizations
export interface TemplateCustomizations {
  daysOfWeek?: number[];
  icon?: string;
  iconColor?: string;
  name?: string;
  preferredTime?: string;
  reminderTime?: string;
}
