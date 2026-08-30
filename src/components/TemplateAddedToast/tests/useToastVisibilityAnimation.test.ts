import { renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import { useToastVisibilityAnimation } from '../useToastVisibilityAnimation';

function shared(value: number) {
  return { value } as Reanimated.SharedValue<number>;
}

describe('useToastVisibilityAnimation', () => {
  afterEach(() => jest.restoreAllMocks());

  it('settles the card within 220ms without delaying the check icon', () => {
    const withTiming = jest.spyOn(Reanimated, 'withTiming');
    const withDelay = jest.spyOn(Reanimated, 'withDelay');
    const values = {
      iconOpacity: shared(0),
      iconScale: shared(1),
      opacity: shared(0),
      scale: shared(1),
      translateY: shared(96),
    };

    renderHook(() =>
      useToastVisibilityAnimation({
        ...values,
        autoDismissEnabled: false,
        duration: 0,
        handleDismiss: jest.fn(),
        reduceMotion: false,
        triggerAlreadyExistsHaptic: jest.fn(),
        variant: 'success',
        visible: true,
      })
    );

    expect(withTiming).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ duration: 220 })
    );
    expect(withTiming).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ duration: 150 })
    );
    expect(withDelay).not.toHaveBeenCalled();
    expect(values.iconScale.value).toBe(1);
  });
});
