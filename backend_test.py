#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Repbep
Tests all authentication, profile, projects, and AI chat endpoints
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Backend URL from frontend .env
BACKEND_URL = "https://repbep-profiles.preview.emergentagent.com/api"

class RepbepAPITester:
    def __init__(self):
        self.session = None
        self.auth_token = None
        self.user_id = None
        self.project_id = None
        self.conversation_id = None
        self.test_results = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, success: bool, details: str, response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        print(f"   Details: {details}")
        if response_data:
            print(f"   Response: {json.dumps(response_data, indent=2, default=str)}")
        print("-" * 80)
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data,
            "timestamp": datetime.now().isoformat()
        })
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple:
        """Make HTTP request and return (success, status_code, response_data)"""
        url = f"{BACKEND_URL}{endpoint}"
        request_headers = {"Content-Type": "application/json"}
        
        if headers:
            request_headers.update(headers)
            
        if self.auth_token and "Authorization" not in request_headers:
            request_headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            async with self.session.request(
                method, 
                url, 
                json=data if data else None,
                headers=request_headers
            ) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                
                return response.status < 400, response.status, response_data
                
        except Exception as e:
            return False, 0, str(e)
    
    # ============= AUTHENTICATION TESTS =============
    
    async def test_register(self):
        """Test user registration"""
        test_data = {
            "email": "test@repbep.com",
            "password": "test123",
            "displayName": "Test User"
        }
        
        success, status_code, response = await self.make_request("POST", "/auth/register", test_data)
        
        if success and status_code == 200:
            if "token" in response and "user" in response:
                self.auth_token = response["token"]
                self.user_id = response["user"]["id"]
                self.log_test(
                    "POST /api/auth/register", 
                    True, 
                    f"User registered successfully. Status: {status_code}",
                    {"user_id": self.user_id, "has_token": bool(self.auth_token)}
                )
            else:
                self.log_test(
                    "POST /api/auth/register", 
                    False, 
                    f"Missing token or user in response. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "POST /api/auth/register", 
                False, 
                f"Registration failed. Status: {status_code}",
                response
            )
    
    async def test_login(self):
        """Test user login"""
        test_data = {
            "email": "test@repbep.com",
            "password": "test123"
        }
        
        success, status_code, response = await self.make_request("POST", "/auth/login", test_data)
        
        if success and status_code == 200:
            if "token" in response and "user" in response:
                self.auth_token = response["token"]
                self.user_id = response["user"]["id"]
                self.log_test(
                    "POST /api/auth/login", 
                    True, 
                    f"Login successful. Status: {status_code}",
                    {"user_id": self.user_id, "email": response["user"].get("email")}
                )
            else:
                self.log_test(
                    "POST /api/auth/login", 
                    False, 
                    f"Missing token or user in response. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "POST /api/auth/login", 
                False, 
                f"Login failed. Status: {status_code}",
                response
            )
    
    async def test_get_me(self):
        """Test get current user"""
        if not self.auth_token:
            self.log_test("GET /api/auth/me", False, "No auth token available", None)
            return
            
        success, status_code, response = await self.make_request("GET", "/auth/me")
        
        if success and status_code == 200:
            if "id" in response and "email" in response:
                self.log_test(
                    "GET /api/auth/me", 
                    True, 
                    f"User profile retrieved successfully. Status: {status_code}",
                    {"user_id": response["id"], "email": response["email"], "displayName": response.get("displayName")}
                )
            else:
                self.log_test(
                    "GET /api/auth/me", 
                    False, 
                    f"Invalid user data in response. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "GET /api/auth/me", 
                False, 
                f"Failed to get user profile. Status: {status_code}",
                response
            )
    
    # ============= PROFILE TESTS =============
    
    async def test_update_profile(self):
        """Test profile update"""
        if not self.auth_token:
            self.log_test("PUT /api/profile", False, "No auth token available", None)
            return
            
        test_data = {
            "displayName": "Updated Test User",
            "bio": "This is a test bio for the updated user",
            "theme": "light",
            "colorScheme": "blue"
        }
        
        success, status_code, response = await self.make_request("PUT", "/profile", test_data)
        
        if success and status_code == 200:
            if response.get("displayName") == test_data["displayName"] and response.get("bio") == test_data["bio"]:
                self.log_test(
                    "PUT /api/profile", 
                    True, 
                    f"Profile updated successfully. Status: {status_code}",
                    {
                        "displayName": response.get("displayName"),
                        "bio": response.get("bio"),
                        "theme": response.get("theme"),
                        "colorScheme": response.get("colorScheme")
                    }
                )
            else:
                self.log_test(
                    "PUT /api/profile", 
                    False, 
                    f"Profile data not updated correctly. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "PUT /api/profile", 
                False, 
                f"Profile update failed. Status: {status_code}",
                response
            )
    
    # ============= PROJECTS TESTS =============
    
    async def test_create_project(self):
        """Test project creation"""
        if not self.auth_token:
            self.log_test("POST /api/projects", False, "No auth token available", None)
            return
            
        test_data = {
            "name": "Test Project",
            "description": "Testing",
            "tech": ["React", "FastAPI"],
            "color": "emerald"
        }
        
        success, status_code, response = await self.make_request("POST", "/projects", test_data)
        
        if success and status_code == 200:
            if "id" in response and response.get("name") == test_data["name"]:
                self.project_id = response["id"]
                self.log_test(
                    "POST /api/projects", 
                    True, 
                    f"Project created successfully. Status: {status_code}",
                    {
                        "project_id": self.project_id,
                        "name": response.get("name"),
                        "description": response.get("description"),
                        "tech": response.get("tech")
                    }
                )
            else:
                self.log_test(
                    "POST /api/projects", 
                    False, 
                    f"Invalid project data in response. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "POST /api/projects", 
                False, 
                f"Project creation failed. Status: {status_code}",
                response
            )
    
    async def test_get_projects(self):
        """Test get all projects"""
        if not self.auth_token:
            self.log_test("GET /api/projects", False, "No auth token available", None)
            return
            
        success, status_code, response = await self.make_request("GET", "/projects")
        
        if success and status_code == 200:
            if isinstance(response, list):
                project_count = len(response)
                self.log_test(
                    "GET /api/projects", 
                    True, 
                    f"Projects retrieved successfully. Status: {status_code}. Found {project_count} projects",
                    {"project_count": project_count, "projects": [p.get("name") for p in response]}
                )
            else:
                self.log_test(
                    "GET /api/projects", 
                    False, 
                    f"Response is not a list. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "GET /api/projects", 
                False, 
                f"Failed to get projects. Status: {status_code}",
                response
            )
    
    async def test_update_project(self):
        """Test project update"""
        if not self.auth_token or not self.project_id:
            self.log_test("PUT /api/projects/{id}", False, "No auth token or project ID available", None)
            return
            
        test_data = {
            "name": "Updated Test Project",
            "description": "Updated description for testing",
            "tech": ["React", "FastAPI", "MongoDB"]
        }
        
        success, status_code, response = await self.make_request("PUT", f"/projects/{self.project_id}", test_data)
        
        if success and status_code == 200:
            if response.get("name") == test_data["name"] and response.get("description") == test_data["description"]:
                self.log_test(
                    "PUT /api/projects/{id}", 
                    True, 
                    f"Project updated successfully. Status: {status_code}",
                    {
                        "project_id": self.project_id,
                        "name": response.get("name"),
                        "description": response.get("description"),
                        "tech": response.get("tech")
                    }
                )
            else:
                self.log_test(
                    "PUT /api/projects/{id}", 
                    False, 
                    f"Project data not updated correctly. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "PUT /api/projects/{id}", 
                False, 
                f"Project update failed. Status: {status_code}",
                response
            )
    
    async def test_delete_project(self):
        """Test project deletion"""
        if not self.auth_token or not self.project_id:
            self.log_test("DELETE /api/projects/{id}", False, "No auth token or project ID available", None)
            return
            
        success, status_code, response = await self.make_request("DELETE", f"/projects/{self.project_id}")
        
        if success and status_code == 200:
            if "message" in response and "deleted" in response["message"].lower():
                self.log_test(
                    "DELETE /api/projects/{id}", 
                    True, 
                    f"Project deleted successfully. Status: {status_code}",
                    response
                )
                self.project_id = None  # Clear project ID since it's deleted
            else:
                self.log_test(
                    "DELETE /api/projects/{id}", 
                    False, 
                    f"Unexpected response format. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "DELETE /api/projects/{id}", 
                False, 
                f"Project deletion failed. Status: {status_code}",
                response
            )
    
    # ============= AI CHAT TESTS =============
    
    async def test_send_message(self):
        """Test sending a message to AI"""
        if not self.auth_token:
            self.log_test("POST /api/chat/message", False, "No auth token available", None)
            return
            
        test_data = {
            "message": "Hello, can you help me build a todo app?",
            "projectId": self.project_id  # Can be None
        }
        
        success, status_code, response = await self.make_request("POST", "/chat/message", test_data)
        
        if success and status_code == 200:
            if "conversationId" in response and "message" in response:
                self.conversation_id = response["conversationId"]
                ai_message = response["message"]
                self.log_test(
                    "POST /api/chat/message", 
                    True, 
                    f"AI message sent successfully. Status: {status_code}",
                    {
                        "conversation_id": self.conversation_id,
                        "ai_response_length": len(ai_message.get("content", "")),
                        "ai_role": ai_message.get("role"),
                        "has_content": bool(ai_message.get("content"))
                    }
                )
            else:
                self.log_test(
                    "POST /api/chat/message", 
                    False, 
                    f"Invalid response format. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "POST /api/chat/message", 
                False, 
                f"Failed to send message. Status: {status_code}",
                response
            )
    
    async def test_follow_up_message(self):
        """Test sending a follow-up message in the same conversation"""
        if not self.auth_token or not self.conversation_id:
            self.log_test("POST /api/chat/message (follow-up)", False, "No auth token or conversation ID available", None)
            return
            
        test_data = {
            "message": "What technologies would you recommend for the backend?",
            "conversationId": self.conversation_id
        }
        
        success, status_code, response = await self.make_request("POST", "/chat/message", test_data)
        
        if success and status_code == 200:
            if "conversationId" in response and "message" in response:
                ai_message = response["message"]
                self.log_test(
                    "POST /api/chat/message (follow-up)", 
                    True, 
                    f"Follow-up message sent successfully. Status: {status_code}",
                    {
                        "conversation_id": response["conversationId"],
                        "ai_response_length": len(ai_message.get("content", "")),
                        "ai_role": ai_message.get("role"),
                        "has_content": bool(ai_message.get("content"))
                    }
                )
            else:
                self.log_test(
                    "POST /api/chat/message (follow-up)", 
                    False, 
                    f"Invalid response format. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "POST /api/chat/message (follow-up)", 
                False, 
                f"Failed to send follow-up message. Status: {status_code}",
                response
            )
    
    async def test_get_conversations(self):
        """Test getting conversation history"""
        if not self.auth_token:
            self.log_test("GET /api/chat/conversations", False, "No auth token available", None)
            return
            
        success, status_code, response = await self.make_request("GET", "/chat/conversations")
        
        if success and status_code == 200:
            if isinstance(response, list):
                conversation_count = len(response)
                total_messages = sum(len(conv.get("messages", [])) for conv in response)
                self.log_test(
                    "GET /api/chat/conversations", 
                    True, 
                    f"Conversations retrieved successfully. Status: {status_code}. Found {conversation_count} conversations with {total_messages} total messages",
                    {
                        "conversation_count": conversation_count,
                        "total_messages": total_messages,
                        "conversations": [{"id": conv.get("id"), "title": conv.get("title"), "message_count": len(conv.get("messages", []))} for conv in response]
                    }
                )
            else:
                self.log_test(
                    "GET /api/chat/conversations", 
                    False, 
                    f"Response is not a list. Status: {status_code}",
                    response
                )
        else:
            self.log_test(
                "GET /api/chat/conversations", 
                False, 
                f"Failed to get conversations. Status: {status_code}",
                response
            )
    
    # ============= MAIN TEST RUNNER =============
    
    async def run_all_tests(self):
        """Run all API tests in sequence"""
        print("=" * 80)
        print("REPBEP BACKEND API TESTING")
        print("=" * 80)
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 80)
        
        # Authentication Tests
        print("\n🔐 AUTHENTICATION TESTS")
        await self.test_register()
        await self.test_login()
        await self.test_get_me()
        
        # Profile Tests
        print("\n👤 PROFILE TESTS")
        await self.test_update_profile()
        
        # Projects Tests
        print("\n📁 PROJECTS TESTS")
        await self.test_create_project()
        await self.test_get_projects()
        await self.test_update_project()
        await self.test_delete_project()
        
        # AI Chat Tests
        print("\n🤖 AI CHAT TESTS")
        await self.test_send_message()
        await self.test_follow_up_message()
        await self.test_get_conversations()
        
        # Summary
        print("\n" + "=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        failed = total - passed
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("\n" + "=" * 80)
        return passed, failed, total

async def main():
    """Main test runner"""
    async with RepbepAPITester() as tester:
        passed, failed, total = await tester.run_all_tests()
        
        # Exit with error code if any tests failed
        if failed > 0:
            sys.exit(1)
        else:
            print("🎉 All tests passed!")
            sys.exit(0)

if __name__ == "__main__":
    asyncio.run(main())