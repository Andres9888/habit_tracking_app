/**
 * Event handlers for TemplatesScreen
 */

import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { SortOption } from '../templates/constants';
import type { TemplateCustomizations } from './TemplatesScreen.types';
import type { UseTemplateHandlersOptions } from './TemplatesScreen.handlers.types';

export function useTemplateHandlers(opts: UseTemplateHandlersOptions) {
  const {
    flatListRef,
    importTemplate,
    seedAdditionalTemplates,
    seedNewScienceTemplates,
    seedTemplates,
    setImportedTemplateIds,
    setImportingTemplateId,
    setIsSeeding,
    setPreviewTemplate,
    setResearchOnly,
    setSearchQuery,
    setSelectedCategory,
    setShowCustomizeModal,
    setShowFullsizePreview,
    setShowSortOptions,
    setShowToast,
    setSortOption,
    setToastMessage,
    setViewMode,
    setExpandedCategories,
  } = opts;

  const handleToggleCategory = useCallback(
    (categoryId: string) => {
      setExpandedCategories((prev) => {
        const n = new Set(prev);
        if (n.has(categoryId)) {
          n.delete(categoryId);
        } else {
          n.add(categoryId);
        }
        return n;
      });
    },
    [setExpandedCategories]
  );

  const handleBackToBrowse = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory('all');
    setViewMode('browse');
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [flatListRef, setSelectedCategory, setViewMode]);

  const handleTemplatePreview = useCallback(
    (t: Doc<'templates'>) => {
      setPreviewTemplate(t);
      setShowFullsizePreview(true);
    },
    [setPreviewTemplate, setShowFullsizePreview]
  );
  const handleCustomizeFromPreview = useCallback(
    (t: Doc<'templates'>) => {
      setPreviewTemplate(t);
      setShowCustomizeModal(true);
      setShowFullsizePreview(false);
    },
    [setPreviewTemplate, setShowCustomizeModal, setShowFullsizePreview]
  );

  const handleDirectImport = useCallback(
    async (templateId: Id<'templates'>) => {
      try {
        setImportingTemplateId(templateId);
        const result = await importTemplate({
          customizations: undefined,
          templateId,
        });
        if (result.success) {
          setImportedTemplateIds((p) => new Set(p).add(templateId));
          setShowToast(true);
          setToastMessage('Imported habit successfully');
          setTimeout(() => setShowFullsizePreview(false), 1000);
        }
      } catch (error) {
        console.error('Failed to import:', error);
        setShowToast(true);
        setToastMessage('Failed to import template. Please try again.');
      } finally {
        setImportingTemplateId(null);
      }
    },
    [
      importTemplate,
      setImportedTemplateIds,
      setImportingTemplateId,
      setShowFullsizePreview,
      setShowToast,
      setToastMessage,
    ]
  );

  const handleTemplateImport = useCallback(
    async (
      templateId: Id<'templates'>,
      customizations?: TemplateCustomizations
    ) => {
      try {
        setImportingTemplateId(templateId);
        const result = await importTemplate({ customizations, templateId });
        if (result.success) {
          setImportedTemplateIds((p) => new Set(p).add(templateId));
          setShowToast(true);
          setToastMessage('Imported habit successfully');
          setShowCustomizeModal(false);
        }
      } catch (error) {
        console.error('Failed to import:', error);
        setShowToast(true);
        setToastMessage('Failed to import template. Please try again.');
      } finally {
        setImportingTemplateId(null);
      }
    },
    [
      importTemplate,
      setImportedTemplateIds,
      setImportingTemplateId,
      setShowCustomizeModal,
      setShowToast,
      setToastMessage,
    ]
  );

  const handleSelectSortOption = useCallback(
    (option: SortOption) => {
      setSortOption(option);
      setShowSortOptions(false);
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    },
    [flatListRef, setShowSortOptions, setSortOption]
  );

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setResearchOnly(false);
    setSortOption('popular');
    setViewMode('browse');
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [
    flatListRef,
    setResearchOnly,
    setSearchQuery,
    setSelectedCategory,
    setSortOption,
    setViewMode,
  ]);

  const handleSeedTemplates = useCallback(async () => {
    setIsSeeding(true);
    try {
      await seedTemplates({});
      await seedAdditionalTemplates({});
      await seedNewScienceTemplates({});
      setToastMessage('Templates loaded successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Error seeding:', error);
      setToastMessage('Failed to load templates.');
      setShowToast(true);
    } finally {
      setIsSeeding(false);
    }
  }, [
    seedAdditionalTemplates,
    seedNewScienceTemplates,
    seedTemplates,
    setIsSeeding,
    setShowToast,
    setToastMessage,
  ]);

  return {
    handleBackToBrowse,
    handleCustomizeFromPreview,
    handleDirectImport,
    handleResetFilters,
    handleSeedTemplates,
    handleSelectSortOption,
    handleTemplateImport,
    handleTemplatePreview,
    handleToggleCategory,
  };
}
