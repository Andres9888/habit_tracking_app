# Debug Steps: Habit Strength Not Updating

Run these commands in order and tell me what you see at each step:

## Step 1: Check if schema is deployed

```bash
npx convex run testStrength:checkStatus
```

**What to look for:**

- If error about "testStrength" not found → Schema not deployed, go to Step 2
- If you see habit data with `hasStrengthField: true` → Schema is deployed, go to Step 3
- If you see `hasStrengthField: false` → Schema exists but field is missing

## Step 2: Deploy the schema

```bash
npx convex dev
```

**Wait for:**

- "✔ Deployed functions to <your-deployment>"
- Then press Ctrl+C to exit
- Then run Step 1 again

## Step 3: Force initialize from command line

```bash
npx convex run testStrength:forceInitialize
```

**What you should see:**

```
🚀 Starting manual initialization...
Found X habits to initialize

📊 Habit: Exercise
   Tracking entries: 10
   ✅ Final strength: 45.2% (developing)
   Days processed: 15

✅ Initialization complete!
```

**If it says "No tracking data":**

- Your habits have no history yet
- Toggle some habits ON, then run this again

## Step 4: Verify values in database

```bash
npx convex run testStrength:checkStatus
```

**You should see:**

```json
[
  {
    "name": "Exercise",
    "strength": 0.452,
    "strengthLevel": "developing",
    "strengthUpdatedAt": 1729089234000,
    "hasStrengthField": true
  }
]
```

**If strength is still null/undefined:**

- Something is wrong with the database update
- Tell me the exact output

## Step 5: Check the UI

Refresh your app and look at:

1. **Big blue boxes** on each habit card
2. **Purple debug box** at the top

**Should show:**

- Large percentage like "45.2%"
- Strength level like "(developing)"
- Updated timestamp

## Step 6: Test live updates

1. Toggle a habit ON (click the circle)
2. Watch the terminal where `npx convex dev` is running
3. Look for: `🔧 Habit Strength Update:`
4. Check if the big blue box updates

---

## Tell me what happens at each step!

Especially tell me:

- **Step 1 output** - Do you see hasStrengthField: true or false?
- **Step 3 output** - What strength percentages does it show?
- **Step 5** - Do the big blue boxes show percentages?
- **Step 6** - Does the terminal show the 🔧 log when you toggle?
