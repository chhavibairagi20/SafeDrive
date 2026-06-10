# SafeDrive

SafeDrive is a modern Expo React Native app for driver distraction and harsh driving detection. It uses smartphone sensors to monitor driving behavior and calculate a real-time safety score.

## Key Features

- Real-time sensor monitoring using `expo-sensors`
- Harsh braking, harsh acceleration, sharp turn, aggressive steering, excessive movement, and phone handling detection
- Live driving score and event dashboard
- Drive summary screen with detailed event breakdown
- History screen with saved drive sessions
- AsyncStorage persistence for drive session storage
- Modern UX with safety color palette and dashboard-style cards

## Project Structure

- `App.tsx` — app entry point and navigation container
- `src/navigation/AppNavigator.tsx` — app navigation stack
- `src/screens/` — app screens
  - `HomeScreen.tsx`
  - `DrivingScreen.tsx`
  - `SummaryScreen.tsx`
  - `HistoryScreen.tsx`
- `src/components/` — reusable UI components
  - `ScoreCard.tsx`
  - `EventCard.tsx`
  - `SensorCard.tsx`
  - `AnalyticsCard.tsx`
- `src/services/` — sensor/event/score logic
  - `SensorService.ts`
  - `EventDetector.ts`
  - `ScoreCalculator.ts`
- `src/storage/DriveStorage.ts` — AsyncStorage utilities
- `src/types/` — TypeScript model definitions
- `src/utils/theme.ts` — design tokens and colors

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Expo CLI if needed:
   ```bash
   npm install -g expo-cli
   ```

3. Start the app:
   ```bash
   npm start
   ```

4. Run on a device/emulator:
   - `npm run android`
   - `npm run ios`
   - `npm run web`

## Notes

- The app uses `react-native-chart-kit` for chart rendering.
- Local drive sessions are stored with React Native AsyncStorage.
- The app is built for Expo-managed workflows.

## License

This project is provided as-is for development and demo purposes.
