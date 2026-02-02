from twilio.rest import Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def send_whatsapp_message(to_number: str, body: str):
    """
    Sends a WhatsApp message using Twilio.
    
    Args:
        to_number (str): The recipient's phone number (e.g., "+1234567890").
        body (str): The message content.
    """
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        logger.warning("Twilio credentials not configured. Skipping WhatsApp message.")
        return

    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # Ensure numbers have 'whatsapp:' prefix
        from_number = settings.TWILIO_WHATSAPP_NUMBER
        if not from_number.startswith("whatsapp:"):
            from_number = f"whatsapp:{from_number}"
            
        dest_number = to_number
        if not dest_number.startswith("whatsapp:"):
            dest_number = f"whatsapp:{dest_number}"

        logger.info(f"Attempting to send WhatsApp message from {from_number} to {dest_number}")

        message = client.messages.create(
            from_=from_number,
            body=body,
            to=dest_number
        )
        logger.info(f"WhatsApp message sent to {to_number}: {message.sid}")
        return message.sid
    except Exception as e:
        logger.error(f"Failed to send WhatsApp message: {str(e)}")
        # Don't raise exception to avoid blocking the main application flow
        return None
