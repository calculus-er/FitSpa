# FitSpa - AI-Powered Fitness Tracking

A comprehensive fitness tracking application built with React, TypeScript, and Firebase, featuring AI-powered pose detection and real-time workout analytics.

## 🚀 Features

- **AI Pose Detection**: Real-time exercise form analysis using MediaPipe
- **Workout Tracking**: Comprehensive workout logging and progress tracking
- **Voice Feedback**: Real-time audio feedback during workouts
- **Analytics Dashboard**: Detailed insights into fitness progress
- **User Authentication**: Secure Firebase Authentication
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Sync**: Cloud Firestore for data synchronization

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Hook Form** for form management

### AI & Computer Vision
- **MediaPipe Pose** for pose detection
- **TensorFlow.js** for ML operations
- **WebRTC** for camera access

### Backend & Infrastructure
- **Firebase Authentication** for user management
- **Cloud Firestore** for real-time database
- **Cloud Storage** for file storage
- **Cloud Functions** for server-side logic
- **Firebase Hosting** for deployment

## 📦 Installation

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Firebase project with Blaze plan

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fitspa.git
   cd fitspa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase credentials in `.env.local`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start Firebase emulators (optional)**
   ```bash
   npm run firebase:emulators
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:staging` - Build for staging
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run firebase:emulators` - Start Firebase emulators
- `npm run deploy` - Deploy to production
- `npm run deploy:staging` - Deploy to staging

### Project Structure

```
fitspa/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── home/         # Home page components
│   │   └── ui/           # UI components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility libraries
│   │   ├── firebase/     # Firebase configuration
│   │   ├── pose-detection/ # Pose detection logic
│   │   ├── voice/        # Voice feedback
│   │   └── workout/      # Workout utilities
│   └── pages/            # Page components
├── functions/             # Cloud Functions
├── scripts/              # Deployment scripts
└── docs/                 # Documentation
```

## 🚀 Deployment

### Quick Deploy

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Deploy to production**
   ```bash
   npm run deploy:production
   ```

### Detailed Deployment Guide

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for comprehensive deployment instructions, including:
- Environment setup
- CI/CD configuration
- Security rules
- Performance optimization

## 🔒 Security

### Firebase Security Rules

The application uses comprehensive security rules:

- **Firestore**: User data isolation and proper access controls
- **Storage**: File access restrictions based on ownership
- **Authentication**: Secure user session management

### Environment Variables

Never commit `.env.local` to version control. Use different environment configurations for development, staging, and production.

## 📊 Monitoring & Analytics

### Performance Monitoring
- Firebase Performance Monitoring for app performance
- Custom metrics for workout tracking
- Error tracking and reporting

### Analytics
- Google Analytics integration
- Custom event tracking for user behavior
- Workout completion metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test on multiple devices and browsers

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Note: Camera access is required for pose detection features.

## 🐛 Troubleshooting

### Common Issues

**Camera not working**
- Check browser permissions
- Ensure HTTPS in production
- Try a different browser

**Firebase connection issues**
- Verify environment variables
- Check Firebase project settings
- Review security rules

**Build errors**
- Clear node_modules and reinstall
- Check Node.js version
- Verify environment variables

For more troubleshooting tips, see the [Deployment Guide](./docs/DEPLOYMENT.md#troubleshooting).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for pose detection
- [Firebase](https://firebase.google.com/) for backend services
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

For support:
- Create an issue on GitHub
- Check the [documentation](./docs/)
- Review the [troubleshooting guide](./docs/DEPLOYMENT.md#troubleshooting)

---

Built with ❤️ for the fitness community
