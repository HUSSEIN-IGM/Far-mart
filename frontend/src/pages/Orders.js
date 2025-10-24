import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import MpesaPayment from '../components/payments/MpesaPayment';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      console.log('📦 Loading orders for user type:', user.user_type);
      
      let response;
      if (user.user_type === 'farmer') {
        response = await orderService.getFarmerOrders();
      } else {
        response = await orderService.getUserOrders();
      }
      
      console.log('✅ Orders response:', response.data);
      setOrders(response.data.orders || []);
      
    } catch (error) {
      console.error('❌ Failed to load orders:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load orders';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);
      
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order ${newStatus} successfully!`);
      
      // Reload orders to get updated data
      loadOrders();
      
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  const handlePayWithMpesa = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
    toast.success('Payment completed successfully!');
    loadOrders(); // Reload orders to show updated payment status
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  if (!isAuthenticated || !user) {
    return <div className="container">Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>{user.user_type === 'farmer' ? 'My Sales' : 'My Orders'}</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <h3>No orders found</h3>
            <p>
              {user.user_type === 'farmer' 
                ? 'You haven\'t received any orders yet.' 
                : 'You haven\'t placed any orders yet.'
              }
            </p>
            {user.user_type === 'user' && (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/animals')}
              >
                Browse Animals
              </button>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="order-total">
                      Total: ${order.total_amount}
                    </p>
                    {order.payment_status && (
                      <p className="order-payment">
                        Payment: <span className={`payment-${order.payment_status}`}>
                          {order.payment_status}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="order-status">
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                    
                    {/* Payment button for users with pending orders */}
                    {user.user_type === 'user' && order.status === 'pending' && (
                      <div className="payment-actions">
                        <button 
                          className="btn btn-primary btn-small"
                          onClick={() => handlePayWithMpesa(order)}
                        >
                          Pay with M-Pesa
                        </button>
                      </div>
                    )}
                    
                    {/* Farmer actions for pending orders */}
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
                  <h4>Items:</h4>
                  {order.order_items && order.order_items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <h5>{item.animal?.name || `Animal ${item.animal_id}`}</h5>
                        <p>
                          Breed: {item.animal?.breed || 'Unknown'} • 
                          Quantity: {item.quantity} • 
                          Price: ${item.price} each
                        </p>
                      </div>
                      <div className="item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {order.shipping_address && (
                  <div className="order-shipping">
                    <strong>Shipping Address:</strong> {order.shipping_address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* M-Pesa Payment Modal */}
        {showPaymentModal && selectedOrder && (
          <MpesaPayment 
            order={selectedOrder}
            onPaymentSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;