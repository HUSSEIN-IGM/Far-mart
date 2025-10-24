from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
bcrypt = Bcrypt()

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Import config
    from config import config
    app.config.from_object(config[config_name])
    
    # SIMPLE CORS FIX - Allow all for development
    CORS(app)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Import models here to avoid circular imports
    from app import models
    
    # Register blueprints - MAKE SURE PAYMENTS IS INCLUDED
    from app.auth import auth_bp
    from app.animals import animals_bp
    from app.orders import orders_bp
    from app.cart import cart_bp
    from app.payments import payments_bp  # <-- THIS LINE IS CRITICAL
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(animals_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(cart_bp, url_prefix='/api')
    app.register_blueprint(payments_bp, url_prefix='/api')  # <-- AND THIS ONE
    
    return app