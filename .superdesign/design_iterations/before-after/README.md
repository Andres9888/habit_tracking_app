# Habit Detail — Before & After

Imported from claude.ai/design · **Habit Tracker** (`fb57387b…`), file `Habit Detail Before & After.html`,
via the DesignSync MCP (`get_file`). Implemented = reproduced as a faithful, runnable build.

## What this design is
A **before/after design canvas** (Figma-style pan/zoom board) arguing the Habit Detail redesign — not an app
screen itself. It contains:
- **Intro** — "Making the screen do more, not just look nicer"
- **Full screen** — Before (current) vs After (redesigned) phones, side by side, + a "What changed" notes list
- **The new interactions, up close** — three frames the current screen can't express: tap-a-day → note + backfill, at-risk tonight, completed (bar settles)

## The redesign (what After changes)
1. Complete action → **sticky bar** pinned over the scroll (was an inline button that scrolled below the fold)
2. Hero leads with the **streak numeral 47🔥** (was a 3-up equal stat band)
3. Month chain becomes **interactive** — tap a done day to read its note, tap a missed day (dashed +) to backfill
4. Header gains a **••• overflow** (Edit · Share · Archive)
5. Strength keeps the projection card; nothing removed, just re-prioritised

## Files
| | |
|---|---|
| `source/index.html` | faithful re-host of the original (CDN React/Babel) — open to run with pan/zoom |
| `source/*.jsx`, `source/tokens.js` | the imported deps, verbatim (tokens · design-canvas · habit-card · detail-screens · detail-fullscreen · main) |
| `before-after.offline.html` | self-contained build — React/JSX/fonts inlined, renders with no network. `?flat=1` = full canvas in normal flow (for capture) |
| `renders/canvas-full.png` | full-canvas render @2× (genuine headless Chrome) |
| `build-offline.ts` | builder (transpile + inline) |

## Run it
- `source/index.html` — the original, interactive (drag to pan, pinch/scroll to zoom), needs network.
- `before-after.offline.html` — same thing, offline. Add `?flat=1` to drop the pan/zoom and see the whole board.

## Fidelity
Built from the source files **verbatim** (same JSX, tokens, font set incl. Literata italic + DM Sans 800) →
fidelity is by construction; confirmed visually against the source layout in `renders/canvas-full.png`.

> This is the **design canvas** implemented. Porting the *After* redesign into the live RN app
> (`src/screens/HabitDetailScreen` — sticky complete bar, interactive backfill chain, at-risk state, ••• menu)
> is a separate, larger task — not done here.
