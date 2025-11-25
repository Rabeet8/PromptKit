# Environment Variables Setup

## Overview
This project uses environment variables to keep sensitive configuration data (like API URLs and Firebase credentials) private and out of version control.

## Setup Instructions

### 1. Create Your `.env` File
Copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

### 2. Fill in Your Values
Open the `.env` file and replace the placeholder values with your actual credentials:

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://your-actual-api-url.com

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
# ... etc
```

### 3. Important Notes

- **EXPO_PUBLIC_ Prefix**: In Expo, environment variables that need to be accessible in your app code MUST be prefixed with `EXPO_PUBLIC_`. This is an Expo requirement for client-side environment variables.

- **Git Ignore**: The `.env` file is already added to `.gitignore`, so it won't be committed to your repository. This keeps your sensitive data safe.

- **Restart Required**: After changing environment variables, you need to restart your Expo development server:
  ```bash
  # Stop the current server (Ctrl+C)
  # Then restart
  npm start
  ```

- **Production Builds**: For production builds (EAS Build), you'll need to set these environment variables in your EAS secrets or in the `eas.json` configuration.

## Files Modified

1. **`.env`** - Contains your actual secret values (NOT committed to git)
2. **`.env.example`** - Template file showing what variables are needed (committed to git)
3. **`.gitignore`** - Updated to ignore `.env` file
4. **`api/apiClient.ts`** - Now reads base URL from environment variables
5. **`config/firebase.ts`** - Now reads Firebase config from environment variables

## Security Best Practices

✅ **DO:**
- Keep your `.env` file local and never commit it
- Share `.env.example` with your team
- Use different values for development and production
- Rotate your API keys regularly

❌ **DON'T:**
- Commit `.env` to version control
- Share your `.env` file in chat/email
- Hardcode sensitive values in your code
- Use production credentials in development

## Troubleshooting

### Error: "EXPO_PUBLIC_API_BASE_URL is not defined"
- Make sure you have a `.env` file in the project root
- Verify the variable name is exactly `EXPO_PUBLIC_API_BASE_URL`
- Restart your Expo development server

### Changes not reflecting
- Clear Expo cache: `npx expo start -c`
- Restart the development server
