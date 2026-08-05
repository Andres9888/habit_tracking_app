# Phase 05: Cross-Platform Token Alignment

**Goal:** Resolve the divergence between web (global.css / tailwind.config.js) and native (src/theme/\*.ts) design tokens so both platforms render consistently.

**Context:** Three critical mismatches exist:

1. **Fonts**: typography.ts uses Literata + DM Sans, global.css uses Plus Jakarta Sans + Source Sans 3, tailwind.config.js uses Inter
2. **Spacing**: tailwind `md: 16px` vs theme `spacing.md: 12`
3. **Border radius**: tailwind `card: 12px` vs theme `borderRadius.card: 16`
4. **Colors**: CSS `--background` resolves to ~#FAF8F5, but core.ts says #F5F1ED; CSS `--card` is #FFFFFF but core.ts card is #EDEAE5

**Decision needed:** The native tokens (src/theme/) are the primary design system. Web should align TO native, not the other way around. This phase updates the web layer.

---

- [ ] **Align tailwind.config.js spacing with theme spacing.ts**: Change `md: '16px'` to `md: '12px'` to match `spacing.md: 12` from `src/theme/spacing.ts`. Also add `base: '16px'` to tailwind spacing to match `spacing.base: 16`. Add `'3xl': '64px'` to match `spacing['3xl']: 64`. The full tailwind spacing should be: `xs: '4px', sm: '8px', md: '12px', base: '16px', lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px'`.

- [ ] **Align tailwind.config.js border radius with theme**: Change `card: '12px'` to `card: '16px'` to match `borderRadius.card: 16` from `src/theme/spacing.ts`. Update CSS variable `--radius: 0.75rem` in `global.css` to `--radius: 1rem` (16px) so the computed values `calc(var(--radius) - 2px)` and `calc(var(--radius) - 4px)` produce 14px and 12px respectively (matching `borderRadius.large: 16`, `borderRadius.medium: 12`).

- [ ] **Align tailwind.config.js hardcoded colors with CSS variables**: In `tailwind.config.js`, replace hardcoded color values with CSS variable references where possible: (1) `accent: { DEFAULT: '#10B981' }` -> `accent: { DEFAULT: 'hsl(var(--primary))' }` (since primary and accent are the same emerald green). (2) `card: { DEFAULT: '#FFFFFF', foreground: '#1F2937' }` -> `card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' }`. Add `--card-foreground: 30 10% 16%;` to global.css if not present. (3) `dominant: '#faf9f7'` -> add `--dominant` CSS variable and reference it. (4) `'secondary-text': '#1F2937'` -> replace with `'hsl(var(--foreground))'`. (5) `neutral: '#C4BFB7'` -> `'hsl(var(--muted))'`.

- [ ] **Align global.css color values with core.ts**: Update CSS variables in `global.css` to match the native color values from `src/theme/colors/core.ts`: (1) `--background: 36 33% 97%` currently resolves to ~#FAF8F5. The native value is `#F5F1ED` which is HSL `30 20% 94%`. Update to `--background: 30 20% 94%`. (2) `--card: 0 0% 100%` (#FFFFFF) but native card is `#EDEAE5`. Update to `--card: 30 10% 91%` (approximate HSL for #EDEAE5). (3) `--border: 30 8% 74%` resolves to ~#C4BFB7 but native border is `#DDD8D2` which is HSL `30 12% 85%`. Update to `--border: 30 12% 85%`. (4) Verify --foreground, --primary, --muted still match after changes.

- [ ] **Align global.css fonts with typography.ts**: The native app uses Literata (serif, display/H1) + DM Sans (sans-serif, body). Update `global.css` to match: (1) Replace the Google Fonts import to load Literata and DM Sans instead of Plus Jakarta Sans and Source Sans 3: `@import url('https://fonts.googleapis.com/css2?family=Literata:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;600;700;800&display=swap');` (keep Inter as fallback). (2) Update body font-family: `font-family: 'DM Sans', 'Inter', system-ui, sans-serif;`. (3) Update heading font-family: `font-family: 'Literata', 'Inter', system-ui, serif;`. (4) Update `tailwind.config.js` fontFamily: `sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif']` and `heading: ['Literata', 'Inter', 'system-ui', 'serif']`.

- [ ] **Remove redundant spring aliases from theme**: In `src/theme/animations.ts`, the springs `button`, `micro`, and `snappy` are all identical to `standard` (damping 18, stiffness 150). These aliases add cognitive load without semantic value. Remove `button`, `micro`, and `snappy` from the springs object. Search for any imports of these specific spring names across `src/` and replace with `springs.standard`. If any file uses `springs.button`, `springs.micro`, or `springs.snappy`, update to `springs.standard`.
