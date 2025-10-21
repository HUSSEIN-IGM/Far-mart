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
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # CORS configuration - allow all methods and headers
    cors.init_app(app, 
                 origins=["http://localhost:3000"],
                 methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 allow_headers=["Content-Type", "Authorization"])
    
    bcrypt.init_app(app)
    
    # Import models here to avoid circular imports
    from app import models
    
    # Register blueprints
    from app.auth import auth_bp
    from app.animals import animals_bp
    from app.orders import orders_bp
    from app.cart import cart_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(animals_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(cart_bp, url_prefix='/api')
    
    return app