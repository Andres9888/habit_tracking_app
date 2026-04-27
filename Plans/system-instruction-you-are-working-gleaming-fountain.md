# Habit Library — Workflow Consistency Audit

## Context

The Habit Library is the user's main path to "I want a habit but I don't want to design one from scratch." It spans a dedicated full-screen surface (`TemplatesScreen`) and an inline browser embedded in `CreateHabitModal`. Over time the two surfaces have drifted: they share the same Convex data layer but use different UI shells, different preview modals, different categorization systems, and different feature sets (search, filters, customization depth). On top of that, the user-facing word is "Library" while the code calls everything "Templates," and there's a chunk of premium-pack scaffolding wired up but hard-coded off.

Goal of this doc: surface every consistency issue across the end-to-end flow (entry → browse → preview → import → post-import), rate severity, and recommend a direction. **No code changes — audit only.**

---

## Workflow map (verified)

```
  ENTRY                           BROWSE                          PREVIEW                          IMPORT                           POST-IMPORT
  ────────────────────────────    ───────────────────────────     ───────────────────────────      ────────────────────────         ──────────────────────────
  BottomActionBar BookOpen ──┐
                             ├──▶ TemplatesScreen ──────────▶  FullsizeTemplatePreview ─┬──▶ direct import (Convex) ─────▶ toast + checkmark + close
  EmptyState "Add first" ────┘    (Goal grid + Popular +      (fullScreen, custom anim) │
                                   Explore-all rows + Search)                           └──▶ "Customize" ───▶ TemplatePreviewModal ─▶ import (Convex)
  CreateHabitModal hero ─────────▶ TemplateBrowser            (also opens TemplatePreviewModal directly                   ▶ closes back to CreateHabitModal
                                   (inline, ≤300px,            via in-modal "View Science")
                                    chip filters, NO search)

  Onboarding TemplateGrid ──────▶ (separate, parallel surface — pre-auth)
```

**Data layer is shared:** all surfaces call `api.templates.list`, `api.templates.getPopular`, and `templates.importTemplate`. Categorization, however, is *not* shared — see Finding 3.

---

## Findings

Severity scale: **🔴 High** (user-visible inconsistency or real dead code) · **🟡 Medium** (architectural drift, likely to bite later) · **🟢 Low** (naming/cleanup).

---

### 🔴 1. Two preview modals with diverging UX for the same job

**Files:**
- `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx:23-104`
- `src/screens/templates/TemplatePreviewModal/TemplatePreviewModal.tsx:46-272`

Both modals exist to "show me this template before I add it," but they look and behave like different products:

| Dimension | FullsizeTemplatePreview | TemplatePreviewModal |
|---|---|---|
| Modal shell | Custom `Modal` w/ `variant='fullScreen'` | RN native `Modal` + custom Animated.View |
| Entrance | 7 dedicated animation hooks (`useEntranceAnimations`, `useExitAnimations`, `useDeferredUnmount`, `useSuccessAnimations`, `useButtonAnimations`, `useAnimatedStyles`, `useHandlers`) | Reanimated `FadeInUp.delay(...).duration(280)` per element |
| Dismiss | `disableBackdropClose` while importing, `disableGestureClose` always | Swipe-to-dismiss via `useSwipeDismiss`, backdrop tap closes |
| Customization surface | Read-only preview + "Import" + "Customize" → opens the *other* modal | Full editor: name, icon, color, reminder time, **strength algorithm, streak goal, progress emojis** |
| Header pattern | Title + back/close buttons | Drag handle + `ImportHeader` |
| Theming | Uses `iconColor` directly | Uses `useThemeColors()` + dark mode branch |

**Why this is a problem:** depending on the entry path, the user gets different default "preview" affordances. From `TemplatesScreen` you see a polished marketing-style preview and have to *opt into* customization through a second modal. From `CreateHabitModal` "View Science," you skip the marketing preview and land directly in the editor. Same template, two mental models. The animation budget (custom hook stack vs. one-liners) is also wildly asymmetric.

