from google.cloud import firestore
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class FirestoreService:
    def __init__(self):
        try:
            # Assumes GOOGLE_APPLICATION_CREDENTIALS is set or service-account.json is valid
            # In local dev with firebase-admin SDK initialized, we might use that client, 
            # but google.cloud.firestore usually needs its own creds or explicit client pass.
            # For simplicity in this starter, we try default client which picks up the env var.
            self.db = firestore.Client.from_service_account_json(settings.FIREBASE_CREDENTIALS_PATH)
            logger.info("Firestore Client initialized")
        except Exception as e:
            logger.warning(f"Firestore init failed: {e}")
            self.db = None

    async def save_conversation(self, uid: str, data: dict):
        if not self.db:
            return
        
        # Firestore async calls are blocking in standard library unless using AsyncClient
        # For Hackathon, standard client in threadpool or just standard client is okay for low load
        # Ideally: use firestore.AsyncClient()
        
        doc_ref = self.db.collection('users').document(uid).collection('conversations').document()
        doc_ref.set(data)
        return doc_ref.id

    async def get_user_profile(self, uid: str):
        if not self.db:
            return {}
        
        doc = self.db.collection('users').document(uid).get()
        if doc.exists:
            return doc.to_dict()
        return {}

    async def save_user_profile(self, uid: str, data: dict):
        if not self.db:
            return
        self.db.collection('users').document(uid).set(data, merge=True)

firestore_service = FirestoreService()
