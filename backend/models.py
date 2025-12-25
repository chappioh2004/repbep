from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
from datetime import datetime
import uuid

# User Models
class SocialLinks(BaseModel):
    github: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None

class WorkspaceSettings(BaseModel):
    autoSave: bool = True
    codeCompletion: bool = True
    notifications: bool = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    displayName: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    displayName: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    theme: str = "dark"
    colorScheme: str = "emerald"
    socialLinks: Optional[SocialLinks] = None
    workspaceSettings: Optional[WorkspaceSettings] = None
    createdAt: datetime

class UserUpdate(BaseModel):
    displayName: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    theme: Optional[str] = None
    colorScheme: Optional[str] = None
    socialLinks: Optional[SocialLinks] = None
    workspaceSettings: Optional[WorkspaceSettings] = None

# Project Models
class ProjectCreate(BaseModel):
    name: str
    description: str
    tech: List[str] = []
    color: str = "emerald"

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    tech: Optional[List[str]] = None
    color: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: str
    status: str
    tech: List[str]
    color: str
    createdAt: datetime
    lastModified: datetime

# Chat Models
class MessageCreate(BaseModel):
    projectId: Optional[str] = None
    message: str
    conversationId: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    timestamp: datetime

class ConversationResponse(BaseModel):
    id: str
    projectId: Optional[str] = None
    title: str
    messages: List[MessageResponse]
    createdAt: datetime

# Auth Models
class TokenResponse(BaseModel):
    user: UserResponse
    token: str
