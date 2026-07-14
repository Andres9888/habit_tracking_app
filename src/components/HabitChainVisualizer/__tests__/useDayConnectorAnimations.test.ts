import { renderHook } from '@testing-library/react-native';
import {
  CONNECTOR_SHIMMER_CYCLES,
  useDayConnectorAnimations,
} from '../useDayConnectorAnimations';

describe('useDayConnectorAnimations', () => {
  it('limits decorative connector shimmer to two cycles', () => {
    const { result } = renderHook(() =>
      useDayConnectorAnimations({ visible: true, shimmerSpeed: 1000 })
    );

    expect(CONNECTOR_SHIMMER_CYCLES).toBe(2);
    expect(result.current.opacity.value).toBe(1);
  });

  it('keeps a hidden connector reset', () => {
    const { result } = renderHook(() =>
      useDayConnectorAnimations({ visible: false, shimmerSpeed: 1000 })
    );

    expect(result.current.opacity.value).toBe(0);
    expect(result.current.shimmerPosition.value).toBe(0);
  });
});
