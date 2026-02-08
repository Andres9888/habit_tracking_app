/**
 * BrowseCategoriesTab - Stable callback reference tests
 *
 * Verifies that:
 * - Inline arrow functions are replaced with stable useCallback references
 * - onImport uses a useCallback wrapper instead of inline closure
 * - onToggle passes handleToggleCategory directly (no inline wrapper)
 * - CollapsibleCategorySection onToggle type accepts categoryId
 */

import * as fs from 'fs';
import * as path from 'path';

const COMPONENT_PATH = path.resolve(__dirname, '../BrowseCategoriesTab.tsx');
const CCS_TYPES_PATH = path.resolve(
  __dirname,
  '../../../../components/CollapsibleCategorySection/types.ts'
);
const CCS_ANIMATIONS_PATH = path.resolve(
  __dirname,
  '../../../../components/CollapsibleCategorySection/useHeaderAnimations.ts'
);

let componentSource: string;
let ccsTypesSource: string;
let ccsAnimationsSource: string;

beforeAll(() => {
  componentSource = fs.readFileSync(COMPONENT_PATH, 'utf-8');
  ccsTypesSource = fs.readFileSync(CCS_TYPES_PATH, 'utf-8');
  ccsAnimationsSource = fs.readFileSync(CCS_ANIMATIONS_PATH, 'utf-8');
});

describe('BrowseCategoriesTab - stable callback references', () => {
  it('should import useCallback from react', () => {
    expect(componentSource).toMatch(/import.*useCallback.*from 'react'/);
  });

  it('should define handleImport with useCallback', () => {
    expect(componentSource).toMatch(
      /const handleImport = useCallback\(/
    );
  });

  it('should NOT use inline arrow for onImport in JSX', () => {
    expect(componentSource).not.toMatch(/onImport=\{.*=>/);
  });

  it('should pass handleImport as onImport prop', () => {
    expect(componentSource).toContain('onImport={handleImport}');
  });

  it('should NOT use inline arrow for onToggle in JSX', () => {
    expect(componentSource).not.toMatch(/onToggle=\{.*=>/);
  });

  it('should pass handleToggleCategory directly as onToggle', () => {
    expect(componentSource).toContain('onToggle={handleToggleCategory}');
  });
});

describe('CollapsibleCategorySection - onToggle type update', () => {
  it('should type onToggle to accept categoryId parameter', () => {
    expect(ccsTypesSource).toMatch(/onToggle:\s*\(categoryId:\s*string\)\s*=>\s*void/);
  });

  it('should pass categoryId in useHeaderAnimations params interface', () => {
    expect(ccsAnimationsSource).toContain('categoryId: string');
  });

  it('should call onToggle with categoryId in handleHeaderPress', () => {
    expect(ccsAnimationsSource).toContain('onToggle(categoryId)');
  });
});
