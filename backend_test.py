#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class GLIBackendTester:
    def __init__(self, base_url="https://leefstijl-coach.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.demo_accounts = [
            {"email": "inwoner@demo.nl", "password": "demo123", "role": "inwoner"},
            {"email": "deelnemer@demo.nl", "password": "demo123", "role": "deelnemer"},
            {"email": "verwijzer@demo.nl", "password": "demo123", "role": "verwijzer"},
            {"email": "professional@demo.nl", "password": "demo123", "role": "professional"}
        ]

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 200:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_demo_login(self, email, password, expected_role):
        """Test login with demo account"""
        success, response = self.run_test(
            f"Login {expected_role}",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        
        if success and 'token' in response:
            self.token = response['token']
            user_data = response.get('user', {})
            if user_data.get('role') == expected_role:
                print(f"   ✅ Role verified: {expected_role}")
                return True
            else:
                print(f"   ❌ Role mismatch: expected {expected_role}, got {user_data.get('role')}")
                return False
        return False

    def test_profile_access(self):
        """Test profile access with token"""
        return self.run_test("Get Profile", "GET", "auth/profile", 200)

    def test_public_endpoints(self):
        """Test all public endpoints"""
        print("\n" + "="*50)
        print("TESTING PUBLIC ENDPOINTS")
        print("="*50)
        
        # Test programs endpoint
        self.run_test("Get Programs", "GET", "programs", 200)
        
        # Test coaches endpoint  
        self.run_test("Get Coaches", "GET", "coaches", 200)
        
        # Test FAQs endpoint
        self.run_test("Get FAQs", "GET", "faqs", 200)
        
        # Test FAQs with role filter
        self.run_test("Get FAQs (inwoner)", "GET", "faqs?role=inwoner", 200)

    def test_contact_submission(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+31612345678",
            "message": "Test message for GLI information",
            "request_type": "info"
        }
        return self.run_test("Submit Contact", "POST", "contact", 200, data=contact_data)

    def test_protected_endpoints(self):
        """Test protected endpoints that require authentication"""
        print("\n" + "="*50)
        print("TESTING PROTECTED ENDPOINTS")
        print("="*50)
        
        # Test resources endpoint
        self.run_test("Get Resources", "GET", "resources", 200)
        
        # Test events endpoint
        self.run_test("Get Events", "GET", "events", 200)

    def test_unauthorized_access(self):
        """Test endpoints without authentication"""
        print("\n" + "="*50)
        print("TESTING UNAUTHORIZED ACCESS")
        print("="*50)
        
        # Temporarily remove token
        temp_token = self.token
        self.token = None
        
        # Should fail without token
        self.run_test("Resources (No Auth)", "GET", "resources", 401)
        self.run_test("Events (No Auth)", "GET", "events", 401)
        
        # Restore token
        self.token = temp_token

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        return self.run_test(
            "Invalid Login",
            "POST", 
            "auth/login",
            401,
            data={"email": "invalid@test.com", "password": "wrongpassword"}
        )

    def test_seed_data(self):
        """Test seed data endpoint"""
        return self.run_test("Seed Data", "POST", "admin/seed", 200)

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting GLI Backend API Tests")
        print(f"🌐 Base URL: {self.base_url}")
        print(f"🔗 API URL: {self.api_url}")
        
        # Test root endpoint
        print("\n" + "="*50)
        print("TESTING BASIC CONNECTIVITY")
        print("="*50)
        self.test_root_endpoint()
        
        # Test public endpoints
        self.test_public_endpoints()
        
        # Test contact submission
        self.test_contact_submission()
        
        # Test unauthorized access
        self.test_unauthorized_access()
        
        # Test invalid login
        self.test_invalid_login()
        
        # Test seed data
        self.test_seed_data()
        
        # Test demo account logins and role-based access
        print("\n" + "="*50)
        print("TESTING DEMO ACCOUNT AUTHENTICATION")
        print("="*50)
        
        for account in self.demo_accounts:
            print(f"\n--- Testing {account['role']} account ---")
            
            if self.test_demo_login(account['email'], account['password'], account['role']):
                # Test profile access
                self.test_profile_access()
                
                # Test protected endpoints
                self.test_protected_endpoints()
            
            # Clear token for next account
            self.token = None
        
        # Print final results
        self.print_results()

    def print_results(self):
        """Print test results summary"""
        print("\n" + "="*60)
        print("TEST RESULTS SUMMARY")
        print("="*60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"{i}. {test['name']}")
                if 'error' in test:
                    print(f"   Error: {test['error']}")
                else:
                    print(f"   Expected: {test['expected']}, Got: {test['actual']}")
                    if test.get('response'):
                        print(f"   Response: {test['response']}")
        
        return success_rate >= 80  # Consider 80%+ success rate as passing

def main():
    """Main test execution"""
    tester = GLIBackendTester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n\n⚠️ Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())