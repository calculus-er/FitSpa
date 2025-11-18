# FitSpa - AI Fitness Trainer

AI-based Fitness Tracking and Posture Correction Trainer with real-time pose detection, voice feedback, and detailed analytics.

## Features

- **Real-time Pose Detection**: Uses MediaPipe Pose to track your movements in real-time
- **Exercise Form Analysis**: AI-powered form correction for push-ups, squats, planks, and lunges
- **Rep Counting**: Automatic rep counting based on movement patterns
- **Voice Feedback**: Real-time voice guidance and motivational messages
- **Workout Analytics**: Track your progress with detailed analytics and charts
- **Firebase Integration**: Secure authentication and data persistence

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Pose Detection**: MediaPipe Pose
- **Backend**: Firebase (Authentication + Firestore)
- **Voice**: Web Speech API

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings
5. Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

Set up the following security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workouts/{workoutId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /analytics/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/          # React components
│   ├── home/           # Home page components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
│   ├── usePoseDetection.ts
│   ├── useRepCounter.ts
│   ├── useFormAnalysis.ts
│   ├── useVoiceFeedback.ts
│   ├── useAnalytics.ts
│   └── useWorkoutHistory.ts
├── lib/
│   ├── firebase/       # Firebase configuration and utilities
│   ├── pose-detection/ # MediaPipe pose detection
│   ├── exercises/      # Exercise validators (pushup, squat, plank, lunge)
│   ├── voice/          # Voice feedback system
│   └── workout/        # Workout recording and configuration
└── pages/              # Page components
    ├── Home.tsx
    ├── Auth.tsx
    ├── Workout.tsx
    └── Analytics.tsx
```

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Start Workout**: Grant camera access and select an exercise
3. **Get Feedback**: Receive real-time form corrections via voice and visual feedback
4. **Track Progress**: View detailed analytics of your workouts

## Supported Exercises

- **Push-ups**: Tracks form, counts reps, monitors elbow angles
- **Squats**: Analyzes knee alignment, depth, and posture
- **Plank Hold**: Tracks time and body alignment
- **Lunges**: Monitors front knee position and back leg straightness

## Performance Considerations

- Pose detection runs at ~30fps
- Voice feedback is throttled to prevent spam
- Firestore writes are batched for efficiency
- Video stream is optimized to 720p

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari (may have limited MediaPipe support)

## Troubleshooting

### Camera Access Issues
- Ensure you're using HTTPS (required for camera access)
- Check browser permissions
- Try a different browser

### Pose Detection Not Working
- Ensure good lighting
- Stand at appropriate distance from camera
- Ensure full body is visible

### Firebase Errors
- Verify `.env.local` file exists with correct values
- Check Firestore security rules
- Verify Firebase project is set up correctly

## License

MIT