**Recommendation:** decide which modal owns each job and document it.
- Either: collapse to one preview modal with a `mode: 'preview' | 'edit'` prop, OR
- Keep both but make the "Customize" affordance and copy identical, and ensure both surfaces expose the same customization fields (currently the marketing preview cannot adjust strength algorithm/streak goal at all — direct-import skips them).

---

### 🔴 2. Categorization runs on two parallel systems

**Files:**
- `src/screens/TemplatesScreen/data/goalCollections.ts` (hardcoded `GOAL_COLLECTIONS` referenced at `TemplatesScreen.tsx:21,46-62`)
- `convex/templates/queries.ts:17-38` (Convex `category` field, indexed `by_category`)
- `src/components/CreateHabitModal/components/CategoryFilters/` (chip row, calls categories query)

`TemplatesScreen` groups templates into **Goals** (Health/Fitness, Productivity, etc.) using `GOAL_COLLECTIONS`, where each goal owns a hardcoded list of `categories`. Then it bridges goal → templates by `goal.categories.includes(t.category)` (`TemplatesScreen.tsx:50`).

Meanwhile, `CreateHabitModal`'s `TemplateBrowser` filters by raw category chips (`CategoryFilters`) — no concept of "goals."

**Risks:**
- A new template must be assigned a `category` value that exists in some `GOAL_COLLECTIONS[*].categories`, or it's invisible in the goal grid but visible in the in-modal browser. Easy to miss.
- The goal taxonomy lives in client code, not Convex — non-engineers can't tweak it.
- The two surfaces give different mental models of "what kinds of habits exist."

**Recommendation:** pick one canonical taxonomy.
- Option A: lift `GOAL_COLLECTIONS` into Convex as a `goals` table with `categories: string[]`; both surfaces query it.
- Option B: drop "Goals" entirely and show categories directly in `TemplatesScreen` (matches `TemplateBrowser`).
- Option C: keep the split but add a CI check that every Convex template's `category` is in some `GOAL_COLLECTIONS[*].categories`.

---

### 🔴 3. Premium Packs: dead code with full data + UI pipeline

**Files:**
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx:36` → `const SHOW_PREMIUM_PACKS = false;`
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx:92-94` → guarded by the constant
- `src/screens/TemplatesScreen/components/PremiumPacksSection/` (full component tree)
- `src/screens/TemplatesScreen/data/premiumPacks.ts` (`PREMIUM_PACKS` data)
- `src/screens/TemplatesScreen/hooks/usePackConfirm.ts`, `useMainBrowseData.ts:96`
- `TemplatesScreen.tsx:181-186` (always rendered into `premiumPacksSection` prop)
- `TemplatesScreen.tsx:113-116, 168-171` (pack confirm modal plumbed through `TemplatesScreenModals`)

The user never sees premium packs — the rendering is gated by a hardcoded `false`. But the data, the component tree, the confirm modal, and `usePackConfirm` are all wired through `TemplatesScreen`'s props.

**Risks:** high-overhead orchestration props (`packConfirm.selectedPack`, `packConfirm.handleCancel`, etc.) live in `useTemplatesScreenProps` for a feature that doesn't ship. Any refactor touching `TemplatesScreenModals` has to drag this along.

**Recommendation:** decide.
- Ship it (remove the `false` guard) — and make sure the pricing/paywall flow is real.
- Or remove it (delete `PremiumPacksSection`, `premiumPacks.ts`, `usePackConfirm`, the pack-related props on `TemplatesScreenModals`).
- "Leave it dormant" is the worst option — it's already imposing maintenance tax.

---

### 🟡 4. Naming chaos: Templates / Library / Goals / Packs

**Evidence:**
- Code calls everything "Templates": `TemplatesScreen`, `TemplateBrowser`, `TemplatePreviewModal`, `FullsizeTemplatePreview`, `templateUsage`, `api.templates.list`.
- Props and copy use "Library": `onCloseLibrary`, `EmptyState` "Browse the library."
- Sub-grouping uses "Goals" (`GOAL_COLLECTIONS`).
- A separate "Packs" concept also exists in code (`PremiumPacksSection`, `usePackConfirm`).
- Two different folders with template content: `src/screens/TemplatesScreen/` (PascalCase) and `src/screens/templates/TemplatePreviewModal/` (lowercase).

