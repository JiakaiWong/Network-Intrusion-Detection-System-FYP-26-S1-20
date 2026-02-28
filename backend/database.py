import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()  # loads variables from .env

MONGODB_URL = os.getenv("MONGODB_URL")
print(f"Raw MONGODB_URL from env: {MONGODB_URL}")   # Check if the variable is loaded correctly
if not MONGODB_URL:
    print("WARNING: MONGODB_URL is not set!")
    # Optionally fallback to localhost for debugging?
else:
    # Redact password for safe printing
    import re
    redacted = re.sub(r'://[^:]+:[^@]+@', '://<credentials>@', MONGODB_URL)
    print(f"Connecting to: {redacted}")



client = AsyncIOMotorClient(MONGODB_URL)
db = client["siemless_db"] # db name
print(f"Database name: {db.name}")