# LobbyRush Deployment

LobbyRush is ready to deploy as a static GitHub Pages site from the repository root.

## GitHub Pages

1. Upload these files and folders to the `main` branch of `mka007-dev/squad-link`.
2. Keep `.github/workflows/pages.yml` in the repository. It includes hidden files so `.nojekyll` is published correctly.
3. Go to the repository `Actions` tab.
4. Run or wait for `Deploy LobbyRush Preview`.
5. Open `https://mka007-dev.github.io/squad-link/`.

## Required Files

- `index.html`
- `preview.html`
- `404.html`
- `firebase-config.js`
- `firestore.rules`
- `site.webmanifest`
- `robots.txt`
- `sitemap.xml`
- `.nojekyll`
- `assets/lobbyrush-logo.svg`
- `.github/workflows/pages.yml`

## Firebase

The app already loads Firebase from `firebase-config.js`. Publish `firestore.rules` in Firebase Console so posts, chat messages, squads, and events can be shared between visitors.

If Firebase is unavailable, the app still runs in local browser storage so the UI does not break.
