import { act, renderHook } from '@testing-library/react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { buildCatalogGroups } from '../hooks/buildCatalogGroups';
import { useImportedTemplateIdsSync } from '../hooks/useImportedTemplateIdsSync';

const templates = [
  {
    _id: 'available-high',
    category: 'health',
    description: 'Available habit',
    name: 'Available',
    popularityScore: 100,
  },
  {
    _id: 'already-imported',
    category: 'health',
    description: 'Previously added habit',
    name: 'Existing',
    popularityScore: 90,
  },
  {
    _id: 'available-low',
    category: 'health',
    description: 'Another available habit',
    name: 'Another',
    popularityScore: 80,
  },
] as unknown as Doc<'templates'>[];

function catalogOrder(importedIds: Set<string>) {
  return buildCatalogGroups(templates, '', importedIds).flatMap((group) =>
    group.templates.map((template) => template._id)
  );
}

describe('useImportedTemplateIdsSync', () => {
  it('keeps the entry ordering snapshot stable after a local import', () => {
    const initialImportedIds = new Set(['already-imported']);
    const { result } = renderHook(() =>
      useImportedTemplateIdsSync(initialImportedIds)
    );
    const orderBeforeImport = catalogOrder(
      result.current.catalogOrderImportedIds
    );
    act(() => {
      result.current.setImportedTemplateIds((current) =>
        new Set(current).add('available-high')
      );
    });

    expect(result.current.importedTemplateIds.has('available-high')).toBe(true);
    expect(result.current.catalogOrderImportedIds).toEqual(
      new Set(['already-imported'])
    );
    expect(catalogOrder(result.current.catalogOrderImportedIds)).toEqual(
      orderBeforeImport
    );
  });

  it('keeps a local import in place when the server query catches up', () => {
    const { result, rerender } = renderHook(
      ({ importedIds }: { importedIds: Set<string> | undefined }) =>
        useImportedTemplateIdsSync(importedIds),
      { initialProps: { importedIds: new Set<string>() } }
    );
    const orderBeforeImport = catalogOrder(
      result.current.catalogOrderImportedIds
    );
    const orderSnapshotBeforeImport = result.current.catalogOrderImportedIds;

    act(() => {
      result.current.setImportedTemplateIds((current) =>
        new Set(current).add('available-high')
      );
    });
    rerender({ importedIds: new Set(['available-high']) });

    expect(result.current.catalogOrderImportedIds).toEqual(new Set());
    expect(result.current.catalogOrderImportedIds).toBe(
      orderSnapshotBeforeImport
    );
    expect(result.current.importedTemplateIds).toEqual(
      new Set(['available-high'])
    );
    expect(catalogOrder(result.current.catalogOrderImportedIds)).toEqual(
      orderBeforeImport
    );
  });

  it('still accepts pre-existing imports after an empty cached response', () => {
    const { result, rerender } = renderHook(
      ({ importedIds }: { importedIds: Set<string> }) =>
        useImportedTemplateIdsSync(importedIds),
      { initialProps: { importedIds: new Set<string>() } }
    );

    rerender({ importedIds: new Set(['already-imported']) });

    expect(result.current.catalogOrderImportedIds).toEqual(
      new Set(['already-imported'])
    );
    expect(result.current.importedTemplateIds).toEqual(
      new Set(['already-imported'])
    );
  });
});
