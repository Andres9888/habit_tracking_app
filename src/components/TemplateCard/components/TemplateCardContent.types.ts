/**
 * TemplateCardContent Types
 */

export interface TemplateCardContentProps {
  category?: string;
  checkmarkStyle: any;
  description: string;
  frequency?: string;
  icon: string;
  iconColor: string;
  isImported: boolean;
  isImporting: boolean;
  isLocked: boolean;
  isPremium: boolean;
  name: string;
  onImportPress: (e: any) => void;
  onPreview?: () => void;
  popularityScore?: number;
  scientificLink?: string;
  scientificReference: string;
  showPreviewCTA: boolean;
  usageCount?: number;
  youtubeLink?: string;
}
