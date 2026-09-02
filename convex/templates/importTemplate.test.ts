import type { Id } from '../_generated/dataModel';
import { importTemplate } from './importTemplate';

type TemplateId = Id<'templates'>;

function getHandler() {
  return (
    importTemplate as unknown as {
      _handler: (
        ctx: ReturnType<typeof createCtx>,
        args: { templateId: TemplateId }
      ) => Promise<{ habitId: Id<'habits'>; success: true }>;
    }
  )._handler;
}

function createCtx(templateOverrides: Record<string, unknown> = {}) {
  const inserted: Array<{
    record: Record<string, unknown>;
    table: string;
  }> = [];
  const templateId = 'template_1' as TemplateId;
  const template = {
    _id: templateId,
    category: 'creativity',
    createdAt: 1,
    description:
      'Writing regularly creates room to think clearly and explore new ideas.',
    frequency: 'daily',
    icon: '✍️',
    iconColor: '#7C3AED',
    name: 'Creative Writing',
    scientificReference: 'Test reference',
    tagline: 'Make room for ideas worth keeping.',
    ...templateOverrides,
  };

  const db = {
    get: jest.fn(async (id: string) => (id === templateId ? template : null)),
    insert: jest.fn(async (table: string, record: Record<string, unknown>) => {
      inserted.push({ record, table });
      return table === 'habits' ? 'habit_1' : 'usage_1';
    }),
    query: jest.fn(() => ({
      withIndex: jest.fn(() => ({
        collect: jest.fn(async () => []),
        first: jest.fn(async () => null),
      })),
    })),
  };

  return {
    auth: {
      getUserIdentity: jest.fn(async () => ({ subject: 'user_1' })),
    },
    db,
    inserted,
    templateId,
  };
}

describe('template import motivation', () => {
  it('imports the template tagline as the habit why', async () => {
    const ctx = createCtx();

    await expect(
      getHandler()(ctx, { templateId: ctx.templateId })
    ).resolves.toEqual({ habitId: 'habit_1', success: true });

    expect(ctx.inserted).toContainEqual({
      table: 'habits',
      record: expect.objectContaining({
        name: 'Creative Writing',
        why: 'Make room for ideas worth keeping.',
      }),
    });
  });

  it('falls back to the template description when no short why is authored', async () => {
    const ctx = createCtx({ suggestedWhy: '   ', tagline: undefined });

    await getHandler()(ctx, { templateId: ctx.templateId });

    expect(ctx.inserted).toContainEqual({
      table: 'habits',
      record: expect.objectContaining({
        why: 'Writing regularly creates room to think clearly and explore new ideas.',
      }),
    });
  });

  it('keeps imported fallback copy within the 140-character why contract', async () => {
    const ctx = createCtx({
      description: 'A'.repeat(160),
      suggestedWhy: undefined,
      tagline: undefined,
    });

    await getHandler()(ctx, { templateId: ctx.templateId });

    const habit = ctx.inserted.find(({ table }) => table === 'habits');
    expect(habit?.record.why).toBe(`${'A'.repeat(139)}…`);
  });
});
