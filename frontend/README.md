# Lost and Found - Frontend

A React-based Lost and Found application for university services with Firebase authentication.

## Setup

### 1. Install dependencies:
```bash
npm install
```

### 2. Configure Firebase:

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click on the web icon (</>) to add a web app
4. Register your app and copy the Firebase configuration

#### Enable Authentication
1. In your Firebase project, go to **Authentication** → **Get Started**
2. Click on **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

#### Create Environment File
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Open `.env` and replace the placeholder values with your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 3. Start the development server:
```bash
npm start
```

### 4. Build for production:
```bash
npm run build
```

## Placeholder Images

The application requires the following placeholder images to be added to the `public` folder:

### 1. `landing-image.jpg`
- **Location**: `/public/landing-image.jpg`
- **Description**: An image showing a person pointing at a laptop screen
- **Recommended size**: 600x400px or similar aspect ratio
- **Used in**: Landing Page (Welcome page)

### 2. `login-illustration.png`
- **Location**: `/public/login-illustration.png`
- **Description**: Illustration of a person with headphones (circular format works best)
- **Recommended size**: 400x400px
- **Used in**: Login Page

### 3. `signup-illustration.png`
- **Location**: `/public/signup-illustration.png`
- **Description**: Illustration of a person sitting with a checkmark icon
- **Recommended size**: 400x500px
- **Used in**: Sign Up Page

## Features

### Pages
- **Landing Page**: Welcome page with tagline and call-to-action
- **Login Page**: User authentication interface with Firebase
- **Sign Up Page**: New user registration with fields for:
  - Full Name
  - Role
  - Email
  - Phone Number
  - Password
  - Confirm Password
- **Forgot Password Page**: Password reset via email

### Authentication Features
- **User Registration**: Create new accounts with email and password
- **User Login**: Secure authentication using Firebase Auth
- **Password Reset**: Email-based password recovery
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: User-friendly error messages for authentication failures
- **Loading States**: Visual feedback during authentication processes
- **Protected Routes**: Authentication state management using React Context

## Design

The application follows a clean, modern design with:
- Blue color scheme (#1E3A8A primary, #5B8DEE secondary)
- Gold accents (#D4A017)
- Light blue form backgrounds (#C9E4F5)
- Dark navy backgrounds for login/signup pages (#0A2540)
- White backgrounds for landing page

## Technologies

- React 18
- Material-UI (MUI) 5
- React Router DOM 6
- Emotion for styled components
