import React from 'react';
import './AnimalFilters.css';

const AnimalFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="animal-filters">
      <h3>Filter Animals</h3>
      
      <div className="filters-grid">
        <div className="filter-group">
          <label>Animal Type</label>
          <select 
            value={filters.type} 
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="cattle">Cattle</option>
            <option value="poultry">Poultry</option>
            <option value="swine">Swine</option>
            <option value="sheep">Sheep</option>
            <option value="goat">Goat</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Breed</label>
          <input
            type="text"
            placeholder="Search breed..."
            value={filters.breed}
            onChange={(e) => handleChange('breed', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Min Age (months)</label>
          <input
            type="number"
            placeholder="Min age"
            value={filters.min_age}
            onChange={(e) => handleChange('min_age', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Max Age (months)</label>
          <input
            type="number"
            placeholder="Max age"
            value={filters.max_age}
            onChange={(e) => handleChange('max_age', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button 
          className="btn btn-secondary btn-clear"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default AnimalFilters;