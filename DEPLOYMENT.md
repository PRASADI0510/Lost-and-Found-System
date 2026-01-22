# Firebase Hosting Deployment Guide

This project is configured to automatically deploy to Firebase Hosting using GitHub Actions.

## Prerequisites

- Firebase project: `lostandfound-8c504`
- GitHub repository with Actions enabled
- Node.js 18 or higher

## Setup Instructions

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Generate Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/project/lostandfound-8c504/settings/serviceaccounts/adminsdk)
2. Click on "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely

### 4. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `FIREBASE_SERVICE_ACCOUNT_LOSTANDFOUND_8C504`
5. Value: Paste the entire contents of the service account JSON file
6. Click "Add secret"

### 5. Enable Firebase Hosting

```bash
# Initialize Firebase Hosting (already configured in firebase.json)
firebase deploy --only hosting
```

## How It Works

### Automatic Deployment

- **On Push to Master**: Automatically builds and deploys to production
  - Workflow: `.github/workflows/firebase-hosting-merge.yml`
  - Deployed to: Live channel

- **On Pull Request**: Automatically builds and deploys to preview channel
  - Workflow: `.github/workflows/firebase-hosting-pull-request.yml`
  - Creates temporary preview URL for testing

### Manual Deployment

To deploy manually from your local machine:

```bash
# Build the frontend
cd frontend
npm run build
cd ..

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Configuration Files

- `firebase.json` - Firebase Hosting configuration
- `.firebaserc` - Firebase project settings
- `.github/workflows/firebase-hosting-merge.yml` - Production deployment workflow
- `.github/workflows/firebase-hosting-pull-request.yml` - Preview deployment workflow

## Deployment URL

After deployment, your app will be available at:
- Production: `https://lostandfound-8c504.web.app`
- Or: `https://lostandfound-8c504.firebaseapp.com`

## Troubleshooting

### Build fails in GitHub Actions

- Check that all environment variables are set
- Verify Node.js version matches (18)
- Check build logs in Actions tab

### Deployment permission denied

- Verify the Firebase service account secret is correctly set
- Ensure the service account has proper permissions in Firebase Console

### App doesn't load after deployment

- Check browser console for errors
- Verify Firebase configuration in `frontend/src/firebase.js`
- Ensure all routes are working with the rewrite rule in `firebase.json`

## CI/CD Pipeline

The pipeline runs the following steps:

1. **Checkout Code**: Gets the latest code from the repository
2. **Setup Node.js**: Installs Node.js version 18
3. **Install Dependencies**: Runs `npm ci` in the frontend directory
4. **Build**: Creates production build with `npm run build`
5. **Deploy**: Deploys to Firebase Hosting using the service account

## Environment Variables

If you need to add environment variables for the build:

1. Create `.env.production` in the `frontend` directory
2. Add your variables (e.g., `REACT_APP_API_KEY=...`)
3. Add the file to `.gitignore` (already configured)
4. For GitHub Actions, add them as repository secrets and include in the workflow

## Notes

- The build is configured with `CI: false` to prevent warnings from being treated as errors
- All routes redirect to `index.html` for React Router to handle client-side routing
- Build output directory is `frontend/build`
