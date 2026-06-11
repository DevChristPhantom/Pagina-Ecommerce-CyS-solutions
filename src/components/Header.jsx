import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, Moon, Sun, Settings, Headphones, Search, LogOut } from 'lucide-react';

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
          <span className="logo-icon">
            <Headphones size={32} strokeWidth={2.5} style={{ verticalAlign: 'middle', color: '#FF6600' }} />
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
              placeholder="Buscar audífonos..." 
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
