import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Only load cart if authenticated
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated, navigate]);

  const loadCart = async () => {
    try {
      const response = await cartService.getCart();
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartService.updateCartItem(itemId, { quantity: newQuantity });
      await loadCart();
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await cartService.checkout({
        shipping_address: user?.address || 'Default address'
      });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error('Checkout failed: ' + (error.response?.data?.message || error.message));
    }
  };

  // Add this check at the beginning of the component return
  if (!isAuthenticated || !user) {
    return <div className="container">Loading...</div>;
  }

  const total = cartItems.reduce((sum, item) => sum + (item.animal.price * item.quantity), 0);

  if (isLoading) {
    return <div className="container">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Browse animals and add some to your cart!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/animals')}
          >
            Browse Animals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} item(s) in cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.animal.image_url || 'https://via.placeholder.com/100x100?text=Animal'} 
                    alt={item.animal.name}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.animal.name}</h3>
                  <p className="item-breed">{item.animal.breed} • {item.animal.animal_type}</p>
                  <p className="item-age">Age: {item.animal.age} months</p>
                  <p className="item-price">${item.animal.price} each</p>
                </div>

                <div className="item-quantity">
                  <label>Qty:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <p>${(item.animal.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="item-actions">
                  <button 
                    className="btn-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button 
                className="btn btn-primary btn-checkout"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              <p className="security-note">
                🔒 Secure checkout · Your information is safe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;