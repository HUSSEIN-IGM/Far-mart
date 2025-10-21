import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Only load orders if user is authenticated
    if (isAuthenticated && user) {
      loadOrders();
    }
  }, [isAuthenticated, user, navigate]);

  const loadOrders = async () => {
    try {
      let response;
      if (user.user_type === 'farmer') {
        response = await orderService.getFarmerOrders();
      } else {
        response = await orderService.getUserOrders();
      }
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Show loading while checking authentication
  if (!isAuthenticated || !user) {
    return <div className="container">Loading...</div>;
  }

  if (isLoading) {
    return <div className="container">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>{user.user_type === 'farmer' ? 'My Sales' : 'My Orders'}</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                    {user.user_type === 'farmer' && order.status === 'pending' && (
                      <div className="status-actions">
                        <button 
                          className="btn btn-success btn-small"
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        >
                          Confirm
                        </button>
                        <button 
                          className="btn btn-danger btn-small"
                          onClick={() => updateOrderStatus(order.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-items">
                  {order.order_items && order.order_items.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <h4>{item.animal?.name || item.animal_name || 'Animal'}</h4>
                        <p>{item.animal?.breed || 'Unknown breed'} • Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${item.price} × {item.quantity} = ${item.subtotal || (item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.total_amount}</strong>
                  </div>
                  {order.shipping_address && (
                    <div className="shipping-address">
                      <strong>Shipping to:</strong> {order.shipping_address}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;