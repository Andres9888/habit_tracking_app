# Habit Add Page - Lo-Fi Wireframes
*Low-fidelity mockups for UX improvements*

---

## Current vs Improved - Side by Side

### CURRENT DESIGN (What we have now)

```
┌─────────────────────────────┐
│  Create Habit           [X] │
├─────────────────────────────┤
│                             │
│  📚 Templates ↓             │
│  [Browse templates...]      │
│                             │
│  ┌───────────────────────┐ │
│  │ Preview               │ │
│  │  [ ] Name...          │ │
│  └───────────────────────┘ │
│                             │
│  Habit Name                 │
│  ┌───────────────────────┐ │
│  │ Enter habit name...   │ │
│  └───────────────────────┘ │
│                             │
│  Icon                       │
│  [None][🏃][📚][💧]...     │
│                             │
│  Color                      │
│  ● ● ● ● ● ● ● ●           │
│                             │
│  Reminders                  │
│  ○ Enable reminders         │
│                             │
│  ┌───────────────────────┐ │
│  │   Create Habit        │ │
│  └───────────────────────┘ │
└─────────────────────────────┘

ISSUES:
→ Too much scrolling
→ Templates buried
→ All options shown
→ Suggestions below input
```

---

### IMPROVED DESIGN (Recommended)

```
┌─────────────────────────────┐
│  Create Habit           [X] │
├─────────────────────────────┤
│                             │
│  🎯 Quick Start             │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │ 🏃   │ │ 📚   │ │ 💧   ││
│  │ Run  │ │ Read │ │Water ││
│  └──────┘ └──────┘ └──────┘│
│  [See all templates →]      │
│                             │
│  What habit?          0/50  │
│  ┌───────────────────────┐ │
│  │ _                     │ │
│  └───────────────────────┘ │
│                             │
│  💡 Tap to use              │
│  ┌───────────────────────┐ │
│  │ 🧘 Meditate          ✨││
│  ├───────────────────────┤ │
│  │ 🏃 Exercise          ✨││
│  ├───────────────────────┤ │
│  │ 📚 Read              ✨││
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ ✨ Preview            │ │
│  │  ┌───┐                │ │
│  │  │🏃 │ Morning Run    │ │
│  │  └───┘                │ │
│  │  ○○○○○○○ This week   │ │
│  └───────────────────────┘ │
│                             │
│  ⚙️ More options ▼         │
│                             │
│  ┌───────────────────────┐ │
│  │   Create Habit        │ │
│  └───────────────────────┘ │
└─────────────────────────────┘

IMPROVEMENTS:
✓ Templates at top
✓ Suggestions above input
✓ Better preview
✓ Advanced collapsed
✓ Less scrolling
```

---

## Detailed Screens

### Screen 1: Initial State (Empty)

```
┌─────────────────────────────┐
│ [<] Create Habit        [X] │
├─────────────────────────────┤
│                             │
│  🎯 Quick Start             │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │  🏃  │ │  📚  │ │  💧  ││
│  │      │ │      │ │      ││
│  │ Run  │ │ Read │ │Water ││
│  │Daily │ │Daily │ │8x   ││
│  └──────┘ └──────┘ └──────┘│
│                             │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │  🧘  │ │  💪  │ │  😴  ││
│  │      │ │      │ │      ││
│  │Yoga  │ │Gym   │ │Sleep ││
│  │15min │ │1hr   │ │8hr  ││
│  └──────┘ └──────┘ └──────┘│
│                             │
│  [Browse all 24 →]          │
│                             │
│  OR                         │
│                             │
│  What habit do you want     │
│  to build?            0/50  │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │ Type here...          │ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│                             │
│  ┌───────────────────────┐ │
│  │ ✨                    │ │
│  │ Your habit will       │ │
│  │ appear here           │ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│                             │
│  ┌───────────────────────┐ │
│  │   Create Habit        │ │
│  │   (disabled)          │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

---

### Screen 2: User Typing "medi..."

```
┌─────────────────────────────┐
│ [<] Create Habit        [X] │
├─────────────────────────────┤
│                             │
│  [Quick Start collapsed]    │
│                             │
│  What habit do you want     │
│  to build?            4/50  │
│  ┌───────────────────────┐ │
│  │ medi|                 │ │
│  └───────────────────────┘ │
│                             │
│  💡 Tap to use              │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  🧘 Meditate       ✨ │ │
│  │  Purple color         │ │
│  │                       │ │
│  └───────────────────────┘ │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  💊 Medicine       ✨ │ │
│  │  Red color            │ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│                             │
│  ┌───────────────────────┐ │
│  │ ✨ Preview            │ │
│  │                       │ │
│  │  ┌───┐               │ │
│  │  │ ? │  medi         │ │
│  │  └───┘               │ │
│  │                       │ │
│  │  👇 Pick icon below   │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │   Create Habit        │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

---

### Screen 3: After Tapping Suggestion

