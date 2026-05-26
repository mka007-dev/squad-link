# LobbyRush

LobbyRush is a cross-platform React Native Expo app for gaming communities focused on FIFA, GTA, and Call of Duty: Warzone.

The deploy-ready web app is in `preview.html` and can run on GitHub Pages as a static site.
It includes Firebase Auth, Firestore-backed posts/chat/squads/events, Firebase Storage profile pictures, chat voice notes, profile sync, joins, invite requests, RSVPs, reports, admin moderation, legal/compliance pages, and a mobile installable shell.

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
- `storage.rules` protects user profile picture and voice note uploads in Firebase Storage.
- `firestore.indexes.json` keeps database index deploys repeatable.
- `firebase.json` and `.firebaserc` let the Firebase CLI deploy the database rules.
- `functions/` contains the deploy-ready welcome and match email notification backend.

Deploy Firestore rules, Storage rules, indexes, and functions with:

```bash
firebase deploy --only firestore,storage,functions --project squad-link-aa29e
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

## Test on an iPhone

The Expo app is an iOS-ready native shell that loads the live LobbyRush web app from:

```text
https://mka007-dev.github.io/squad-link/preview.html
```

For quick device testing:

```bash
npm install
npx expo start --tunnel
```

Install Expo Go on the iPhone, then scan the QR code. The native shell includes iOS permission text for profile picture uploads and chat voice notes.

For TestFlight or an installable iPhone build:

```bash
npx eas login
npx eas build --platform ios --profile preview
```

You need an Apple Developer account before EAS can create signing credentials for a real iPhone build.

## Build iPhone and Android apps

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

The app identifiers are configured in `app.json` as `com.mka007dev.lobbyrush`.

For the first iOS production build, run EAS in interactive mode so it can create or validate Apple signing credentials:

```bash
eas build --platform ios
```

You need an active Apple Developer account with permission to create certificates, identifiers, and provisioning profiles.
