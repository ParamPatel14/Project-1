import os
from dotenv import load_dotenv
from twilio.rest import Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load env vars
load_dotenv(dotenv_path="c:\\Projects\\Project 1\\backend\\.env")

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
# Try the standard Sandbox number
from_number = "whatsapp:+14155238886"
to_number = os.getenv("TWILIO_CONTACT_NUMBER")

print(f"SID: {account_sid}")
print(f"From (Sandbox): {from_number}")
print(f"To: {to_number}")

if not account_sid or not auth_token:
    print("Error: Missing credentials")
    exit(1)

try:
    client = Client(account_sid, auth_token)
    
    if not to_number.startswith("whatsapp:"):
        to_number = f"whatsapp:{to_number}"
        
    print(f"Sending from {from_number} to {to_number}...")
    
    message = client.messages.create(
        from_=from_number,
        body="Hello! This is a test message from Trae AI (Sandbox) to verify Twilio integration.",
        to=to_number
    )
    
    print(f"Message sent! SID: {message.sid}")
    print(f"Status: {message.status}")
    
except Exception as e:
    print(f"Error sending message: {e}")
