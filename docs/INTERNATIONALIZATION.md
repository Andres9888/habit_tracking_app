# Internationalization (i18n) - Implementation Guide

## Overview

Chain Day now has a foundation for internationalization, enabling the app to support multiple languages and locale-specific formatting. This is **v1 - Foundation**, focusing on architecture and Japanese language support (priority for user's move to Japan).

## Current Support

### Languages
- **English** (`en`) - Default
- **日本語 / Japanese** (`ja`) - Full foundation support
- **Español / Spanish** (`es`) - Full foundation support

### What's Implemented

✅ **Infrastructure**
- i18next integration with React Native
- AsyncStorage persistence for language preferences
- Language selector in Settings modal
- Locale-aware date/time formatting utilities

✅ **Translation Coverage**
- Core UI elements (buttons, common actions)
- Settings screen
- Authentication screens
- Error messages
- Progress/motivation messages
- Notification templates

✅ **Locale Formatting**
- Date formatting (day names, month names)
- Number formatting (decimal/thousands separators)
- Currency formatting
- Relative time formatting

## Architecture

### File Structure

```
src/
├── i18n/
│   ├── config.ts              # i18next configuration
│   ├── useI18n.ts             # React hook for translations
│   ├── index.ts               # Public exports
│   └── locales/
│       ├── en.json            # English translations
│       ├── ja.json            # Japanese translations
│       └── es.json            # Spanish translations
├── utils/
│   └── localeFormat.ts        # Date/time/number formatting
└── App.tsx                    # i18n initialization
```

### Key Components

1. **`i18n/config.ts`**
   - Initializes i18next with react-i18next
   - Sets up AsyncStorage for persistence
   - Configures language detection and fallback

2. **`i18n/useI18n.ts`**
   - React hook providing `t()` translation function
   - Language switching: `changeLanguage(code)`
   - Current language access: `currentLanguage`

3. **`utils/localeFormat.ts`**
   - `formatDate()` - Locale-aware date formatting
   - `formatNumber()` - Number formatting (commas, decimals)
   - `formatCurrency()` - Currency with symbols
   - `formatRelativeTime()` - "2 hours ago" style

## Usage

### Basic Translation

```tsx
import { useI18n } from '../i18n';

function MyComponent() {
  const { t } = useI18n();
  
  return <Text>{t('common.save')}</Text>;
  // English: "Save"
  // Japanese: "保存"
  // Spanish: "Guardar"
}
```

### With Interpolation

```tsx
const { t } = useI18n();

// In translation file: "streakFreeze": "Your {{streak}}-day streak on {{emoji}} {{name}} is about to break"
t('notifications.streakFreeze', { 
  streak: 7, 
  emoji: '🔥', 
  name: 'Meditation' 
});
```

### Date Formatting

```tsx
import { useI18n } from '../i18n';
import { formatDate } from '../utils/localeFormat';

function MyComponent() {
  const { currentLanguage } = useI18n();
  const date = new Date();
  
  return (
    <Text>
      {formatDate(date, 'EEEE, MMMM d', currentLanguage)}
    </Text>
  );
  // English: "Monday, January 1"
  // Japanese: "月曜日, 1月 1"
  // Spanish: "lunes, enero 1"
}
```

### Number Formatting

```tsx
import { formatNumber, formatCurrency } from '../utils/localeFormat';

// Numbers
formatNumber(1234.56, 'en'); // "1,234.56"
formatNumber(1234.56, 'es'); // "1.234,56"
formatNumber(1234.56, 'ja'); // "1,234.56"

// Currency
formatCurrency(1999, 'USD', 'en'); // "$1,999.00"
formatCurrency(1999, 'JPY', 'ja'); // "¥1,999"
formatCurrency(1999, 'EUR', 'es'); // "1.999,00 €"
```

## Adding New Languages

### 1. Create Translation File

Create `src/i18n/locales/<code>.json` following the structure in `en.json`.

### 2. Update Configuration

```typescript
// src/i18n/config.ts
import newLang from './locales/<code>.json';

i18n.init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
    es: { translation: es },
    <code>: { translation: newLang }, // Add here
  },
  // ...
});
```

### 3. Add to Supported Languages

```typescript
// src/i18n/useI18n.ts
export type SupportedLanguage = 'en' | 'ja' | 'es' | '<code>';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // ...existing languages
  { code: '<code>', label: 'Name', nativeLabel: 'Native Name' },
];
```

### 4. Add date-fns Locale

```typescript
// src/utils/localeFormat.ts
import { <code> } from 'date-fns/locale';

const LOCALE_MAP: Record<SupportedLanguage, Locale> = {
  en: enUS,
  ja: ja,
  es: es,
  <code>: <code>,
};
```

## RTL Support (Future)

The architecture is prepared for Right-to-Left (RTL) language support (Arabic, Hebrew):

1. React Native has built-in RTL support with `I18nManager`
2. i18next supports RTL detection
3. Layouts using flexbox will automatically reverse

To enable:
```typescript
import { I18nManager } from 'react-native';
I18nManager.allowRTL(true);
I18nManager.forceRTL(true); // For testing
```

**Note:** Enabling RTL requires app restart on iOS.

## Migration Strategy

This is a **foundation release** - not all strings are translated yet. Migration approach:

### Phase 1 ✅ (Current)
- Infrastructure setup
- Settings screen
- Core actions (save, cancel, delete, etc.)
- Authentication flow
- Error messages

### Phase 2 (Next)
- Habit creation/editing
- All hardcoded UI strings
- Onboarding flow
- Premium features

### Phase 3 (Future)
- User-generated content (habit names, notes)
- AI-generated content localization
- Dynamic content

## Best Practices

### DO ✅
- Use `t()` for all user-facing strings
- Use `formatDate()` instead of hardcoded formats
- Use `formatNumber()` for numbers, counts, percentages
- Test all languages before releasing
- Keep translation keys organized by feature
- Use interpolation for dynamic content

### DON'T ❌
- Don't hardcode strings like "Today", "Tomorrow"
- Don't use `toLocaleDateString()` - inconsistent behavior
- Don't concatenate translated strings
- Don't translate developer-facing content (console.log, errors)
- Don't assume English sentence structure in other languages

## Testing

```bash
# 1. Change language in Settings
# 2. Verify translations appear correctly
# 3. Check date/number formatting
# 4. Restart app - language should persist

# Test different dates
const testDates = [
  new Date('2024-01-01'), // Monday
  new Date('2024-12-25'), // Wednesday
];

testDates.forEach(date => {
  console.log('en:', formatDate(date, 'EEEE, MMMM d', 'en'));
  console.log('ja:', formatDate(date, 'EEEE, MMMM d', 'ja'));
  console.log('es:', formatDate(date, 'EEEE, MMMM d', 'es'));
});
```

## Known Limitations

1. **Partial Translation Coverage** - Only core strings translated; migration in progress
2. **No Pluralization Yet** - Need to add plural rules for "1 habit" vs "2 habits"
3. **No Context Support** - Same word in different contexts uses same translation
4. **User Content** - Habit names, categories remain in user's input language

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
- [date-fns Locales](https://date-fns.org/docs/Locale)
- [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

## Questions?

This foundation provides the structure. Expand translations incrementally by:
1. Finding hardcoded strings
2. Adding to `locales/*.json`
3. Replacing with `t('key')`
4. Testing in all languages

Focus on high-traffic areas first (habit list, creation, streaks).
