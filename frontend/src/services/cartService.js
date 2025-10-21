import api from './api';

export const cartService = {
  getCart: () => {
    return api.get('/cart');
  },

  addToCart: (animalId, quantity = 1) => {
    return api.post('/cart', { animal_id: animalId, quantity });
  },

  updateCartItem: (itemId, data) => {
    return api.put(`/cart/${itemId}`, data);
  },

  removeFromCart: (itemId) => {
    return api.delete(`/cart/${itemId}`);
  },

  clearCart: () => {
    return api.delete('/cart/clear');
  },

  checkout: (checkoutData) => {
    return api.post('/orders', checkoutData);
  }
};