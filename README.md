# SHAHEEN KAPDA GHAR — MISSING MANIFEST FIX

## Root cause confirmed by DevTools screenshot
Application > Manifest shows `Line: 1, column: 1, Syntax error`; Sources shows `No resource with given URL found` for `/manifest-skg-v6.webmanifest`.
This means the **published** site does not supply a valid JSON manifest there. Chrome therefore uses a generic S icon. The gold favicon shown in the tab does not establish PWA installation support.

## What this package changes
- Latest user-provided `index.html` preserved, except the three PWA head references and explanatory comment.
- Uses `/manifest.json` (and includes `manifest.webmanifest` compatibility alias).
- Uses local official gold SKG PNGs at `/skg-icon-192.png`, `/skg-icon-512.png`, `/skg-apple-icon-180.png`.
- Reuses your original exact `A.png`, original sidebar styling, product catalogue logic, mobile bottom nav, gallery and WhatsApp links.
- Updated `service-worker.js` and `_headers`.
- `/icon-check.html` checks real contents, not just HTTP 200.

## DEPLOY CORRECTLY — uploading index.html alone never fixes this
**For Cloudflare Pages Direct Upload:** Extract the ZIP. Add your existing `products.json` (not in this ZIP). In Cloudflare Pages, create a new deployment of **the extracted directory contents**, preserving all files at the same root level. Do NOT upload a nested directory named SKG-PWA-MANIFEST-REPAIR or the ZIP without extraction if your upload method doesn't support it.

**For Cloudflare Pages linked to GitHub:** Commit all these files to your configured *build output directory*. If using Vite, static assets normally belong in `public/`; that directory's contents must land at the root of the generated `dist/`. If your deployment uses a static site with no build step, place everything in the Pages output root. If your build does not copy the files from the repository root, the deployed site will continue to return 404 for manifest and icon links.

*Do not overwrite your existing `products.json`. Do not deploy the sample contents of unrelated repositories.*

## After deployment, before reinstalling
1. Open https://shaheen-kapda-live.pages.dev/manifest.json — you **must** see JSON starting with `{`, including icons, **not** `index.html`, 404, or an error page.
2. Open https://shaheen-kapda-live.pages.dev/skg-icon-192.png — actual gold SKG logo must appear.
3. Open https://shaheen-kapda-live.pages.dev/icon-check.html — expect **10 / 10 checks passed**. If any fail, a file isn't in the published output.
4. In Chrome: DevTools > Application > Manifest; it must show the name and icons without any syntax error.
5. Only then uninstall old PWA and reinstall on Chrome / Safari / Android.

If manifest URL returns HTML, check Cloudflare Pages build output root and any `_redirects` catch-all such as `/* /index.html 200`. Your static manifest must be included at the published root so it is not replaced by SPA fallback.

## Platform note
Gold logo image PNGs preserve transparency. iPhone/Android may render their own icon tile background; website code cannot require a truly background-free home-screen tile.

## GitHub access
This package was created offline; no GitHub repo or Cloudflare project was modified. The connected GitHub plugin currently did not return an accessible Shaheen Kapda Ghar repository.
