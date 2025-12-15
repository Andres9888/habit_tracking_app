import fs from 'fs';
import path from 'path';

const TEMPLATE_FILE_PATH = path.join(process.cwd(), 'convex', 'templates.ts');

const extractBlockBetween = (
  fileContent: string,
  startMarker: string,
  endMarker: string
): string => {
  const startIndex = fileContent.indexOf(startMarker);
  const endIndex = fileContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(
      `Unable to locate block between markers: ${startMarker} -> ${endMarker}`
    );
  }

  return fileContent.slice(startIndex, endIndex);
};

const collectNameFields = (block: string): string[] => {
  const names: string[] = [];

  const singleQuoteRegex = /\bname:\s*'([^']+)'/g;
  const doubleQuoteRegex = /\bname:\s*"([^"]+)"/g;

  let match: RegExpExecArray | null;

  while ((match = singleQuoteRegex.exec(block)) !== null) {
    names.push(match[1]);
  }

  while ((match = doubleQuoteRegex.exec(block)) !== null) {
    names.push(match[1]);
  }

  return names;
};

describe('template seeds', () => {
  it('seedNewScienceTemplates has unique template names (case/whitespace-insensitive)', () => {
    const content = fs.readFileSync(TEMPLATE_FILE_PATH, 'utf8');
    const seedBlock = extractBlockBetween(
      content,
      'export const seedNewScienceTemplates',
      'export const getTemplateCount'
    );

    const names = collectNameFields(seedBlock);
    const normalized = names.map((name) => name.trim().toLowerCase());

    const counts = new Map<string, number>();
    for (const key of normalized) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const duplicates = Array.from(counts.entries()).filter(
      ([, count]) => count > 1
    );

    expect(duplicates).toEqual([]);
  });
});



