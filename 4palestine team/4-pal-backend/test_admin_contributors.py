"""
Test admin authority on contributor endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def get_admin_token():
    """Get admin token for testing"""
    login_data = {
        "email": "mustapha.belkebir@ensia.edu.dz",
        "password": "---"
    }
    
    response = requests.post(f"{BASE_URL}/admin/auth/login", json=login_data)
    if response.status_code == 200:
        result = response.json()
        return result['data']['access_token']
    return None

def test_admin_contributor_access():
    """Test admin access to contributor endpoints"""
    print("=== Testing Admin Access to Contributors ===")
    
    access_token = get_admin_token()
    if not access_token:
        print("❌ Could not get admin token")
        return
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        # Test listing contributors
        response = requests.get(f"{BASE_URL}/contributors", headers=headers)
        print(f"List Contributors Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Admin can list contributors! Found {len(result['data'])} contributors")
            
            # Test admin ability to modify verification status
            if result['data']:
                contributor_id = result['data'][0]['id']
                
                # Try to update verification status (admin-only field)
                update_data = {
                    "verification_status": "approved",
                    "verified": True
                }
                
                update_response = requests.put(f"{BASE_URL}/contributors/{contributor_id}", 
                                             json=update_data, headers=headers)
                print(f"Update Contributor Status Code: {update_response.status_code}")
                
                if update_response.status_code == 200:
                    updated_data = update_response.json()['data']
                    if updated_data.get('verification_status') == 'approved':
                        print("✅ Admin can update verification status!")
                    else:
                        print("⚠️ Admin update worked but verification status not updated")
                else:
                    print("❌ Admin cannot update contributor verification status")
                    print(f"Error: {update_response.text}")
            else:
                print("ℹ️ No contributors found to test updates")
        else:
            print("❌ Admin cannot list contributors!")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Contributor test failed: {str(e)}")

if __name__ == "__main__":
    test_admin_contributor_access()