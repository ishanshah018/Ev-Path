# EV-PATH Chatbot Setup Guide

## Overview
The EV-PATH chatbot is powered by Google's Gemini AI and provides expert assistance for electric vehicle-related questions.

## Environment Variables Required

Create a `.env` file in the `evproxy/` directory with the following variables:

```env
# OpenChargeMap API Key (for EV station data)
OCM_API_KEY=your_ocm_api_key_here

# Gemini AI API Key (for chatbot functionality)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Getting API Keys

### 1. OpenChargeMap API Key
1. Visit [OpenChargeMap](https://openchargemap.io/site/develop)
2. Register for a free account
3. Generate an API key
4. Add it to your `.env` file

### 2. Gemini AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Add it to your `.env` file

## Features

### Backend (Django)
- **Endpoint**: `/api/chatbot/`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "message": "Your question here",
    "conversation_history": [
      {
        "role": "user",
        "content": "Previous message"
      },
      {
        "role": "assistant", 
        "content": "Previous response"
      }
    ]
  }
  ```

### Frontend (React)
- Modern, responsive chat interface
- EV-focused quick questions
- Real-time typing indicators
- Conversation history
- Error handling
- Mobile-friendly design

## EV Topics Covered
- Electric vehicle technology and specifications
- EV charging infrastructure and connectors
- Range optimization and battery management
- Cost analysis and savings
- Trip planning and route optimization
- Environmental impact
- EV maintenance and best practices
- Indian EV market and policies

## Usage
1. Start the Django backend: `python manage.py runserver`
2. Start the React frontend: `npm run dev`
3. Navigate to `/chatbot` in your browser
4. Start asking EV-related questions!

## Troubleshooting

### 404 Error
If you get a 404 error when accessing the chatbot:

1. **Check if Django server is running**:
   ```bash
   cd evproxy
   python manage.py runserver
   ```

2. **Verify the endpoint is accessible**:
   ```bash
   curl -X POST http://localhost:8000/api/chatbot/ \
     -H "Content-Type: application/json" \
     -d '{"message": "test", "conversation_history": []}'
   ```

3. **Check if frontend proxy is configured**:
   - Ensure `vite.config.js` has the proxy configuration
   - Restart the frontend development server after making changes

### Rate Limiting
If you hit Gemini API rate limits:
- The chatbot will provide a helpful fallback response
- Wait a few minutes before trying again
- Consider upgrading your Gemini API plan for higher limits

### CORS Issues
If you see CORS errors in the browser console:
- Ensure Django CORS settings are correct
- Check that the frontend is running on the correct port (5173)
- Verify the proxy configuration in `vite.config.js`

## Security Features
- CSRF protection disabled for API endpoint
- Input validation and sanitization
- Rate limiting (can be added)
- Safety filters in Gemini API calls
