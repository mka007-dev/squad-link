# LobbyRush Deploy-Ready Checklist

Last checked: June 1, 2026

This checklist translates the full app-build and QA blueprint into the concrete release path for LobbyRush, the gaming community app for FIFA, GTA, and Warzone players.

## Current Status

- Frontend web app is live-ready through `preview.html` and GitHub Pages.
- Mobile web UI has a simplified five-tab bottom dock: Home, Match, Feed, Chat, Profile.
- Match section readability has been patched so card text, stat boxes, and action buttons stay readable on dark UI.
- Firebase Auth, Firestore, Storage rules, App Check setup, private messages, public chat, voice notes, profiles, posts, squads, events, reports, and notifications are represented in the app stack.
- Expo wrapper is configured for iPhone testing through `App.tsx`.
- Legal pages exist: Privacy Policy, Terms of Service, and Community Guidelines.

## Local QA Passed

- `node --check preview-server.js`
- `node --check service-worker.js`
- `node --check functions/index.js`
- `npx tsc --noEmit`
- Inline script parsing for `preview.html`

## Phase 1: Discovery And Requirements

- [x] Core value proposition defined: help gamers find squads, post updates, chat, and build profiles.
- [x] Target audience defined: FIFA, GTA, and COD Warzone players.
- [x] MVP feature list exists: auth, profiles, feed, squad finder, events, matchmaking, chat, DMs, voice notes, notifications, moderation.
- [ ] Finalize future-phase list: tournaments, real voice rooms, Discord/Xbox/PlayStation login, richer media uploads.
- [ ] Define measurable launch targets:
  - Home screen usable in under 2 seconds on normal mobile data.
  - No unreadable text on iPhone-width screens.
  - Sign up, sign in, post, match, DM, and chat flows pass on production URL.

## Phase 2: Design And Architecture

- [x] Dark gaming UI direction established.
- [x] Responsive web app layout supports desktop and mobile.
- [x] Five-tab mobile navigation reduces bottom dock crowding.
- [x] Firebase architecture documented in `APP_STACK.md` and `FIREBASE_SETUP.md`.
- [ ] Manual visual QA needed on:
  - iPhone Safari
  - Expo Go iPhone preview
  - Android Chrome
  - Desktop Chrome or Edge
- [ ] Review long usernames, long posts, and empty states across all sections.

## Phase 3: Development And CI

- [x] GitHub Pages deployment is connected to `mka007-dev/squad-link`.
- [x] Firebase rules and indexes are versioned.
- [x] Cloud Functions source exists for welcome and match emails.
- [x] Local TypeScript check passes.
- [ ] Add a GitHub Actions check that runs:
  - `npx tsc --noEmit`
  - `node --check preview-server.js`
  - `node --check service-worker.js`
  - `node --check functions/index.js`
- [ ] Add Playwright or equivalent browser smoke tests for navigation, auth form validation, posting, chat, DMs, and profile save.

## Phase 4: Formal QA

- [ ] Functional test: create account, sign in, sign out, forgot password.
- [ ] Functional test: create/update profile and upload avatar after Firebase Storage is enabled.
- [ ] Functional test: search usernames and send a direct message.
- [ ] Functional test: send public chat text and voice note.
- [ ] Functional test: create post, squad, and event.
- [ ] Functional test: Squad Up/match flow creates notifications and match record.
- [ ] Regression test: all five bottom tabs navigate correctly on mobile.
- [ ] Regression test: Squads and Events remain reachable from Home cards/buttons.
- [ ] UI test: Match card text remains readable on iPhone-size screens.
- [ ] Offline test: service worker app shell loads after first visit.
- [ ] Security test: signed-out users cannot write protected data.
- [ ] Security test: users cannot read private messages that do not include them.
- [ ] Security test: users cannot write another user's profile/avatar folder.

## Phase 5: Deployment And Launch

- [x] GitHub Pages deployment path exists.
- [x] App shell and legal pages are included.
- [x] Firebase config points to `squad-link-aa29e`.
- [ ] Buy or connect a real custom domain.
- [ ] Add GitHub Pages `CNAME` after the exact domain is chosen.
- [ ] Configure DNS at the domain registrar.
- [ ] Enable GitHub Pages HTTPS for the custom domain.
- [ ] Run production smoke test on:
  - `https://mka007-dev.github.io/squad-link/preview.html`
  - Future custom domain URL
- [ ] Prepare app store assets before iOS/Android release: icon, splash, screenshots, feature copy, keywords, privacy details.

## Phase 6: Post-Launch Maintenance

- [x] Firebase Analytics config is present.
- [ ] Enable Firebase Crashlytics for native app builds.
- [ ] Add production error monitoring for web runtime errors.
- [ ] Set up support/report review workflow for moderation.
- [ ] Review Firestore usage and indexes after real users start testing.
- [ ] Schedule monthly dependency/security review.

## Remaining Launch Blockers

- Firebase Cloud Functions email delivery needs Firebase Blaze plan before production deploy.
- SMTP credentials must be added in `functions/.env` before custom welcome and match emails can send.
- Firebase Storage must be enabled in the console before live profile picture uploads can use cloud storage.
- App Check enforcement should only be enabled after a successful live sign-in/create-account test.
- Native iOS/App Store release still needs a paid Apple Developer team, signing assets, screenshots, store copy, and real-device QA.
- Custom domain cannot be completed until the exact owned domain is provided and DNS is configured.

