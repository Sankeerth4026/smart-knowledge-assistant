from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_documents_into_chunks(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
    )

    chunks = text_splitter.split_documents(documents)

    return chunks