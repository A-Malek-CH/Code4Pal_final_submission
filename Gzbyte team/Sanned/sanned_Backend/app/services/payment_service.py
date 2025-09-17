# app/services/payment_service.py
import os, requests, logging
from urllib.parse import urljoin

logger = logging.getLogger(__name__)
CHECKOUT_SECRET = os.getenv("CHECKOUT_SECRET_KEY")
CHECKOUT_ENV = os.getenv("CHECKOUT_ENVIRONMENT", "sandbox")  # sandbox or production


BASE = "https://api.sandbox.checkout.com/" if CHECKOUT_ENV == "sandbox" else "https://api.checkout.com/"

class PaymentService:
    @staticmethod
    def create_payment_link(sponsorship_id: int, amount: float, currency: str, return_url: str, cancel_url: str, metadata: dict = None):
       
        if not CHECKOUT_SECRET:
            raise RuntimeError("CHECKOUT_SECRET_KEY not configured")

        url = urljoin(BASE, "payment-links")
        payload = {
            "amount": int(round(amount * 100)),  # amount in minor units (cents)
            "currency": currency,
            "reference": f"sponsorship_{sponsorship_id}",
            "description": f"Sponsorship for request {metadata.get('request_id') if metadata else ''}",
            "return_url": return_url,
            "cancel_url": cancel_url,
            "metadata": metadata or {}
        }
        headers = {
            "Authorization": f"Bearer {CHECKOUT_SECRET}",
            "Content-Type": "application/json"
        }
        resp = requests.post(url, json=payload, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        # data keys vary — typically includes id and url fields; adapt if your account returns different shape
        checkout_id = data.get("id") or data.get("payment_link", {}).get("id")
        checkout_url = data.get("url") or data.get("payment_link", {}).get("url")
        logger.info("Created payment link %s", checkout_id)
        return {"checkout_id": checkout_id, "checkout_url": checkout_url, "raw": data}
