# Convex File Storage

## Overview

Use Convex File Storage for app-owned uploads in this Habit Tracking app.

The app already uses Convex, and the local dependency is pinned to `convex@1.21.0` in `package.json` and `package-lock.json`. Convex File Storage supports arbitrary file types, stores files under `Id<"_storage">`, and lets Convex queries, mutations, actions, and HTTP actions generate file URLs or read/write/delete blobs.

Recommended first use cases:

- User profile images and small app-owned media.
- Files whose authorization can be checked before returning a URL.
- Files where non-expiring bearer URLs are acceptable after the app intentionally shares them.

Do not use direct Convex file URLs for private data that must be re-authorized on every read. For those flows, serve through an authenticated HTTP action for files up to 20 MiB, or use Cloudflare R2 if expiring URLs are required.

## Selection Rationale

Selected option: **Convex File Storage**.

| Option | Fit | Pricing snapshot | Limits / operational notes | Decision |
| --- | --- | --- | --- | --- |
| Convex File Storage | Best fit because the app already uses Convex functions, Convex auth context, generated `Id<"_storage">` types, and existing storage ownership patterns. | Convex pricing page, checked 2026-07-14: Free/Starter includes 1 GB file storage, then `$0.033/GB`; Professional includes 100 GB, then `$0.03/GB`. File accesses count as function calls per Convex limits docs. | Generated upload URLs expire in 1 hour. Upload POST has a 2 minute timeout. HTTP action responses are limited to 20 MiB. Direct file URLs are bearer URLs and are revoked only by deleting the file. | Choose for first implementation. Lowest complexity and strongest integration with existing Convex data model. |
| Cloudflare R2 | Good if the app needs expiring URLs, custom-domain public asset serving, or cheaper high-egress object storage. Convex docs explicitly recommend considering the Convex Cloudflare R2 component when expiring file URLs are needed. | Cloudflare R2 pricing, last updated 2026-05-28: Standard storage `$0.015/GB-month`, Class A `$4.50/million`, Class B `$0.36/million`, egress free, 10 GB-month free tier for Standard. | R2 public `r2.dev` bucket access is for testing, can throttle at hundreds of requests/sec, and production should use a custom domain. Object size is 5 GiB less than 5 TiB; single upload/part limit is 5 MiB less than 5 GiB. Cloudflare REST API is 1,200 requests per 5 minutes; use S3-compatible or Workers API for object traffic. | Defer. Add only if expiring URLs or public asset economics become requirements. |
| AWS S3 | Strong general-purpose object storage, mature IAM, lifecycle, replication, multipart upload, and ecosystem support. | AWS S3 pricing is region-specific and should be checked in AWS Pricing Calculator. The S3 pricing page documents request charges, storage class charges, data retrieval charges for infrequent/archive classes, and that DELETE/CANCEL requests are free. | AWS multipart docs checked 2026-07-14 list 48.8 TiB maximum object size, 10,000 parts, and 5 MiB to 5 GiB part size. Requires AWS credentials, bucket policy/CORS, presigned URL code, IAM rotation, and lifecycle management. | Defer. Too much operational surface for current app-owned media. |

Practical conclusion: start with Convex File Storage because the app already has Convex auth, database, generated types, and deployment tooling. Revisit R2 when bearer URL permanence becomes unacceptable or public asset traffic makes Convex file access/function-call pricing unattractive. Revisit S3 only for AWS-specific compliance, lifecycle, or ecosystem needs.

## Installation

No new library is required for the selected option.

Current local dependency:

```json
{
  "dependencies": {
    "convex": "1.21.0"
  }
}
```

If a future branch lacks Convex, install the exact version intentionally rather than floating:

```bash
npm install convex@1.21.0
```

Context7 note: Context7 tools are not exposed in this Codex session, so no Context7 library ID could be resolved. The selected library is the official `convex` npm package, verified locally at `1.21.0`, and API details below are from official Convex docs checked on 2026-07-14.

