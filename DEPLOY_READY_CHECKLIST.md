# LobbyRush Deploy-Ready Checklist

Last checked: May 25, 2026

## Passed

- Core navigation works across Home, Match, Feed, Squads, Events, Chat, and Profile.
- Account form validation shows clear errors for bad email and short passwords.
- Firebase loads on the live app path and reports `Firebase live`.
- Firestore rules compile and were deployed successfully.
- Profile picture upload UI is wired to Firebase Storage, and owner-only `storage.rules` is ready.
- Community chat supports text messages and short playable voice notes.
- App Check is configured and the Firebase API key is referrer-restricted.
- Local and mobile browser smoke tests pass with no runtime console errors.
- Mobile viewport has no horizontal overflow and no tiny visible buttons.
- Service worker caches the app shell and legal pages.
- Privacy Policy, Terms of Service, and Community Guidelines are published.
- Production dependency audits show no high or critical issues for the static app or functions.

## Remaining Launch Blockers

- Firebase Cloud Functions email delivery needs the Firebase Blaze plan before it can be deployed.
- SMTP credentials must be added in `functions/.env` before custom welcome and match emails can send.
- Firebase Storage must be enabled in the console before `storage.rules` can deploy and live profile picture uploads can complete.
- Native app store release still needs production Android/iOS signing assets, screenshots, store descriptions, and real device QA.
- App Check enforcement should only be enabled after a live sign-in/create-account test passes.

## Commands Used

```bash
node --check preview-server.js
node --check service-worker.js
node --check functions/index.js
npm audit --omit=dev --audit-level=high
npm audit --prefix functions --omit=dev --audit-level=high
firebase deploy --only firestore --project squad-link-aa29e
firebase deploy --only storage --project squad-link-aa29e
```
