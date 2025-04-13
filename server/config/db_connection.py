import os
from pymongo import MongoClient
from dotenv import load_dotenv
import mongoengine

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

def connect_db():
    try:
        if not MONGO_URI:
            raise ValueError("MONGODB_URI is not set in the environment variables.")
        
        # Connect using pymongo
        client = MongoClient(MONGO_URI)
        
        # Extract database name from the URI
        db_name = MONGO_URI.split("/")[-1].split("?")[0]
        
        # Connect `mongoengine`
        mongoengine.connect(db=db_name, host=MONGO_URI, alias="default")
        
        print("✅ Database is connected! 🚀")
        return client
    except Exception as error:
        print("❌ Error connecting to the database:", str(error))
        return None