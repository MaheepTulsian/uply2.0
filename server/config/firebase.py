import firebase_admin
from firebase_admin import credentials, auth
import os

# Path to service account file
service_account_path = os.environ.get('FIREBASE_SERVICE_ACCOUNT', 'config/firebase-service-account.json')

def initialize_firebase():
    try:
        # Check if app already initialized
        if firebase_admin._apps:
            return firebase_admin.get_app()
        
        # Initialize with service account
        cred = credentials.Certificate(service_account_path)
        return firebase_admin.initialize_app(cred, {
            'projectId': 'uply-48594'  # Add your project ID here
        })
    except Exception as e:
        print(f"Error initializing Firebase: {str(e)}")
        raise e

# Initialize when module is imported
firebase_app = initialize_firebase()