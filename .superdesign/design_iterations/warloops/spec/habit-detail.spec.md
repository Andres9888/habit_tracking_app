# Habit Detail — Fidelity Spec

> War Loops capture of `Habit Detail.html` from the claude.ai/design project **Habit Tracker**
> (`fb57387b-33f4-430b-a250-19c792ae7035`). Source pulled verbatim via DesignSync; rendered and
> measured in genuine headless Chrome (Chrome-for-Testing 148, CDP capture @2×).
>
> **Subject:** the iOS Habit Detail screen — `HabitDetailLive` inside a 390×780 `Phone` shell.
> The interactive `TweaksPanel` in the original file is **editor chrome, not part of the screen**, and is
> excluded from the mirror. Default tweak state captured: `feel=celebrate · affordance=arrow · undoHint=true`.

---

## 1. Intent

A single-habit detail screen for "Chain Day". The **streak numeral is the protagonist**; the screen's
job is to make "tap to mark done / tap to undo" obvious and to make the completion moment feel earned
(button fills, check scales in, streak ticks, today's chain link snaps in, confetti). Warm, minimal,
serif-display + sans-body, forest-green primary with a sparing burnished-gold streak accent.

## 2. Frame & layout

| Element | Value |
|---|---|
| Stage background | `#e9e5df` (centers the phone; `min-height:100vh`, flex center) |
| Phone shell | 390 × 780, `border-radius:44`, `padding:8`, bezel `inset 0 0 0 8px #0A0908`, drop `0 40px 80px rgba(0,0,0,.18)` |
| Inner screen | `border-radius:36`, background `#F5F1ED`, `padding-top:44` (status bar) |
| Status bar | height 44 · "9:41" DM Sans 14/600 · Dynamic Island 110×30 r20 `#000` centered · signal+battery glyphs right |
| Screen stack | TopBar (fixed) → scroll region [ Hero · CompleteControl · Calendar card · Strength card ] |

Vertical rhythm (screen-content origin, after the 44px status bar; values in CSS px):

```
TopBar      pad 4/16/10   back■36  ·  "Daily · Evening"  ·  ■36 more
Hero        pad 8/16/0
  icon tile 72 ── name +12 ── kicker +16 ── numeral +2 ── submeta +6 ── chain +16
CompleteControl  margin 16/24/0
  helper line (h22, the 👇 line) +8 ── button (pad 17/0) ── undo line (h18) +8
Calendar    card margin 16/16/0, pad 16
Strength    card margin 16/16/24, pad 16
```

> **Measured invariant:** the "Mark as done" button top sits at **CSS y≈506** from screen origin in
> *both* idle and done states. The helper line renders **≈22px** tall (the 👇 emoji enlarges the caption
> line box) — this +4px over the nominal 18px is structural and propagates to every element below it.
> Getting this wrong shifts the entire lower half by 4px (see §10).

## 3. Design tokens  *(verbatim from `tokens.js`)*

**Color**
- Canvas `--bg #F5F1ED` · Surface-L1 `--card #EDEAE5` · Card-white `#FFFFFF`
- Border `#DDD8D2` / muted `#E5E2DE`
- Text: primary `#2D2A26` · secondary `#6B6560` · tertiary `#6E6660` · inverse `#FFFFFF`
- Primary (forest green): 600 `#059669` · 700 `#047857` · 500 `#10B981` · 100 `#D1FAE5`
- Streak (burnished gold, ≤10% area): 100 `#FEF3CD` · 300 `#E8B94D` · 500 `#8B6208` · 700 `#7D5907`
- Strength levels: Starting `#4D7A0A` · Building `#16a34a` · Developing `#0d9488` · **Strong `#0891b2`** · Automatic `#059669`
- Semantic: success `#15793C` · error `#B53030` · warning `#9A5504`
- Gray: g50 `#FAF8F5` · g100 `#F5F1ED` · g200 `#DDD8D2` · g400 `#6E6660` · g500 `#6B6560` · g700 `#3D3833` · g800 `#2D2A26`

**Type** — Literata (serif display/H1) · DM Sans (body/UI) · JetBrains Mono (numeric)
| Role | Family / size / weight / tracking / line |
|---|---|
| Hero name | Literata 23 / 700 / −0.3 |
| Streak numeral | Literata 60 / 600 / −2 / 64 |
| Kicker ("CURRENT STREAK") | DM Sans 11 / 700 / +1.6 / uppercase |
| Body | DM Sans 17 / 400 / 24 |
| Body-small (submeta) | DM Sans 14 / 400 / 20 |
| Caption (helper, hints, labels) | DM Sans 13 / 500 / 18 |
| Strength % | JetBrains Mono 26 / 700 |

**Spacing** (8px grid) xs4 · sm8 · md12 · base16 · lg24 · xl32 · xxl48
**Radius** rXs4 · rSm8 · rMd12 · **rLg16** · rXl24 · rFull9999
**Shadow** card `0 2px 8px rgba(45,42,38,.06)`

## 4. Content (exact)

- Habit: 🧘 **Evening meditation** · cadence "Daily · Evening"
- Streak **47** (→ **48** when done today) 🔥 · "best **52** · 128 total"
- Chain: Mon–Sat filled (link icon), **Today** outlined when not done
- CTA "Mark as done" → "Done for Today"; helper "👇 Tap to log today"; undo "Tap again to undo"
- Calendar "June" · "Tap any day to edit" · 35-cell grid, today = cell idx 27, fill pattern `[2,3,4,6,8,9,10,11,13,15,16,17,18,20,22,23,24,25,26]`, future cells dashed @0.5
- Strength ring **68%** · "Strong" (`#0891b2`) · "Up 6% this month — keep showing up"

## 5. Components

**TopBar** — back chevron in 36px `#EDEAE5` circle · centered caption `#6E6660`/600 · ⋯ (3-dot, `#524D47`) in 36px circle.
**Hero** — 72px icon tile (r16, `#EDEAE5`; → `#D1FAE5` + success badge when done) · serif name · kicker · 60px streak numeral (`#2D2A26` idle → `#7D5907` gold when done) + 🔥 · submeta.
**ChainStrip** — 7 columns, gap 7. Day links 26×26 r9, filled `#059669` w/ white link glyph; Today = `#DDD8D2` w/ 2px `#059669` border (idle) → fills + `0 0 0 4px #D1FAE5` ring (done). Labels caption-10; "Today" g700/700.
**CompleteControl** — helper line (👇 + "Tap to log today", caption g500); the button = full-width, pad 17/0, r16, **2px `#15793C` border**, transparent (idle) → filled `#15793C` (done); 24px indicator (outline ring → white disc + success check); label success-green → white. Undo line below when done.
**Calendar card** — g50 surface, header "June" (16/600) + hint; 7-col grid gap 6; cells aspect-1 r8; today = 2px primary border + center dot (idle) → fill + white check (done); future = dashed @0.5.
**Strength card** — 72px SVG ring (track g200, value `#0891b2`, 8px stroke, `stroke-dashoffset` for 68%), mono "68%" centered; "HABIT STRENGTH" / "Strong" / trend line.

## 6. Motion spec

Keyframes (verbatim):
```
hd-pulse    2s  ∞    box-shadow 0→13px halo, rgba(5,150,105,.34)→0   (affordance=pulse)
hd-arrow    1.2s ∞   translateY 0→4→0                                (affordance=arrow, the 👇)
hd-confetti 600/720ms cubic-bezier(.18,.7,.3,1)  translate(var)+rotate, opacity→0
hd-pop      .4–.45s cubic-bezier(.2,1.5,.4,1)  scale .4→1.28→1
hd-tick     .5s cubic-bezier(.2,1.2,.4,1)  translateY 0→−7(.45α)→0
```
**Completion choreography** (tap "Mark as done" / today's calendar cell):
1. Button `background` transparent→`#15793C` over **.32s** `cubic-bezier(.3,0,.2,1)`; press `scale(.97)` .12s.
2. Indicator: outline ring fades/`scale(.6)`; white disc `scale .2→1` over **.28s** `cubic-bezier(.2,1.5,.4,1)` +.04s, check appears.
3. Streak numeral `47→48`, color→gold `#7D5907`, **hd-tick .5s**.
4. Today chain link fills + **hd-pop .45s** + `0 0 0 4px #D1FAE5` ring.
5. Hero icon tile → `#D1FAE5` (.4s) + success badge **hd-pop .4s**.
6. Confetti **Burst** (celebrate: 14 pieces; bold: 22) from streak numeral + button, 5-color [`#10B981 #8B6208 #E8B94D #059669 #0891b2`], 600/720ms.
7. Copy: helper hides; "Done for Today"; "Tap again to undo" appears. Tap again fully reverses.

**Variants** (TweaksPanel): `feel` = calm (no confetti) · **celebrate** (default) · bold (intenser burst). `affordance` = pulse (halo) · glow (ring+shadow) · **arrow** (default 👇) · none. `undoHint` toggles the undo line. `@media (prefers-reduced-motion)` kills all animation.

## 7. Responsive behavior

**The screen is a fixed-width 390px phone mock — it is not fluid.** The stage flex-centers the fixed
phone; content geometry is viewport-invariant. At viewport width ≤ ~410px (mobile) the phone + bezel
exceed the viewport and the **right edge clips** (⋯ button, calendar's Sat column). This is intrinsic to
the source and is reproduced identically by the clones. Verified at desktop 1280, tablet 834, mobile 390.

## 8. States captured

`idle` (done=false, default) · `done` (done=true, settled — confetti elapsed).

## 9. Builds

- **Pencil** (`builds/pencil.html`) — static, motionless pixel mirror of the idle default. Pure HTML/CSS, no JS except static grid generation. Same Phone-shell geometry + tokens.
- **Forge** (`builds/forge.html`) — the moving version. Self-contained vanilla JS/CSS, **no React**, reproducing the full completion choreography from §6. Interactive (tap button or today's cell; tap again undoes). `?state=idle|done`, `?freeze=1` (settle for capture), `?stage=1` (responsive stage).

## 10. Fidelity validation  *(SSIM, box-window @2×, vs genuine source render)*

| Pair | Round 1 | Final | Gate ≥0.90 |
|---|---|---|---|
| Pencil idle vs source idle | 0.9068 | **0.9779** | ✅ |
| Forge idle vs source idle | 0.9070 | **0.9782** | ✅ |
| Forge done vs source done | 0.9078 | **0.9761** | ✅ |
| Responsive desktop (source vs forge) | — | **0.9916** | ✅ |
| Responsive tablet | — | **0.9907** | ✅ |
| Responsive mobile | — | **0.9738** | ✅ |

**Repairs applied:** (1) chain→button gap was 4px short in both clones (the 👇 helper line box is 22px,
not 18) → fixed; lifted idle 0.907→0.978. (2) Same +4px is structural in the done state too → keep
helper slot at 22px in both states; lifted done 0.908→0.976. (3) Helper set to `inline-flex gap:6 line:18`
to match source's span (marginal).

**Residual gap (accepted):** weakest band ≈0.89 localized to the chain link-glyphs, day labels, and 👇 —
sub-pixel anti-aliasing between identical glyph/SVG definitions, not a layout or token defect. Below the
2%-per-round improvement floor → **stall**; further repair would chase rasterizer noise.
