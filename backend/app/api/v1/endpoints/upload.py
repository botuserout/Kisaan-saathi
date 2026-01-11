from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from firebase_admin import storage, firestore
from app.core.security import get_current_user
import uuid
import time
import os

router = APIRouter()

@router.post("/upload-image")
async def upload_image(
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Uploads an image to Firebase Storage and returns the public URL.
    Optionally stores metadata in Firestore.
    """
    try:
        # 1. Validation
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
        
        # 2. Generate Unique Filename
        file_extension = image.filename.split(".")[-1] if "." in image.filename else "jpg"
        image_id = str(uuid.uuid4())
        filename = f"disease-detection/{current_user['uid']}/{image_id}.{file_extension}"
        
        print(f"Starting upload for user {current_user['uid']}, file: {filename}")

        # 3. Upload to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(filename)
        
        # Read file content safely
        content = await image.read()
        if len(content) == 0:
             raise HTTPException(status_code=400, detail="Empty file provided.")

        blob.upload_from_string(content, content_type=image.content_type)
        
        # Make public
        blob.make_public()
        image_url = blob.public_url
        print(f"Upload successful. URL: {image_url}")
        
        # 4. Optional: Store Metadata in Firestore
        try:
            db = firestore.client()
            db.collection("scans").document(image_id).set({
                "userId": current_user['uid'],
                "imageUrl": image_url,
                "timestamp": firestore.SERVER_TIMESTAMP,
                "filename": filename,
                "status": "uploaded"
            })
        except Exception as fs_error:
            print(f"Firestore write failed (non-blocking): {fs_error}")
        
        return {
            "imageUrl": image_url,
            "imageId": image_id
        }

    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        print(f"Critical Upload Failure: {str(e)}")
        # Don't expose internal errors details to client unless safe
        raise HTTPException(status_code=500, detail="Image upload failed. Please try again.")
