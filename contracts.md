# Repbep Backend Implementation Contracts

## Overview
This document outlines the API contracts, database schema, and integration plan for the Repbep platform backend.

## Technology Stack
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI Model**: Anthropic Claude Sonnet 4.5 via emergentintegrations
- **Authentication**: JWT-based

## API Contracts

### 1. Authentication Endpoints

#### POST /api/auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```
**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe"
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "user": { ... },
  "token": "jwt_token"
}
```

#### GET /api/auth/me
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "avatar": "url",
  "bio": "...",
  "theme": "dark",
  "colorScheme": "emerald",
  "socialLinks": { ... },
  "workspaceSettings": { ... }
}
```

### 2. Profile Endpoints

#### PUT /api/profile
**Headers:** `Authorization: Bearer <token>`
**Request:**
```json
{
  "displayName": "Updated Name",
  "bio": "My bio",
  "avatar": "url",
  "theme": "dark",
  "colorScheme": "emerald",
  "socialLinks": {
    "github": "url",
    "twitter": "url",
    "linkedin": "url"
  },
  "workspaceSettings": {
    "autoSave": true,
    "codeCompletion": true,
    "notifications": true
  }
}
```

### 3. Projects Endpoints

#### GET /api/projects
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
[
  {
    "id": "project_id",
    "name": "Project Name",
    "description": "Description",
    "status": "active",
    "tech": ["React", "Node.js"],
    "color": "emerald",
    "createdAt": "ISO date",
    "lastModified": "ISO date"
  }
]
```

#### POST /api/projects
**Headers:** `Authorization: Bearer <token>`
**Request:**
```json
{
  "name": "New Project",
  "description": "Description",
  "tech": ["React"],
  "color": "emerald"
}
```

#### PUT /api/projects/:id
**Headers:** `Authorization: Bearer <token>`
**Request:** Same as POST

#### DELETE /api/projects/:id
**Headers:** `Authorization: Bearer <token>`

### 4. AI Chat Endpoints

#### POST /api/chat/message
**Headers:** `Authorization: Bearer <token>`
**Request:**
```json
{
  "projectId": "project_id",
  "message": "User message",
  "conversationId": "optional_conversation_id"
}
```
**Response:**
```json
{
  "conversationId": "conversation_id",
  "message": {
    "id": "message_id",
    "role": "assistant",
    "content": "AI response",
    "timestamp": "ISO date"
  }
}
```

#### GET /api/chat/conversations/:projectId
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
[
  {
    "id": "conversation_id",
    "projectId": "project_id",
    "title": "Conversation title",
    "messages": [...],
    "createdAt": "ISO date"
  }
]
```

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (hashed)",
  "displayName": "string",
  "avatar": "string (url)",
  "bio": "string",
  "theme": "string (dark/light)",
  "colorScheme": "string",
  "socialLinks": {
    "github": "string",
    "twitter": "string",
    "linkedin": "string"
  },
  "workspaceSettings": {
    "autoSave": "boolean",
    "codeCompletion": "boolean",
    "notifications": "boolean"
  },
  "createdAt": "datetime"
}
```

### Projects Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "name": "string",
  "description": "string",
  "status": "string (active/completed/archived)",
  "tech": ["string"],
  "color": "string",
  "createdAt": "datetime",
  "lastModified": "datetime"
}
```

### Conversations Collection
```json
{
  "_id": "ObjectId",
  "projectId": "ObjectId",
  "userId": "ObjectId",
  "title": "string",
  "sessionId": "string (for LlmChat)",
  "createdAt": "datetime",
  "lastModified": "datetime"
}
```

### Messages Collection
```json
{
  "_id": "ObjectId",
  "conversationId": "ObjectId",
  "role": "string (user/assistant)",
  "content": "string",
  "timestamp": "datetime"
}
```

## Mock Data to Replace

### In mock.js:
1. **mockUser** → Replace with GET /api/auth/me
2. **mockProjects** → Replace with GET /api/projects
3. **mockConversations** → Replace with GET /api/chat/conversations/:projectId

## Frontend Integration Plan

### 1. Create API Service (src/services/api.js)
- Axios instance with base URL
- Request/response interceptors for auth token
- Error handling

### 2. Update Components
- **Auth.jsx**: Connect to /api/auth/login and /api/auth/register
- **Dashboard.jsx**: Connect to /api/chat/message for AI interactions
- **Profile.jsx**: Connect to /api/profile for updates
- **Projects.jsx**: Connect to /api/projects for CRUD operations

### 3. Add Context/State Management
- AuthContext for user authentication state
- Store JWT token in localStorage
- Auto-refresh user data on login

## AI Integration Details

### Claude Sonnet 4.5 Setup
- Use `emergentintegrations` library
- Model: "claude-sonnet-4-5-20250929"
- Provider: "anthropic"
- Use EMERGENT_LLM_KEY from environment
- Create new LlmChat instance per conversation
- Store conversation history in database

### System Message
```
You are an AI development assistant for Repbep, a platform that helps developers build applications using AI agents. You provide guidance on:
- Frontend development (React, Tailwind, JavaScript)
- Backend development (FastAPI, Python, MongoDB)
- Code generation and debugging
- Architecture and best practices
- Integration with third-party APIs

Be concise, practical, and provide code examples when helpful.
```

## Implementation Order
1. ✅ Frontend with mock data (COMPLETED)
2. Database models and utilities
3. Authentication endpoints
4. Profile management endpoints
5. Projects CRUD endpoints
6. AI chat integration with Claude
7. Frontend-backend integration
8. Testing

## Environment Variables Required
```
MONGO_URL=<existing>
DB_NAME=<existing>
JWT_SECRET=<generate random secret>
EMERGENT_LLM_KEY=sk-emergent-f9c3cAf169b3341127
```
