import boto3
from app.core.config import settings
import os

s3_client =boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

def generate_s3_key(
        user_id:str,
        source_id:str,
        filename:str
):
    extension=os.path.splitext(filename)[1]
    return(
        f"users/"
        f"{user_id}/"
        f"sources/"
        f"{source_id}/"
        f"original{extension}"
    )
def upload_pdf_to_s3(
        file_bytes:bytes,
        s3_key:str
):
     s3_client.put_object(
          Bucket=settings.AWS_S3_BUCKET,
          Key=s3_key,
          Body=file_bytes,
          ContentType="application/pdf"
     )
     return s3_key

