# SquadLink

SquadLink is a cross-platform React Native Expo app for gaming communities focused on FIFA, GTA, and Call of Duty: Warzone.

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
