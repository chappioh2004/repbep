from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pathlib import Path
import logging
from typing import List
from bson import ObjectId
from datetime import datetime

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import users_collection, projects_collection, conversations_collection, messages_collection
from models import (
    UserCreate, UserLogin, UserResponse, UserUpdate, TokenResponse,
    ProjectCreate, ProjectUpdate, ProjectResponse,
    MessageCreate, MessageResponse, ConversationResponse,
    SocialLinks, WorkspaceSettings
)
from auth import hash_password, verify_password, create_access_token, get_current_user
from ai_service import AIService

# Create the main app
app = FastAPI()

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Initialize AI Service
ai_service = AIService()

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

# ============= AUTH ENDPOINTS =============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = {
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "displayName": user_data.displayName,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data.displayName}",
        "bio": "",
        "theme": "dark",
        "colorScheme": "emerald",
        "socialLinks": {"github": "", "twitter": "", "linkedin": ""},
        "workspaceSettings": {"autoSave": True, "codeCompletion": True, "notifications": True},
        "createdAt": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    
    # Create token
    token = create_access_token({"sub": user_dict["id"]})
    
    # Prepare response
    del user_dict["password"]
    del user_dict["_id"]
    
    return {
        "user": user_dict,
        "token": token
    }

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    # Find user
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_access_token({"sub": str(user["_id"])})
    
    # Prepare response
    user = serialize_doc(user)
    del user["password"]
    
    return {
        "user": user,
        "token": token
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = serialize_doc(user)
    del user["password"]
    return user

# ============= PROFILE ENDPOINTS =============

@api_router.put("/profile", response_model=UserResponse)
async def update_profile(profile_data: UserUpdate, user_id: str = Depends(get_current_user)):
    update_dict = profile_data.dict(exclude_unset=True)
    
    if update_dict:
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_dict}
        )
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    user = serialize_doc(user)
    del user["password"]
    return user

# ============= PROJECTS ENDPOINTS =============

@api_router.get("/projects", response_model=List[ProjectResponse])
async def get_projects(user_id: str = Depends(get_current_user)):
    projects = await projects_collection.find({"userId": ObjectId(user_id)}).to_list(1000)
    return [serialize_doc(project) for project in projects]

@api_router.post("/projects", response_model=ProjectResponse)
async def create_project(project_data: ProjectCreate, user_id: str = Depends(get_current_user)):
    project_dict = project_data.dict()
    project_dict["userId"] = ObjectId(user_id)
    project_dict["status"] = "active"
    project_dict["createdAt"] = datetime.utcnow()
    project_dict["lastModified"] = datetime.utcnow()
    
    result = await projects_collection.insert_one(project_dict)
    project_dict["id"] = str(result.inserted_id)
    del project_dict["_id"]
    del project_dict["userId"]
    
    return project_dict

@api_router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    user_id: str = Depends(get_current_user)
):
    # Verify project belongs to user
    project = await projects_collection.find_one({
        "_id": ObjectId(project_id),
        "userId": ObjectId(user_id)
    })
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_dict = project_data.dict(exclude_unset=True)
    if update_dict:
        update_dict["lastModified"] = datetime.utcnow()
        await projects_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_dict}
        )
    
    project = await projects_collection.find_one({"_id": ObjectId(project_id)})
    project = serialize_doc(project)
    del project["userId"]
    return project

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, user_id: str = Depends(get_current_user)):
    result = await projects_collection.delete_one({
        "_id": ObjectId(project_id),
        "userId": ObjectId(user_id)
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# ============= CHAT ENDPOINTS =============

@api_router.post("/chat/message")
async def send_message(message_data: MessageCreate, user_id: str = Depends(get_current_user)):
    conversation_id = message_data.conversationId
    
    # Create or get conversation
    if not conversation_id:
        conversation_dict = {
            "userId": ObjectId(user_id),
            "projectId": ObjectId(message_data.projectId) if message_data.projectId else None,
            "title": message_data.message[:50] + "..." if len(message_data.message) > 50 else message_data.message,
            "sessionId": f"session_{datetime.utcnow().timestamp()}",
            "createdAt": datetime.utcnow(),
            "lastModified": datetime.utcnow()
        }
        result = await conversations_collection.insert_one(conversation_dict)
        conversation_id = str(result.inserted_id)
        session_id = conversation_dict["sessionId"]
    else:
        conversation = await conversations_collection.find_one({"_id": ObjectId(conversation_id)})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        session_id = conversation["sessionId"]
    
    # Save user message
    user_message = {
        "conversationId": ObjectId(conversation_id),
        "role": "user",
        "content": message_data.message,
        "timestamp": datetime.utcnow()
    }
    await messages_collection.insert_one(user_message)
    
    # Get AI response
    ai_response = await ai_service.chat(session_id, message_data.message)
    
    # Save AI message
    ai_message = {
        "conversationId": ObjectId(conversation_id),
        "role": "assistant",
        "content": ai_response,
        "timestamp": datetime.utcnow()
    }
    result = await messages_collection.insert_one(ai_message)
    
    # Update conversation lastModified
    await conversations_collection.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"lastModified": datetime.utcnow()}}
    )
    
    return {
        "conversationId": conversation_id,
        "message": {
            "id": str(result.inserted_id),
            "role": "assistant",
            "content": ai_response,
            "timestamp": ai_message["timestamp"]
        }
    }

@api_router.get("/chat/conversations")
async def get_conversations(user_id: str = Depends(get_current_user)):
    conversations = await conversations_collection.find(
        {"userId": ObjectId(user_id)}
    ).sort("lastModified", -1).to_list(100)
    
    result = []
    for conv in conversations:
        messages = await messages_collection.find(
            {"conversationId": conv["_id"]}
        ).sort("timestamp", 1).to_list(1000)
        
        conv = serialize_doc(conv)
        if conv.get("projectId"):
            conv["projectId"] = str(conv["projectId"])
        del conv["userId"]
        del conv["sessionId"]
        
        conv["messages"] = [serialize_doc(msg) for msg in messages]
        for msg in conv["messages"]:
            del msg["conversationId"]
        
        result.append(conv)
    
    return result

@api_router.get("/chat/conversations/{project_id}")
async def get_project_conversations(project_id: str, user_id: str = Depends(get_current_user)):
    conversations = await conversations_collection.find({
        "userId": ObjectId(user_id),
        "projectId": ObjectId(project_id)
    }).sort("lastModified", -1).to_list(100)
    
    result = []
    for conv in conversations:
        messages = await messages_collection.find(
            {"conversationId": conv["_id"]}
        ).sort("timestamp", 1).to_list(1000)
        
        conv = serialize_doc(conv)
        conv["projectId"] = str(conv["projectId"])
        del conv["userId"]
        del conv["sessionId"]
        
        conv["messages"] = [serialize_doc(msg) for msg in messages]
        for msg in conv["messages"]:
            del msg["conversationId"]
        
        result.append(conv)
    
    return result

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    from database import client
    client.close()
