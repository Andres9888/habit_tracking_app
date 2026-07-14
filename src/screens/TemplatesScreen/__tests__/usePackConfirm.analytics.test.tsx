import { useState } from 'react';
import { act, renderHook } from '@testing-library/react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { PremiumPack } from '../data/premiumPacks';
import { usePackConfirm } from '../hooks/usePackConfirm';

const firstId = 'template-pack-first' as Id<'templates'>;
const secondId = 'template-pack-second' as Id<'templates'>;
const pack: PremiumPack = {
  backgroundGradient: ['#000000', '#ffffff'],
  description: 'Test pack',
  emojiGroup: ['✓'],
  habits: [
    { emoji: '1', frequency: 'Daily', name: 'First habit' },
    { emoji: '2', frequency: 'Daily', name: 'Second habit' },
  ],
  id: 'test-pack',
  name: 'Test pack',
};

describe('usePackConfirm conversion attribution', () => {
  it('attributes pack imports and counts only newly created habits', async () => {
    const importTemplate = jest.fn(async ({ templateId }) => ({
      alreadyExists: templateId === secondId,
      success: true,
    }));
    const onComplete = jest.fn();
    const { result } = renderHook(() => {
      const [importedIds, setImportedIds] = useState<Set<string>>(new Set());
      const confirmation = usePackConfirm({
        allTemplates: [
          { _id: firstId, name: 'First habit' },
          { _id: secondId, name: 'Second habit' },
        ],
        importTemplate,
        onComplete,
        setImportedIds,
      });
      return { ...confirmation, importedIds };
    });

    act(() => result.current.handlePackPress(pack));
    await act(async () => result.current.handleConfirm());

    expect(importTemplate).toHaveBeenNthCalledWith(1, {
      source: 'pack',
      templateId: firstId,
    });
    expect(importTemplate).toHaveBeenNthCalledWith(2, {
      source: 'pack',
      templateId: secondId,
    });
    expect(result.current.importedIds).toEqual(new Set([firstId, secondId]));
    expect(onComplete).toHaveBeenCalledWith(1);
  });
});
