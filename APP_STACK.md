# LobbyRush App Stack

This repository includes the frontend, backend integration, database rules, and deployment infrastructure needed to run LobbyRush.

## Frontend

- `preview.html` is the production web app for GitHub Pages.
- `index.html` redirects users into the web app.
- `assets/lobbyrush-logo.svg`, `site.webmanifest`, `service-worker.js`, `404.html`, `robots.txt`, and `sitemap.xml` support branding, installability, offline shell behavior, and search metadata.
- The UI is responsive for mobile and desktop.

## Backend

- Firebase Authentication is used for Email/Password, password reset, remembered sessions, and optional anonymous guest sign-in.
- `firebase-config.js` connects the frontend to the Firebase project `squad-link-aa29e`.
- Firebase App Check is configured with reCAPTCHA Enterprise to reduce abuse from unauthorized web origins.
- The Firebase web API key is restricted to GitHub Pages plus localhost/127.0.0.1 testing referrers.
- If Firebase Auth is unavailable, account actions stay disabled instead of storing browser-only password accounts.

## Database

- Cloud Firestore stores shared app data.
- `firestore.rules` defines the access model.
- `firestore.indexes.json` is included for repeatable Firestore deploys. The current queries use single-field ordering, so no composite indexes are required yet.

Collections used:

- `profiles`
- `posts`
- `messages`
- `squads`
- `events`
- `postJoins`
- `squadRequests`
- `eventRsvps`
- `playerActions`
- `voiceRooms`
- `privateMessages`
- `notifications`
- `reports`
- `admins`

User-created posts, chat messages, squads, events, joins, invite requests, RSVPs, voice rooms, and public player cards are visible to other users once Firestore rules are published. Private messages, player match actions, and notifications are restricted to the signed-in owner by Firestore rules.

## Infrastructure

- GitHub Pages deployment is handled by `.github/workflows/pages.yml`.
- Firebase deploy configuration is handled by `firebase.json`.
- Firebase project targeting is handled by `.firebaserc`.
- Manual upload copies are kept in `lobbyrush-upload-files` and `lobbyrush-github-upload.zip`.

## Required Console Setup

These one-time settings must exist in Firebase Console:

- Authentication: Email/Password enabled.
- Authentication: Anonymous enabled if Guest Mode should use cloud accounts.
- Authentication: authorized domain includes `mka007-dev.github.io`.
- App Check: reCAPTCHA Enterprise configured for the web app.
- API key restrictions: browser referrers include `mka007-dev.github.io/*`, `localhost/*`, and `127.0.0.1/*`.
- Firestore Database: created in production mode.
- Firestore Rules: deployed from `firestore.rules`.

Deploy Firestore rules and indexes with:

```bash
firebase deploy --only firestore --project squad-link-aa29e
```

Deploy the frontend by pushing to `main`; GitHub Actions publishes the app to:

```text
https://mka007-dev.github.io/squad-link/
```
