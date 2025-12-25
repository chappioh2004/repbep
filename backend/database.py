from motor.motor_asyncio import AsyncIOMotorClient
import os

mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'repbep')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Collections
users_collection = db.users
projects_collection = db.projects
conversations_collection = db.conversations
messages_collection = db.messages
