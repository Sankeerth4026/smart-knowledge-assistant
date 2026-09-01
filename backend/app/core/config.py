from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY:str
    JWT_ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int
    GOOGLE_API_KEY:str
    GEMINI_CHAT_MODEL:str="gemini-3.1-flash-lite"
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    AWS_S3_BUCKET: str
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str
    
    class Config:
        env_file = ".env"


settings = Settings()