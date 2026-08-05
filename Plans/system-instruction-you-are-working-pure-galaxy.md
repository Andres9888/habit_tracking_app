# Plan: "Custom" growth-icons preset (persisted per-user)

## Context

The app has 5 built-in growth-icon presets (Plants, Fitness, Space, Mind, Fire) and already lets users override any of the 5 stage slots with any emoji via `EmojiPickerSheet`. When the user's set doesn't match a built-in, the Advanced Options row already shows the label **"Custom"** — but there is no matching chip in the preset scroller.

Worse, as soon as the user taps **Fitness** (or any other preset), their custom emoji combination is overwritten — there's no way back to it without remembering each emoji by hand.

**Goal:** Add a 6th chip labelled **"Custom"** to the preset row that represents the user's own saved emoji set. Whenever the user edits any slot in **Settings → Default growth icons**, we auto-save that set to `userSettings.customProgressEmojis`. Tapping the **Custom** chip (in either the global settings picker or per-habit Advanced Options picker) re-applies that saved set. Switching to Fitness never loses the user's custom work.

---

## Scope

- ✅ Persist user's custom set on `userSettings.customProgressEmojis`
- ✅ Auto-save custom set when user edits slots in **global Settings**
- ✅ Show "Custom" chip in **both** global Settings picker AND per-habit Advanced Options picker
- ✅ Tapping "Custom" chip applies the saved set
- ❌ No changes to per-habit `progressEmojis` field; snapshot-on-create logic stays as-is
- ❌ No multi-custom sets (single slot per user)
- ❌ No backfill or migration (field is optional)

---

## Design

### Data model

Add one optional field to `userSettings` only. The per-habit `progressEmojis` field stays unchanged.

- `userSettings.customProgressEmojis?: ProgressEmojiSet`
  - Same validator as existing `progressEmojis`
  - Optional; absent until user first customizes a slot in global Settings

### Behavior matrix

| User action (location)                  | Writes to `progressEmojis` | Writes to `customProgressEmojis` |
| --------------------------------------- | -------------------------- | -------------------------------- |
| Edit slot in **Settings**               | ✅ (active default)         | ✅ (auto-saved custom)            |
| Pick built-in preset in **Settings**    | ✅                          | ❌ (untouched)                    |
| Tap **Custom** chip in **Settings**     | ✅ (applies saved custom)   | ❌                                |
| Reset in **Settings**                   | → `DEFAULT_PROGRESS_EMOJIS` | ❌                                |
| Edit slot in **per-habit Advanced**     | writes to habit-local only | ❌ (global custom untouched)      |
| Tap **Custom** chip in **per-habit**    | writes to habit-local only | ❌                                |

### `matchPresetId` precedence

Built-ins take precedence — if the user's current set happens to match Plants exactly, the **Plants** chip lights up, not **Custom**. This avoids double-highlighting.

```ts
function matchPresetId(set: ProgressEmojiSet, customEmojis?: ProgressEmojiSet): string | null {
  for (const preset of PROGRESS_EMOJI_PRESETS) {
    if (STRENGTH_LEVEL_KEYS.every((k) => preset.emojis[k] === set[k])) return preset.id;
  }
  if (customEmojis && STRENGTH_LEVEL_KEYS.every((k) => customEmojis[k] === set[k])) return 'custom';
  return null;
}
```

### Visual chip

The "Custom" chip renders only when `customProgressEmojis` is present on userSettings (otherwise 5 chips, unchanged). Uses the same `ProgressEmojiPresetChip` component, with a synthesised `ProgressEmojiPreset` object:

```ts
{ id: 'custom', label: 'Custom', emojis: userSettings.customProgressEmojis }
```

The chip shows the user's actual preview emojis (starting · developing · automatic), matching all other chips. No special icon/gradient — keeps the row visually consistent.

Placement: **after** the 5 built-ins (right edge of the scroll row).

---

## Files to modify

### Schema (Convex)

1. **`convex/schema.ts`** — add `customProgressEmojis: v.optional(progressEmojisValidator)` to `userSettings` table definition (around line 406 where `progressEmojis` is declared).

2. **`convex/settings.ts`** (likely location — confirm path during implementation) — update the `update` mutation args to accept `customProgressEmojis` and the `get` query return shape.

### Core util

3. **`src/utils/progressEmojis.ts`**
   - Add `CUSTOM_PRESET_ID = 'custom'` constant.
   - Extend `matchPresetId(set, customEmojis?)` signature as shown above (customEmojis optional — existing callers unaffected).

### Hook (new or extension)

4. **`src/hooks/useProgressEmojis.ts`** (existing file — confirm during implementation)
   - Add `useUserCustomProgressEmojis(): ProgressEmojiSet | undefined` that reads `settings?.customProgressEmojis`, nulling out if it matches default.

### Preset row component

