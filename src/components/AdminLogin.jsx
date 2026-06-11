import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Lock, User, ArrowLeft, Headphones } from 'lucide-react';

export default function AdminLogin({ onBackToStore }) {
  const { login } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate small latency for enterprise look
    setTimeout(() => {
      const success = login(username, password);
      setIsLoading(false);
      if (!success) {
        setError('Usuario o contraseña incorrectos.');
      }
    }, 800);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '20px',
      background: 'radial-gradient(circle, rgba(122,25,148,0.08) 0%, rgba(15,23,42,0.01) 100%)'
    }}>
      <div className="glass" style={{
        width: '420px',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--light-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255, 102, 0, 0.1)', color: 'var(--primary)', marginBottom: '16px' }}>
            <Headphones size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '6px' }}>
            Acceso Administrativo
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Introduce tus credenciales para ingresar al panel.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.8rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> Usuario
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="Ej. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Contraseña
            </label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              marginTop: '10px',
              background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(122, 25, 148, 0.3)'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <button 
          className="btn-secondary" 
          onClick={onBackToStore} 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px dashed var(--light-border)' }}
          disabled={isLoading}
        >
          <ArrowLeft size={16} /> Volver a la Tienda
        </button>
      </div>
    </div>
  );
}
