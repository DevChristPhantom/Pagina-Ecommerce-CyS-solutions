import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { settings } = useContext(AppContext);

  return (
    <footer style={{
      borderTop: '1px solid var(--light-border)',
      padding: '50px 5% 30px',
      marginTop: '60px',
      backgroundColor: 'rgba(0,0,0,0.01)',
      transition: 'var(--transition)'
    }} className="footer-glass">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ color: 'var(--primary)' }}>
              <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 4 1-.5 3-2 3-4 0-1.66-1.34-3-3-3zm-4.5-3c-1.1 0-2 .9-2 2s1.5 2 2 2.5c.5-.5 2-1.4 2-2.5s-.9-2-2-2zm9 0c-1.1 0-2 .9-2 2s1.5 2 2 2.5c.5-.5 2-1.4 2-2.5s-.9-2-2-2zm-9-5C7.7 6 7 6.7 7 7.5s1 1.5 1.5 2c.5-.5 1.5-1.2 1.5-2S9.3 6 7.5 6zm9 0c-1.8 0-2.5.7-2.5 1.5s1 1.5 1.5 2c.5-.5 1.5-1.2 1.5-2S18.3 6 16.5 6z" />
            </svg>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {settings.storeName.split(' ')[0]} <span style={{ color: 'var(--primary)' }}>{settings.storeName.split(' ')[1] || ''}</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Especialistas en bienestar y felicidad felina. Ofrecemos los mejores rascadores, juguetes, accesorios y combos premium con envíos express en Lima y provincias.
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px' }}>
            Categorías
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li><span style={{ cursor: 'pointer' }}>Casas para Gatos</span></li>
            <li><span style={{ cursor: 'pointer' }}>Accesorios Premium</span></li>
            <li><span style={{ cursor: 'pointer' }}>Juguetes Interactivos</span></li>
            <li><span style={{ cursor: 'pointer' }}>Apoyo a Gatitos (Solidario)</span></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px' }}>
            Métodos de Pago
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                backgroundColor: 'var(--secondary)', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '0.7rem', 
                fontWeight: 700 
              }}>
                YAPE
              </span> 
              Pago por código QR
            </li>
            <li>Transferencias Directas</li>
            <li>Contraentrega (Previo acuerdo)</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px' }}>
            Contacto & Soporte
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} className="text-muted" />
              <span>+51 {settings.whatsappNumber}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} className="text-muted" />
              <span>contacto@cyssolutions.com</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} className="text-muted" />
              <span>Av. Primavera 1230, Santiago de Surco - Lima</span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--light-border)',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        &copy; {new Date().getFullYear()} CyS solutions Animals. Todos los derechos reservados. Diseñado bajo estándares Senior QA & UX.
      </div>
    </footer>
  );
}