```
┌─────────────────────────────┐
│ [<] Create Habit        [X] │
├─────────────────────────────┤
│                             │
│  What habit do you want     │
│  to build?           10/50  │
│  ┌───────────────────────┐ │
│  │ Meditate              │ │
│  └───────────────────────┘ │
│                             │
│  ✓ Auto-filled!             │
│                             │
│                             │
│  ┌───────────────────────┐ │
│  │ ✨ Live Preview       │ │
│  │                       │ │
│  │  ┌────┐              │ │
│  │  │ 🧘 │ Meditate     │ │
│  │  └────┘              │ │
│  │  (purple background)  │ │
│  │                       │ │
│  │  This week:           │ │
│  │  ○ ○ ○ ○ ○ ○ ○      │ │
│  │  S M T W T F S        │ │
│  └───────────────────────┘ │
│                             │
│  ⚙️ More options ▼         │
│  (Customize icon,           │
│   color, reminders)         │
│                             │
│                             │
│                             │
│  ┌───────────────────────┐ │
│  │   Create Habit        │ │
│  │   (active!)           │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

---

### Screen 4: Advanced Options Expanded

```
┌─────────────────────────────┐
│ [<] Create Habit        [X] │
├─────────────────────────────┤
│                             │
│  Meditate             10/50 │
│  ┌───────────────────────┐ │
│  │ Meditate              │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ ✨ Preview            │ │
│  │  ┌────┐              │ │
│  │  │ 🧘 │ Meditate     │ │
│  │  └────┘ Daily        │ │
│  │  ○ ○ ○ ○ ○ ○ ○      │ │
│  └───────────────────────┘ │
│                             │
│  ⚙️ More options ▲         │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │ Choose Icon           │ │
│  │                       │ │
│  │ [None] [🧘] [🏃] [📚]│ │
│  │ [💧] [🎯] [→]        │ │
│  │                       │ │
│  │ Choose Color          │ │
│  │                       │ │
│  │ ● ● 🟣 ● ● ● ● ●     │ │
│  │                       │ │
│  │ [🎨 Custom]           │ │
│  │                       │ │
│  │ ⏰ Daily Reminder     │ │
│  │                       │ │
│  │ ○ Remind me daily     │ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │   Create Habit        │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

---

## Key Interaction Patterns

### Pattern 1: Quick Template Flow
```
[User opens modal]
       ↓
[Sees 6 popular templates]
       ↓
[Taps "🏃 Run"]
       ↓
[Auto-filled + Preview updates]
       ↓
[Taps "Create"]
       ↓
Done! (2 taps)
```

### Pattern 2: Smart Suggestion Flow
```
[User types "med"]
       ↓
[Suggestions appear above]
       ↓
[Taps "🧘 Meditate"]
       ↓
[Name, emoji, color auto-filled]
       ↓
[Taps "Create"]
       ↓
Done! (3 taps + typing)
```

### Pattern 3: Full Custom Flow
```
[User types habit name]
       ↓
[Ignores suggestions]
       ↓
[Expands "More options"]
       ↓
[Picks custom emoji]
       ↓
[Picks custom color]
       ↓
[Sets reminder]
       ↓
[Taps "Create"]
       ↓
Done! (6+ taps + typing)
```

---

## Component Breakdown

### A) Template Cards (Top Section)
```
┌──────────────┐
│    🏃        │  ← Large emoji (40px)
│              │
│    Run       │  ← Bold name
│    Daily     │  ← Small descriptor
└──────────────┘
   56px × 80px
   12px gap between
```

### B) Smart Suggestion Card
```
┌─────────────────────────────┐
│                             │
│  🧘  Meditate          ✨  │  ← Emoji + Name + Sparkle
│  Purple color               │  ← Small hint text
│                             │
└─────────────────────────────┘
  Full width
  48px height (tap target)
  8px gap between cards
```

### C) Enhanced Preview
```
┌─────────────────────────────┐
│ ✨ Live Preview             │  ← Label
├─────────────────────────────┤
│                             │
│  ┌────┐                    │
│  │ 🧘 │  Meditate          │  ← Icon + Name
│  └────┘  Daily             │  ← Frequency
│                             │
│  This week:                 │
│  ○ ○ ○ ○ ○ ○ ○            │  ← Week preview
│  S M T W T F S              │
│                             │
└─────────────────────────────┘
```

### D) Collapsible Section
```
⚙️ More options ▼  ← Collapsed
(tap to expand)

⚙️ More options ▲  ← Expanded
┌─────────────────┐
│ [Options here]  │
└─────────────────┘
```

---

## Spacing & Sizing

```
Top padding:        16px
Section gaps:       24px
Card padding:       16px
Button height:      56px
Input height:       56px
Icon cards:         80px tall
Suggestion cards:   48px tall (min tap target)
Bottom padding:     32px
```

---

## What Changes?

### Moving UP:
- ✓ Templates (from middle → top)
- ✓ Smart suggestions (from bottom → above input)

### Moving DOWN:
- ✓ Advanced options (collapsed at bottom)

### NEW:
- ✓ Character counter (0/50)
- ✓ Week preview in preview card
- ✓ Better empty states
- ✓ Larger tap targets
- ✓ Auto-fill from suggestions

### REMOVED:
- Nothing! Just reorganized

---

## Next Steps?

Ready to implement? We can start with:

**Option A**: Quick Wins Only
- Reorder suggestions
- Add character counter
- Better empty states
*Time: 1-2 hours*

**Option B**: Full Smart Simplified
- All of Option A
- Collapsible advanced options
- Auto-fill from suggestions
- Enhanced preview
*Time: 3-5 hours*

Which one should we build? 🚀
