import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimals } from '../store/slices/animalsSlice';
import AnimalCard from './AnimalCard';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const AnimalList = () => {
  const dispatch = useDispatch();
  const { animals, isLoading } = useSelector(state => state.animals);
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    min_age: '',
    max_age: ''
  });

  useEffect(() => {
    dispatch(fetchAnimals(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container>
      <h1>Available Animals</h1>
      
      <Filters>
        <select 
          value={filters.type} 
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="cattle">Cattle</option>
          <option value="poultry">Poultry</option>
          <option value="swine">Swine</option>
          <option value="sheep">Sheep</option>
          <option value="goat">Goat</option>
        </select>

        <input
          type="text"
          placeholder="Breed"
          value={filters.breed}
          onChange={(e) => handleFilterChange('breed', e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Age"
          value={filters.min_age}
          onChange={(e) => handleFilterChange('min_age', e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Age"
          value={filters.max_age}
          onChange={(e) => handleFilterChange('max_age', e.target.value)}
        />
      </Filters>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {animals.map(animal => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </div>
    </Container>
  );
};

export default AnimalList;