# Firebase Setup

LobbyRush is wired for Firebase Auth and Cloud Firestore. With the current `firebase-config.js`, the app can connect to your `squad-link-aa29e` Firebase project after the console setup below is finished. The file exposes `LOBBYRUSH_FIREBASE_CONFIG` for the app and keeps the old `SQUADLINK_FIREBASE_CONFIG` alias for compatibility.

Firebase Authentication must be enabled for Create Account, Sign In, Guest Mode, password reset, and cloud-synced community actions. The app clears old browser-only account data and does not store password accounts locally.

## 1. Enable Authentication

1. Open https://console.firebase.google.com/
2. Select the `squad-link-aa29e` project.
3. Go to **Build > Authentication > Sign-in method**.
4. Enable **Email/Password**.
5. Enable **Anonymous** so users can join as guests.

## 2. Create Firestore

1. Go to **Build > Firestore Database**.
2. Click **Create database**.
3. Choose production mode.
4. Pick your nearest region.

## 3. Publish Security Rules

Preferred CLI deploy:

```bash
firebase login
firebase deploy --only firestore --project squad-link-aa29e
```

The CLI uses:

- `.firebaserc`
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`

Manual console deploy:

1. Open **Firestore Database > Rules**.
2. Replace the rules with the contents of `firestore.rules`.
3. Click **Publish**.

The rules allow public reads for the community app, require signed-in users for posts/chat/squads/events/actions/reports, protect profiles by user ID, and make report reading/clearing admin-only.

## 4. App Check And API Key Restrictions

App Check is configured for the web app with a reCAPTCHA Enterprise key. The frontend reads `LOBBYRUSH_APP_CHECK_SITE_KEY` from `firebase-config.js` and initializes App Check before Firestore/Auth.

The Firebase web API key is restricted to these browser referrers:

- `mka007-dev.github.io/*`
- `localhost/*`
- `127.0.0.1/*`

Do not enable App Check enforcement until you have tested the deployed app after each release.

## 5. Add An Admin

After your own account signs in once:

1. Open **Authentication > Users** and copy your user UID.
2. Open **Firestore Database > Data**.
3. Create a collection named `admins`.
4. Create a document where the document ID is your UID.
5. Add any field, for example `role` = `owner`.

That account will be able to view and clear the Mod Queue.

## 6. Upload To GitHub Pages

Upload the updated project files to the `mka007-dev/squad-link` repository:

- `preview.html`
- `firebase-config.js`
- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `firestore.indexes.json`
- `APP_STACK.md`
- `FIREBASE_SETUP.md`
- `DEPLOYMENT.md`
- `README.md`
- `service-worker.js`
- `site.webmanifest`
- `.nojekyll`
- `404.html`
- `assets/lobbyrush-logo.svg`

The ready-to-upload copy is also in `lobbyrush-upload-files`, and the zipped version is `lobbyrush-github-upload.zip`.

## Collections Used

- `profiles`
- `posts`
- `messages`
- `squads`
- `events`
- `postJoins`
- `squadRequests`
- `eventRsvps`
- `reports`
- `admins`
