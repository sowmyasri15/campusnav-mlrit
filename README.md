# CampusNav — Smart Campus Navigation System

## Overview
CampusNav is a web-based campus navigation system for MLR Institute of Technology. It helps students, visitors, faculty, and parents move around the campus more easily by combining an interactive map, walking route calculations, campus location search, accessibility filtering, and quick emergency exit guidance.

The project is built with React and Vite on the frontend, and it uses Firebase for authentication and announcements. It also uses Leaflet + OSRM for map rendering and route generation, while the weather widget can show live campus weather when an OpenWeather API key is configured.

## Problem Statement
Large campuses can be hard to navigate, especially for first-time visitors and students trying to find academic blocks, labs, hostels, and emergency exits quickly. Static maps do not usually help with route planning, accessibility requirements, or real-time campus updates, which can lead to confusion and delays.

## Solution
CampusNav gives users a practical map-based interface for:
- finding key campus locations
- getting walking directions from a current location or another known landmark
- using voice search for faster destination lookup
- enabling accessible-only routes
- getting emergency exit guidance instantly
- accessing campus announcements from Firebase

This project is focused on the MLRIT Dundigal campus layout and is designed as a lightweight, deployable web app for students and visitors.

## Features
The following features are implemented in the current codebase:

- Interactive campus map with Leaflet
- Campus location search and destination selection
- Walking route calculation via OSRM
- Voice search using the browser Web Speech API
- Accessible route filtering
- Emergency exit route calculation
- Firebase announcements feed
- Weather widget for campus coordinates
- QR code generation for locations
- User dashboard with favourites and theme preferences
- Admin dashboard for publishing and deleting announcements
- Analytics dashboard with demo statistics
- Dark/light mode
- Responsive mobile-friendly layout

## Technology Stack
### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Leaflet
- react-leaflet
- react-hot-toast
- React Icons
- qrcode.react

### Backend and Services
- Firebase Authentication
- Firebase Firestore
- OSRM routing API
- OpenWeatherMap API (optional, when configured)
- Web Speech API

## Project Structure
```text
campusnav-mlrit/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── README.md
├── PROJECT_REPORT.md
├── PRESENTATION_SCRIPT.md
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── map/
│   │   │   ├── Map.jsx
│   │   │   └── RoutePanel.jsx
│   │   ├── qr/
│   │   │   └── QRCodeGenerator.jsx
│   │   ├── realtime/
│   │   │   ├── Announcements.jsx
│   │   │   └── WeatherWidget.jsx
│   │   └── ui/
│   │       ├── Navbar.jsx
│   │       ├── ThemeToggle.jsx
│   │       └── LoadingSpinner.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/
│   │   └── campusData.js
│   ├── hooks/
│   │   ├── useGeolocation.js
│   │   └── useVoiceSearch.js
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── MapView.jsx
│   │   └── Signup.jsx
│   └── services/
│       ├── firebase.js
│       └── firestore.js
└── public/
```

## How It Works
1. The app loads the campus map and campus location data.
2. The user selects a destination or uses voice search.
3. The app asks for geolocation if the user chooses a current-location route.
4. A request is sent to the OSRM walking router for the routing polyline.
5. The selected route is drawn on the map with distance and estimated travel time.
6. Firebase is used for authentication and real-time announcements.
7. The weather widget retrieves data from OpenWeather when a key is configured; otherwise it displays demo values.

## Firebase Setup
This project expects Firebase configuration values to be supplied through Vite environment variables. The app does not hardcode Firebase credentials in the source code.

1. Create or use an existing Firebase project.
2. Enable Authentication and choose the providers you need.
3. Enable Firestore.
4. Add your project web configuration values to a local `.env` file.
5. Make sure the Firebase `Authorized domains` list includes your deployment domain if you use hosted authentication.

The app uses the following Firebase configuration keys:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Environment Variables
Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Example:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_optional
```

Do not commit real values to GitHub. Keep `.env` and `.env.local` out of version control.

## Installation
```bash
npm install
```

## Run Locally
```bash
npm run dev
```

The app runs on the Vite default port, which is usually:
```text
http://localhost:3000
```

## Production Build
```bash
npm run build
```

This produces a static `dist/` folder for deployment.

## Deployment
This project is a Vite React frontend and is suitable for static hosting.

### Recommended: Vercel
Use the Vercel dashboard with the following settings:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `.`

Add the required environment variables in Vercel:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_OPENWEATHER_API_KEY` (optional, only if you want live weather data)

### Alternative: Netlify
- Import the repository
- Set the build command to `npm run build`
- Set the publish directory to `dist`
- Add the same environment variables in the Netlify dashboard

## Security
- Store Firebase and API credentials in environment variables only.
- Keep `.env` and `.env.local` ignored in Git.
- Commit only `.env.example` with placeholders.
- Do not commit private service-account files or secret keys.
- Keep Firestore rules restricted to the proper authenticated user/admin logic.

## Future Enhancements
The following ideas are planned as future improvements rather than part of the current app:
- Indoor navigation for floors and rooms
- More campus locations and building metadata
- Live crowd and occupancy information
- Push notifications for urgent announcements
- Advanced route optimization and alternate paths
- Mobile application packaging

## Author
Anumula Sowmya Sri

B.Tech Computer Science Engineering
MLR Institute of Technology

GitHub: https://github.com/sowmyasri15
LinkedIn: https://linkedin.com/in/sowmyan-anumula