## Configuration

### Environment variables

Direct upload URL flow requires no storage-provider-specific environment variables beyond the app's normal Convex client/server setup.

| Variable | Required | Where | Purpose |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_CONVEX_URL` | Yes for this Expo app's Convex client setup if already used by the app. | Client build env / `.env.local` | Convex deployment URL for the React Native client. Keep using the app's existing provider wiring. |
| `CONVEX_DEPLOYMENT` | Usually present in Convex-managed local env. | `.env.local` / Convex CLI | Identifies the Convex deployment for CLI workflows. |
| `VITE_CONVEX_SITE_URL` | Only for web examples or HTTP-action file serving examples. In Expo, use the equivalent public site URL env if needed. | Client | Base URL for Convex HTTP actions, e.g. `https://...convex.site`. |
| `CLIENT_ORIGIN` | Only for custom HTTP upload actions with browser CORS. | Convex dashboard env / deployment env | Allowed origin for CORS response headers. |

Do not add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, or `R2_BUCKET` for the selected Convex File Storage path. Those belong only to deferred S3/R2 implementations.

### Init Code

No storage client init is needed. Convex exposes storage on function context:

- `ctx.storage.generateUploadUrl()` in mutations.
- `ctx.storage.getUrl(storageId)` in queries, mutations, and actions.
- `ctx.storage.delete(storageId)` in mutations and actions.
- `ctx.storage.get(storageId)` and `ctx.storage.store(blob)` in actions and HTTP actions.

Example schema fields:

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userFiles: defineTable({
    userId: v.string(),
    storageId: v.id("_storage"),
    contentType: v.optional(v.string()),
    size: v.optional(v.number()),
    purpose: v.union(v.literal("profileImage"), v.literal("attachment")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_storage", ["storageId"]),
});
```

## Key Patterns

### 1. Generate a Short-Lived Upload URL

Generate the upload URL immediately before upload. Convex docs state this URL expires in 1 hour.

```ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateProfileImageUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});
```

### 2. Upload From The Client, Then Persist The Storage ID

The client posts file bytes to the generated URL and receives JSON containing `storageId`.

```ts
const uploadUrl = await generateProfileImageUploadUrl();

const uploadResult = await fetch(uploadUrl, {
  method: "POST",
  headers: { "Content-Type": file.type },
  body: file,
});

if (!uploadResult.ok) {
  throw new Error(`Upload failed: ${uploadResult.status}`);
}

const { storageId } = (await uploadResult.json()) as { storageId: string };

await saveProfileImage({ storageId });
```

### 3. Save The Storage ID Server-Side

Always validate `v.id("_storage")` server-side. Store ownership metadata in app tables before exposing URLs.

```ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveProfileImage = mutation({
  args: { storageId: v.id("_storage") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const metadata = await ctx.db.system.get("_storage", args.storageId);
    if (!metadata) {
      throw new Error("Uploaded file not found");
    }

    await ctx.db.insert("userFiles", {
      userId: identity.subject,
      storageId: args.storageId,
      contentType: metadata.contentType,
      size: metadata.size,
      purpose: "profileImage",
      createdAt: Date.now(),
    });

    return null;
  },
});
```

### 4. Return A URL After Authorization

`Id<"_storage">` values are safe to store and pass through Convex functions. URLs from `getUrl()` are bearer URLs, so only return them after checking the caller can see the file.

```ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getProfileImageUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const owned = await ctx.db
      .query("userFiles")
      .withIndex("by_storage", (q) => q.eq("storageId", args.storageId))
      .unique();

    if (!owned || owned.userId !== identity.subject) {
      return null;
    }

    return await ctx.storage.getUrl(args.storageId);
  },
});
```

### 5. Delete File And Ownership Row Together

Deleting a file makes previously generated URLs return 404.

```ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deleteUserFile = mutation({
  args: { storageId: v.id("_storage") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const owned = await ctx.db
      .query("userFiles")
      .withIndex("by_storage", (q) => q.eq("storageId", args.storageId))
      .unique();

    if (!owned || owned.userId !== identity.subject) {
      throw new Error("File not found");
    }

    await ctx.storage.delete(args.storageId);
    await ctx.db.delete(owned._id);
    return null;
  },
});
```

### 6. Serve Through HTTP Action When Every Read Needs Authorization

Use this only for small files because Convex HTTP action responses are limited to 20 MiB.

```ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/file",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get("storageId") as Id<"_storage"> | null;

    if (!storageId) {
      return new Response("Missing storageId", { status: 400 });
    }

    // Add app-specific authentication and authorization before reading bytes.
    const blob = await ctx.storage.get(storageId);
    if (blob === null) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(blob);
  }),
});

