# CampusNav — Smart Campus Navigation System

A complete web application for navigating a college campus with real-time routing,
voice search, QR codes, accessibility mode, and emergency exit navigation.

## Tech Stack
- React 18 + Vite
- Tailwind CSS (dark mode)
- Firebase (Auth + Firestore)
- Leaflet.js + OSRM (free routing)
- Web Speech API (voice)
- qrcode.react (QR generation)

## Setup (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable **Authentication** → Email/Password AND Google
4. Enable **Firestore Database** (start in test mode)
5. Copy your config from Project Settings → Your apps

### 3. Set environment variables
```bash
cp .env.example .env
```
Fill in your Firebase values in `.env`. OpenWeatherMap key is optional — the app shows mock weather without it.

### 4. Firestore Security Rules
In Firebase Console → Firestore → Rules, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /locations/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@example.com';
    }
    match /announcements/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@example.com';
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run
```bash
npm run dev
```
Open http://localhost:3000

## Features
- 🗺️ Interactive map with 11 campus locations
- 🧭 Walking route calculation (OSRM — no API key needed)
- 🎙️ Voice search (Web Speech API)
- ♿ Accessibility mode — filters and highlights accessible routes
- 🚨 Emergency exit — one tap to nearest exit
- 📢 Real-time announcements (Firebase Firestore)
- 🌤️ Weather widget
- 📱 QR code generation per location
- 👤 User dashboard with favourites
- 📊 Analytics with charts
- 🔐 Admin dashboard (login as admin@example.com)
- 🌙 Dark / light mode

## Build for production
```bash
npm run build
```
Deploy the `dist/` folder to Vercel, Netlify, or any static host.

## Admin Access
Sign up or log in with email `admin@example.com` to access the admin dashboard.
From there you can create/delete announcements and view all campus locations.
