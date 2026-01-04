/**
 * CompletionBadge Component Snapshot Tests
 * Ensures visual consistency across badge types
 */

import React from 'react';
import renderer from 'react-test-renderer';
import { CompletionBadge } from '../CompletionBadge';

describe('CompletionBadge Snapshots', () => {
  it('matches snapshot for required badge', () => {
    const tree = renderer.create(<CompletionBadge type="required" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot for optional badge', () => {
    const tree = renderer.create(<CompletionBadge type="optional" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot for complete badge', () => {
    const tree = renderer.create(<CompletionBadge type="complete" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with custom accessibility label', () => {
    const tree = renderer
      .create(
        <CompletionBadge
          type="required"
          accessibilityLabel="Custom label for screen reader"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
