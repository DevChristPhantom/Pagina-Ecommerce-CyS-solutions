import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Phone, Mail, MapPin, Headphones } from 'lucide-react';

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
            <Headphones size={24} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {settings.storeName.split(' ')[0]} <span style={{ color: 'var(--primary)' }}>{settings.storeName.split(' ')[1] || ''}</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Especialistas en audio de alta fidelidad. Brindamos los mejores audífonos con envíos express y garantía oficial en todo el Perú.
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px' }}>
            Categorías
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li><span style={{ cursor: 'pointer', hover: { color: 'var(--primary)' } }}>Over-Ear Inalámbricos</span></li>
            <li><span style={{ cursor: 'pointer' }}>Earbuds Deportivos</span></li>
            <li><span style={{ cursor: 'pointer' }}>Auriculares Gaming RGB</span></li>
            <li><span style={{ cursor: 'pointer' }}>Conducción Ósea</span></li>
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
        &copy; {new Date().getFullYear()} CyS solutions. Todos los derechos reservados. Diseñado bajo estándares Senior QA & UX.
      </div>
    </footer>
  );
}
