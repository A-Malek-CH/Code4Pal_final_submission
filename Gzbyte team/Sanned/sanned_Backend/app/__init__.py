from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    # config
    from app.config import Config
    app.config.from_object(Config)

    # init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = None

    @login_manager.user_loader
    def load_user(user_id):
        from app.models.Users import User
        return User.query.get(int(user_id))

    # register blueprints (safe imports inside create_app)
    try:
        from app.routes.auth_routes import auth_bp
        app.register_blueprint(auth_bp)
    except Exception:
        app.logger.debug("Auth routes not available")

    try:
        from app.routes.RequestRouter import reques_bp
        app.register_blueprint(reques_bp)
    except Exception:
        app.logger.debug("Request routes not available")

    try:
        from app.ai_matching.matcher_routes import matcher_bp       
        app.register_blueprint(matcher_bp)
        app.logger.info("AI matching routes registered")
    except Exception as e:
        app.logger.warning(f"AI matching routes not registered: {e}")

    # dev CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    return app
