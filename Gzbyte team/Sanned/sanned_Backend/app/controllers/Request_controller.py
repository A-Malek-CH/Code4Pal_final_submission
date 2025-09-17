from ipaddress import ip_address
from flask import request ,jsonify,g
from app.services.RequestService import RequestService
import logging 

class Request_controller:
    @staticmethod
    def create_request():
        data=request.json
        ip_address=request.remote_addr
        manual_city=data.get("city")

        logging.info(f"creat request attemp from IP={ip_address},city={manual_city}")

        req = RequestService.create_request(
            user=g.current_user,
            type=data.get("type"),
            description=data.get("description"),
            ip_address=ip_address,
            manual_city=manual_city
        )

        response = {
            "id": req.id,
            "type": req.type,
            "description": req.description,
            "status": req.status,
            "created_at": req.created_at.isoformat(),
            "user_id": req.user_id
        }
        return jsonify(response), 201