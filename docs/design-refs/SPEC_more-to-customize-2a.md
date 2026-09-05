# Spec: "More to customize" panel, direction 2a

Target: `src/components/CreateHabitModal/` and `src/components/AdvancedOptions/` in `Andres9888/habit_tracking_app@main`.
Visual reference: `add-habit-more-to-customize.dc.html`, badges **2a** (screen) and **2b** (open states + reminder flow). "Current" and **1a** are earlier passes; ignore.

## 1. Summary of change

1. Rows in the panel rest **closed** (one 60px line each) and open **in place**, one at a time.
2. `EnhancedReminderSelector` moves **inside** the panel as row one, using the same row anatomy.
3. `AdvancedOptionsSummaryHeader` (summary chips + green "Customize/Hide" pill) is **removed**. The panel gets a plain caps label above the card instead.
4. Each row has **one hue** at a shared tint level; value chips echo the row hue. Green is reserved for the selected option inside pickers.
5. Icon / Color pickers above the panel: labels move **left**, caps style, action on the right. Icons on a 5-col grid with a "+" tile; colors on one row.
6. Copy rewritten (see §6). Keep strings verbatim.

## 2. Screen structure (top → bottom)

```
ScreenHeader (unchanged)
NameInputSection (unchanged)
SectionLabel "ICON"           right: "BROWSE ALL" (primary-700)
EmojiGrid 5 cols, gap 8, tiles aspect 1:1, last tile = "+" (dashed)
SectionLabel "COLOR"
ColorRow 10 cols, 26px dots, selected = 2px primary-500 ring, 2px gap
SectionLabel "MORE TO CUSTOMIZE"   right: "Optional" (12/600 text.secondary, not caps)
PanelCard
  Row: Daily reminder   (trailing = Switch)
  Row: Your why         (trailing = ValueChip + chevron)
  Row: Streak goal
  Row: Strength curve
  Row: Growth icons
```

Section spacing: 24px between sections. Horizontal padding 24px (existing `airyScale`).

## 3. Tokens (light theme)

| Name | Value | Use |
|---|---|---|
| panel.bg | `#F0EDE8` | PanelCard fill |
| panel.border | `#DDD8D2` | card border, row dividers |
| chip.rest.bg | `#F8F5F1` | option chip at rest, field fill |
| chip.rest.border | `#DDD8D2` 1px | |
| chip.selected.bg | `colors.primary[100]` `#D1FAE5` | selected option |
| chip.selected.border | `colors.primary[500]` `#10B981` 2px | |
| chip.selected.ink | `colors.primary[700]` `#047857` | |
| dot.suggested | `#059669` 5px circle | "suggested" marker |
| chevron | `#A39D95` | row chevron, 16px, stroke 2.2 |
| text.primary | `#2D2A26` | |
| text.secondary | `#6E6660` | hints, micro labels |
| label.caps | `#6B6560` 12/700, letter-spacing .8, uppercase | section labels |

Row hues (tile bg / ink). Tiles are 32×32, radius 9, icon 16px.

| Row | Tile bg | Ink | Unset chip border |
|---|---|---|---|
| Daily reminder | `#DCF1E7` | `#047857` | — |
| Your why | `#FBEBD9` | `#B45309` | `#E8C9A6` |
| Streak goal | `#FBF0CC` | `#8B6208` | `#E9D89A` |
| Strength curve | `#DCF1E7` | `#047857` | — |
| Growth icons | `#EBE4F7` | `#6D3AC7` | — |

Value chip: pill, padding 4×10, 12/600. **Set** = filled with tile bg + ink. **Unset** = transparent, 1.5px border in "unset chip border", ink text, label is a verb ("Add", "Set").

## 4. Components

### PanelCard
`bg panel.bg`, `border 1px panel.border`, `radius 16`, `shadow 0 1 3 rgba(45,42,38,.04)`, `paddingHorizontal 16`. Rows separated by `1px panel.border` top border (first row none).

