import { fireEvent, render } from '@testing-library/react-native';
import { WhyInline } from '../WhyInline';

describe('WhyInline', () => {
  it('renders the title, description and placeholder', () => {
    const { getByLabelText, getByText } = render(
      <WhyInline why='' onWhyChange={jest.fn()} />
    );

    expect(getByText('Your why')).toBeTruthy();
    expect(getByText('One line, shown above Complete today.')).toBeTruthy();
    expect(getByLabelText('Your why').props.placeholder).toBe(
      'Why this one matters to you'
    );
  });

  it('caps the input at 140 characters', () => {
    const { getByLabelText } = render(
      <WhyInline why='' onWhyChange={jest.fn()} />
    );

    expect(getByLabelText('Your why').props.maxLength).toBe(140);
  });

  it('shows Not set until a non-blank value is entered', () => {
    const { getByText, queryByText, rerender } = render(
      <WhyInline why='' onWhyChange={jest.fn()} />
    );
    expect(getByText('Not set')).toBeTruthy();

    rerender(<WhyInline why='   ' onWhyChange={jest.fn()} />);
    expect(getByText('Not set')).toBeTruthy();
    expect(queryByText('Set')).toBeNull();

    rerender(
      <WhyInline why='To wake up clear-headed' onWhyChange={jest.fn()} />
    );
    expect(getByText('Set')).toBeTruthy();
  });

  it('counts characters against the cap', () => {
    const { getByText, rerender } = render(
      <WhyInline why='' onWhyChange={jest.fn()} />
    );
    expect(getByText('0/140')).toBeTruthy();

    rerender(<WhyInline why='abcde' onWhyChange={jest.fn()} />);
    expect(getByText('5/140')).toBeTruthy();
  });

  it('reports every edit', () => {
    const onWhyChange = jest.fn();
    const { getByLabelText } = render(
      <WhyInline why='' onWhyChange={onWhyChange} />
    );

    fireEvent.changeText(getByLabelText('Your why'), 'Because it matters');

    expect(onWhyChange).toHaveBeenCalledWith('Because it matters');
  });
});
