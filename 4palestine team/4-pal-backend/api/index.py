from flask import Flask
from flask_cors import CORS

from api.routes.users import users_bp
from api.routes.contributors import contributors_bp
from api.routes.locations import locations_bp
from api.routes.emergencies import emergencies_bp
from api.routes.auth import auth_bp
from api.routes.admin_auth import admin_auth_bp

from flask_mail import Mail
from api.extensions import mail

app = Flask(__name__)
CORS(app)

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'students4pal@gmail.com'
app.config['MAIL_PASSWORD'] = 'sjhpshhrjwzkcacs'  
app.config['MAIL_DEFAULT_SENDER'] = 'students4pal@gmail.com'

mail.init_app(app)


# Register blueprints with clean route prefixes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(admin_auth_bp, url_prefix="/api/admin/auth")
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(contributors_bp, url_prefix="/api/contributors")
app.register_blueprint(locations_bp, url_prefix="/api/locations")
app.register_blueprint(emergencies_bp, url_prefix="/api/emergencies")


@app.route("/")
def root():
    return {"message": "API is running"}

