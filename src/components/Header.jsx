import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, Moon, Sun, Settings, Search, LogOut } from 'lucide-react';

export default function Header({ onCartOpen, isDarkMode, setIsDarkMode, searchQuery, setSearchQuery }) {
  const { cart, isAdminMode, setIsAdminMode, settings, isAuthenticated, logout } = useContext(AppContext);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleAdminClick = () => {
    if (isAdminMode && isAuthenticated) {
      // If we are authenticated and in admin mode, clicking the button toggles back to store
      setIsAdminMode(false);
    } else {
      // Otherwise toggle admin mode (which will trigger login if not authenticated)
      setIsAdminMode(true);
    }
  };

  return (
    <>
      <div className="promo-bar">
        <span>🚚 Envío Gratis en Lima por compras mayores a S/. 299</span>
      </div>

      <header className="glass">
        <div className="logo-container" onClick={() => setIsAdminMode(false)}>
          <span className="logo-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style={{ verticalAlign: 'middle', color: 'var(--primary)' }}>
              <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 4 1-.5 3-2 3-4 0-1.66-1.34-3-3-3zm-4.5-3c-1.1 0-2 .9-2 2s1.5 2 2 2.5c.5-.5 2-1.4 2-2.5s-.9-2-2-2zm9 0c-1.1 0-2 .9-2 2s1.5 2 2 2.5c.5-.5 2-1.4 2-2.5s-.9-2-2-2zm-9-5C7.7 6 7 6.7 7 7.5s1 1.5 1.5 2c.5-.5 1.5-1.2 1.5-2S9.3 6 7.5 6zm9 0c-1.8 0-2.5.7-2.5 1.5s1 1.5 1.5 2c.5-.5 1.5-1.2 1.5-2S18.3 6 16.5 6z" />
            </svg>
          </span>
          <span className="logo-text">
            {settings.storeName.split(' ')[0]} <span>{settings.storeName.split(' ')[1] || ''}</span>
          </span>
        </div>

        {!isAdminMode && (
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar juguetes, casas, collares..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className="nav-actions">
          <button 
            className="icon-btn" 
            onClick={toggleDarkMode}
            title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isAdminMode ? (
            <button className="icon-btn" onClick={onCartOpen} title="Ver Carrito">
              <ShoppingCart size={20} />
              {totalCartItems > 0 && (
                <span className="icon-badge">{totalCartItems}</span>
              )}
            </button>
          ) : null}

          {isAuthenticated && isAdminMode ? (
            <button 
              className="admin-toggle-btn"
              onClick={logout}
              style={{ background: '#EF4444', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
              title="Cerrar Sesión Administrador"
            >
              <LogOut size={16} />
              Salir
            </button>
          ) : (
            <button 
              className="admin-toggle-btn"
              onClick={handleAdminClick}
            >
              <Settings size={16} />
              {isAdminMode ? 'Tienda' : 'Admin Panel'}
            </button>
          )}
        </div>
      </header>
    </>
  );
}
