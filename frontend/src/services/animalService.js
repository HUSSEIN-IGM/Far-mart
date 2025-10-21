import api from './api';

export const animalService = {
  getAnimals: (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });

    return api.get(`/animals?${params.toString()}`);
  },

  getAnimal: (id) => {
    return api.get(`/animals/${id}`);
  },

  createAnimal: (animalData) => {
    return api.post('/animals', animalData);
  },

  updateAnimal: (id, animalData) => {
    return api.put(`/animals/${id}`, animalData);
  },

  deleteAnimal: (id) => {
    return api.delete(`/animals/${id}`);
  },

  getMyAnimals: (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });

    return api.get(`/animals/farmer/my-animals?${params.toString()}`);
  }
};