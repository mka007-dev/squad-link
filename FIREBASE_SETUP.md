# Firebase Setup

LobbyRush is wired for Firebase Auth and Cloud Firestore. With the current `firebase-config.js`, the app can connect to your `squad-link-aa29e` Firebase project after the console setup below is finished. The file exposes `LOBBYRUSH_FIREBASE_CONFIG` for the app and keeps the old `SQUADLINK_FIREBASE_CONFIG` alias for compatibility.

If Firebase Authentication is not enabled yet, the app falls back to local browser accounts so the Create Account section still works. Local accounts do not sync across devices; enable Auth to make accounts cloud-backed.

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

## 4. Add An Admin

After your own account signs in once:

1. Open **Authentication > Users** and copy your user UID.
2. Open **Firestore Database > Data**.
3. Create a collection named `admins`.
4. Create a document where the document ID is your UID.
5. Add any field, for example `role` = `owner`.

That account will be able to view and clear the Mod Queue.

## 5. Upload To GitHub Pages

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
