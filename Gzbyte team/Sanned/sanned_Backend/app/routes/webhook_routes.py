# app/routes/webhook_routes.py
import os, hmac, hashlib, logging
from flask import Blueprint, request, jsonify
from app import db
from app.models.sponsorship import Sponsorship

logger = logging.getLogger(__name__)
WEBHOOK_SECRET = os.getenv("CHECKOUT_WEBHOOK_SECRET")  # from Dashboard

webhook_bp = Blueprint("webhook_bp", __name__)

@webhook_bp.route("/webhook/checkout", methods=["POST"])
def checkout_webhook():
    raw = request.get_data() 
   
    received_sig = request.headers.get("Checkout-Signature") or request.headers.get("X-Checkout-Signature") or request.headers.get("cko-signature")

    if not received_sig or not WEBHOOK_SECRET:
        logger.warning("Missing signature or webhook secret")
        return jsonify({"error": "missing signature"}), 400

   
    computed = hmac.new(WEBHOOK_SECRET.encode(), raw, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(computed, received_sig):
        logger.warning("Invalid webhook signature")
        return jsonify({"error": "invalid signature"}), 403

    payload = request.get_json()
 
    event_type = payload.get("type") or payload.get("event")
    data = payload.get("data") or payload


    if event_type in ("payment.captured", "payment_approved", "payment.succeeded", "payment_captured"):
        metadata = data.get("metadata") or {}
        sponsorship_id = metadata.get("sponsorship_id")
        if sponsorship_id:
            s = Sponsorship.query.get(int(sponsorship_id))
            if s and s.status != "paid":
                s.status = "paid"
                s.checkout_id = data.get("id") or s.checkout_id
                db.session.commit()
                logger.info("Sponsorship %s marked as paid", s.id)
                # TODO: release escrow / notify doer / match request
    return jsonify({"ok": True}), 200
