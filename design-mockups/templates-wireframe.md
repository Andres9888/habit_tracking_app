# Templates Screen – Wireframe

Low-fi structure for the revamped Templates experience.

```
┌──────────────────────────────────────────────┐
│ Templates                                    │
│ Science-backed habits to get you started     │
├──────────────────────────────────────────────┤
│ [🔍 Search habits or science keywords   ][✕] │
│ [⚙ Sort: Popular] [🧪 Research only ○]        │
├──────────────────────────────────────────────┤
│ Categories                                   │
│ ✨ All (24) | 🌅 Morning (6) | 🧘 Mindful (4)  │
│ 💪 Health (7) | 🎯 Productivity (5) | …        │
│  (horizontal scroll + pill counters)         │
├──────────────────────────────────────────────┤
│ Spotlight Habit                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Sparkles + title + teaser                 │ │
│ │ ⏱️ Daily      🔥 Popular pick             │ │
│ │ [Preview] [Import habit]                  │ │
│ └──────────────────────────────────────────┘ │
├──────────────────────────────────────────────┤
│ Habit Templates list                         │
│ ┌──────────────────────────────────────────┐ │
│ │ icon | Morning Run           Premium     │ │
│ │ name + ⏱️ Daily · 🔗 Research link        │ │
│ │ “Kickstart metabolism…”                   │ │
│ │ 🔬 Research: citation text                │ │
│ │ [Import Template] [Preview]               │ │
│ └──────────────────────────────────────────┘ │
│ (repeated cards; scroll with gradient hints) │
├──────────────────────────────────────────────┤
│ Empty state (if filters hide all) + Reset    │
├──────────────────────────────────────────────┤
│ Preview bottom sheet                         │
│ ┌──────────────────────────────────────────┐ │
│ │ Icon, name, category + cadence             │ │
│ │ Description text                           │ │
│ │ 🔬 Scientific Backing + tappable link      │ │
│ │ “Make it yours”:                           │ │
│ │   Habit name [__________] 14/50            │ │
│ │   Reminder chips [7:30 AM][12:00 PM]…      │ │
│ │   Color swatches (● ● ● ● ●)               │ │
│ │ [Import Template]   [Cancel]               │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

## Key Regions

1. **Hero headline** – anchors the page and mirrors copy from UX spec.
2. **Search & controls** – left-aligned search bar with right-aligned sort + research-only filters.
3. **Category rail** – horizontally scrollable chips with counts to show coverage.
4. **Spotlight card** – gradient block featuring one highlighted habit.
5. **Template list** – stacked TemplateCard components with metadata pills and dual CTAs.
6. **Empty state** – only appears when filters hide all content; includes reset button.
7. **Preview sheet** – bottom-sheet modal with science reference, reminder presets, and color picker.

Use this as a blueprint for higher-fidelity mocks or implementation tweaks.

