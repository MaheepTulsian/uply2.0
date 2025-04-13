from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.db_connection import connect_db
from routes.index import router as api_router

# Initialize MongoDB
connect_db()

# Initialize FastAPI App
app = FastAPI()

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, modify for production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register all routes from index.py
app.include_router(api_router)

# Root Route
@app.get("/")
def home():
    return {"message": "Welcome to the FastAPI MongoDB Server 🚀"}