**Risks:** four nouns for what is roughly two things (a template, and a curated bundle/goal). New devs and designers have to learn the dictionary before they can talk about the feature.

**Recommendation:** pick a vocabulary and apply it consistently in code AND copy:
- *Library* = the surface (user-facing).
- *Template* = a single suggestable habit (user-facing + code).
- *Collection* (or *Goal*) = a curated bundle of templates (single term, used everywhere).
- *Pack* — retire it or merge into Collection.

Then either rename `TemplatesScreen → LibraryScreen` (matches `onCloseLibrary`) or rename the prop (`onCloseTemplates`). Today both names coexist in the same component.

---

### 🟡 5. Feature parity gap between full-screen and in-modal browse

**Files:**
- `TemplatesScreen` (full-screen): search bar, sort options, goal grid, popular row, category rows, see-all, fullsize preview.
- `src/components/CreateHabitModal/components/TemplateBrowser.tsx`: chip filter row + scrollable list. **No search, no sort, no goals.**

**Risks:** a user who has just decided "create a habit" has weaker discovery tools than a user who came in via the bottom-bar BookOpen. Discoverability is path-dependent.

**Recommendation:** at minimum add search to the in-modal browser. Better: extract a shared `<TemplateBrowse />` primitive that both surfaces compose, and let each surface decide which sub-features (search, sort, goals, preview style) to enable via props.

---

### 🟡 6. Duplicate-prevention message is split

**Files:**
- `convex/templates/importTemplate.ts:55-63` (server-side: returns `alreadyExists: true`)
- `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts` (client-side: `importedTemplateIds: Set<Id>`)
- `src/screens/TemplatesScreen/hooks/useImportFeedback.ts` (toast strings)

The server returns a structured "already exists" result. The client also keeps a local Set of imported IDs (which it uses to disable buttons / show checkmarks). These two sources of truth can drift if a fresh device, multi-device session, or web session imports a template — the local Set won't know until refetch.

**Risks:** stale "Add" button after another device imports the same template. Toast copy may differ from button state.

**Recommendation:** treat the server query (`getImportedTemplateIds`) as the single source. Subscribe rather than fetch-and-cache. Centralize the "already imported" check in one hook.

---

### 🟡 7. Two onboarding paths to template discovery

**Files:**
- `src/screens/onboarding/TemplateGrid.tsx` (carousel page 2)
- `OnboardingScreen.tsx` references `TemplatesScreen`

There are two "show templates during onboarding" code paths. Likely one is the onboarding-v2 redesign and one is legacy, but I did not verify which is currently active.

**Recommendation:** confirm which is shipping (likely tied to the `onboarding-v2` work in `MEMORY.md`) and delete the other. If both ship under different feature flags, document why in a comment at each entry point.

---

### 🟡 8. State management split

**Files:**
- `TemplatesScreen` orchestrates via `useTemplatesScreenProps` → `useViewNavigation` + `useFilteredTemplates` + `useTemplateImportHandlers` + `useImportFeedback` + `usePackConfirm` + `useMainBrowseData` + animations.
- `TemplateBrowser` (in-modal) uses a flat `useTemplateBrowser` hook.

Same data, two completely different hook architectures. Reading both surfaces back-to-back feels like reading code from two teams.

**Risks:** when a feature lands in one surface (e.g., new "trending this week" row), porting it to the other is a small rewrite, not a config change.

**Recommendation:** factor the shared concerns (filtered list, import action, imported-ID tracking, preview state) into a single `useHabitLibrary()` hook. Keep view-stack/animation/screen-shell concerns local to each surface.

---

### 🟢 9. Two `templates` directories with different casing

- `src/screens/TemplatesScreen/` (PascalCase)
- `src/screens/templates/TemplatePreviewModal/` (lowercase)

Pure naming inconsistency. Likely one was created before the project standardized on PascalCase screen folders.

