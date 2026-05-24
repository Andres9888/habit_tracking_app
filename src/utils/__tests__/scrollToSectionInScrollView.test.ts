import { scrollToSectionInScrollView } from '../scrollToSectionInScrollView';

jest.mock('react-native', () => ({
  findNodeHandle: jest.fn(() => 1),
}));

jest.useFakeTimers();

describe('scrollToSectionInScrollView', () => {
  it('scrolls to measured section offset after layout delay', () => {
    const scrollTo = jest.fn();
    const scrollViewRef = { current: { scrollTo } };
    const contentRef = { current: { __nativeTag: 1 } };
    const sectionRef = {
      current: {
        measureLayout: (
          _handle: number,
          onSuccess: (x: number, y: number) => void
        ) => onSuccess(0, 120),
      },
    };

    scrollToSectionInScrollView(
      scrollViewRef as never,
      contentRef as never,
      sectionRef as never
    );

    jest.advanceTimersByTime(250);

    expect(scrollTo).toHaveBeenCalledWith({
      y: 112,
      animated: true,
    });
  });

  it('does nothing when refs are missing', () => {
    const scrollTo = jest.fn();
    const scrollViewRef = { current: { scrollTo } };

    scrollToSectionInScrollView(
      scrollViewRef as never,
      { current: null },
      { current: null }
    );

    jest.advanceTimersByTime(250);

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
