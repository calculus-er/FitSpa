# Firebase Deployment Guide for FitSpa

This guide covers the complete process of deploying the FitSpa application to Firebase Hosting with all supporting services.

## Prerequisites

### Required Tools
- **Node.js** (v20 or higher)
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** for version control
- **Firebase project** with Blaze plan

### Firebase Project Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Blaze plan for advanced features
3. Set up the following services:
   - Authentication
   - Firestore Database
   - Cloud Storage
   - Cloud Functions

## Initial Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Project
```bash
firebase init
```
Select the following features:
- Hosting
- Functions
- Firestore
- Storage

### 4. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your Firebase credentials in `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Local Development

### Start Development Server
```bash
npm run dev
```

### Start Firebase Emulators
```bash
npm run firebase:emulators
```

This will start:
- Auth emulator on port 9099
- Functions emulator on port 5001
- Firestore emulator on port 8080
- Hosting emulator on port 5000
- Storage emulator on port 9199

## Build Process

### Production Build
```bash
npm run build
```

### Staging Build
```bash
npm run build:staging
```

The build process includes:
- TypeScript compilation
- Code splitting for optimal loading
- Asset optimization
- Source map generation
- Environment variable injection

## Deployment Options

### 1. Manual Deployment

#### Deploy to Production
```bash
npm run deploy:production
```

#### Deploy to Staging
```bash
npm run deploy:staging
```

#### Deploy Only Functions
```bash
npm run deploy:functions
```

#### Deploy Only Hosting
```bash
./scripts/deploy.sh hosting
```

### 2. Using the Deployment Script
The deployment script provides comprehensive deployment options:

```bash
# Show help
./scripts/deploy.sh --help

# Deploy to production (default)
./scripts/deploy.sh

# Deploy to staging
./scripts/deploy.sh staging

# Deploy only functions
./scripts/deploy.sh functions

# Deploy only hosting
./scripts/deploy.sh hosting
```

### 3. Automated Deployment (CI/CD)

#### GitHub Actions Setup
1. Add the following secrets to your GitHub repository:
   - `FIREBASE_SERVICE_ACCOUNT`: Service account JSON key
   - `VITE_FIREBASE_API_KEY`: Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
   - `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
   - `VITE_FIREBASE_APP_ID`: Firebase app ID

#### Deployment Triggers
- **Push to `main`**: Deploys to production
- **Push to `develop`**: Deploys to staging
- **Pull requests**: Builds and tests only

## Firebase Services Configuration

### Firestore Security Rules
Current rules are in `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**⚠️ Update these rules** based on your application's security requirements.

### Cloud Storage Rules
Current rules are in `storage.rules`:
- User profiles: Private to user
- Workout data: Private to user
- Exercise demos: Public read, admin write
- User content: Private to user

### Cloud Functions
Functions are located in `functions/src/index.ts`:
- `processWorkoutData`: Processes workout data and saves to Firestore
- `generateAnalyticsReport`: Generates analytics reports

## Performance Optimization

### Build Optimizations
- **Code Splitting**: Separates vendor, Firebase, UI, and utility code
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Compresses images and other assets
- **Caching Headers**: Sets appropriate cache headers for different file types

### Firebase Hosting Optimizations
- **Global CDN**: Automatic global content delivery
- **HTTP/2**: Modern protocol support
- **SSL/TLS**: Free SSL certificates
- **Edge Caching**: Caches static assets at edge locations

## Monitoring and Analytics

### Firebase Performance Monitoring
- Automatic performance data collection
- Custom traces for specific operations
- Network request monitoring

### Google Analytics
- User behavior tracking
- Page view analytics
- Conversion tracking

### Error Reporting
Consider integrating error reporting (e.g., Sentry) for production monitoring.

## Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different environments for development, staging, and production
- Rotate API keys regularly

### Firebase Security Rules
- Implement least-privilege access
- Regularly review and update rules
- Test rules in emulator before deploying

### HTTPS
- Firebase Hosting automatically enforces HTTPS
- All API calls should use HTTPS

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### Firebase Login Issues
```bash
# Re-login to Firebase
firebase logout
firebase login
```

#### Deployment Failures
```bash
# Check Firebase project configuration
firebase use default
firebase projects:list

# Deploy with verbose output
firebase deploy --debug
```

#### Functions Not Working
```bash
# Check functions logs
firebase functions:log

# Test functions locally
cd functions
npm run serve
```

### Getting Help
- Check Firebase Console for error messages
- Review deployment logs
- Use Firebase CLI with `--debug` flag for detailed output
- Consult [Firebase Documentation](https://firebase.google.com/docs)

## Maintenance

### Regular Tasks
- Monitor usage and costs in Firebase Console
- Update dependencies regularly
- Review and update security rules
- Backup important data
- Monitor performance metrics

### Scaling Considerations
- Monitor Firestore read/write operations
- Optimize database queries
- Implement proper indexing
- Consider Cloud Functions cold start optimization
- Monitor storage usage

## Cost Management

### Blaze Plan Benefits
- Unlimited hosting bandwidth
- Pay-as-you-go pricing for other services
- Access to all Firebase features

### Cost Optimization Tips
- Use Firestore efficiently (avoid unnecessary reads/writes)
- Optimize Cloud Functions (reduce execution time)
- Monitor storage usage
- Set up budget alerts in Google Cloud Console

## Next Steps

After deployment:
1. Set up custom domain in Firebase Console
2. Configure analytics and monitoring
3. Test all features thoroughly
4. Set up backup and recovery procedures
5. Document any custom configurations

For additional support, refer to the [Firebase Documentation](https://firebase.google.com/docs) or create an issue in the project repository.
