# War Loops — Habit Detail

Capture → spec → static mirror + moving version → multi-viewport fidelity compare → repair → gated stop.

**Target:** `Habit Detail.html` (claude.ai/design · Habit Tracker `fb57387b…`) — pulled verbatim via DesignSync
(authorized: user's own project). Subject = the `HabitDetailLive` screen in a 390×780 iOS `Phone` shell;
the `TweaksPanel` editor chrome is excluded. Default tweaks: `feel=celebrate · affordance=arrow · undoHint=true`.

## Deliverables
| | Path |
|---|---|
| **Spec** | `spec/habit-detail.spec.md` — layout, tokens, content, motion, responsive, validation |
| **Pencil** (static mirror) | `builds/pencil.html` — motionless idle pixel mirror, pure HTML/CSS |
| **Forge** (moving version) | `builds/forge.html` — full completion choreography, vanilla JS, no React (`?state=`, `?freeze=1`, `?stage=1`) |
| Source bundle | `source/` — verbatim tokens.js + JSX + offline render harness |
| Renders | `renders/` — source/pencil/forge × idle/done, live transition, 3-viewport stage, diff heatmaps, contact sheet |
| Scores | `scores/round{1..4}.json`, `scores/responsive.json` |

## Fidelity (SSIM vs genuine Chrome render of source) — gate ≥ 0.90
| Pair | Final |
|---|---|
| Pencil idle | **0.978** ✅ |
| Forge idle | **0.978** ✅ |
| Forge done | **0.976** ✅ |
| Responsive desktop / tablet / mobile | **0.992 / 0.991 / 0.974** ✅ |

**Stop reason:** all gates pass; last repair round gained <0.1% (stall). Residual ≈0.89 band = chain
link-glyph / day-label / 👇 sub-pixel anti-aliasing between identical definitions — rasterizer noise, not a defect.

## Reproduce
```
bun build-offline-source.ts                 # build offline source render
bun shot.ts <url> <out.png> 460 860 2 600   # CDP capture (Chrome --screenshot is broken in CfT 148)
bun motion.ts <url> <out.png> 240           # capture a live mid-transition frame
python3 score.py '[{"a":..,"b":..,"heat":..}]'
```
Open `builds/forge.html` directly in a browser and tap **Mark as done** to see the motion.