**Recommendation:** move `src/screens/templates/TemplatePreviewModal` to live alongside its caller (it's only used by `TemplatesScreen`/`TemplatesScreenModals`, so move it under `src/screens/TemplatesScreen/components/TemplatePreviewModal/`). Delete the lowercase folder.

---

### 🟢 10. Type duplication / aliasing for templates

- `Doc<'templates'>` (Convex generated type) — used in `TemplatesScreen.tsx:9`.
- `HabitTemplate` (local type) — defined in `src/components/CreateHabitModal/types.ts:5`, used by `TemplateBrowser`.

Same shape, two names. Risk: if Convex schema changes, the local alias rots silently.

**Recommendation:** retire `HabitTemplate` and import `Doc<'templates'>` everywhere, OR make `HabitTemplate = Doc<'templates'>` in one place and use that alias consistently.

---

### 🟢 11. Back-button behavior depends on entry path

- `FullsizeTemplatePreview` has an *optional* `onBack` prop — present when opened from `TemplatesScreen` (returns to library), absent from in-modal flow.
- `TemplatePreviewModal` has no back, only swipe-dismiss + cancel.

**Risks:** users learn one nav model and then encounter the other.

**Recommendation:** standardize header pattern across both modals (drag handle + close on the left, action on the right, optional back as a leading chevron).

---

## Recommended remediation order

If you choose to act on this later, I'd sequence as follows:

1. **Decide on Premium Packs (Finding 3).** Cheapest, unblocks file deletions or an actual feature.
2. **Pick one taxonomy (Finding 2).** Touches data — needs to happen before UI unification.
3. **Unify the preview modals (Finding 1) + state hook (Finding 8).** Biggest UX consistency win.
4. **Add search to in-modal browser (Finding 5).** Small, high-value parity fix.
5. **Naming + folder cleanup (Findings 4, 9, 10).** Mechanical, do as one PR after the above.
6. **Onboarding path consolidation (Finding 7).** Verify with onboarding-v2 owner first.
7. **Subscribe-not-fetch for imported IDs (Finding 6).** Small, polish.
8. **Header standardization (Finding 11).** Polish, do alongside #3.

---

## Verification notes (what I actually read)

- `src/screens/TemplatesScreen/TemplatesScreen.tsx` — full file
- `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx` — full file
- `src/screens/templates/TemplatePreviewModal/TemplatePreviewModal.tsx` — full file
- `src/components/CreateHabitModal/components/TemplateBrowser.tsx` — full file
- `MainBrowseView.tsx:36, 92-94` — confirmed `SHOW_PREMIUM_PACKS = false` guard
- Grep confirmation of premium-packs surface area across `src/screens/TemplatesScreen/`
- Plus an Explore-agent map of the broader workflow (entry points, hooks, Convex queries) — used as a guide; the file:line citations above were spot-checked.

What I did **not** independently verify (treat findings here as "investigate before acting"):
- Exact wiring of `OnboardingScreen` ↔ `TemplateGrid` ↔ `TemplatesScreen` (Finding 7).
- Whether `getImportedTemplateIds` is currently a `useQuery` subscription or a one-shot fetch (Finding 6) — Explore agent reported it as fetch-on-visit.
- Whether the `templateUsage` table is currently the popularity source or just analytics.

---

# Mockups — Proposed Unified Library Browser

> **Workflow note:** per the project's superdesign convention, layout is confirmed in ASCII first, then HTML mocks land in `.superdesign/design_iterations/`. ASCII is below — please confirm the layout before I generate HTML.

---

## The unifying idea: one `<TemplateBrowse />` primitive

Today's two surfaces (full-screen `TemplatesScreen` and in-modal `TemplateBrowser`) reimplement the same job. Proposal: extract one primitive that both compose. Each surface enables the sub-features it needs via props.

```
<TemplateBrowse
  data={templates}                  // shared Convex query
  enableSearch                      // ← toggleable
  enableSort                        // ← toggleable
  enableGoals                       // ← toggleable
  enablePopular                     // ← toggleable
  density="comfortable" | "compact" // controls row height + padding
  importedTemplateIds={set}         // single source of truth (subscribed)
  onPreview={fn}                    // → unified preview modal
  onImport={fn}                     // → Convex mutation
/>
```

The primitive owns: list virtualization, item rendering, "already imported" checkmarks, empty/loading states. The host owns: shell (full screen vs collapsible panel), header copy, modal coordination.

---

## Mock A — Full-screen `TemplatesScreen` (using the primitive)

**Current state (verified at `MainBrowseView.tsx:38-117`):**

```
┌─────────────────────────────────────────┐
│  ScreenHeader                           │
│  "What do you want to work on?"         │
│  Pick a path — habits proven to work.   │
├─────────────────────────────────────────┤
│  🔍 Try: morning walk · journaling…     │  ← SearchBar (sticky)
├─────────────────────────────────────────┤
│                                         │
│  ┌───────┐ ┌───────┐                    │
│  │Health │ │Product│  ← GoalCollection  │
│  │Fitness│ │ ivity │     Grid (6 cards) │
│  └───────┘ └───────┘                    │
│  ┌───────┐ ┌───────┐                    │
│  │Mind   │ │Sleep  │                    │
│  └───────┘ └───────┘                    │
│                                         │
│  ▶ Popular this week         [See all]  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│  │ 🏃 │ │ 📚 │ │ 💧 │ │ 🧘 │  ← horiz   │
│  └────┘ └────┘ └────┘ └────┘            │
│                                         │
│  ▶ Morning routine           [See all]  │  ← CategoryRows
│  [scrollable list of templates]         │
│                                         │
│  ▶ Health & Fitness          [See all]  │
│  [scrollable list of templates]         │
│                                         │
│  ▶ … more category rows …               │
└─────────────────────────────────────────┘
```

**Proposed (using `<TemplateBrowse />`):**

```
┌─────────────────────────────────────────┐
│  ← Library          What's your goal?   │  ← header copy lands on
│                                         │     ONE noun ("Library")
├─────────────────────────────────────────┤
│  🔍 Search the library…           [⇅]   │  ← search + sort toggle
├─────────────────────────────────────────┤
│  Goals                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐             │
│  │Health│ │Focus │ │Sleep │             │  ← goal collections
│  └──────┘ └──────┘ └──────┘     [more]  │     (taxonomy from server,
│                                         │      not hardcoded)
│  ─── or browse all ───                  │
│                                         │
│  ▶ Popular this week         [See all]  │
│  ┌────┐ ┌────┐ ┌────┐                   │
│  │ 🏃 │ │ 📚 │ │ 💧 │  ✓ ← checkmark   │     ← imported state from
│  └────┘ └────┘ └────┘                   │       single source
│                                         │
│  ▶ Health & Fitness          [See all]  │
│  ┌─────────────────────────────────┐    │
│  │ 🏃  Morning walk            [+] │    │  ← TemplateRow primitive
│  │     10 min · daily · ★4.7       │    │     (same row used in
│  └─────────────────────────────────┘    │      modal-mode)
│  ┌─────────────────────────────────┐    │
│  │ 💧  Drink water on wake     ✓   │    │  ← already imported
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                                          ▲
        Premium Packs row deleted ────────┘
        (per Finding 3 — pick or remove)
```

**Changes vs today:**
- Title noun standardized to "Library" (matches `onCloseLibrary` prop).
- Goals taxonomy comes from server, not `GOAL_COLLECTIONS` constant.
- Premium-pack scaffolding removed from props.
- `TemplateRow` is the same primitive used inside the modal context (consistency win).

---

## Mock B — In-modal browser inside CreateHabitModal (using the primitive)

**Current state (verified at `TemplateBrowser.tsx:32-87`, `TemplateList.tsx:30,97`):**

```
┌─────────────────────────────────────────┐
│  Create a habit                    [✕]  │
├─────────────────────────────────────────┤
│                                         │
│  Habit name: [_______________________]  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ✨ Browse Templates           [▾] │  │  ← TemplateHero
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ [All] [Morning] [Health] [Sleep]… │  │  ← CategoryFilters
│  ├───────────────────────────────────┤  │
│  │ 🏃 Morning walk          [Select] │  │
│  │ 📚 Read 10 pages         [Select] │  │  ← TemplateList
│  │ 💧 Drink water           [Select] │  │     (max-h: 300px,
│  │ 🧘 Meditate              [Select] │  │      no search,
│  └───────────────────────────────────┘  │      no sort)
│                                         │
│  Icon · Color · Reminder · …            │
└─────────────────────────────────────────┘
```

**Proposed (using `<TemplateBrowse density="compact" />`):**

```
┌─────────────────────────────────────────┐
│  Create a habit                    [✕]  │
├─────────────────────────────────────────┤
│                                         │
│  Habit name: [_______________________]  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ✨ Browse Library             [▾] │  │  ← naming aligned
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔍 Search the library…            │  │  ← NEW: search
│  ├───────────────────────────────────┤  │
│  │ [All] [Morning] [Health] [Sleep]… │  │
│  ├───────────────────────────────────┤  │
│  │ 🏃 Morning walk              [+]  │  │  ← TemplateRow
│  │ 📚 Read 10 pages             [+]  │  │     (compact density,
│  │ 💧 Drink water on wake       ✓    │  │      same primitive
│  │ 🧘 Meditate                  [+]  │  │      as full-screen)
│  └───────────────────────────────────┘  │
│  ↓ scroll to see all                    │
│                                         │
│  Icon · Color · Reminder · …            │
└─────────────────────────────────────────┘
```

**Changes vs today:**
- Search added (Finding 5 parity fix).
- "Browse Templates" → "Browse Library" copy alignment.
- Same row component as full-screen → tap behavior, "imported ✓" state, accessibility identical across surfaces.
- Direct-add `[+]` button on each row matches the full-screen affordance.

---

## Mock C — Unified preview modal

Today: `FullsizeTemplatePreview` (read-only marketing) vs `TemplatePreviewModal` (full editor). Proposal: one modal with `mode="preview" | "customize"`.

```
mode="preview"  (default entry from any list tap)

┌─────────────────────────────────────────┐
│  ←                                  ✕   │  ← back optional, close always
│                                         │
│         ┌───────┐                       │
│         │  🏃   │   ← big icon          │
│         └───────┘                       │
│                                         │
│       Morning walk                      │
│       10 min · daily                    │
│                                         │
│  Why this works ────────────────────    │
│  Walking boosts mood and cognition.     │
│  Source: Mikkelsen et al. 2017          │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      Add to my habits      ✓    │    │  ← direct import
│  └─────────────────────────────────┘    │
│                                         │
│         [ Customize first ]             │  ← swap to edit mode
└─────────────────────────────────────────┘
            │
            │ "Customize first" tapped
            ▼
mode="customize"  (current TemplatePreviewModal — kept as-is)

┌─────────────────────────────────────────┐
│        ▬▬▬                              │  ← drag handle
│  Cancel              Add this habit     │
├─────────────────────────────────────────┤
│         ┌───────┐                       │
│         │  🏃   │                       │
│         └───────┘                       │
│  [ Morning walk_______________________] │  ← editable name
│                                         │
│  Choose an icon: 🏃 📚 💧 🧘 …         │
│  Pick a color:   ● ● ● ● ● ● ●           │
│  Reminder:       [ 7:00 AM ]            │
│                                         │
│  ▾ Advanced                              │
│    Strength algorithm · Streak goal     │
│    · Progress emojis                    │
└─────────────────────────────────────────┘
```

**Changes vs today:**
- Single modal component, two modes — eliminates the split between marketing-preview and full-editor.
- Both modes share the SAME header pattern (drag handle + close + optional back).
- Direct-import path now lives in `mode="preview"` and exposes the same advanced fields as customize via a single shared `useImportTemplate()` hook (Finding 1 fix).
- Backdrop/swipe behavior unified (no more "disable gesture close" asymmetry).

---

## What I'd build, in order

1. ASCII layouts confirmed (this section) → user sign-off.
2. `generateTheme` call to drop tokens for the mock CSS.
3. Static HTML in `.superdesign/design_iterations/`:
   - `library_full_1.html` — Mock A
   - `library_modal_1.html` — Mock B
   - `library_preview_1.html` — Mock C (both modes)
4. (Out of scope for now) — actual React refactor mapping primitives to the components in `src/screens/TemplatesScreen/` and `src/components/CreateHabitModal/`.

**Plan-mode caveat:** steps 2 and 3 require exiting plan mode (they write files outside `Plans/`). Confirming layout here keeps that step honest.
