# Emoji Category Pills — Scroll Affordance Mocks

## Context
The emoji picker's category pills (horizontal row below the search box) have no visual affordance indicating they're swipeable. Users may not discover categories beyond what's visible on screen.

**Current state:** Plain horizontal `ScrollView` with `showsHorizontalScrollIndicator={false}`, no fade/gradient/arrow/etc.

## Plan
Create a single HTML file with 10 different scroll affordance variations, styled to match the app's dark pill design. Open in browser for review.

### 10 Variations
1. **Right fade gradient** — trailing edge fades to transparent
2. **Both-edge fade** — fades on whichever side has more content
3. **Arrow indicator** — small chevron arrow on the right edge
4. **Peek/offset** — last visible pill is cut off mid-word to hint at more
5. **Scroll indicator dots** — small dot pagination below pills
6. **Animated nudge** — pills auto-scroll slightly on mount then bounce back
7. **"More" chip** — a final pill styled as "+5 more" counter
8. **Gradient + arrow combo** — fade gradient with a small arrow overlay
9. **Scrollbar thin line** — thin custom scrollbar below the pills
10. **Drag handle / grip lines** — subtle grip texture on the right edge

### Deliverable
- Single HTML file: `.superdesign/design_iterations/emoji_scroll_affordance_1.html`
- Mobile-width viewport (390px), dark background context
- Each variation as a labeled section the user can scroll through

### Files involved (read-only reference)
- `src/components/EmojiPickerV2/CategoryPills.tsx`
- `src/components/EmojiPickerV2/CategoryPills.styles.ts`

### Verification
- Open HTML file in browser
- Visually confirm all 10 variations render correctly
- Each clearly demonstrates its scroll affordance approach