5. **`src/components/ProgressEmojiPicker/ProgressEmojiPresetRow.tsx`**
   - Add optional prop `customPreset?: ProgressEmojiPreset | null`.
   - If truthy, append a 6th `ProgressEmojiPresetChip` after the 5 built-ins with `preset={customPreset}`.
   - Preserve existing fade gradients and scroll behaviour.

### Global settings picker (auto-save custom)

6. **`src/components/SettingsModal/GrowthIconsSettingsRow.tsx`**
   - Query `customProgressEmojis` from settings.
   - Build `customPreset` object from it (if present) and pass down to `ProgressEmojiPicker`.
   - In `handleChange`, detect whether the caller is "edit slot" vs "pick preset" — simplest heuristic: if the incoming set does not match any built-in preset AND does not match `customProgressEmojis`, treat it as a slot edit and write `customProgressEmojis: next` alongside `progressEmojis: next`. Otherwise only write `progressEmojis`.

7. **`src/components/ProgressEmojiPicker/ProgressEmojiPicker.tsx`**
   - Accept optional `customPreset` prop and thread it to `ProgressEmojiPresetRow`.
   - Pass `customEmojis` to `matchPresetId()` so the Custom chip highlights when active.

### Per-habit Advanced picker

8. **`src/components/AdvancedOptions/GrowthIconsSheetBody.tsx`**
   - Query userSettings via the hook from step 4.
   - Build `customPreset` and pass to `ProgressEmojiPresetRow`.
   - Pass `customEmojis` to `matchPresetId()`.
   - Note: editing slots here does **not** write to `customProgressEmojis` — only the global Settings picker auto-saves. This is intentional per the behaviour matrix.

9. **`src/components/AdvancedOptions/AdvancedOptionsSection.tsx`**
   - Update the subtitle label lookup (line 88-89) to also recognise `'custom'` → label `'Custom'`, sourced from userSettings if matched.

### Snapshot-on-create

10. **`src/components/CreateHabitModal/hooks/useCreateHabitHandlers.ts`** — no change needed. `userDefaultEmojis` still snapshots `progressEmojis`. The new `customProgressEmojis` is purely a shortcut for the user's own preferred set; it doesn't change the default-resolution path.

---

## Reuse (no new code where possible)

- `ProgressEmojiPresetChip` is reused as-is for the Custom chip (just pass the synthesised preset).
- `EmojiPickerSheet` is reused for slot editing (no change).
- `resolveProgressEmojis` is unchanged — the resolution order stays `per-habit → user-default → built-in`.
- `matchPresetId` is extended (new optional arg) not replaced — existing call sites compile cleanly.

---

## Verification

1. **Type check**: `cd /Users/andres/conductor/workspaces/habit_tracking_app/wellington-v2 && npx tsc --noEmit` — must pass.
2. **Lint**: `npm run lint:max-lines` — all touched files must stay ≤100 lines. `ProgressEmojiPresetRow.tsx` is currently 92 lines; watch for creep.
3. **Convex dev server**: `npx convex dev` — schema push must succeed without migration prompt (field is optional).
4. **Manual: Settings → Default growth icons**
   - Open picker, edit Starting emoji from 🌱 to ⭐.
   - Verify the subtitle on Advanced Options row now reads "Custom · levels up every 20%".
   - Verify a 6th chip "Custom" appears with preview ⭐ · 🌳 · ⚡ (or whatever the current resolved set is).
   - Tap **Fitness** → chips swap to Fitness preview, but Custom chip is still present showing the ⭐-set preview.
   - Tap **Custom** → slots return to ⭐ · 🌿 · 🌳 · 💪 · ⚡. `customProgressEmojis` is unchanged in DB.
5. **Manual: per-habit Advanced Options**
   - Open any habit's Advanced → Growth Icons sheet.
   - Verify "Custom" chip appears (reading from userSettings).
   - Tap Custom → habit's local `progressEmojis` override set to user's custom set.
   - Verify userSettings.customProgressEmojis is NOT modified.
6. **Manual: create-new-habit snapshot**
   - With a user Custom set saved, create a new habit without editing Advanced.
   - Verify habit's `progressEmojis` snapshots the current `userSettings.progressEmojis` (active default), matching today's snapshot behaviour — not `customProgressEmojis`.
7. **Manual: reset behaviour**
   - In Settings picker, tap "Reset to default".
   - Verify `progressEmojis` → DEFAULT and `customProgressEmojis` remains.
   - Tap Custom chip → set restores. (Reset doesn't nuke Custom — by design.)
   - If a user wants to clear Custom, they edit a slot to become the new Custom (auto-overwrite).

---

## Non-goals / deferred

- Multiple saved custom sets ("Custom 1", "Custom 2") — single slot only.
- Per-habit auto-save of a habit-specific custom (only the global userSettings picker auto-saves).
- Explicit "Clear custom" action — overwriting on edit is the clear path. Can revisit if users request it.
- Migration/backfill of existing users who already have a non-preset `progressEmojis` — they'll just see no Custom chip until the next edit, which immediately materialises one.
