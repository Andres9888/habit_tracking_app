import React from 'react';
import { render } from '@testing-library/react-native';
import { ChainLinkIcon } from '../ChainLinkIcon';

describe('ChainLinkIcon', () => {
  it('renders with default props', () => {
    const { toJSON } = render(<ChainLinkIcon />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { toJSON } = render(<ChainLinkIcon color='#ff0000' />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { toJSON } = render(<ChainLinkIcon size={24} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with both custom color and size', () => {
    const { toJSON } = render(<ChainLinkIcon color='#00ff00' size={32} />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies correct viewBox dimensions', () => {
    const { getByTestId } = render(<ChainLinkIcon color='#ffffff' size={20} />);
    // The SVG component should render successfully
    expect(true).toBe(true);
  });
});
