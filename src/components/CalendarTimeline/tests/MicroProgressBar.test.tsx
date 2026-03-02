import React from 'react';
import { render } from '@testing-library/react-native';

import { MicroProgressBar } from '../components/MicroProgressBar';

const mockReduceMotion = jest.fn(() => false);
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => mockReduceMotion(),
}));

afterEach(() => mockReduceMotion.mockReturnValue(false));

describe('MicroProgressBar', () => {
  it('renders nothing when total is 0', () => {
    const { toJSON } = render(<MicroProgressBar completed={0} total={0} />);
    expect(toJSON()).toBeNull();
  });

  it('renders a progress bar when total > 0', () => {
    const { getByLabelText } = render(
      <MicroProgressBar completed={2} total={5} />
    );
    expect(getByLabelText('2 of 5 completed')).toBeTruthy();
  });

  it('updates accessibility label with count', () => {
    const { getByLabelText } = render(
      <MicroProgressBar completed={3} total={7} />
    );
    expect(getByLabelText('3 of 7 completed')).toBeTruthy();
  });

  it('renders when all completed', () => {
    const { getByLabelText } = render(
      <MicroProgressBar completed={5} total={5} />
    );
    expect(getByLabelText('5 of 5 completed')).toBeTruthy();
  });

  it('renders when completed exceeds total', () => {
    const { getByLabelText } = render(
      <MicroProgressBar completed={8} total={5} />
    );
    expect(getByLabelText('8 of 5 completed')).toBeTruthy();
  });

  it('renders correctly with reduceMotion enabled', () => {
    mockReduceMotion.mockReturnValue(true);
    const { getByLabelText } = render(
      <MicroProgressBar completed={3} total={5} />
    );
    expect(getByLabelText('3 of 5 completed')).toBeTruthy();
  });
});
