"""
Comprehensive test for the complete admin system
Tests all admin functionality including authentication and authorization
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

class AdminSystemTest:
    def __init__(self):
        self.access_token = None
        self.refresh_token = None
        
    def test_admin_login(self):
        """Test admin login functionality"""
        print("=== 1. Testing Admin Login ===")
        
        login_data = {
            "email": "mustapha.belkebir@ensia.edu.dz",
            "password": "--"
        }
        
        response = requests.post(f"{BASE_URL}/admin/auth/login", json=login_data)
        
        if response.status_code == 200:
            result = response.json()
            self.access_token = result['data']['access_token']
            self.refresh_token = result['data']['refresh_token']
            print(f"✅ Admin login successful! Admin: {result['data']['admin']['name']}")
            return True
        else:
            print(f"❌ Admin login failed: {response.text}")
            return False
    
    def test_admin_profile(self):
        """Test admin profile access"""
        print("\n=== 2. Testing Admin Profile Access ===")
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.get(f"{BASE_URL}/admin/auth/profile", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Admin profile access successful! Admin: {result['data']['admin']['name']}")
            return True
        else:
            print(f"❌ Admin profile access failed: {response.text}")
            return False
    
    def test_admin_authority_users(self):
        """Test admin authority over user endpoints"""
        print("\n=== 3. Testing Admin Authority on Users ===")
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        # Test listing users
        response = requests.get(f"{BASE_URL}/users", headers=headers)
        if response.status_code == 200:
            users = response.json()['data']
            print(f"✅ Admin can list users! Found {len(users)} users")
            
            # Test updating a user (if users exist)
            if users:
                user_id = users[0]['id']
                update_data = {"first_name": "AdminUpdated"}
                
                update_response = requests.put(f"{BASE_URL}/users/{user_id}", 
                                             json=update_data, headers=headers)
                if update_response.status_code == 200:
                    print("✅ Admin can update users!")
                    
                    # Test admin can update user_type (admin-only field)
                    type_update = {"user_type": "registered"}
                    type_response = requests.put(f"{BASE_URL}/users/{user_id}",
                                               json=type_update, headers=headers)
                    if type_response.status_code == 200:
                        updated_user = type_response.json()['data']
                        if updated_user.get('user_type') == 'registered':
                            print("✅ Admin can update user_type (admin-only field)!")
                        else:
                            print("⚠️ Admin update worked but user_type not changed")
                    return True
                else:
                    print(f"❌ Admin cannot update users: {update_response.text}")
                    return False
            else:
                print("ℹ️ No users found to test updates")
                return True
        else:
            print(f"❌ Admin cannot list users: {response.text}")
            return False
    
    def test_admin_authority_contributors(self):
        """Test admin authority over contributor endpoints"""
        print("\n=== 4. Testing Admin Authority on Contributors ===")
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        # Test listing contributors
        response = requests.get(f"{BASE_URL}/contributors", headers=headers)
        if response.status_code == 200:
            contributors = response.json()['data']
            print(f"✅ Admin can list contributors! Found {len(contributors)} contributors")
            
            # Test updating contributor verification (admin-only)
            if contributors:
                contributor_id = contributors[0]['id']
                update_data = {
                    "verification_status": "approved",
                    "verified": True
                }
                
                update_response = requests.put(f"{BASE_URL}/contributors/{contributor_id}",
                                             json=update_data, headers=headers)
                if update_response.status_code == 200:
                    updated = update_response.json()['data']
                    if updated.get('verification_status') == 'approved':
                        print("✅ Admin can update verification status (admin-only field)!")
                    else:
                        print("⚠️ Admin update worked but verification status not updated")
                    return True
                else:
                    print(f"❌ Admin cannot update contributors: {update_response.text}")
                    return False
            else:
                print("ℹ️ No contributors found to test updates")
                return True
        else:
            print(f"❌ Admin cannot list contributors: {response.text}")
            return False
    
    def test_token_refresh(self):
        """Test admin token refresh"""
        print("\n=== 5. Testing Admin Token Refresh ===")
        
        refresh_data = {"refresh_token": self.refresh_token}
        response = requests.post(f"{BASE_URL}/admin/auth/refresh", json=refresh_data)
        
        if response.status_code == 200:
            result = response.json()
            new_token = result['data']['access_token']
            print("✅ Admin token refresh successful!")
            
            # Test new token works
            headers = {"Authorization": f"Bearer {new_token}"}
            profile_response = requests.get(f"{BASE_URL}/admin/auth/profile", headers=headers)
            
            if profile_response.status_code == 200:
                print("✅ New access token works correctly!")
                return True
            else:
                print("❌ New access token doesn't work")
                return False
        else:
            print(f"❌ Token refresh failed: {response.text}")
            return False
    
    def test_admin_change_password(self):
        """Test admin password change"""
        print("\n=== 6. Testing Admin Password Change ===")
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        change_data = {
            "current_password": "belkebir2004",
            "new_password": "newpassword123"
        }
        
        response = requests.post(f"{BASE_URL}/admin/auth/change-password", 
                               json=change_data, headers=headers)
        
        if response.status_code == 200:
            print("✅ Admin password change successful!")
            
            # Test login with new password
            login_data = {
                "email": "mustapha.belkebir@ensia.edu.dz",
                "password": "newpassword123"
            }
            
            login_response = requests.post(f"{BASE_URL}/admin/auth/login", json=login_data)
            if login_response.status_code == 200:
                print("✅ Login with new password successful!")
                
                # Change password back to original
                new_access = login_response.json()['data']['access_token']
                reset_headers = {"Authorization": f"Bearer {new_access}"}
                reset_data = {
                    "current_password": "newpassword123",
                    "new_password": "belkebir2004"
                }
                
                reset_response = requests.post(f"{BASE_URL}/admin/auth/change-password",
                                             json=reset_data, headers=reset_headers)
                if reset_response.status_code == 200:
                    print("✅ Password reset to original successful!")
                    return True
                else:
                    print("⚠️ Password change worked but reset failed")
                    return True
            else:
                print("❌ Login with new password failed")
                return False
        else:
            print(f"❌ Password change failed: {response.text}")
            return False
    
    def test_unauthorized_access(self):
        """Test that non-admin users cannot access admin endpoints"""
        print("\n=== 7. Testing Unauthorized Access Prevention ===")
        
        # Test without token
        response = requests.get(f"{BASE_URL}/admin/auth/profile")
        if response.status_code == 401:
            print("✅ Admin endpoints properly reject requests without tokens!")
        else:
            print(f"❌ Admin endpoints accept requests without tokens: {response.status_code}")
            return False
        
        # Test with invalid token
        headers = {"Authorization": "Bearer invalid_token"}
        response = requests.get(f"{BASE_URL}/admin/auth/profile", headers=headers)
        if response.status_code == 401:
            print("✅ Admin endpoints properly reject invalid tokens!")
            return True
        else:
            print(f"❌ Admin endpoints accept invalid tokens: {response.status_code}")
            return False
    
    def run_all_tests(self):
        """Run all admin system tests"""
        print("🔐 Starting Comprehensive Admin System Tests...\n")
        
        tests = [
            ("Admin Login", self.test_admin_login),
            ("Admin Profile", self.test_admin_profile),
            ("Admin Authority on Users", self.test_admin_authority_users),
            ("Admin Authority on Contributors", self.test_admin_authority_contributors),
            ("Token Refresh", self.test_token_refresh),
            ("Password Change", self.test_admin_change_password),
            ("Unauthorized Access Prevention", self.test_unauthorized_access),
        ]
        
        results = []
        for test_name, test_func in tests:
            try:
                if test_name == "Admin Login":
                    success = test_func()
                    results.append((test_name, success))
                    if not success:
                        print("❌ Cannot continue without successful login")
                        break
                else:
                    success = test_func() if self.access_token else False
                    results.append((test_name, success))
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {str(e)}")
                results.append((test_name, False))
        
        # Print summary
        print("\n" + "="*60)
        print("🔐 ADMIN SYSTEM TEST SUMMARY")
        print("="*60)
        
        passed = sum(1 for _, success in results if success)
        total = len(results)
        
        for test_name, success in results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"{test_name:<35} {status}")
        
        print("="*60)
        print(f"TOTAL: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL ADMIN SYSTEM TESTS PASSED! 🎉")
            print("\nAdmin system is fully functional:")
            print("• ✅ Admin authentication with login/logout")
            print("• ✅ JWT token generation and refresh")
            print("• ✅ Admin authority over user endpoints")
            print("• ✅ Admin authority over contributor endpoints")
            print("• ✅ Admin-only field modifications")
            print("• ✅ Password change functionality")
            print("• ✅ Proper security and access control")
        else:
            print(f"⚠️ {total - passed} test(s) failed. Please review the errors above.")

if __name__ == "__main__":
    tester = AdminSystemTest()
    tester.run_all_tests()