import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  selectedCategories,
  setSelectedCategories,
  maxPrice,
  setMaxPrice,
  selectedColors,
  setSelectedColors,
  selectedFeatures,
  setSelectedFeatures,
  resetFilters
}) {
  const { products } = useContext(AppContext);

  // Dynamically extract values for filtering
  const categories = [...new Set(products.map((p) => p.category))];
  const colors = [...new Set(products.map((p) => p.color))];
  const features = [...new Set(products.flatMap((p) => p.features || []))];

  // Helper arrays of default color hexes for the picker UI
  const colorMap = {
    "Negro": "#1E293B",
    "Plateado": "#CBD5E1",
    "Blanco": "#FFFFFF",
    "Verde": "#10B981",
    "Rojo": "#EF4444",
    "Azul": "#3B82F6",
    "Gris": "#64748B"
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleFeatureToggle = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  // Find max possible price dynamically
  const maxPossiblePrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;

  return (
    <aside className="sidebar-filter">
      <div className="filter-section" style={{ borderBottom: '1px solid var(--light-border)', paddingBottom: '16px' }}>
        <div className="filter-title">
          <span>Filtros</span>
          <button 
            onClick={resetFilters} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}
            title="Limpiar Filtros"
          >
            <RotateCcw size={12} />
            Reiniciar
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h4 className="filter-title">Categoría</h4>
        <ul className="filter-list">
          {categories.map((category) => (
            <li key={category}>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Slider */}
      <div className="filter-section">
        <h4 className="filter-title">Precio Máximo</h4>
        <div className="range-slider">
          <input
            type="range"
            min="0"
            max={maxPossiblePrice}
            step="10"
            value={maxPrice === Infinity ? maxPossiblePrice : maxPrice}
            onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
            className="range-input"
          />
          <div className="range-values">
            <span>S/. 0</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
              S/. {maxPrice === Infinity ? maxPossiblePrice.toFixed(0) : maxPrice.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="filter-section">
        <h4 className="filter-title">Color</h4>
        <div className="color-picker">
          {colors.map((color) => (
            <div
              key={color}
              className={`color-option ${selectedColors.includes(color) ? 'active' : ''}`}
              onClick={() => handleColorToggle(color)}
              title={color}
            >
              <div 
                className="color-badge" 
                style={{ backgroundColor: colorMap[color] || '#CCCCCC' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="filter-section">
        <h4 className="filter-title">Características</h4>
        <ul className="filter-list">
          {features.map((feature) => (
            <li key={feature}>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                />
                {feature}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
