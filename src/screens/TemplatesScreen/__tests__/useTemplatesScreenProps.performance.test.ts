import fs from 'node:fs';
import path from 'node:path';

const TEMPLATES_ROOT = path.resolve(__dirname, '..');

function readSource(relativePath: string) {
  return fs.readFileSync(path.join(TEMPLATES_ROOT, relativePath), 'utf8');
}

describe('Templates screen orchestration performance', () => {
  it('does not run legacy catalog derivations outside the active catalog view', () => {
    const source = readSource('hooks/useTemplatesScreenProps.ts');

    expect(source).not.toContain('useFilteredTemplates');
    expect(source).not.toContain('useScienceCountsByCategory');
    expect(source).not.toContain('useTemplatesByCategory');
    expect(source).not.toContain('useEntranceAnimations');
    expect(source).not.toContain('useTabIndicator');
  });

  it('does not mount obsolete browse state, timers, or handler hooks', () => {
    const dataSource = readSource('useTemplatesData.ts');
    const handlerSource = readSource('TemplatesScreen.handlers.ts');
    const stateSource = readSource('TemplatesScreen.hooks.ts');

    expect(dataSource).not.toContain('getCategoriesFromTemplates');
    expect(handlerSource).not.toContain('useNavigationHandlers');
    expect(handlerSource).not.toContain('useSortHandlers');
    expect(stateSource).not.toContain('debouncedSearchQuery');
    expect(stateSource).not.toContain('setTimeout');
    expect(stateSource).not.toContain('useExpandedCategories');
  });

  it('keeps search input urgent while deferring catalog derivation', () => {
    const source = readSource('views/CatalogView.tsx');

    expect(source).toContain('useDeferredValue(searchQuery)');
    expect(source).toContain('searchQuery: deferredSearchQuery');
    expect(source).toContain('value={searchQuery}');
  });

  it('uses one shared template sort instead of consecutive sorts', () => {
    const catalogSource = readSource('hooks/buildCatalogGroups.ts');
    const prescriptionSource = readSource('hooks/prescriptionResolver.ts');
    const sortSource = readSource('utils/sortTemplatesByImportState.ts');

    expect(catalogSource).not.toContain('[...templates].sort');
    expect(prescriptionSource).not.toContain('[...candidates].sort');
    expect(sortSource.match(/\.sort\(/g)).toHaveLength(1);
  });

  it('isolates import state to the affected row with stable callbacks', () => {
    const filteredListSource = readSource('views/CatalogFilteredList.tsx');
    const rowSource = readSource(
      'components/ExploreAllSection/TemplateReadRow.tsx'
    );
    const screenSource = readSource('TemplatesScreen.tsx');
    const sectionListSource = readSource('views/CatalogSectionList.tsx');

    expect(rowSource).toContain('memo(function TemplateReadRow');
    expect(rowSource).not.toContain('importedTemplateIds: Set');
    expect(rowSource).not.toContain('importingTemplateId: string | null');
    expect(filteredListSource).toContain(
      'isImported={p.importedTemplateIds.has(item._id)}'
    );
    expect(filteredListSource).toContain(
      'isImporting={p.importingTemplateIds.has(item._id)}'
    );
    expect(sectionListSource).toContain(
      'isImported={p.importedTemplateIds.has(item._id)}'
    );
    expect(sectionListSource).toContain(
      'isImporting={p.importingTemplateIds.has(item._id)}'
    );
    expect(screenSource).toContain(
      '[handlers.handleDirectImport, state.setPreviewTemplate]'
    );
    expect(screenSource).not.toContain('[handlers, state]');
  });

  it('keeps catalog ordering independent from live import feedback', () => {
    const catalogSource = readSource('views/CatalogView.tsx');
    const screenSource = readSource('TemplatesScreen.tsx');
    const syncSource = readSource('hooks/useImportedTemplateIdsSync.ts');

    expect(screenSource).toContain(
      'catalogOrderImportedIds={state.catalogOrderImportedIds}'
    );
    expect(catalogSource).toContain(
      'importedTemplateIds: p.catalogOrderImportedIds'
    );
    expect(catalogSource).toContain(
      'importedTemplateIds={p.importedTemplateIds}'
    );
    expect(syncSource).toContain('setCatalogOrderImportedIds');
  });
});
