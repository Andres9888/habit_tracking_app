import { act, renderHook } from '@testing-library/react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { PremiumPack } from '../../data/premiumPacks';
import { usePackConfirm } from '../usePackConfirm';

const templateId = 'template-pack' as Id<'templates'>;
const habitId = 'habit-pack' as Id<'habits'>;
const pack: PremiumPack = {
  backgroundGradient: ['#000', '#111'],
  description: 'Test pack',
  emojiGroup: ['📦'],
  habits: [{ emoji: '📦', frequency: 'Daily', name: 'Pack habit' }],
  id: 'test-pack',
  name: 'Test pack',
};

it('records the exact habit target created by a pack import', async () => {
  const importTemplate = jest
    .fn()
    .mockResolvedValue({ habitId, success: true });
  const onImported = jest.fn();
  const onComplete = jest.fn();
  const setImportedIds = jest.fn();
  const { result } = renderHook(() =>
    usePackConfirm({
      allTemplates: [{ _id: templateId, name: 'Pack habit' }],
      importTemplate,
      onComplete,
      onImported,
      setImportedIds,
    })
  );

  act(() => result.current.handlePackPress(pack));
  await act(async () => result.current.handleConfirm());

  expect(onImported).toHaveBeenCalledWith(templateId, habitId);
  expect(onComplete).toHaveBeenCalledWith(1);
});
