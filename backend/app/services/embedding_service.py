from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.core.config import settings

def get_embedding_model():
    return GoogleGenerativeAIEmbeddings(
        model='gemini-embedding-001',
        google_api_key=settings.GOOGLE_API_KEY
    )

def test_generate_embeddings(text:str):
    embedding_model=get_embedding_model()
    vector=embedding_model.embed_query(text)
    return vector