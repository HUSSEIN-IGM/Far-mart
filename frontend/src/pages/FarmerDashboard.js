import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAnimals } from '../store/slices/animalsSlice';
import { animalService } from '../services/animalService';
import { toast } from 'react-toastify';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { animals, isLoading: animalsLoading } = useSelector((state) => state.animals);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [animalForm, setAnimalForm] = useState({
    name: '',
    animal_type: 'cattle',
    breed: '',
    age: '',
    price: '',
    weight: '',
    description: '',
    image_url: '',
    is_available: true
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated && user && user.user_type === 'farmer') {
      dispatch(fetchAnimals());
    }
  }, [dispatch, user, isAuthenticated, navigate]);

  // Reset form when opening/closing modal
  useEffect(() => {
    if (!showAnimalForm) {
      setEditingAnimal(null);
      setAnimalForm({
        name: '',
        animal_type: 'cattle',
        breed: '',
        age: '',
        price: '',
        weight: '',
        description: '',
        image_url: '',
        is_available: true
      });
    }
  }, [showAnimalForm]);

  const handleAnimalSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAnimal) {
        // Update existing animal
        await animalService.updateAnimal(editingAnimal.id, animalForm);
        toast.success('Animal updated successfully!');
      } else {
        // Create new animal
        await animalService.createAnimal(animalForm);
        toast.success('Animal added successfully!');
      }
      
      setShowAnimalForm(false);
      setEditingAnimal(null);
      dispatch(fetchAnimals());
    } catch (error) {
      toast.error(`Failed to ${editingAnimal ? 'update' : 'add'} animal: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditAnimal = (animal) => {
    setEditingAnimal(animal);
    setAnimalForm({
      name: animal.name,
      animal_type: animal.animal_type,
      breed: animal.breed,
      age: animal.age,
      price: animal.price,
      weight: animal.weight || '',
      description: animal.description || '',
      image_url: animal.image_url || '',
      is_available: animal.is_available
    });
    setShowAnimalForm(true);
  };

  const handleDeleteAnimal = async (animalId) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await animalService.deleteAnimal(animalId);
        toast.success('Animal deleted successfully!');
        dispatch(fetchAnimals());
      } catch (error) {
        toast.error('Failed to delete animal');
      }
    }
  };

  const toggleAvailability = async (animal) => {
    try {
      await animalService.updateAnimal(animal.id, {
        is_available: !animal.is_available
      });
      toast.success(`Animal marked as ${!animal.is_available ? 'available' : 'sold'}!`);
      dispatch(fetchAnimals());
    } catch (error) {
      toast.error('Failed to update animal availability');
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="container">Loading...</div>;
  }

  if (user.user_type !== 'farmer') {
    return (
      <div className="container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>This page is only available for farmers.</p>
        </div>
      </div>
    );
  }

  const myAnimals = animals.filter(animal => animal.farmer?.id === user.id);

  return (
    <div className="farmer-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Farmer Dashboard</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAnimalForm(true)}
          >
            Add New Animal
          </button>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Animals</h3>
            <p>{myAnimals.length}</p>
          </div>
          <div className="stat-card">
            <h3>Available Animals</h3>
            <p>{myAnimals.filter(a => a.is_available).length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Value</h3>
            <p>${myAnimals.reduce((total, animal) => total + animal.price, 0)}</p>
          </div>
        </div>

        {showAnimalForm && (
          <div className="animal-form-modal">
            <div className="modal-content">
              <h2>{editingAnimal ? 'Edit Animal' : 'Add New Animal'}</h2>
              <form onSubmit={handleAnimalSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Animal Name *</label>
                    <input
                      type="text"
                      value={animalForm.name}
                      onChange={(e) => setAnimalForm({...animalForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Animal Type *</label>
                    <select
                      value={animalForm.animal_type}
                      onChange={(e) => setAnimalForm({...animalForm, animal_type: e.target.value})}
                      required
                    >
                      <option value="cattle">Cattle</option>
                      <option value="poultry">Poultry</option>
                      <option value="swine">Swine</option>
                      <option value="sheep">Sheep</option>
                      <option value="goat">Goat</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Breed *</label>
                    <input
                      type="text"
                      value={animalForm.breed}
                      onChange={(e) => setAnimalForm({...animalForm, breed: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age (months) *</label>
                    <input
                      type="number"
                      value={animalForm.age}
                      onChange={(e) => setAnimalForm({...animalForm, age: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={animalForm.price}
                      onChange={(e) => setAnimalForm({...animalForm, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={animalForm.weight}
                      onChange={(e) => setAnimalForm({...animalForm, weight: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={animalForm.description}
                    onChange={(e) => setAnimalForm({...animalForm, description: e.target.value})}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={animalForm.image_url}
                    onChange={(e) => setAnimalForm({...animalForm, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={animalForm.is_available}
                      onChange={(e) => setAnimalForm({...animalForm, is_available: e.target.checked})}
                    />
                    Available for sale
                  </label>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn btn-primary">
                    {editingAnimal ? 'Update Animal' : 'Add Animal'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAnimalForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="my-animals">
          <h2>My Animals</h2>
          {animalsLoading ? (
            <div className="loading">Loading animals...</div>
          ) : myAnimals.length === 0 ? (
            <div className="no-animals">
              <p>You haven't added any animals yet.</p>
              <p>Click "Add New Animal" to get started!</p>
            </div>
          ) : (
            <div className="animals-grid">
              {myAnimals.map(animal => (
                <div key={animal.id} className="animal-card">
                  <div className="animal-image">
                    <img 
                      src={animal.image_url || 'https://via.placeholder.com/300x200?text=Animal+Image'} 
                      alt={animal.name}
                    />
                    {!animal.is_available && (
                      <div className="sold-badge">Sold</div>
                    )}
                  </div>
                  
                  <div className="animal-info">
                    <h3>{animal.name}</h3>
                    <div className="animal-details">
                      <span className="animal-type">{animal.animal_type}</span>
                      <span className="animal-breed">{animal.breed}</span>
                    </div>
                    <div className="animal-specs">
                      <span>Age: {animal.age} months</span>
                      {animal.weight && <span>Weight: {animal.weight} kg</span>}
                    </div>
                    <p className="animal-price">${animal.price}</p>
                    <p className="animal-description">{animal.description}</p>
                    
                    <div className="animal-actions">
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => handleEditAnimal(animal)}
                      >
                        Edit
                      </button>
                      <button 
                        className={`btn btn-small ${animal.is_available ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => toggleAvailability(animal)}
                      >
                        {animal.is_available ? 'Mark Sold' : 'Mark Available'}
                      </button>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteAnimal(animal.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;