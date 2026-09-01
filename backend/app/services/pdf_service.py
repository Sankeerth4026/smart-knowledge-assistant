from langchain_community.document_loaders import PyMuPDFLoader

def load_pdf_documunets(filepath:str):

    loader=PyMuPDFLoader(filepath)
    documents=loader.load()
    return documents

def get_pdf_stats(documents):
    total_pages=len(documents)
    total_characters=sum(len(doc.page_content or "") for doc in documents)
    
    return {
       "total_pages":total_pages,
        "total_characters":total_characters
    }