# Daily Habits Tracker - Expo App

A mobile habit tracking app built with React Native, Expo, and Convex.

## Features

- 🐱 Cat-themed motivational messages
- 📊 Habit streaks and consistency tracking
- 📅 Week and calendar views
- 📝 Notes for each habit
- ⚙️ Customizable settings
- 🔐 User authentication
- 📱 Cross-platform (iOS, Android, Web)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your Convex deployment:
   - Copy your existing Convex backend files to this project
   - Update `.env.local` with your Convex URL

3. Start the development server:

   ```bash
   npm start
   ```

4. Use the Expo Go app to scan the QR code and run on your device

## Building for Production

1. Install EAS CLI:

   ```bash
   npm install -g @expo/eas-cli
   ```

2. Configure your project:

   ```bash
   eas build:configure
   ```

3. Build for iOS and Android:
   ```bash
   eas build --platform all
   ```

## Deployment

Deploy to app stores using EAS Submit:

```bash
eas submit --platform all
```

## Convex Backend

This app uses the same Convex backend as the web version. Make sure to copy over:

- `convex/` directory with all your functions
- Environment variables in your Convex dashboard
