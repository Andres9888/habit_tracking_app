import type { Id } from '../_generated/dataModel';
import { backfillImportedHabitWhy, importTemplate } from './importTemplate';
import { deriveWhyFromBenefits } from './importedWhy';

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

function importedWhy(ctx: ReturnType<typeof createCtx>) {
  return ctx.inserted.find(({ table }) => table === 'habits')?.record.why;
}

function createBackfillCtx(
  why?: string,
  templateOverrides: Record<string, unknown> = {}
) {
  const habitId = 'habit_existing' as Id<'habits'>;
  const templateId = 'template_existing' as TemplateId;
  const habit = { _id: habitId, why };
  const template = {
    _id: templateId,
    description: 'Writing regularly creates room to think clearly.',
    suggestedWhy: undefined,
    tagline: 'Make room for ideas worth keeping.',
    ...templateOverrides,
  };
  const db = {
    get: jest.fn(async (id: string) => {
      if (id === habitId) return habit;
      if (id === templateId) return template;
      return null;
    }),
    patch: jest.fn(async () => undefined),
    query: jest.fn(() => ({
      collect: jest.fn(async () => [{ habitId, templateId }]),
    })),
  };
  return { db, habitId };
}

function getBackfillHandler() {
  return (
    backfillImportedHabitWhy as unknown as {
      _handler: (
        ctx: ReturnType<typeof createBackfillCtx>,
        args: Record<string, never>
      ) => Promise<{
        patchedCount: number;
        patchedHabitIds: string[];
        replacedCount: number;
        success: true;
      }>;
    }
  )._handler;
}

describe('deriveWhyFromBenefits', () => {
  it('joins up to three benefit titles into one reason sentence', () => {
    expect(
      deriveWhyFromBenefits([
        { title: 'Calmer mind' },
        { title: 'Sharper focus' },
        { title: 'Steadier mood' },
        { title: 'Better sleep' },
      ])
    ).toBe('Calmer mind, sharper focus and steadier mood.');
  });

  it('handles a single benefit and ignores blank titles', () => {
    expect(deriveWhyFromBenefits([{ title: ' Calmer mind ' }])).toBe(
      'Calmer mind.'
    );
    expect(deriveWhyFromBenefits([{ title: '   ' }])).toBeUndefined();
    expect(deriveWhyFromBenefits([])).toBeUndefined();
    expect(deriveWhyFromBenefits(undefined)).toBeUndefined();
  });
});

describe('template import motivation', () => {
  it('imports the authored suggestedWhy ahead of everything else', async () => {
    const ctx = createCtx({
      benefitDetails: [{ title: 'Calmer mind' }],
      suggestedWhy: 'Because thinking on paper keeps me honest.',
    });

    await expect(
      getHandler()(ctx, { templateId: ctx.templateId })
    ).resolves.toEqual({ habitId: 'habit_1', success: true });

    expect(ctx.inserted).toContainEqual({
      table: 'habits',
      record: expect.objectContaining({
        name: 'Creative Writing',
        why: 'Because thinking on paper keeps me honest.',
      }),
    });
  });

  it('derives the why from benefit titles when no suggestedWhy is authored', async () => {
    const ctx = createCtx({
      benefitDetails: [
        { title: 'Calmer mind' },
        { title: 'Sharper focus' },
        { title: 'Steadier mood' },
      ],
    });

    await getHandler()(ctx, { templateId: ctx.templateId });

    expect(importedWhy(ctx)).toBe(
      'Calmer mind, sharper focus and steadier mood.'
    );
  });

  it('never uses the marketing tagline as the why', async () => {
    const ctx = createCtx({
      suggestedWhy: '   ',
      tagline: 'Twenty-five minutes on, five off.',
    });

    await getHandler()(ctx, { templateId: ctx.templateId });

    expect(importedWhy(ctx)).toBe(
      'Writing regularly creates room to think clearly and explore new ideas.'
    );
  });

  it('keeps imported fallback copy within the 140-character why contract', async () => {
    const ctx = createCtx({
      description: 'A'.repeat(160),
      suggestedWhy: undefined,
      tagline: undefined,
    });

    await getHandler()(ctx, { templateId: ctx.templateId });

    expect(importedWhy(ctx)).toBe(`${'A'.repeat(139)}…`);
  });
});

describe('template import motivation backfill', () => {
  it('adds the source template why to an existing import with no why', async () => {
    const ctx = createBackfillCtx();

    await expect(getBackfillHandler()(ctx, {})).resolves.toEqual({
      dryRun: false,
      patchedCount: 1,
      patchedHabitIds: [ctx.habitId],
      replacedCount: 0,
      success: true,
    });
    expect(ctx.db.patch).toHaveBeenCalledWith(ctx.habitId, {
      why: 'Writing regularly creates room to think clearly.',
    });
  });

  it('replaces a legacy tagline why with the new resolved why', async () => {
    const ctx = createBackfillCtx('Make room for ideas worth keeping.', {
      suggestedWhy: 'Because thinking on paper keeps me honest.',
    });

    await expect(getBackfillHandler()(ctx, {})).resolves.toEqual({
      dryRun: false,
      patchedCount: 0,
      patchedHabitIds: [ctx.habitId],
      replacedCount: 1,
      success: true,
    });
    expect(ctx.db.patch).toHaveBeenCalledWith(ctx.habitId, {
      why: 'Because thinking on paper keeps me honest.',
    });
  });

  it('replaces a legacy truncated-description why', async () => {
    const description = 'A'.repeat(160);
    const ctx = createBackfillCtx(`${'A'.repeat(139)}…`, {
      description,
      suggestedWhy: 'Because it keeps my head clear.',
    });

    await expect(getBackfillHandler()(ctx, {})).resolves.toEqual({
      dryRun: false,
      patchedCount: 0,
      patchedHabitIds: [ctx.habitId],
      replacedCount: 1,
      success: true,
    });
    expect(ctx.db.patch).toHaveBeenCalledWith(ctx.habitId, {
      why: 'Because it keeps my head clear.',
    });
  });

  it('preserves an existing user-authored why', async () => {
    const ctx = createBackfillCtx('My own reason.', {
      suggestedWhy: 'Because thinking on paper keeps me honest.',
    });

    await expect(getBackfillHandler()(ctx, {})).resolves.toEqual({
      dryRun: false,
      patchedCount: 0,
      patchedHabitIds: [],
      replacedCount: 0,
      success: true,
    });
    expect(ctx.db.patch).not.toHaveBeenCalled();
  });

  it('no-ops when the resolved why already matches the stored one', async () => {
    const ctx = createBackfillCtx(
      'Writing regularly creates room to think clearly.'
    );

    await expect(getBackfillHandler()(ctx, {})).resolves.toEqual({
      dryRun: false,
      patchedCount: 0,
      patchedHabitIds: [],
      replacedCount: 0,
      success: true,
    });
    expect(ctx.db.patch).not.toHaveBeenCalled();
  });
});
