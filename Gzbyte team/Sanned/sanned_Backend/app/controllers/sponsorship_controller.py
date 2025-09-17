
from flask import request, jsonify, url_for, current_app
from app import db
from app.models.sponsorship import Sponsorship
from app.services.payment_service import PaymentService
import logging

logger = logging.getLogger(__name__)

class SponsorshipController:
    @staticmethod
    def init_sponsorship(user_id, request_id, data):
        amount = data.get("amount")
        currency = data.get("currency", "USD")
        pay_doer = data.get("pay_doer", False)

        if not amount:
            return {"error": "amount is required"}, 400

        # create sponsorship row
        sponsorship = Sponsorship(
            sponsor_id=user_id,
            request_id=request_id,
            amount=amount,
            currency=currency,
            pay_doer=pay_doer,
            status="pending"
        )
        db.session.add(sponsorship)
        db.session.commit()

        # prepare return/cancel URLs (frontend will handle final redirect)
        # use absolute URLs (example uses Flask url_for)
        return_url = data.get("return_url") or url_for("frontend.payment_success", _external=True)
        cancel_url = data.get("cancel_url") or url_for("frontend.payment_cancel", _external=True)

        # call Checkout
        try:
            res = PaymentService.create_payment_link(
                sponsorship_id=sponsorship.id,
                amount=float(amount),
                currency=currency,
                return_url=return_url,
                cancel_url=cancel_url,
                metadata={"sponsorship_id": str(sponsorship.id), "request_id": str(request_id)}
            )
            sponsorship.checkout_id = res["checkout_id"]
            sponsorship.checkout_url = res["checkout_url"]
            sponsorship.status = "reserved"  # reserved until webhook confirms
            db.session.commit()
        except Exception as e:
            logger.exception("Payment link creation failed")
            sponsorship.status = "failed"
            db.session.commit()
            return {"error": "failed to init payment"}, 500

        return {"sponsorship_id": sponsorship.id, "checkout_url": sponsorship.checkout_url}, 201
