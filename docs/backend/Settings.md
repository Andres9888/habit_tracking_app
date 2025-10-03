# Settings API (Convex)

Module: `convex/settings.ts`

## get (query)
- Args: `{}`
- Returns: `{ catTheme: boolean; darkMode: boolean; showCalendarView: boolean; showConsistency: boolean; showEmojis: boolean; showMotivationalMessages: boolean; showStreaks: boolean }`

## update (mutation)
- Args: `{ catTheme: boolean; darkMode: boolean; showCalendarView: boolean; showConsistency: boolean; showEmojis: boolean; showMotivationalMessages: boolean; showStreaks: boolean }`
- Returns: `null`

---

## Usage in client

```ts
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const settings = useQuery(api.settings.get);
const updateSettings = useMutation(api.settings.update);
await updateSettings({ darkMode: true, ...settings });
```
