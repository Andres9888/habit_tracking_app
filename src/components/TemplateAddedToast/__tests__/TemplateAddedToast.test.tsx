/**
 * The library post-add toast now renders the same confirmation panel as the
 * drill-down, so these tests pin the two things that made the old capsule a
 * different product: the membership headline and actions that name where they
 * go.
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TemplateAddedToast } from '../TemplateAddedToast';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const templateData = {
  color: '#1E8153',
  icon: '🏋️',
  name: 'Bone-Strengthening Exercise',
};

function renderToast(
  props: Partial<React.ComponentProps<typeof TemplateAddedToast>> = {}
) {
  return render(
    <TemplateAddedToast
      templateData={templateData}
      visible
      onAddAnother={jest.fn()}
      onViewHabit={jest.fn()}
      {...props}
    />
  );
}

describe('TemplateAddedToast', () => {
  it('renders nothing when hidden', () => {
    renderToast({ visible: false });
    expect(screen.queryByTestId('templates-toast')).toBeNull();
  });

  it('states membership and names both destinations', () => {
    renderToast();

    const container = screen.getByTestId('templates-toast-container');
    expect(container.props.pointerEvents).toBe('auto');
    expect(
      screen.getByText(`${templateData.name} is in your habits`)
    ).toBeTruthy();
    expect(
      screen.getByText("Complete it from Today when it's due.")
    ).toBeTruthy();
    expect(screen.getByText(`Go to ${templateData.name}`)).toBeTruthy();
    expect(screen.getByText('Keep exploring habits')).toBeTruthy();
  });

  it('counts the session once more than one habit has been added', () => {
    renderToast({ sessionImportCount: 3 });

    expect(
      screen.getByText(
        "That's 3 added today. Complete them from Today when they're due."
      )
    ).toBeTruthy();
  });

  it('says already for a duplicate rather than claiming a new add', () => {
    renderToast({ variant: 'already_exists' });

    expect(
      screen.getByText(`${templateData.name} is already in your habits`)
    ).toBeTruthy();
  });

  it('routes the primary to the habit and the secondary back to the library', () => {
    jest.useFakeTimers();
    const onViewHabit = jest.fn();
    const onAddAnother = jest.fn();
    renderToast({ onAddAnother, onViewHabit });

    fireEvent.press(screen.getByText(`Go to ${templateData.name}`));
    expect(onViewHabit).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(onViewHabit).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText('Keep exploring habits'));
    expect(onAddAnother).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('keeps a dismiss action when there is no habit to open', () => {
    renderToast({ onAddAnother: undefined, onViewHabit: undefined });

    expect(screen.getByText('Keep exploring habits')).toBeTruthy();
  });
});
