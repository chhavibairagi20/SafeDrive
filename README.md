# 🚗 SafeDrive – Driver Distraction & Harsh Driving Detection System

## Project Overview

SafeDrive is a React Native mobile application that monitors driving behavior using smartphone sensors and evaluates driver safety in real time.

The application collects sensor data from the device during a driving session and detects unsafe driving events such as harsh braking, harsh acceleration, sharp turns, aggressive steering, excessive device movement, and possible phone handling while driving.

Based on detected events, the app calculates a driving safety score and provides a detailed summary and analytics dashboard at the end of each drive.

The goal of this project is to demonstrate the use of mobile sensors for real-world telematics applications similar to those used in insurance, fleet management, and driver safety monitoring systems.

---

# Features

* Start Drive / End Drive functionality
* Real-time sensor monitoring
* Event detection using device sensors
* Driving safety score calculation
* Drive session summary
* Event timeline
* Historical drive storage
* Analytics dashboard
* Safety rating system

---

# Tech Stack Used

## Frontend

* React Native
* Expo SDK 55
* TypeScript

## Navigation

* React Navigation

## Storage

* AsyncStorage

## Sensors

* Expo Sensors

## Charts & Analytics

* React Native Chart Kit
* React Native SVG

---

# Sensors Used

## Accelerometer

Used to measure linear acceleration of the device.

Applications:

* Harsh Braking Detection
* Harsh Acceleration Detection

---

## Gyroscope

Used to measure rotational movement of the device.

Applications:

* Sharp Turn Detection
* Aggressive Steering Detection

---

## Device Motion

Used to track device orientation and motion changes.

Applications:

* Excessive Device Movement Detection
* Phone Handling Detection

---

## Magnetometer (Optional)

Can be used to improve direction and orientation tracking.

---

# Event Detection Strategy

The application continuously monitors sensor values during a driving session.

Sensor data is processed every 200 milliseconds.

Whenever sensor readings exceed predefined thresholds, a driving event is generated.

Each detected event is logged with:

* Event Type
* Timestamp
* Severity
* Score Penalty

---

# Threshold Values Chosen

| Event                     | Threshold                                |
| ------------------------- | ---------------------------------------- |
| Harsh Braking             | Acceleration Z < -2.5                    |
| Harsh Acceleration        | Acceleration Z > 2.5                     |
| Sharp Turn                | abs(Gyroscope Y) > 1.8                   |
| Aggressive Steering       | abs(Gyroscope X) > 2.0                   |
| Excessive Device Movement | Rotation Rate > 3.0                      |
| Phone Handling            | High movement continuously for 3 seconds |

These values were selected through testing and represent aggressive driving behaviors.

---

# Driving Score Calculation Logic

Each drive starts with a score of:

100 Points

Detected events reduce the score.

| Event                     | Penalty |
| ------------------------- | ------- |
| Harsh Brake               | -5      |
| Harsh Acceleration        | -5      |
| Sharp Turn                | -3      |
| Aggressive Steering       | -4      |
| Excessive Device Movement | -2      |
| Phone Handling            | -10     |

Formula:

Final Score = 100 - Sum(All Penalties)

The minimum score is capped at 0.

---

# Safety Rating System

| Score Range | Rating    |
| ----------- | --------- |
| 90 - 100    | Excellent |
| 75 - 89     | Good      |
| 60 - 74     | Average   |
| Below 60    | Risky     |

Color Indicators:

🟢 Green → Excellent

🟡 Yellow → Good

🟠 Orange → Average

🔴 Red → Risky

---

# Dashboard Analytics

The dashboard provides:

* Total Drives
* Average Score
* Best Score
* Worst Score
* Event Breakdown
* Historical Scores
* Event Distribution Charts

---

# How to Run Locally

## Clone Repository

```bash
git clone <repository-url>
```

## Navigate to Project

```bash
cd SafeDrive
```

## Install Dependencies

```bash
npm install
```

## Start Expo Server

```bash
npx expo start
```

## Run on Device

* Install Expo Go on Android/iOS
* Scan the QR code

OR

```bash
npx expo run-android
```

---

# Project Structure

```text
src/

screens/
├── HomeScreen.tsx
├── DrivingScreen.tsx
├── SummaryScreen.tsx
├── HistoryScreen.tsx

components/
├── ScoreCard.tsx
├── EventCard.tsx
├── SensorCard.tsx
├── AnalyticsCard.tsx

services/
├── SensorService.ts
├── EventDetector.ts
├── ScoreCalculator.ts

storage/
└── DriveStorage.ts

utils/
├── thresholds.ts
└── theme.ts
```

---

# Assumptions Made

* Phone is mounted securely inside the vehicle.
* Sensor readings are sampled every 200ms.
* Device orientation remains relatively stable during driving.
* Threshold values are approximations and may vary depending on vehicle type and road conditions.
* The app is intended for educational and demonstration purposes and should not be considered a certified driver safety solution.

---

# Future Improvements

* GPS Route Replay
* Event Heatmaps
* AI-generated Driving Feedback
* Cloud Data Synchronization
* Driver Comparison Analytics
* Fleet Management Dashboard
* Machine Learning Based Event Detection

---

# Screenshots

## Home Screen

<img width="321" height="702" alt="image" src="https://github.com/user-attachments/assets/796f286f-1b59-4c83-a9a0-af7aabc292c2" />

## Driving Screen

<img width="315" height="698" alt="image" src="https://github.com/user-attachments/assets/d389d66c-1b95-424e-9b00-36a3781493e6" />

## Summary Screen

<img width="312" height="701" alt="image" src="https://github.com/user-attachments/assets/ec394d71-e3b5-4408-81c3-101b07fc116a" />
<img width="315" height="696" alt="image" src="https://github.com/user-attachments/assets/4dc1ee6d-a8f0-41e8-8d25-e5a0d9226d34" />

## Analytics Dashboard

<img width="312" height="698" alt="image" src="https://github.com/user-attachments/assets/27a51298-1474-4422-bdab-8ae0e2cdf961" />

## Drive History
<img width="315" height="696" alt="image" src="https://github.com/user-attachments/assets/b53b8a43-53ef-4156-a2ff-736a162821f6" />

---

# Author

Chhavi Bairagi

B.Tech Computer Science Engineering

React Native & Web Development Enthusiast

