from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.db import connect_db
from config.firebase import firebase_app
from routes.index import router as api_router

# Initialize MongoDB
connect_db()

# Initialize FastAPI App
app = FastAPI(
    title="Uply API",
    description="API for Uply - AI-powered career assistant platform",
    version="1.0.0"
)

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, modify for production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register all routes from index.py
app.include_router(api_router, prefix="/api")

# Root Route
@app.get("/")
def home():
    return {"message": "Welcome to the FastAPI MongoDB Server 🚀"}