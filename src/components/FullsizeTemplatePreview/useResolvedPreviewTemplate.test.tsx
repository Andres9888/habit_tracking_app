import { renderHook } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useResolvedPreviewTemplate } from '../useResolvedPreviewTemplate';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

const stub = {
  _id: 'templates:1',
  name: 'Sleep',
  scientificReference: 'Walker',
} as unknown as Doc<'templates'>;

const full = {
  ...stub,
  lead: 'why it works',
} as unknown as Doc<'templates'>;

describe('useResolvedPreviewTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the catalog stub until getById resolves', () => {
    (useQuery as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() =>
      useResolvedPreviewTemplate(stub, true)
    );

    expect(result.current).toBe(stub);
    expect(useQuery).toHaveBeenCalledWith(
      expect.anything(),
      { id: stub._id }
    );
  });

  it('prefers the full document once it matches the open stub', () => {
    (useQuery as jest.Mock).mockReturnValue(full);

    const { result } = renderHook(() =>
      useResolvedPreviewTemplate(stub, true)
    );

    expect(result.current).toBe(full);
  });

  it('skips getById while the preview is closed', () => {
    (useQuery as jest.Mock).mockReturnValue(undefined);

    renderHook(() => useResolvedPreviewTemplate(stub, false));

    expect(useQuery).toHaveBeenCalledWith(expect.anything(), 'skip');
  });
});
