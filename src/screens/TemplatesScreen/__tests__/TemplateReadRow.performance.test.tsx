import { render } from '@testing-library/react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { TemplateReadRow } from '../components/ExploreAllSection/TemplateReadRow';

const mockUseTemplateReadRow = jest.fn(() => ({
  chevronAnimatedStyle: {},
  contentAnimatedStyle: {},
  expanded: false,
  handleContentLayout: jest.fn(),
  toggle: jest.fn(),
}));

jest.mock('../components/ExploreAllSection/TemplateReadRow.hooks', () => ({
  useTemplateReadRow: () => mockUseTemplateReadRow(),
}));

jest.mock('../components/ExploreAllSection/TemplateReadRowDrawer', () => ({
  TemplateReadRowDrawer: () => null,
}));

jest.mock('../components/ExploreAllSection/TemplateReadRowHeader', () => ({
  TemplateReadRowHeader: () => null,
}));

jest.mock('../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({ colors: { card: '#fff' } }),
}));

const items = ['Read', 'Walk', 'Meditate'].map(
  (name, index) =>
    ({
      _id: `template-${index + 1}`,
      description: `${name} every day`,
      icon: '🎯',
      name,
    }) as unknown as Doc<'templates'>
);

describe('TemplateReadRow render isolation', () => {
  it('rerenders only the affected card when an import starts', () => {
    const onImport = jest.fn();
    const onPreview = jest.fn();

    function Rows({
      importingTemplateId,
    }: {
      importingTemplateId: string | null;
    }) {
      return (
        <>
          {items.map((item) => (
            <TemplateReadRow
              key={item._id}
              isImported={false}
              isImporting={importingTemplateId === item._id}
              item={item}
              onImport={onImport}
              onPreview={onPreview}
            />
          ))}
        </>
      );
    }

    const { rerender } = render(<Rows importingTemplateId={null} />);

    expect(mockUseTemplateReadRow).toHaveBeenCalledTimes(3);

    rerender(<Rows importingTemplateId={null} />);

    expect(mockUseTemplateReadRow).toHaveBeenCalledTimes(3);

    rerender(<Rows importingTemplateId='template-2' />);

    expect(mockUseTemplateReadRow).toHaveBeenCalledTimes(4);
  });
});
