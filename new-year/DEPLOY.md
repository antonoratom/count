# Deployment Instructions

## ⚠️ IMPORTANT: Upload the BUILT files, not the source files!

You must upload the contents of the **`dist/`** folder, NOT the source files.

## Build the Project

```bash
npm run build
```

This creates a `dist/` folder with all the production files.

## Files to Upload

Upload **ONLY** these files from the `dist/` folder:

```
dist/
  ├── index.html          ← Upload this
  └── assets/
      ├── index.js        ← Upload this
      └── index.css       ← Upload this
```

## Server Structure

On your server at `https://code.anton-atom.com/count/new-year/`, the structure should be:

```
/count/new-year/
  ├── index.html          (from dist/index.html)
  └── assets/
      ├── index.js        (from dist/assets/index.js)
      └── index.css       (from dist/assets/index.css)
```

## What NOT to Upload

❌ **DO NOT upload:**
- Source `index.html` (the one in project root)
- `src/` folder
- `styles.css` (source file)
- Any other source files

✅ **ONLY upload from `dist/` folder**

## Verify Deployment

After uploading, check:

1. `https://code.anton-atom.com/count/new-year/index.html` should load
2. Open browser console (F12) - no 404 errors
3. Network tab should show:
   - ✅ `index.js` loading from `/count/new-year/assets/index.js`
   - ✅ `index.css` loading from `/count/new-year/assets/index.css`
   - ❌ NOT `/styles.css` or `/src/main.ts`

## Quick Test

Open browser console and check:
- If you see errors about `/styles.css` or `/src/main.ts` → wrong files uploaded
- If you see errors about `/count/new-year/assets/...` → correct files, but path issue
