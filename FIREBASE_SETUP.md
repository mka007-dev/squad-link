# Firebase Setup

LobbyRush is wired for Firebase Cloud Firestore. Until you add your Firebase config, it runs in local browser mode.

## 1. Create Firebase project

1. Go to https://console.firebase.google.com/
2. Create a project.
3. Add a Web app.
4. Copy the Firebase config object.

## 2. Add config

Open `firebase-config.js` and replace every `PASTE_...` value with the values from Firebase.

## 3. Create Firestore database

1. In Firebase Console, open **Firestore Database**.
2. Click **Create database**.
3. Start in test mode only briefly while setting up.
4. Choose your nearest region.

## 4. Add security rules

Copy the contents of `firestore.rules` into:

Firestore Database > Rules

Then publish the rules.

## 5. Upload to GitHub

Upload these files to the repo:

- `preview.html`
- `firebase-config.js`
- `firestore.rules`
- `assets/lobbyrush-logo.svg`

After GitHub Pages updates, posts, squads, events, and chat messages will be visible to other users.

## Collections used

- `posts`
- `messages`
- `squads`
- `events`

The current rules allow public reads and validated creates, but block edits/deletes. Add authentication before allowing moderation tools to delete posts.
