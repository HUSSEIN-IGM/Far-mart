import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimals } from '../store/slices/animalsSlice';
import AnimalCard from '../components/animals/AnimalCard';
import AnimalFilters from '../components/animals/AnimalFilters';
import './Animals.css';

const Animals = () => {
  const dispatch = useDispatch();
  const { animals, isLoading, error } = useSelector((state) => state.animals);
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    min_age: '',
    max_age: '',
    search: '',
  });

  useEffect(() => {
    dispatch(fetchAnimals(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      breed: '',
      min_age: '',
      max_age: '',
      search: '',
    });
  };

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          Error loading animals: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="animals-page">
      <div className="container">
        <div className="animals-header">
          <h1>Browse Animals</h1>
          <p>Find quality farm animals directly from farmers</p>
        </div>

        <AnimalFilters 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {isLoading ? (
          <div className="loading">Loading animals...</div>
        ) : (
          <>
            <div className="animals-grid">
              {animals.map(animal => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
            
            {animals.length === 0 && (
              <div className="no-animals">
                <h3>No animals found</h3>
                <p>Try adjusting your filters or check back later.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Animals;