import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useTemplateAutoImport } from '../useTemplateAutoImport';

const mockImportTemplate = jest.fn();

jest.mock('convex/react', () => ({
  useMutation: () => mockImportTemplate,
}));

describe('useTemplateAutoImport', () => {
  beforeEach(() => {
    mockImportTemplate.mockReset();
  });

  it('imports every picked template and reports zero failures', async () => {
    mockImportTemplate.mockResolvedValue({});
    const { result } = renderHook(() => useTemplateAutoImport(['a', 'b']));

    await waitFor(() => expect(mockImportTemplate).toHaveBeenCalledTimes(2));
    expect(result.current.failedCount).toBe(0);
  });

  it('surfaces failed imports instead of swallowing them', async () => {
    mockImportTemplate
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('network'));
    const { result } = renderHook(() => useTemplateAutoImport(['a', 'b']));

    await waitFor(() => expect(result.current.failedCount).toBe(1));
  });

  it('retry re-imports only the failed templates and clears on success', async () => {
    mockImportTemplate
      .mockResolvedValueOnce({}) // a succeeds
      .mockRejectedValueOnce(new Error('network')) // b fails
      .mockResolvedValueOnce({}); // retry of b succeeds
    const { result } = renderHook(() => useTemplateAutoImport(['a', 'b']));

    await waitFor(() => expect(result.current.failedCount).toBe(1));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.failedCount).toBe(0));
    expect(mockImportTemplate).toHaveBeenCalledTimes(3);
    expect(mockImportTemplate).toHaveBeenLastCalledWith({ templateId: 'b' });
  });

  it('does not import when nothing was picked', () => {
    renderHook(() => useTemplateAutoImport([]));
    expect(mockImportTemplate).not.toHaveBeenCalled();
  });
});
