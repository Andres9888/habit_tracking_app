# Articles API (Convex)

Module: `convex/articles.ts`

## list (query)
- Args: `{ category?: string }`
- Returns: `Array<Article>` where `Article` includes `_id`, `title`, `content`, `category`, `createdAt`
- Behavior: when `category` provided, uses `by_category` index and sorts `desc`

## seed (mutation)
- Args: `{}`
- Returns: `null`
- Behavior: Inserts initial articles if none exist.

---

## Usage in client

```ts
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const all = useQuery(api.articles.list) ?? [];
const foundation = useQuery(api.articles.list, { category: "foundation" }) ?? [];
```