export default http;
```

## API Reference Table

| API | Available in | Signature / return | Use | Notes |
| --- | --- | --- | --- | --- |
| `ctx.storage.generateUploadUrl()` | Mutation context | `Promise<string>` | Creates a short-lived HTTP POST URL for client upload. | Client POST response JSON includes `{ storageId: "..." }`. Upload URL expires in 1 hour. |
| `ctx.storage.getUrl(storageId)` | Query, mutation, action contexts | `Promise<null \| string>` | Returns a direct file URL for `Id<"_storage">`. | URL is bearer access. Anyone with it can fetch until file deletion. GET includes HTTP `Digest` header with sha256 checksum. Passing plain string storage IDs is deprecated. |
| `ctx.storage.delete(storageId)` | Mutation, action contexts | `Promise<void>` | Deletes a file. | Previously generated URLs return 404 after deletion. Passing plain string storage IDs is deprecated. |
| `ctx.storage.get(storageId)` | Action and HTTP action contexts only | `Promise<null \| Blob>` | Reads file bytes into a Blob. | Not available in queries/mutations. Use for server-side transforms or HTTP action serving. |
| `ctx.storage.store(blob)` | Action and HTTP action contexts only | `Promise<Id<"_storage">>` | Stores generated/fetched Blob bytes. | Use for files generated by server actions or third-party API responses. |
| `ctx.db.system.get("_storage", storageId)` | Query/mutation/action DB context | `Promise<null \| { _id, _creationTime, sha256, size, contentType? }>` | Reads file metadata. | Convex docs mark `ctx.storage.getMetadata()` as deprecated in favor of this system table read. |

## Gotchas

- Direct file URLs from `storage.getUrl()` are not auth-checked on every read. They are bearer URLs.
- The only way to revoke a direct Convex file URL is to delete the file. If the file must remain available to other users, re-upload it and share only the new URL.
- If access can change over time, return the URL only after app-level checks or serve bytes through an authenticated HTTP action.
- HTTP action responses are limited to 20 MiB, so do not proxy larger private files through Convex HTTP actions.
- Generated upload URLs expire in 1 hour; fetch them just before upload.
- Upload URL POST requests have a 2 minute timeout. Convex docs say file size is not otherwise limited for generated upload URLs, but practical mobile uploads should still enforce app-level size/type caps.
- Do not trust a client-submitted `storageId` as ownership proof. Persist an app-level ownership row after upload and check it before returning URLs or deleting files.
- Use `v.id("_storage")` and `Id<"_storage">`; Convex docs mark plain string storage ID overloads as deprecated.
- `ctx.storage.get()` and `ctx.storage.store()` are action/HTTP-action APIs, not query/mutation APIs.
- For generated files or third-party fetches, store a `Blob` from an action with `ctx.storage.store(blob)`.
- For custom HTTP upload actions, configure CORS explicitly and include `CLIENT_ORIGIN` in Convex deployment env.
- R2 `r2.dev` public bucket URLs are for testing, not production; Cloudflare documents variable throttling and recommends custom domains for production public serving.
- AWS S3 and R2 both add operational surface: credentials, bucket policy, CORS, lifecycle rules, presigned URL code, and separate cleanup jobs.

## Rate Limits

Convex:

- Generated upload URL lifetime: 1 hour.
- Upload URL POST timeout: 2 minutes.
- HTTP action response size: 20 MiB.
- HTTP action request size: Convex limits page says there is no specific limit, but the file-storage upload docs say generated upload URLs are required for files larger than the HTTP action request-size limit wording in that page. Treat generated upload URLs as the default for large uploads.
- Function argument and return value size: 16 MiB.
- Free/Starter deployment class `S16`: 16 concurrent queries, 16 concurrent mutations, 64 Convex runtime actions/HTTP actions, 64 Node actions.
- Professional deployment class `S256`: 256 concurrent queries, 256 concurrent mutations, 512 Convex runtime actions/HTTP actions, 256 Node actions.
- File accesses count as function calls per Convex limits docs.

Cloudflare R2, for comparison:

- Public `r2.dev` testing endpoint may throttle at hundreds of requests/second and return HTTP 429.
- Cloudflare REST API: 1,200 requests per 5 minutes across all R2 REST API operations on the account.
- Concurrent writes to the same object key at high rate can return HTTP 429.
- Production object traffic should use the S3-compatible API, Workers API, or a custom domain.

AWS S3, for comparison:

- Multipart upload should be considered around 100 MB.
- Multipart maximum object size: 48.8 TiB.
- Multipart maximum number of parts: 10,000.
- Multipart part size: 5 MiB to 5 GiB, except the last part has no minimum.

## Currency

| Item | Version / source date | Checked date | Source |
| --- | --- | --- | --- |
| Local Convex package | `convex@1.21.0` from `package.json` / `package-lock.json` | 2026-07-14 | Local repo |
| Convex File Storage overview/security | Docs page checked; no page date shown | 2026-07-14 | https://docs.convex.dev/file-storage/overview |
| Convex upload URL flow and limits | Docs page checked; no page date shown | 2026-07-14 | https://docs.convex.dev/file-storage/upload-files |
| Convex serving/security model | Docs page checked; no page date shown | 2026-07-14 | https://docs.convex.dev/file-storage/serve-files |
| Convex storage API signatures | Docs page checked; no page date shown | 2026-07-14 | https://docs.convex.dev/api/interfaces/server.StorageActionWriter |
| Convex pricing | Pricing page checked; no page date shown | 2026-07-14 | https://www.convex.dev/pricing |
| Convex platform limits | Limits page checked; no page date shown | 2026-07-14 | https://docs.convex.dev/production/state/limits |
| Cloudflare R2 pricing | Last updated 2026-05-28 | 2026-07-14 | https://developers.cloudflare.com/r2/pricing/ |
| Cloudflare R2 limits | Docs page checked; no page date shown in captured lines | 2026-07-14 | https://developers.cloudflare.com/r2/platform/limits/ |
| AWS S3 pricing | Pricing page checked; region-specific values should be confirmed in AWS Pricing Calculator before implementation | 2026-07-14 | https://aws.amazon.com/s3/pricing/ |
| AWS S3 multipart limits | User Guide page checked; no page date shown | 2026-07-14 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html |

## References

- Convex File Storage overview: https://docs.convex.dev/file-storage/overview
- Convex upload files: https://docs.convex.dev/file-storage/upload-files
- Convex serve files: https://docs.convex.dev/file-storage/serve-files
- Convex store generated files: https://docs.convex.dev/file-storage/store-files
- Convex delete files: https://docs.convex.dev/file-storage/delete-files
- Convex file metadata: https://docs.convex.dev/file-storage/file-metadata
- Convex StorageActionWriter API: https://docs.convex.dev/api/interfaces/server.StorageActionWriter
- Convex pricing: https://www.convex.dev/pricing
- Convex limits: https://docs.convex.dev/production/state/limits
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare R2 limits: https://developers.cloudflare.com/r2/platform/limits/
- AWS S3 pricing: https://aws.amazon.com/s3/pricing/
- AWS S3 multipart upload limits: https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html
