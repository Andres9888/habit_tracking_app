/**
 * Scenario S14: Browse and apply a habit template.
 *
 * PASS when the templates library renders its struggle prompt and a popular
 * template, and tapping "Add <template>" applies it via templates:importTemplate.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import TemplatesScreen from '../../src/screens/TemplatesScreen';
import {
  getMutation,
  makeTemplate,
  renderScreen,
  resetConvex,
  seedCommonQueries,
  setQuery,
} from './harness';

describe('S14 Templates browse & apply', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries();
    setQuery('templates:list', [
      makeTemplate('t1', 'Drink Water', 'health'),
      makeTemplate('t2', 'Read', 'learning'),
    ]);
    setQuery('templates:getImportedTemplateIds', []);
    getMutation('templates:importTemplate');
  });

  it('lists templates and imports one on tap', async () => {
    renderScreen(<TemplatesScreen />);
    expect(await screen.findByText('What do you want to change?')).toBeTruthy();
    expect(screen.getByText('Drink Water')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Add Drink Water habit'));
    await waitFor(() =>
      expect(getMutation('templates:importTemplate')).toHaveBeenCalled()
    );
  });
});
