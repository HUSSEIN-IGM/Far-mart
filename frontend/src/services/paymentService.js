import api from './api';

export const paymentService = {
  initiateMpesaPayment: (orderId, phoneNumber) => {
    return api.post('/payments/mpesa/stk-push', {
      order_id: orderId,
      phone_number: phoneNumber
    });
  },

  checkPaymentStatus: (checkoutRequestId) => {
    return api.get(`/payments/check-payment/${checkoutRequestId}`);
  }
};