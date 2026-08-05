# Wendy Suzuki Cardio-for-Brain — Research + Habit Template Plan

## Context

You asked me to "look up Wendy Suzuki cardio for brain for habits." The recent commit `81adbb1d5` added a "13-Minute Focus Meditation (Wendy Suzuki)" template, so the natural next step is a companion cardio template built on her published prescription. This plan captures the verified brief and lays out the template fields that mirror the existing Suzuki meditation entry.

## Research Brief

### Core scientific claims

- **Hippocampus and prefrontal cortex** are the two regions most susceptible to neurodegeneration and most responsive to cardio.
- A single aerobic session raises **dopamine, serotonin, noradrenaline** — the immediate mood bump.
- Cardio elevates **BDNF** ("Miracle-Gro for the brain"), driving hippocampal neurogenesis and synaptic plasticity.
- Long-term aerobic training **enlarges the hippocampus and PFC**, improving resilience to Alzheimer's and dementia.

### Prescription (her consistent talking points)

- **3–4x / week minimum**, more is better.
- **30–45 min per session** (floor: a 10-min brisk walk for measurable mood/focus lift).
- **Intensity:** get heart rate up, break a sweat, "talk but not sing."
- **Modality:** any aerobic — walk, jog, cycle, swim, dance, intenSati.

### Cognitive / mood benefits cited

Attention, executive function, working memory, long-term memory, reduced anxiety/depression, dementia protection. She references Erickson 2011 (~2% hippocampal volume gain/year) for the structural claim.

### Signature framing / quotes

- "Exercise is the most transformative thing you can do for your brain today." (TED 2017)
- "The brain is a muscle — the more you work it out, the bigger and stronger your hippocampus and prefrontal cortex get."
- BDNF = "Miracle-Gro for the brain."
- Post-workout = "a bubble bath of neurochemicals."

### Canonical video (needs live verification once out of plan mode)

- **TED Talk 2017 — "The brain-changing benefits of exercise"**: `https://www.youtube.com/watch?v=BHY0FxzoKZE` *(verify with WebFetch before shipping)*

### Peer-reviewed citation (Suzuki lab)

- **Basso & Suzuki (2017).** *The Effects of Acute Exercise on Mood, Cognition, Neurophysiology, and Neurochemical Pathways: A Review.* **Brain Plasticity, 2(2), 127–152.**
- DOI: `10.3233/BPL-160040` · URL: `https://content.iospress.com/articles/brain-plasticity/bpl160040`

Supporting: Erickson et al. (2011), *PNAS 108(7), 3017–3022*, DOI `10.1073/pnas.1015950108`.

---

## Proposed Habit Template

Mirrors the Wendy Suzuki meditation entry at `convex/templatesDataSeed.ts` (see commit `81adbb1d5`). Uses existing schema from `convex/templates/types.ts:31-44`.

```ts
await insertWithTracking({
  category: 'health_fitness', // closest fit; 'andrew_huberman' reserved for his protocols
  createdAt: now,
  description:
    "Dr. Wendy Suzuki's prescription for a stronger, healthier brain: 30–45 minutes of aerobic exercise, 3–4 times per week. Cardio elevates BDNF (\"Miracle-Gro for the brain\"), grows the hippocampus and prefrontal cortex, and improves attention, memory, and mood — while protecting against Alzheimer's and dementia.",
  frequency: 'weekly', // confirm enum — 3–4x/week pattern
  icon: '🏃',
  iconColor: '#F97316', // warm orange to contrast the meditation entry's indigo
  name: '30-Minute Brain-Boosting Cardio',
  popularityScore: 88,
  scientificLink:
    'https://content.iospress.com/articles/brain-plasticity/bpl160040',
  scientificReference:
    "Basso & Suzuki (2017) — The Effects of Acute Exercise on Mood, Cognition, Neurophysiology, and Neurochemical Pathways: A Review. Brain Plasticity, 2(2), 127–152.",
  tips: [
    'Aim for 30–45 minutes, 3–4 times per week — any aerobic modality (walk, run, bike, swim, dance)',
    'Intensity target: heart rate up, breaking a sweat, able to talk but not sing',
    'Short on time? Even a 10-minute brisk walk gives a measurable focus and mood lift',
  ],
  youtubeLink: 'https://www.youtube.com/watch?v=BHY0FxzoKZE',
});
```

### Fields that need your input / live verification

1. **Category** — `health_fitness` vs. a different existing one. No `brain_health` exists.
2. **Frequency enum** — the existing constants include `FREQUENCY_DAILY`; need to confirm the weekly/3–4x value in `convex/templates/types.ts`.
3. **YouTube URL** — WebFetch `BHY0FxzoKZE` once out of plan mode.
4. **DOI landing page** — WebFetch to confirm it resolves.

---

## Critical files

- `convex/templatesDataSeed.ts` — add the new template entry next to the meditation one.
- `convex/templates/types.ts:9-44` — confirm category + frequency enum values.
- `convex/templates/youtubeLinks.data.ts` — add the TED Talk URL if that file centralizes links.
- `src/types/template.ts` — type alias; no change expected.

## Verification

1. `WebFetch https://www.youtube.com/watch?v=BHY0FxzoKZE` — confirm 200 + title "The brain-changing benefits of exercise".
2. `WebFetch https://content.iospress.com/articles/brain-plasticity/bpl160040` — confirm DOI resolves.
3. `grep`/`Read` `convex/templates/types.ts` to confirm category + frequency values before inserting.
4. Run `npx convex dev` (or existing seed command) locally to verify the template loads without schema errors.
5. Visually confirm the card renders alongside the meditation template in the templates UI.
