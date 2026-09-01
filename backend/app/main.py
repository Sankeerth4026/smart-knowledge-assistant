from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.models.user import User
from app.models.source import Source
from app.models.chat import ChatMessage
from app.routes.auth_routes import router as auth_router
from app.routes.source_routes import router as source_router
from app.routes.chat_routes import router as chat_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Knowledge Assistant API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(source_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "Smart Knowledge Assistant API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}