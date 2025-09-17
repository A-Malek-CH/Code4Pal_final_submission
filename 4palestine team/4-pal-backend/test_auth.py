"""
Test script for authentication system
Run this after setting up the database and installing dependencies
"""

import requests
import json
import time

# Base URL for the API
BASE_URL = "http://127.0.0.1:5000/api"

def test_user_registration():
    """Test user registration"""
    print("Testing user registration...")
    
    # Use a unique email each time to avoid conflicts
    import time
    timestamp = int(time.time())
    
    user_data = {
        "email": f"testuser{timestamp}@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "+1234567890"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register/user", json=user_data)
    print(f"Registration status: {response.status_code}")
    print(f"Registration response: {response.text}")
    
    if response.status_code in [200, 201]:
        try:
            data = response.json()
            if data.get('success', False):
                print(f"✅ User created: {data['data']['user']['email']}")
                print(f"✅ Access token received: {'access_token' in data['data']}")
                print(f"✅ Refresh token received: {'refresh_token' in data['data']}")
                return data['data']
            else:
                print(f"❌ Registration failed: {data.get('message', 'Unknown error')}")
                return None
        except Exception as e:
            print(f"❌ Error parsing response: {e}")
            return None
    else:
        print(f"❌ Registration failed: {response.text}")
        return None

def test_user_login():
    """Test user login"""
    print("\nTesting user login...")
    
    # Try to login with existing user first
    login_data = {
        "email": "testuser@example.com",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login/user", json=login_data)
    print(f"Login status: {response.status_code}")
    print(f"Login response: {response.text}")
    
    if response.status_code == 200:
        try:
            data = response.json()
            print(f"✅ Login successful for: {data['data']['user']['email']}")
            return data['data']
        except Exception as e:
            print(f"❌ Error parsing login response: {e}")
            return None
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def test_contributor_registration():
    """Test contributor registration"""
    print("\nTesting contributor registration...")
    
    # Use a unique email each time to avoid conflicts
    import time
    timestamp = int(time.time())
    
    contributor_data = {
        "email": f"contributor{timestamp}@example.com",
        "password": "contributorpass123",
        "first_name": "Test",
        "last_name": "Contributor",
        "contributor_type": "individual",
        "motivation": "I want to help my community"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register/contributor", json=contributor_data)
    print(f"Contributor registration status: {response.status_code}")
    print(f"Contributor registration response: {response.text}")
    
    if response.status_code in [200, 201]:
        try:
            data = response.json()
            if data.get('success', False):
                print(f"✅ Contributor created: {data['data']['user']['email']}")
                print(f"✅ Contributor ID: {data['data']['contributor']['id']}")
                return data['data']
            else:
                print(f"❌ Contributor registration failed: {data.get('message', 'Unknown error')}")
                return None
        except Exception as e:
            print(f"❌ Error parsing contributor response: {e}")
            return None
    else:
        print(f"❌ Contributor registration failed: {response.text}")
        return None

def test_protected_routes(access_token):
    """Test accessing protected routes"""
    print(f"\nTesting protected routes with token...")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # Test /me endpoint
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"GET /auth/me status: {response.status_code}")
    if response.status_code == 200:
        print(f"Current user info retrieved successfully")
    
    # Test list users (should work with auth)
    response = requests.get(f"{BASE_URL}/users", headers=headers)
    print(f"GET /users status: {response.status_code}")
    
    return response.status_code == 200

def test_token_refresh(refresh_token):
    """Test token refresh"""
    print(f"\nTesting token refresh...")
    
    refresh_data = {
        "refresh_token": refresh_token
    }
    
    response = requests.post(f"{BASE_URL}/auth/refresh", json=refresh_data)
    print(f"Token refresh status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"New access token received")
        return data['data']['access_token']
    else:
        print(f"Token refresh failed: {response.text}")
        return None

def test_logout(refresh_token, access_token):
    """Test logout"""
    print(f"\nTesting logout...")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    logout_data = {
        "refresh_token": refresh_token
    }
    
    response = requests.post(f"{BASE_URL}/auth/logout", json=logout_data, headers=headers)
    print(f"Logout status: {response.status_code}")
    
    if response.status_code == 200:
        print("Logout successful")
        return True
    else:
        print(f"Logout failed: {response.text}")
        return False

def test_unauthorized_access():
    """Test accessing protected routes without token"""
    print(f"\nTesting unauthorized access...")
    
    # Try to access protected route without token
    response = requests.get(f"{BASE_URL}/users")
    print(f"GET /users without token status: {response.status_code}")
    
    if response.status_code == 401:
        print("Unauthorized access properly blocked")
        return True
    else:
        print("Security issue: Unauthorized access not blocked properly")
        return False

def run_all_tests():
    """Run all authentication tests"""
    print("=" * 50)
    print("AUTHENTICATION SYSTEM TESTS")
    print("=" * 50)
    
    try:
        # Test user registration
        user_data = test_user_registration()
        if not user_data:
            print("❌ User registration failed, stopping tests")
            return
        
        print("✅ User registration successful!")
        user_access_token = user_data['access_token']
        user_refresh_token = user_data['refresh_token']
        
        # Test user login
        login_data = test_user_login()
        if login_data:
            print("✅ User login successful!")
            user_access_token = login_data['access_token']  # Use fresh token
            user_refresh_token = login_data['refresh_token']
        else:
            print("⚠️  User login failed, but continuing with registration tokens")
        
        # Test contributor registration
        contributor_data = test_contributor_registration()
        
        # Test protected routes
        test_protected_routes(user_access_token)
        
        # Test token refresh
        new_access_token = test_token_refresh(user_refresh_token)
        if new_access_token:
            user_access_token = new_access_token
        
        # Test unauthorized access
        test_unauthorized_access()
        
        # Test logout
        test_logout(user_refresh_token, user_access_token)
        
        print("\n" + "=" * 50)
        print("TESTS COMPLETED")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to the API server.")
        print("Make sure the Flask server is running on http://127.0.0.1:5000")
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    run_all_tests()