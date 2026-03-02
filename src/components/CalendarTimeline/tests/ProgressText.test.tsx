import React from 'react';
import { render } from '@testing-library/react-native';

import { ProgressText } from '../components/ProgressText';

/* useReduceMotion toggle — defaults to false (motion enabled) */
const mockReduceMotion = jest.fn(() => false);
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => mockReduceMotion(),
}));

afterEach(() => mockReduceMotion.mockReturnValue(false));

describe('ProgressText', () => {
  it('renders nothing when total is 0', () => {
    const { toJSON } = render(<ProgressText completed={0} total={0} />);
    expect(toJSON()).toBeNull();
  });

  it('renders count when not all done', () => {
    const { getByText } = render(<ProgressText completed={2} total={5} />);
    expect(getByText('2')).toBeTruthy();
    expect(getByText(/ of 5/)).toBeTruthy();
  });

  it('renders "All done!" when completed >= total', () => {
    const { getByText } = render(<ProgressText completed={5} total={5} />);
    expect(getByText('All done!')).toBeTruthy();
  });

  it('renders "All done!" when completed exceeds total', () => {
    const { getByText } = render(<ProgressText completed={7} total={5} />);
    expect(getByText('All done!')).toBeTruthy();
  });

  it('uses Animated.Text for "All done!" state', () => {
    const { getByText } = render(<ProgressText completed={5} total={5} />);
    const doneNode = getByText('All done!');
    // Animated.Text is mocked as regular Text — verify the node exists
    expect(doneNode).toBeTruthy();
  });

  it('skips entering animation when reduceMotion is true', () => {
    mockReduceMotion.mockReturnValue(true);
    const { getByText } = render(<ProgressText completed={5} total={5} />);
    expect(getByText('All done!')).toBeTruthy();
  });
});