### PanelRow (closed)
```
[Tile 32] gap10 [Title 15/600 ; Hint 12/500 secondary, 1 line, ellipsis] gap10 [Trailing] gap10 [Chevron ›]
minHeight 60, paddingVertical 12, alignItems center
```
Whole row is one Pressable (`accessibilityRole="button"`, `accessibilityState={{expanded}}`), except the Switch in the reminder row which is its own target. Hit target ≥ 44.

### PanelRow (open)
Same head at `minHeight 36`, chevron rotates to ˅ (180°, `durations.fast`). Body below with `marginTop 12`, row `paddingBottom 16`. Body children in order: `OptionChipRow`, optional inline extra (field / stepper / wheel / theme row), optional `HelperLine`, optional `DisclosureLink`.

Only one row open at a time: opening row N closes the open row. Height animates with `LayoutAnimation`/Reanimated `Layout` (respect `useReduceMotion`).

### OptionChip (shared by Streak, Curve, Growth, Reminder)
```
flex 1, minHeight 66, radius 14, padding 6–8 vertical, column, centered
rest:     chip.rest.bg / chip.rest.border 1px / value 17/700 text.primary
selected: chip.selected.bg / chip.selected.border 2px / value + label primary-700
value:    17/700 (numbers) or 15/700 (words), tabular-nums
label:    10/600 letter-spacing .3 uppercase, nowrap; secondary or primary-700 when selected
optional leading glyph: 18px emoji or 18px icon (Strength curve uses existing per-mode icons/colors: sprout #B0723A, trend #047857, mountain #6D3AC7)
suggested marker: 5px dot.suggested before label, label ink primary-700 (even when not selected)
```
Press feedback: existing `scale 0.97` pattern from `PresetButton`. Haptic on select.

### HelperLine
`10/600 letter-spacing .3 uppercase secondary`, leading 5px green dot (`flex:none`, top offset 3), wraps. `marginTop 8`.

### DisclosureLink
`˅ LABEL` 12/700 caps primary-700, minHeight 36, nowrap. Opens the deep-dive (existing `StrengthCurveExpand` / `GrowthIconsMoreThemes`).

### SectionLabel
Row: caps label left, optional action right (same caps style, primary-700 for actions, secondary 12/600 non-caps for "Optional"). `marginBottom 10`, `paddingHorizontal 2`.

## 5. Row specs

### Daily reminder (replaces `ToggleRow` + presets + `CustomTimeButton` + `NextReminderBadge`)
- Trailing: `Switch` (existing). Chevron only when enabled.
- Hint: enabled → `getNextReminderText(reminderTime)` ("Today at 6:45 PM (in 5h 49m)" / "Tomorrow at 7:00 AM"); disabled → "Off"; permission denied → "Notifications are off for this app" in `#B45309`.
- Value chip (closed + enabled): the time, filled green (`#DCF1E7` / `#047857`), tabular-nums.
- Switch ON → row opens, `snapDefaultToPresetOnEnable` behaviour: Morning selected if no prior time; otherwise restore last time.
- Chips: `DEFAULT_PRESETS` (🌅 Morning 7:00 AM · ☀️ Midday 12:00 PM · 🌙 Evening 8:00 PM) + **Custom** (clock icon, label "PICK"; once set, label = time).
- Tap Custom → inline time wheel (hour · minute · AM/PM) under chips in a `chip.rest.bg` card, radius 14, selection band `#EDEAE5` 36px. **No confirm**; value commits on scroll settle. Replaces `TimePickerModal` in this context (keep the modal for other callers).
- Helper (preset selected): "ONE NOTIFICATION A DAY. CHANGE OR TURN OFF ANYTIME." (wheel shown): "SAVES AS YOU SCROLL. NO CONFIRM STEP."
- Permission denied: amber banner (`#FBEBD9`, radius 14, padding 12×14) with bell-off icon, text "Your time is saved. Allow notifications in Settings to receive it." and pill button "Open Settings" (`#B45309` fill, white 12/700). Chips render at opacity .55, non-interactive.
- Switch OFF: row closes, time retained in state; hint "Off"; chip hidden.

