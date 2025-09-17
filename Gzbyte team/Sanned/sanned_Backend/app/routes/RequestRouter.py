from flask import Blueprint 
from app.controllers.Request_controller import Request_controller

reques_bp=Blueprint("reques_bp",__name__)

class RequestRouter :
    @reques_bp.route("/requests", 
    methods=["POST"])
    def create_request():
        return 
    Request_controller.create_request()