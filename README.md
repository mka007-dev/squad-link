# LobbyRush

LobbyRush is a cross-platform React Native Expo app for gaming communities focused on FIFA, GTA, and Call of Duty: Warzone.

The deploy-ready web app is in `preview.html` and can run on GitHub Pages as a static site.
It includes Firebase Auth, Firestore-backed posts/chat/squads/events, profile sync, joins, invite requests, RSVPs, reports, admin moderation, legal/compliance pages, and a mobile installable shell.

For the full frontend, backend, database, and infrastructure map, see `APP_STACK.md`.

## Deploy the web app

Upload the project files to GitHub and keep `.github/workflows/pages.yml` enabled. GitHub Actions will publish the static app to:

```text
https://mka007-dev.github.io/squad-link/
```

For a complete checklist, see `DEPLOYMENT.md`.

## Backend and database

Firebase is the backend for the web app:

- `firebase-config.js` connects the frontend to Firebase.
- `firestore.rules` protects Cloud Firestore data.
- `firestore.indexes.json` keeps database index deploys repeatable.
- `firebase.json` and `.firebaserc` let the Firebase CLI deploy the database rules.
- `functions/` contains the deploy-ready welcome and match email notification backend.

Deploy Firestore rules, indexes, and functions with:

```bash
firebase deploy --only firestore,functions --project squad-link-aa29e
```

Cloud Functions require the Firebase Blaze plan and SMTP settings in `functions/.env`.

## Preview the static web app

```bash
npm run preview:static
```

Then open:

```text
http://localhost:4173/
```

This project targets Expo SDK 55 for current iPhone and Android builds.

## Run locally

```bash
npm install
npm run start
```

Use the Expo Go app on iPhone or Android to scan the QR code, or run:

```bash
npm run ios
npm run android
```

## Build iPhone and Android apps

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

The app identifiers are placeholders in `app.json` and should be changed before store submission.

For the first iOS production build, run EAS in interactive mode so it can create or validate Apple signing credentials:

```bash
eas build --platform ios
```

You need an active Apple Developer account with permission to create certificates, identifiers, and provisioning profiles.
