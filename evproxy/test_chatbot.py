#!/usr/bin/env python3
"""
Test script for the EV-PATH chatbot endpoint
Run this after setting up your environment variables
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_chatbot():
    """Test the chatbot endpoint"""
    
    # Check if API key is set
    gemini_key = os.getenv('GEMINI_API_KEY')
    if not gemini_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        print("Please set it in your .env file")
        return False
    
    # Test data
    test_message = {
        "message": "What are the benefits of electric vehicles?",
        "conversation_history": []
    }
    
    try:
        # Make request to chatbot endpoint
        response = requests.post(
            'http://localhost:8000/api/chatbot/',
            headers={'Content-Type': 'application/json'},
            json=test_message,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Chatbot endpoint is working!")
            print(f"Response: {data.get('response', 'No response')[:200]}...")
            print(f"Conversation ID: {data.get('conversation_id')}")
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        print("Make sure Django server is running: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing EV-PATH Chatbot...")
    print("=" * 40)
    test_chatbot()
