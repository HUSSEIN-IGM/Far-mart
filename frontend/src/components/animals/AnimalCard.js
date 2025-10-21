import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import { toast } from 'react-toastify';
import './AnimalCard.css';

const AnimalCard = ({ animal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleCardClick = () => {
    // navigate(`/animals/${animal.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user is trying to buy their own animal
    if (user?.user_type === 'farmer' && animal.farmer.id === user.id) {
      toast.error('You cannot buy your own animal');
      return;
    }

    try {
      console.log('🛒 Adding to cart:', animal.id);
      const response = await cartService.addToCart(animal.id);
      console.log('✅ Add to cart response:', response.data);
      toast.success(`${animal.name} added to cart!`);
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to cart';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="animal-card" onClick={handleCardClick}>
      <div className="animal-image">
        <img 
          src={animal.image_url || 'https://via.placeholder.com/300x200?text=Animal+Image'} 
          alt={animal.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Animal+Image';
          }}
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
        <p className="animal-description">
          {animal.description || 'No description available.'}
        </p>
        <div className="animal-footer">
          <div className="animal-price">${animal.price}</div>
          <div className="animal-seller">
            By: {animal.farmer.first_name} {animal.farmer.last_name}
          </div>
        </div>
        
        {animal.is_available && isAuthenticated && user?.user_type === 'user' && (
          <button 
            className="btn btn-primary btn-small"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimalCard;