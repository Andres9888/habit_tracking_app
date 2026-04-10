# Calendar Timeline — Small Polish Tweaks

## Context
The calendar timeline is already well-polished after 5+ design iterations. The user wants to review and identify small improvements. This plan produces a single design mockup HTML showing current vs. proposed tweaks side-by-side.

## Current State Summary
- **Shelf**: Muted surface background, full-width
- **WeekNavRow**: Centered date pill (calendar icon + month + date + chevron-down), "Today" chip slides in for past weeks
- **DayStrip**: 7 × 44px circle cells with SVG progress rings, weekday labels (10px uppercase), streak connector arms
- **Today**: Amber border + breathing glow, "Today" label with `translateX: 3` manual nudge
- **Complete**: Solid emerald fill + check icon + green glow shadow
- **Future**: 0.3 opacity, dashed ring stroke
- **Missed**: 0.55 opacity (no other visual distinction)
- **Partial**: Amber border ring with progress arc

## Proposed Tweaks (Small, Targeted)

### 1. Missed Day Visual (Subtle)
**Current**: Just opacity 0.55 — visually ambiguous, blends with "empty but no data"
**Proposed**: Add a very faint warm-gray crosshatch or a tiny "—" dash in place of the completion dot for days with data but zero completion. This gives a gentle "you skipped" signal without being punitive.

### 2. Today Label Alignment Fix
**Current**: `translateX: 3` hardcoded to nudge "Today" label center — fragile across fonts/devices
**Proposed**: Remove the manual offset. Instead, ensure the label container has proper `textAlign: 'center'` with equal width. "Today" is already centered in its flex container — the translateX was likely compensating for perceived optical misalignment. Test removal first.

### 3. Month Prefix Readability
**Current**: 7px font for "MAR" prefix on the 1st — very hard to read
**Proposed**: Bump to 8px, slightly increase `marginBottom` to -0.5 (from -1) for breathing room. Keep bold weight.

### 4. Breathing Glow Cadence
**Current**: 2.5s full cycle (1250ms half-cycle) — feels slightly fast/anxious
**Proposed**: Slow to 3s full cycle (1500ms half-cycle) for a calmer, more meditative breathing rhythm.

### 5. Ghost Connector Styling
**Current**: Same solid bar as real connectors but at 0.5 opacity — hard to distinguish intent
**Proposed**: Use a dotted/dashed pattern (3px dash, 3px gap) instead of opacity reduction. This makes the "almost there" signal clearer and more intentional.

### 6. Date Pill Chevron Size
**Current**: ChevronDown at 11px — borderline too small to read as interactive
**Proposed**: Bump to 12px for slightly better tap affordance signaling. Keep strokeWidth at 2.

## Files to Modify
- `src/components/CalendarTimeline/components/DayCellContent.tsx` — Remove translateX hack (tweak 2)
- `src/components/CalendarTimeline/components/DayCellRing.styles.ts` — Month prefix font size (tweak 3), missed day styling (tweak 1)
- `src/components/CalendarTimeline/hooks/useTodayGlow.ts` — Glow cadence (tweak 4)
- `src/components/CalendarTimeline/components/ConnectorArms.tsx` — Ghost dashed pattern (tweak 5)
- `src/components/CalendarTimeline/components/WeekNavRow.tsx` — Chevron size (tweak 6)

## Design Mockup
Create `.superdesign/design_iterations/calendar_timeline_tweaks_1.html` showing current vs. proposed side-by-side for each tweak.

## Verification
- Open the HTML mockup in browser to visually compare
- After code changes: run `npx expo start` and visually verify on device/simulator
- Run existing tests: `npx jest --testPathPattern CalendarTimeline`
