import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, onCheckoutOpen }) {
  const { cart, updateQuantity, removeFromCart } = useContext(AppContext);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckoutClick = () => {
    onClose();
    onCheckoutOpen();
  };

  return (
    <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Bolsa de Compras</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} className="text-muted" style={{ color: 'var(--primary)' }} />
              <p>Tu carrito está vacío</p>
              <button className="btn-primary" onClick={onClose} style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                Ver Catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <div className="cart-item-price">S/. {item.price.toFixed(2)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div className="quantity-controller">
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      className="btn-icon-action delete" 
                      onClick={() => removeFromCart(item.id)}
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span className="text-muted">Subtotal</span>
              <span style={{ fontWeight: 600 }}>S/. {subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line">
              <span className="text-muted">Envío</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                Calculado en checkout
              </span>
            </div>
            <div className="cart-summary-total">
              <span>Total Estimado</span>
              <span style={{ color: 'var(--primary)' }}>S/. {subtotal.toFixed(2)}</span>
            </div>
            
            <button className="btn-primary btn-checkout" onClick={handleCheckoutClick}>
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
