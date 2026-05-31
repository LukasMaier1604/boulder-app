# Boulder Demo App

Eine einfache Demo-App fuer eine Boulderhalle mit React, Vite und Capacitor.

## Funktionen

- Fake-NFC-Scan per Button
- Zufaellige Mock-Route aus lokalen Daten
- Attempt-Tracking mit `+1 Attempt` und `Reset`
- Beta-/Tipps-Bereich mit simuliertem Premium-Toggle
- Native Projekte fuer Android und iOS via Capacitor

## Wichtige Befehle

```bash
npm install
npm run dev
```

```bash
npm run build
npm run mobile:build
```

## Android

Android ist auf diesem Rechner bereits eingerichtet.

```bash
npm run android
```

Das oeffnet das native Projekt in Android Studio. Von dort kannst du:

- einen Emulator starten
- ein echtes Android-Handy per USB verbinden
- eine Debug-APK oder ein Release-Build erzeugen

Wenn du Aenderungen an der React-App machst, danach immer erneut synchronisieren:

```bash
npm run mobile:build
```

## iOS

Das iOS-Projekt wurde ebenfalls erzeugt:

```bash
npm run ios
```

Wichtig:

- Das Bauen und Signieren fuer iOS funktioniert am Ende nur auf macOS mit Xcode.
- Auf diesem Windows-System wurden `CocoaPods` und `xcodebuild` nicht gefunden, deshalb wurde nur das Projekt angelegt und synchronisiert.
- Um die App spaeter wirklich auf ein iPhone zu spielen, oeffnest du das Projekt auf einem Mac und fuehrst dort einmal `npx cap sync ios` bzw. die Xcode-Konfiguration aus.

## Projektstruktur

- `src/components/` fuer wiederverwendbare UI-Bausteine
- `src/screens/` fuer Start- und Routenscreen
- `src/data/` fuer lokale Mock-Daten
- `android/` fuer das Android-Projekt
- `ios/` fuer das iOS-Projekt
