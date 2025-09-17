# Sanned App

A full-stack mission discovery and management platform for mobile a, built with React Native (Expo) and Python (Flask).

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Frontend Quickstart](#frontend-quickstart)
- [Backend Quickstart](#backend-quickstart)
- [Notes](#notes)

---

## Project Overview
Sanned is a mobileapp for discovering, creating, and managing humanitarian missions for crisis area like Gaza . It is designed for those in the heart of the crisis to help each other with whatever they can (trading,providing help , services... ) when help is unreachable ,it is also a way and a tool for NGOs to assess the situation and act . It features offline-first sync, location-based discovery, and a robust backend API.

---

## Tech Stack

### **Frontend Framework**
- **React Native** `0.79.5`
- **Expo SDK** `53.0.22` *(Required: Expo SDK 53+)*
- **TypeScript** `5.8.3`
- **Expo Router** `5.1.6`

### **UI Framework & Design System**
- **Tamagui** `1.132.23`

### **State Management**
- **Zustand** `4.5.7`

### **Database & Persistence**
- **WatermelonDB** `0.28.0`
- **AsyncStorage**

### **Forms & Validation**
- **React Hook Form** `7.62.0`
- **Zod** `4.1.5`
- **@hookform/resolvers**

### **Maps & Location**
- **Expo Location** `18.1.6`
- **React Native WebView** `13.13.5`
- **OpenStreetMap**

### **Media & Assets**
- **Expo Image Picker** `16.1.4`
- **Expo File System** `18.1.11`
- **React Native Vector Icons** `10.3.0`
- **@expo/vector-icons**

### **Networking & Sync**
- **@react-native-community/netinfo** `11.4.1`
- **Expo Linking**
- Custom sync service

### **Developer Experience**
- **ESLint** `9.25.1`
- **Prettier** `3.2.5`
- **Babel Decorators**
- **EAS Build**

### **Backend**
- **Python** `3.10+`
- **Flask**
- **SQLAlchemy**
- **Flask-Migrate**
- **JWT Authentication**

---

## Project Structure

### **Frontend** (`sanned_Front/`)
```
sanned_Front/
├── app/                # Expo Router pages & navigation
├── assets/             # Images, fonts, UI components
├── store/              # Zustand state management
├── database/           # WatermelonDB models & config
├── services/           # Business logic & sync
├── utils/              # Utility functions
├── components/         # Shared UI components
```

### **Backend** (`sanned_Backend/`)
```
sanned_Backend/
├── app/                # Flask app, models, controllers, routes, services
├── requirements.txt    # Python dependencies
├── run.py              # App entry point
├── sanned.sql          # DB schema
```

---

## Setup & Installation

### **Frontend**
1. Install [Node.js](https://nodejs.org/) and [Expo CLI](https://docs.expo.dev/get-started/installation/)
2. Install dependencies:
   ```bash
   cd sanned_Front
   npm install
   ```
3. To run the app (dev build recommended for native libraries):
   ```bash
   npx expo start
   # -S to switch between dev build and Expo Go
   # -a to start on Android device/emulator
   ```
   > Some native libraries require a dev build and may not work on Expo Go/emulator. For demo, comment code in `database/index.tsx` and use emulator.

### **Backend**
1. Install [Python 3.10+](https://www.python.org/downloads/)
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows
   .\.venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in `sanned_Backend/`:
   ```env
   FLASK_APP=app
   FLASK_ENV=development
   SECRET_KEY=change-me
   SQLALCHEMY_DATABASE_URI=sqlite:///app.db
   JWT_SECRET_KEY=change-me-too
   ABSTRACT_API_KEY=
   ```
5. Initialize the database:
   ```bash
   flask db init
   flask db migrate -m "init"
   flask db upgrade
   ```
6. Run the server:
   ```bash
   flask run --host 0.0.0.0 --port 5000
   ```

---

## Notes
- You an download and try the demo from here : https://drive.google.com/file/d/1T3W6jQNqGaR0KSkDeT6aAflZq0_77DEl/view?usp=drive_link

- The app factory is `app.create_app()` in `app/__init__.py`.
- Location lookups use Abstract API if `ABSTRACT_API_KEY` is set; otherwise manual city must be `gaza` to pass the Gaza check.
- If migrations fail, delete `migrations/` and re-init.
-The Backend and Frontend Are not Linked  

---

## License
MIT
