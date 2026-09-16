# ShopTrack review — round 4

## New this pass (requested design change)

- **Active-trip header redesign**: the header had grown cluttered — back button, date, budget chip, share, AI, and Done were all crammed into a single row, and the AI chip's colors weren't mapped for dark mode so it rendered as a jarring solid-white pill against the dark header. Rebuilt it as a clear two-row header: a top row with back button, date/summary, and a prominent "Done" button; a second scrollable toolbar row with Budget, Share, and AI as consistently-styled chips. Added proper `--info`/`--warn` theme tokens (light + dark) so every chip now has a correct color in both themes instead of relying on the old inline-hex/dark-override matching trick.
- **App branding on Home**: added a small "ShopTrack" wordmark + logo bar above the greeting on the Home screen header, so the app's identity is visible at a glance before the personalized "Good day, {name}!" message.

## Round 3 — new features

- **"Frequently bought" felt reduced to two items**: `.frequent-grid` was hard-coded to a forced 2-column grid on narrow phones. Converted it to a horizontal, swipeable, snap-scrolling row so all 10 recommended items are reachable with a swipe.
- **Budget**: trips now carry a `budget` field. A "🎯 Budget" card appears on the Home screen and inside the active trip, showing live spent/remaining with a progress bar that turns red if you go over. Entered via a small modal; the last-used amount is remembered and pre-fills your next trip.
- **Share a list with another ShopTrack user**: "Share list" builds a link (`?list=<encoded>`) that encodes the trip's items, quantities, units, prices and budget. When the recipient opens that link in ShopTrack (the app must be reachable at the same URL for both people, since there's no backend), the app detects the `list` parameter and shows an "Import shared list" prompt.

## Round 3 — fixes

- **Broken/duplicate product images**: `onions` pointed at a dead CleanPNG hotlink, and `garlic`, `ginger`, `lettuce`, `pepper`, `salt` and `sugar` had all been accidentally set to the same Unsplash photo. Replaced each with a distinct, reliably-hotlinkable Wikimedia Commons image.
- **Stale service worker cache**: bumped `CACHE_NAME` to `v10` so updated assets actually reach users.

## Still worth knowing about (not changed)

- Cross-device sharing depends on both people using the app at the same hosted URL — there's still no backend, so a link generated on one deployment won't resolve for someone using a different install of the app with no shared host.
- Most of the rest of the UI (item rows, modals, settings) still uses the older inline-hex + `[style*="..."]` dark-mode override pattern documented in round 2. The new header/chip work in this round uses real CSS custom properties instead — a cleaner pattern worth extending to the rest of the UI over time.
- Everything from rounds 1–2 (backend removal, XSS escaping, service worker registration, storage error handling, image loading race fix, missing offline icon assets, title consistency) is still in place.

## Validation

- `node --check script.js`
- `node --check service-worker.js`
- Brace-balance check on styles.css
- Manual review of the new header markup, chip theme tokens, brand bar contrast in both light and dark mode, and the shared-list encode/decode round-trip.

The app remains fully client-side (localStorage), with the optional `window.SHOPTRACK_AI_ENDPOINT` hook for real AI suggestions in production. No backend is required for the app to function.
