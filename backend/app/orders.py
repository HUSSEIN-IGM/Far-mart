from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import CartItem, Order, OrderItem, OrderStatus, Animal, User, UserType

orders_bp = Blueprint('orders', __name__)

# ADD THIS MISSING ROUTE - Fixed response structure
@orders_bp.route('/user/my-orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    """Get all orders for the current user"""
    current_user_id = get_jwt_identity()
    
    try:
        # Get user's orders with their items and animal details
        orders = Order.query.filter_by(user_id=current_user_id)\
            .order_by(Order.created_at.desc())\
            .all()
        
        orders_data = []
        for order in orders:
            order_data = {
                'id': order.id,
                'total_amount': order.total_amount,
                'status': order.status.value,
                'created_at': order.created_at.isoformat(),
                'order_items': []  # Changed to match frontend expectation
            }
            
            # Add order items with animal details
            for item in order.order_items:
                # Calculate subtotal for frontend
                subtotal = item.quantity * item.price
                
                order_data['order_items'].append({
                    'id': item.id,
                    'animal': {
                        'name': item.animal.name,
                        'breed': item.animal.breed
                    },
                    'quantity': item.quantity,
                    'price': item.price,
                    'subtotal': subtotal
                })
            
            orders_data.append(order_data)
        
        # Return with 'orders' key to match frontend expectation
        return jsonify({'orders': orders_data})
    
    except Exception as e:
        return jsonify({'message': 'Error fetching orders', 'error': str(e)}), 500

# FIX THIS ROUTE - Change endpoint to match frontend
@orders_bp.route('/farmer/my-sales', methods=['GET'])
@jwt_required()
def get_farmer_orders():
    """Get orders for farmer's animals - matches frontend endpoint"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.user_type != UserType.FARMER:
        return jsonify({'message': 'Only farmers can view these orders'}), 403
    
    try:
        # Get orders containing animals from this farmer
        orders = Order.query.join(OrderItem).join(Animal).filter(
            Animal.farmer_id == current_user_id
        ).distinct().all()
        
        orders_data = []
        for order in orders:
            order_data = {
                'id': order.id,
                'total_amount': order.total_amount,
                'status': order.status.value,
                'created_at': order.created_at.isoformat(),
                'user': {
                    'first_name': order.user.first_name,
                    'last_name': order.user.last_name,
                    'email': order.user.email
                },
                'order_items': []  # Changed to match frontend
            }
            
            # Only include items from this farmer
            for item in order.order_items:
                if item.animal.farmer_id == current_user_id:
                    subtotal = item.quantity * item.price
                    order_data['order_items'].append({
                        'animal_name': item.animal.name,
                        'quantity': item.quantity,
                        'price': item.price,
                        'subtotal': subtotal
                    })
            
            orders_data.append(order_data)
        
        return jsonify({'orders': orders_data})
    
    except Exception as e:
        return jsonify({'message': 'Error fetching farmer orders', 'error': str(e)}), 500

@orders_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    current_user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=current_user_id).all()
    
    if not cart_items:
        return jsonify({'message': 'Cart is empty'}), 400
    
    total_amount = sum(item.animal.price * item.quantity for item in cart_items)
    
    order = Order(
        user_id=current_user_id,
        total_amount=total_amount
    )
    db.session.add(order)
    
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            animal_id=cart_item.animal_id,
            quantity=cart_item.quantity,
            price=cart_item.animal.price
        )
        db.session.add(order_item)
        
        # Mark animal as unavailable
        cart_item.animal.is_available = False
    
    # Clear cart
    CartItem.query.filter_by(user_id=current_user_id).delete()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order placed successfully',
        'order_id': order.id,
        'total_amount': total_amount
    })

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    current_user_id = get_jwt_identity()
    order = Order.query.get_or_404(order_id)
    
    # Check if current user is farmer for any animal in this order
    is_farmer = any(
        item.animal.farmer_id == current_user_id 
        for item in order.order_items
    )
    
    if not is_farmer:
        return jsonify({'message': 'Not authorized'}), 403
    
    data = request.get_json()
    order.status = OrderStatus(data['status'])
    db.session.commit()
    
    return jsonify({'message': 'Order status updated'})