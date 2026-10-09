# Shaheen Kapda Ghar — PWA v6: two remaining icon issues

## Root cause assessment
The collapsed desktop sidebar is 64px wide while the original logo is wider than its inner available width; its CSS size must shrink on collapse. This code fix is included.

Chrome's **Install this page as an app** with a generic S indicates Chrome is not obtaining a usable install icon from the web manifest. A favicon showing in the tab is not proof the manifest and its PNG files are published. The site's Cloudflare Pages URLs could not be accessed from this editing environment, so the missing resource must be identified by the live diagnostic page.

## Upload / deploy

1. Upload ALL FILES in this ZIP at the actual **Cloudflare Pages output root**, not in a nested directory. If your Pages build is connected to GitHub, commit the files into the folder that Pages publishes. Do not commit only index.html.
2. Keep existing `products.json` in the same published root. This archive excludes your live catalogue intentionally.
3. In a normal browser open: https://shaheen-kapda-live.pages.dev/icon-check.html
4. **Do not reinstall the app unless all 10 tests PASS.** Missing assets may return HTTP 200 with HTML. This checker inspects true PNG bytes and dimensions, and checks the manifests and HTML.
5. On desktop Chrome use DevTools > Application > Manifest to see any manifest or image errors; verify the page links to `/manifest-skg-v6.webmanifest` and that every icon listed loads as image/png.
6. Once verification passes: uninstall previous installed shortcut/app, reopen the homepage, and install again. iPhone uses Safari > Share > Add to Home Screen. Chrome uses Install App/Install Page from browser menu. OS home-screen tiles may draw their own background behind transparent PNG artwork; websites cannot disable OS decorations.

## Changes from v5
* Preserves the exact code the user supplied in the latest file as the starting point.
* Collapsed desktop sidebar centres and confines the logo to 34 x 34 CSS px, while expanded logo remains unchanged.
* Keeps the original gold logo embedded as a data URI for sidebar independence (and includes original A.png).
* Manifest uses two genuinely transparent PNG icons in correct sizes; no potentially confusing maskable variant.
* Renames icon/manifest assets to v6, bypassing older URL caches.
* Includes conventional fallback /apple-touch-icon.png and /manifest.webmanifest.
* Service worker version updated; intentionally avoids intercepting icon and manifest asset requests.
* Cloudflare Pages _headers sets explicit manifest and image Content-Types and short caching.
* New icon-check.html confirms deployment with PNG signature/dimension checks.

Note: This code cannot overcome a Pages deployment that publishes only index.html. The manifest and PNGs must exist at exact root paths. No changes were made to any connected GitHub repository.