### Your why
- Hint: unset → "One line you’ll see each time you check in"; set → the text, ellipsized.
- Chip: unset "Add" (outlined amber) / set "Set" (filled amber).
- Open: text field, `#fff` bg, 1.5px border `#E8C9A6` when focused else `panel.border`, radius 14, padding 14, 15/500, placeholder "I want to feel…", counter inside top-right 11/600 tabular (remaining chars, max 140). Autofocus on open. Helper: "SHOWN ABOVE COMPLETE TODAY".

### Streak goal
- Hint: "A target to aim for. Missing it costs nothing."
- Chip: none → "Set" outlined gold; else "{n} days" filled gold.
- Chips: `— NONE` · `7 DAYS` (suggested dot) · `30 DAYS` · `100 DAYS` · `··· CUSTOM`. Selecting CUSTOM shows a stepper card below: label "Custom target", `−` / value "21 days" / `+` (44px targets), value replaces `···` in the chip. Helper: "SUGGESTED · MOST NEW HABITS STICK AFTER A WEEK".

### Strength curve
- Hint closed: "How hard is this habit?"; open: "How hard is this habit? Easier habits build faster."
- Chip: mode name, filled green.
- Chips: Simple `+10%/DAY` (sprout) · Average `+3%/DAY` (trend, suggested) · Complex `+1%/DAY` (mountain). Helper: "SUGGESTED · MISSES COST LESS ON SLOWER CURVES". Disclosure: "SEE THE DIFFERENCE" → existing compare strip.

### Growth icons
- Hint: "The icon changes as your habit gets stronger". Tile shows the theme's first stage emoji.
- Chip: theme name, filled violet.
- Open: 5 stage chips (emoji 20px; labels NEW · (blank) · (blank) · YOURS · STRONG; YOURS chip is selected-styled and shows the habit's chosen icon), then theme row: 44px pills (emoji + name), selected = `#EBE4F7` bg + 2px `#6D3AC7` border + violet 12/700 text. Helper: "YOUR HABIT ICON STANDS IN FOR THE FOURTH STAGE".

## 6. Copy (verbatim)

- Section labels: `ICON`, `BROWSE ALL`, `COLOR`, `MORE TO CUSTOMIZE`, `Optional`
- Row titles: `Daily reminder`, `Your why`, `Streak goal`, `Strength curve`, `Growth icons` (sentence case)
- All hints, helpers, chip labels and placeholders as listed in §5.

## 7. Behaviour checklist

- [ ] One open row at a time; opening another closes the current (animated, reduce-motion aware).
- [ ] Tapping an open row's head closes it; the value chip in the head updates live while open.
- [ ] Reminder Switch is an independent target inside the row; ON opens the row, OFF closes it and keeps the time.
- [ ] Custom time wheel commits without a confirm step; chip label shows the picked time.
- [ ] Keyboard dismisses on any chip tap (existing behaviour).
- [ ] Haptics on chip select (existing `PresetButton` pattern).
- [ ] Accessibility: rows `button` + `expanded`; chips `button` + `selected`; helper lines `text`; chevron decorative.
- [ ] Dark theme: map via `useThemeColors`; row hues keep ink, drop tile bg lightness ~ same as existing `settingsColors` dark mapping.

## 8. Files likely touched

- `CreateHabitModal/components/CustomizeFields.tsx` (labels left, grid, color row)
- `CreateHabitModal/components/EnhancedReminderSelector/*` → becomes a `PanelRow` body
- `AdvancedOptions/AdvancedOptionsSection.tsx` (remove summary header, add SectionLabel + PanelCard)
- `AdvancedOptions/AdvancedOptionsRow.tsx` / `AdvancedOptionsSectionHead.tsx` → `PanelRow` (closed/open)
- `AdvancedOptions/StreakGoalChip.tsx`, `GrowthThemeChip.tsx`, `StrengthCurveInline.tsx` → share `OptionChip`
- `AdvancedOptions/useAdvancedTokens.ts` → row hue table from §3
- Delete: `AdvancedOptionsSummaryHeader.tsx`, `AdvancedOptionsSummaryChips.tsx`, `AdvancedOptionsToggleButton.tsx`, `StreakGoalStartBadge.tsx`
