1|from anthropic import AsyncAnthropic
2|from dotenv import load_dotenv
3|import os
4|
5|load_dotenv()
6|
7|class AIService:
8|    def __init__(self):
9|        self.api_key = os.environ.get("ANTHROPIC_API_KEY")
10|        self.client = AsyncAnthropic(api_key=self.api_key)
11|        self.system_message = """You are an AI development assistant for Repbep, a platform that helps developers build applications using AI agents. You provide guidance on:
12|- Frontend development (React, Tailwind, JavaScript)
13|- Backend development (FastAPI, Python, MongoDB)
14|- Code generation and debugging
15|- Architecture and best practices
16|- Integration with third-party APIs
17|
18|Be concise, practical, and provide code examples when helpful. Use markdown formatting for code blocks."""
19|        
20|        # Store conversation history per session
21|        self.conversations = {}
22|    
23|    async def chat(self, session_id: str, message: str) -> str:
24|        """Send a message to Claude and get a response"""
25|        try:
26|            # Initialize conversation history if doesn't exist
27|            if session_id not in self.conversations:
28|                self.conversations[session_id] = []
29|            
30|            # Add user message to history
31|            self.conversations[session_id].append({
32|                "role": "user",
33|                "content": message
34|            })
35|            
36|            # Call Claude API
37|            response = await self.client.messages.create(
38|                model="claude-sonnet-4-20250514",
39|                max_tokens=4096,
40|                system=self.system_message,
41|                messages=self.conversations[session_id]
42|            )
43|            
44|            # Extract response text
45|            assistant_message = response.content[0].text
46|            
47|            # Add assistant response to history
48|            self.conversations[session_id].append({
49|                "role": "assistant",
50|                "content": assistant_message
51|            })
52|            
53|            return assistant_message
54|            
55|        except Exception as e:
56|            print(f"Error in AI service: {str(e)}")
57|            return f"I apologize, but I encountered an error processing your request. Please try again. Error: {str(e)}"
58|    
59|    def clear_session(self, session_id: str):
60|        """Clear a chat session from memory"""
61|        if session_id in self.conversations:
62|            del self.conversations[session_id]
63|