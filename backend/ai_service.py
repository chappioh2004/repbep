from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv
import os

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY")
        self.system_message = """You are an AI development assistant for Repbep, a platform that helps developers build applications using AI agents. You provide guidance on:
- Frontend development (React, Tailwind, JavaScript)
- Backend development (FastAPI, Python, MongoDB)
- Code generation and debugging
- Architecture and best practices
- Integration with third-party APIs

Be concise, practical, and provide code examples when helpful. Use markdown formatting for code blocks."""
        
        self.chat_instances = {}
    
    async def chat(self, session_id: str, message: str) -> str:
        """Send a message to Claude and get a response"""
        try:
            # Create new chat instance if doesn't exist
            if session_id not in self.chat_instances:
                chat = LlmChat(
                    api_key=self.api_key,
                    session_id=session_id,
                    system_message=self.system_message
                )
                # Configure to use Claude Sonnet 4.5
                chat.with_model("anthropic", "claude-sonnet-4-5-20250929")
                self.chat_instances[session_id] = chat
            
            chat = self.chat_instances[session_id]
            
            # Create user message
            user_message = UserMessage(text=message)
            
            # Get response
            response = await chat.send_message(user_message)
            
            return response
            
        except Exception as e:
            print(f"Error in AI service: {str(e)}")
            return f"I apologize, but I encountered an error processing your request. Please try again. Error: {str(e)}"
    
    def clear_session(self, session_id: str):
        \"\"\"Clear a chat session from memory\"\"\"
        if session_id in self.chat_instances:
            del self.chat_instances[session_id]
