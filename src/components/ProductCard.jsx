import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, cart } = useContext(AppContext);

  const cartItem = cart.find((item) => Number(item.id) === Number(product.id));
  const isInCart = !!cartItem;

  return (
    <div className="product-card">
      {product.isNew && <span className="card-tag">Nuevo</span>}
      
      <div className="card-img-wrapper">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="card-details">
        <span className="card-category">{product.category}</span>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-description">{product.description}</p>
        
        <div className="card-bottom">
          <div className="card-price">
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>S/. </span>
            {product.price.toFixed(2)}
          </div>
          
          <button 
            className="btn-card-add" 
            onClick={() => addToCart(product)}
            title={isInCart ? `En el carrito (${cartItem.quantity})` : "Añadir al Carrito"}
          >
            {isInCart ? <Check size={20} strokeWidth={3} /> : <ShoppingCart size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
