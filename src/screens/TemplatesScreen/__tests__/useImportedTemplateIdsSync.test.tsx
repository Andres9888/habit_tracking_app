import { renderHook, waitFor } from '@testing-library/react-native';
import { useImportedTemplateIdsSync } from '../hooks/useImportedTemplateIdsSync';

describe('useImportedTemplateIdsSync', () => {
  it('seeds both sets synchronously when the first render has cached ids', () => {
    const { result } = renderHook(() =>
      useImportedTemplateIdsSync(new Set(['template-1']))
    );

    expect(result.current.isImportedStateReady).toBe(true);
    expect([...result.current.frozenImportedIds]).toEqual(['template-1']);
    expect([...result.current.importedTemplateIds]).toEqual(['template-1']);
  });

  it('waits for the first defined response before freezing imported ids', async () => {
    const { result, rerender } = renderHook(
      ({ ids }: { ids: Set<string> | undefined }) =>
        useImportedTemplateIdsSync(ids),
      { initialProps: { ids: undefined } }
    );

    expect(result.current.frozenImportedIds.size).toBe(0);
    expect(result.current.isImportedStateReady).toBe(false);

    rerender({ ids: new Set(['template-1']) });

    await waitFor(() => {
      expect(result.current.isImportedStateReady).toBe(true);
      expect([...result.current.frozenImportedIds]).toEqual(['template-1']);
      expect([...result.current.importedTemplateIds]).toEqual(['template-1']);
    });

    rerender({ ids: new Set(['template-1', 'template-2']) });

    expect([...result.current.frozenImportedIds]).toEqual(['template-1']);
  });
});
