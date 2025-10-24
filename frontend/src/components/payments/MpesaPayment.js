import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { paymentService } from '../../services/paymentService';
import { toast } from 'react-toastify';

const MpesaPayment = ({ order, onPaymentSuccess, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!order) {
      toast.error('No order found');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await paymentService.initiateMpesaPayment(order.id, phoneNumber);
      
      toast.success('Payment initiated! Check your phone for STK Push.');
      
      // Poll for payment status
      checkPaymentStatus(response.data.checkout_request_id);
      
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(`Payment failed: ${error.response?.data?.message || error.message}`);
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (checkoutRequestId) => {
    try {
      const response = await paymentService.checkPaymentStatus(checkoutRequestId);
      
      if (response.data.ResultCode === '0') {
        toast.success('Payment completed successfully!');
        onPaymentSuccess();
      } else {
        // Continue polling or show error
        setTimeout(() => checkPaymentStatus(checkoutRequestId), 3000);
      }
    } catch (error) {
      console.error('Status check failed:', error);
      setTimeout(() => checkPaymentStatus(checkoutRequestId), 3000);
    }
  };

  return (
    <div className="payment-modal">
      <div className="modal-content">
        <h2>Complete Payment with M-Pesa</h2>
        
        <div className="payment-details">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Amount:</strong> KES {order.total_amount}</p>
        </div>

        <div className="form-group">
          <label>M-Pesa Phone Number</label>
          <input
            type="tel"
            placeholder="e.g., 0712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <small>Enter your M-Pesa registered phone number</small>
        </div>

        <div className="payment-instructions">
          <h4>Instructions:</h4>
          <ol>
            <li>Enter your M-Pesa phone number</li>
            <li>Click "Pay with M-Pesa"</li>
            <li>Check your phone for STK Push prompt</li>
            <li>Enter your M-Pesa PIN to complete payment</li>
          </ol>
        </div>

        <div className="payment-actions">
          <button 
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MpesaPayment;