# Google Maps API Setup Guide

This guide will help you set up Google Maps API for your Trippy application.

## 1. Get a Google Maps API Key

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### Step 2: Enable Google Maps APIs
1. Go to **APIs & Services** > **Library**
2. Search for and enable these APIs:
   - **Maps JavaScript API** (required for the map component)
   - **Places API** (optional, for location search)
   - **Geocoding API** (optional, for address lookup)

### Step 3: Create API Key
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key

### Step 4: Restrict Your API Key (Recommended)
1. Click on your API key to edit it
2. Under **Application restrictions**:
   - Choose **HTTP referrers (web sites)**
   - Add your domain(s):
     - `http://localhost:*` (for development)
     - `https://yourdomain.com` (for production)
3. Under **API restrictions**:
   - Choose **Restrict key**
   - Select the APIs you enabled in Step 2

## 2. Add API Key to Your Project

### Method 1: Using .env file (Recommended)

Create or edit the `.env` file in your project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5173/api

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Other environment variables
VITE_APP_NAME=Trippy
VITE_APP_VERSION=1.0.0
```

**Important Notes:**
- Replace `your_actual_api_key_here` with your actual API key
- Never commit your real API key to version control
- Add `.env` to your `.gitignore` file

### Method 2: Environment Variables in Production

For production deployment, set the environment variable:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 3. Usage in Components

The `TripMap` component is already set up to use your API key:

```tsx
import TripMap from './TripMap';

function MyComponent() {
  return (
    <TripMap 
      center={{ lat: 37.7749, lng: -122.4194 }}
      zoom={10}
      markers={[
        { lat: 35.6762, lng: 139.6503, title: "Tokyo, Japan" },
        { lat: 36.3932, lng: 25.4615, title: "Santorini, Greece" }
      ]}
    />
  );
}
```

## 4. Troubleshooting

### API Key Not Working
- Verify the API key is correct in your `.env` file
- Check that the required APIs are enabled in Google Cloud Console
- Ensure your domain is allowed in the API key restrictions
- Check the browser console for error messages

### Map Not Loading
- The component will show a placeholder if the API key is not configured
- Make sure you restart your development server after adding the API key
- Verify the API key has the correct permissions

### Billing Issues
- Google Maps requires a billing account to be set up
- You get $200 in free credits per month
- Most small applications won't exceed the free tier

## 5. Security Best Practices

1. **Never expose your API key in client-side code**
2. **Use environment variables for all sensitive data**
3. **Restrict your API key to specific domains**
4. **Monitor your API usage in Google Cloud Console**
5. **Set up billing alerts to avoid unexpected charges**

## 6. Example .env File Structure

```env
# Development Environment Variables
VITE_API_BASE_URL=http://localhost:5173/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBvOkBwV...your_key_here
VITE_APP_NAME=Trippy
VITE_APP_VERSION=1.0.0

# Production would use different values:
# VITE_API_BASE_URL=https://api.yourdomain.com
# VITE_GOOGLE_MAPS_API_KEY=AIzaSyBvOkBwV...production_key_here
```

## 7. Testing Your Setup

1. Add your API key to the `.env` file
2. Restart your development server: `npm run dev`
3. Navigate to the Plan page (`/plan`)
4. You should see the Google Map with markers
5. If you see a placeholder message, check your API key configuration

## 8. Cost Management

- Monitor usage in Google Cloud Console
- Set up billing alerts
- Consider using map tiles caching for high-traffic applications
- Use the most appropriate map type for your needs

Your Google Maps integration is now ready to use!
