"""
Test script for admin authentication
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def test_admin_login():
    """Test admin login functionality"""
    print("=== Testing Admin Login ===")
    
    login_data = {
        "email": "mustapha.belkebir@ensia.edu.dz",
        "password": "---"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/admin/auth/login", json=login_data)
        print(f"Login Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Admin login successful!")
            print(f"Admin: {result['data']['admin']['name']}")
            
            access_token = result['data']['access_token']
            refresh_token = result['data']['refresh_token']
            
            return access_token, refresh_token
        else:
            print("❌ Admin login failed!")
            print(f"Error: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Login request failed: {str(e)}")
        return None, None

def test_admin_profile(access_token):
    """Test admin profile access"""
    print("\n=== Testing Admin Profile Access ===")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/admin/auth/profile", headers=headers)
        print(f"Profile Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Admin profile access successful!")
            print(f"Admin: {result['data']['admin']['name']}")
        else:
            print("❌ Admin profile access failed!")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Profile request failed: {str(e)}")

def test_admin_authority_on_users(access_token):
    """Test admin authority on user endpoints"""
    print("\n=== Testing Admin Authority on Users ===")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        # Test getting all users
        response = requests.get(f"{BASE_URL}/users", headers=headers)
        print(f"List Users Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Admin can list users! Found {len(result['data'])} users")
            
            # If there are users, try to update one (simulate admin update)
            if result['data']:
                user_id = result['data'][0]['id']
                update_data = {"first_name": "Admin_Updated_Name"}
                
                update_response = requests.put(f"{BASE_URL}/users/{user_id}", 
                                             json=update_data, headers=headers)
                print(f"Update User Status Code: {update_response.status_code}")
                
                if update_response.status_code == 200:
                    print("✅ Admin can update users!")
                else:
                    print("❌ Admin cannot update users")
                    print(f"Error: {update_response.text}")
        else:
            print("❌ Admin cannot list users!")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Users request failed: {str(e)}")

def test_admin_refresh_token(refresh_token):
    """Test admin token refresh"""
    print("\n=== Testing Admin Token Refresh ===")
    
    refresh_data = {"refresh_token": refresh_token}
    
    try:
        response = requests.post(f"{BASE_URL}/admin/auth/refresh", json=refresh_data)
        print(f"Refresh Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Admin token refresh successful!")
            return result['data']['access_token']
        else:
            print("❌ Admin token refresh failed!")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Refresh request failed: {str(e)}")
        return None

def main():
    """Run all admin tests"""
    print("Starting Admin Authentication Tests...\n")
    
    # Test admin login
    access_token, refresh_token = test_admin_login()
    
    if not access_token:
        print("❌ Cannot proceed without valid access token")
        return
    
    # Test admin profile access
    test_admin_profile(access_token)
    
    # Test admin authority on users
    test_admin_authority_on_users(access_token)
    
    # Test token refresh
    new_access_token = test_admin_refresh_token(refresh_token)
    
    if new_access_token:
        print(f"\n✅ All admin authentication tests completed successfully!")
    else:
        print(f"\n⚠️ Some tests failed, but admin login is working")

if __name__ == "__main__":
    main()