# Habit Detail / Confidence Pitch Wireframe

## Goal
Help users feel confident enough to add a habit by staging trust + feasibility + identity in a single scroll.

## Screen context
- Entry paths: goal drill, category drill, search, guided picker, trending, starter.
- Container choice for mock: full-screen detail panel (scrollable), preserving quick add CTA above the fold.

## Component tree contract
- `TemplatePreviewHeader`
- `ConfidencePromiseCard`
- `FeasibilityMetaRow`
- `WhyThisWorksSection`
- `HowYoullDoItSection`
- `IdentitySection`
- `CustomizeAccordion`
- `PairingsSection`
- `StickyAddFooter`

## Layout wireframe (mobile-first)

```text
┌─────────────────────────────────────────────┐
│ ← Back                         Share   Save │
├─────────────────────────────────────────────┤
│ [icon] Drink Water                           │
│ "Stay hydrated so your energy is steadier." │ ← Promise
│                                             │
│ ⏱ 2 min/day      Style: Gentle Start       │ ← Time + style
│ [ Add Habit ]    [ Preview Reminder ]       │
├─────────────────────────────────────────────┤
│ WHY THIS WORKS                               │
│ • Better concentration by midday             │ ← Benefits
│ • Fewer sugar cravings in afternoon          │
│ • Supports workout recovery                  │
│ Science: Journal of Nutrition (2019) ↗       │ ← Science source
├─────────────────────────────────────────────┤
│ HOW YOU'LL DO IT                             │
│ Cue: "After I make coffee..."                │ ← Cue
│ Start small: "Drink 4 sips, then continue."  │ ← Start-small
│ Tip: Keep bottle visible on desk             │
├─────────────────────────────────────────────┤
│ WHO YOU'LL BECOME                            │
│ "I'm a person who takes care of my body."    │ ← Identity
├─────────────────────────────────────────────┤
│ CUSTOMIZE (collapsed by default)             │
│ ▸ Name                                       │
│ ▸ Icon                                       │
│ ▸ Reminder time                              │
│ ▸ Strength / progression style               │
├─────────────────────────────────────────────┤
│ PAIRS WELL WITH                              │
│ [ Morning Stretch ]  [ 5-min Walk ]          │ ← Pairings
│ Why: stacks naturally after hydration        │
├─────────────────────────────────────────────┤
│ Added from: Guided picker (confidence 89%)   │
├─────────────────────────────────────────────┤
│ [ Add Habit ]                      [ Skip ]  │ ← Sticky footer
└─────────────────────────────────────────────┘
```

## Content staging order (must keep)
1. Promise
2. Time/style
3. Benefits + science
4. Cue + start-small
5. Identity
6. Customize
7. Pairings

## Copy notes
- Promise line is one sentence and outcome-focused.
- Benefits stay concrete and short (3 bullets max).
- Science source is optional but visible when present.
- Cue text uses implementation-intention format: "After/When X, I will Y."
- Identity line is in first person for commitment framing.

## Interaction notes
- `Add Habit` appears both above fold and in sticky footer for speed.
- Customize remains collapsed to reduce friction for confident users.
- Pairings CTA can deep-link to second add immediately after success.
