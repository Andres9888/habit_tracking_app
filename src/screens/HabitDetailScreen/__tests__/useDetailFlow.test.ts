import { act, renderHook } from '@testing-library/react-native';
import { useDetailFlow } from '../useDetailFlow';
import { useDetailFlowActions } from '../useDetailFlowActions';

describe('useDetailFlow', () => {
  it('pushes History and Analytics and pops back to Detail', () => {
    const { result } = renderHook(() => useDetailFlow());
    expect(result.current.route).toBe('detail');

    act(() => result.current.go('history'));
    expect(result.current.route).toBe('history');
    expect(result.current.backLabel).toBe('Detail');

    act(() => result.current.go('day', { focusDate: '2026-08-12' }));
    expect(result.current.route).toBe('day');
    expect(result.current.params.focusDate).toBe('2026-08-12');
    expect(result.current.backLabel).toBe('History');

    act(() => result.current.back());
    expect(result.current.route).toBe('history');

    act(() => result.current.back());
    expect(result.current.route).toBe('detail');
  });

  it('replaces params instead of merging them', () => {
    const { result } = renderHook(() => useDetailFlow());
    act(() => result.current.go('day', { focusDate: '2026-08-12' }));
    act(() => result.current.go('analytics'));
    expect(result.current.params).toEqual({});
  });

  it('resets to Detail', () => {
    const { result } = renderHook(() => useDetailFlow());
    act(() => result.current.go('analytics', { insightId: 'working' }));
    act(() => result.current.reset());
    expect(result.current.route).toBe('detail');
    expect(result.current.params).toEqual({});
  });

  it('steps between days without stacking one Entry screen per date', () => {
    const { result } = renderHook(() => {
      const flow = useDetailFlow();
      return {
        ...flow,
        actions: useDetailFlowActions(flow.go, flow.replace, flow.route),
      };
    });

    act(() => result.current.actions.openHistory());
    act(() => result.current.actions.openDay('2026-08-12'));
    act(() => result.current.actions.openDay('2026-08-11'));

    expect(result.current.params.focusDate).toBe('2026-08-11');
    expect(result.current.backLabel).toBe('History');
    act(() => result.current.back());
    expect(result.current.route).toBe('history');
  });
});
