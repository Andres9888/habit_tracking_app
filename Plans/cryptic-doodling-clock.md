# Pain Point 3: Trust Fixes

## Context

Users see fabricated data ("2.4k users", "5-10 min"), a meaningless science badge on 100% of cards, citations dressed up as quotes, and a CTA that implies skipping customization is wrong. These erode trust — the app's core differentiator is "science-backed" and these issues undermine it.

## Changes (5 surgical edits)

### 1. Remove hardcoded "5-10 min" pill
**File:** `src/components/FullsizeTemplatePreview/components/HeroSection.tsx:82`

Delete the line:
```tsx
<MetadataPill iconColor={iconColor}>⏱️ 5-10 min</MetadataPill>
```
No duration field exists in the schema. Keep the 2 accurate pills (frequency + category).

---

### 2. Fix hardcoded "2.4k users" in HeroFooter
**File:** `src/screens/TemplatesScreen/components/FeaturedCollection/HeroFooter.tsx:12`

Replace `2.4k users` with `Science-backed collection`. The HeroFooter has no data props and `FeaturedCollection` only receives `onPress`, so wiring real counts would require prop drilling through `MainBrowseView`. The honest static text is the minimal fix.

---

### 3. Restructure ScienceBox — citation display
**File:** `src/components/FullsizeTemplatePreview/components/ScienceBox.tsx`

Three changes:
- **Header:** Change `SCIENCE BEHIND THIS HABIT` → `WHY THIS WORKS` when no `scientificLink` exists. Keep `SCIENCE BEHIND THIS HABIT` when there IS a verifiable link.
- **Citation display:** Remove the wrapping quotation marks from the reference text. It's a citation, not a quote. Drop the italic `fontStyle`.
- **Link text:** Change `Read Research` → `Read Full Study` for clarity.

**Style file:** `src/components/FullsizeTemplatePreview/styles/science.styles.ts`
- Remove `fontStyle: 'italic'` from `scienceQuote` (line 67)

---

### 4. Fix science badge — only show for verified research
**File:** `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx:53`

Change:
```tsx
hasResearch={!!item.scientificReference}
```
To:
```tsx
hasResearch={!!item.scientificLink}
```

Note: `CollapsibleCategorySection/TemplatesList.tsx:49` already correctly uses `Boolean(template.scientificLink)`. This fix brings `PopularSection` into alignment.

---

### 5. Reframe "Customize First →" CTA
**File:** `src/components/FullsizeTemplatePreview/components/FooterSection.tsx:101`

Change:
```tsx
Customize First →
```
To:
```tsx
Make it yours
```

Also update the accessibility label on line 92 from `'Customize habit before importing'` to `'Personalize habit before adding'`.

---

## Files Modified (5)

| File | Change |
|------|--------|
| `src/components/FullsizeTemplatePreview/components/HeroSection.tsx` | Delete line 82 (fake duration pill) |
| `src/screens/TemplatesScreen/components/FeaturedCollection/HeroFooter.tsx` | Replace "2.4k users" with honest text |
| `src/components/FullsizeTemplatePreview/components/ScienceBox.tsx` | Conditional header, remove fake quotes, update link text |
| `src/components/FullsizeTemplatePreview/styles/science.styles.ts` | Remove italic from citation style |
| `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx` | `scientificReference` → `scientificLink` |
| `src/components/FullsizeTemplatePreview/components/FooterSection.tsx` | "Customize First →" → "Make it yours" |

## Verification

1. Open any template preview → confirm only 2 pills (frequency + category), no "5-10 min"
2. Open Habit Library main screen → confirm hero footer says "Science-backed collection"
3. Open a template WITH `scientificLink` → header says "SCIENCE BEHIND THIS HABIT", link says "Read Full Study"
4. Open a template WITHOUT `scientificLink` → header says "WHY THIS WORKS", no link button
5. Both cases → citation shown without quotation marks, not italic
6. Check trending carousel → only templates with `scientificLink` show the 🔬 badge
7. Preview footer → "Make it yours" text, no arrow
