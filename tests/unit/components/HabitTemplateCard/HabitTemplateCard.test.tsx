import { fireEvent, render } from '@testing-library/react-native';
import { HabitTemplateCard } from '../../../../src/screens/TemplatesScreen/components/HabitTemplateCard';

const template = {
  _id: 't1',
  category: 'mindfulness',
  description: 'Calm your nervous system',
  estimatedMinutes: 10,
  frequency: 'daily',
  icon: '🧘',
  iconColor: '#059669',
  name: '13-Minute Focus Meditation',
} as never;

describe('HabitTemplateCard View details', () => {
  it('opens details at the top', () => {
    const onPreview = jest.fn();
    const { getByLabelText } = render(
      <HabitTemplateCard
        isImported={false}
        isImporting={false}
        item={template}
        onImport={jest.fn()}
        onPreview={onPreview}
      />
    );
    fireEvent.press(
      getByLabelText('View details for 13-Minute Focus Meditation')
    );
    expect(onPreview).toHaveBeenCalledWith(template);
  });

  it('opens preview on card body press', () => {
    const onPreview = jest.fn();
    const { getByLabelText } = render(
      <HabitTemplateCard
        isImported={false}
        isImporting={false}
        item={template}
        onImport={jest.fn()}
        onPreview={onPreview}
      />
    );
    fireEvent.press(getByLabelText('13-Minute Focus Meditation habit'));
    expect(onPreview).toHaveBeenCalledWith(template);
  });
});
