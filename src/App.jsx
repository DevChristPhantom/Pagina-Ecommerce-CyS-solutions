import React, { useState, useEffect, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import FilterSidebar from './components/FilterSidebar';
import CartDrawer from './components/CartDrawer';
import CheckoutWizard from './components/CheckoutWizard';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ThreeDViewer from './components/ThreeDViewer';
import { 
  Sparkles, SlidersHorizontal, ShoppingBag, ShieldCheck, 
  Truck, HelpCircle, MessageSquare, X, CheckCircle, ChevronLeft, ChevronRight,
  Mail, Phone, Globe
} from 'lucide-react';

const carouselSlides = [
  {
    id: 1,
    subtitle: "EDICIÓN EXCLUSIVA INTERACTIVA 3D",
    title: "Razer Kraken Headset",
    tagline: "El auricular gamer más icónico de Razer. Experimenta un audio posicional 7.1 inmersivo con controladores optimizados de 50 mm, almohadillas con gel refrigerante de larga duración y micrófono retráctil con cancelación de ruido de fondo.",
    image: "/razer_kraken_render.png",
    gradientClass: "linear-gradient(115deg, #0F172A 52%, #33FF33 52.3%, #33FF33 54%, #0F172A 54.3%, #0F172A 55%, #1E293B 55.3%, #1E293B 58%, #0F172A 58.3%, #0F172A 59%, #1E293B 59.3%)",
    isLight: false,
    buttonText: "Comprar Ahora",
    isExploded: false,
    isThreeD: true
  }
];

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { settings } = useContext(AppContext);

  useEffect(() => {
    if (carouselSlides.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 8500); // slightly longer duration to allow assembly animation to play fully
    return () => clearInterval(slideTimer);
  }, []);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (carouselSlides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (carouselSlides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  return (
    <div className="hero-banner-carousel">
      {carouselSlides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`carousel-slide ${index === currentSlide ? 'active' : ''} ${slide.isLight ? 'light-slide' : 'dark-slide'}`}
          style={{ background: slide.gradientClass }}
        >
          <div className="hero-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '12px' }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {slide.subtitle}
              </span>
            </div>
            <h1 style={{ color: slide.isLight ? '#0F172A' : '#FFFFFF' }}>
              {slide.title.split(' ')[0]} <br/><span>{slide.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p style={{ color: slide.isLight ? '#475569' : '#CBD5E1' }}>{slide.tagline}</p>
            <a href="#catalogo" className="btn-primary">
              {slide.buttonText}
            </a>
          </div>

          <div className="carousel-image-container">
            {slide.isThreeD ? (
              <ThreeDViewer />
            ) : slide.isExploded ? (
              <div className="animated-headphone-container">
                {/* Assembled central headphones image */}
                <img src="/cys_neon_wireless.png" className="assembled-headphone" alt="Assembled Product" />
                
                {/* Exploded pieces cropped dynamically from cys_exploded.png */}
                <div className="exploded-piece piece-1"></div>
                <div className="exploded-piece piece-2"></div>
                <div className="exploded-piece piece-3"></div>
                <div className="exploded-piece piece-4"></div>
                <div className="exploded-piece piece-5"></div>
                <div className="exploded-piece piece-6"></div>
                <div className="exploded-piece piece-7"></div>
              </div>
            ) : (
              <img src={slide.image} alt={slide.title} />
            )}
          </div>

          {/* Bottom Infobar (Enterprise Style) */}
          <div className="carousel-slide-infobar">
            <span>
              <Mail size={12} /> contacto@cyssolutions.com
            </span>
            <span>
              <Phone size={12} /> +51 {settings.whatsappNumber}
            </span>
            <span>
              <Globe size={12} /> www.cyssolutions.com
            </span>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      {carouselSlides.length > 1 && (
        <>
          <button className="carousel-nav-btn prev" onClick={handlePrev} title="Anterior">
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-nav-btn next" onClick={handleNext} title="Siguiente">
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {carouselSlides.length > 1 && (
        <div className="carousel-indicators">
          {carouselSlides.map((_, idx) => (
            <button 
              key={idx} 
              className={`carousel-indicator ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StorefrontContent({
  searchQuery,
  selectedCategories,
  setSelectedCategories,
  maxPrice,
  setMaxPrice,
  selectedColors,
  setSelectedColors,
  selectedFeatures,
  setSelectedFeatures,
  resetFilters,
  onCheckoutOpen
}) {
  const { products } = useContext(AppContext);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter logic
  const filteredProducts = products.filter((p) => {
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
      return false;
    }
    if (maxPrice !== Infinity && p.price > maxPrice) {
      return false;
    }
    if (selectedColors.length > 0 && !selectedColors.includes(p.color)) {
      return false;
    }
    if (selectedFeatures.length > 0) {
      const hasAllFeatures = selectedFeatures.every(f => p.features.includes(f));
      if (!hasAllFeatures) return false;
    }
    return true;
  });

  return (
    <main>
      {/* Enterprise Hero Banner Carousel */}
      <HeroCarousel />

      {/* Trust Badges */}
      <div className="trust-badges-container">
        <div className="trust-badge-card">
          <ShieldCheck size={28} className="trust-badge-icon" />
          <h4>Garantía Oficial</h4>
          <p>Todos los productos cuentan con 12 meses de garantía real.</p>
        </div>
        <div className="trust-badge-card">
          <Truck size={28} className="trust-badge-icon" />
          <h4>Envíos Express</h4>
          <p>Delivery en 24h a todo Lima y envíos rápidos a nivel nacional.</p>
        </div>
        <div className="trust-badge-card">
          <HelpCircle size={28} className="trust-badge-icon" />
          <h4>Soporte al Instante</h4>
          <p>Consultas y asesoramiento por WhatsApp las 24 horas.</p>
        </div>
      </div>

      {/* Catalog Title */}
      <div id="catalogo" style={{ padding: '20px 5% 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.8rem' }}>Nuestra Colección</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Mostrando {filteredProducts.length} de {products.length} audífonos disponibles
          </p>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          style={{ display: 'none', alignItems: 'center', gap: '8px' }}
          id="mobile-filter-trigger"
        >
          <SlidersHorizontal size={16} />
          Filtros
        </button>
      </div>

      {/* Storefront Shop Layout */}
      <div className="shop-container">
        <div className={mobileFilterOpen ? 'mobile-filter-active' : ''}>
          <FilterSidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            resetFilters={resetFilters}
          />
        </div>

        <div>
          {filteredProducts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              backgroundColor: 'var(--light-surface)', 
              border: '1px solid var(--light-border)', 
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }} className="glass">
              <ShoppingBag size={48} className="text-muted" style={{ color: 'var(--primary)' }} />
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Sin resultados</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  No encontramos audífonos que coincidan con los filtros aplicados.
                </p>
              </div>
              <button className="btn-secondary" onClick={resetFilters} style={{ fontSize: '0.85rem' }}>
                Ver Todos los Audífonos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function FloatingWhatsApp() {
  const { settings } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleStartChat = () => {
    const url = `https://wa.me/51${settings.whatsappNumber}?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20audífonos.`;
    window.open(url, '_blank');
  };

  return (
    <div className="floating-whatsapp-container">
      {isOpen && (
        <div className="whatsapp-chatbox">
          <div className="whatsapp-chatbox-header">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              🎧
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Soporte CyS</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
                En línea
              </div>
            </div>
            <button className="icon-btn" onClick={() => setIsOpen(false)} style={{ marginLeft: 'auto', color: 'white', padding: '4px' }}>
              <X size={16} />
            </button>
          </div>
          <div className="whatsapp-chatbox-body">
            <div className="whatsapp-bubble">
              ¡Hola! 👋 Bienvenidos a <strong>CyS solutions</strong>. ¿Tienes dudas sobre algún audífono o tu pago con Yape? Escríbenos aquí.
            </div>
            <button 
              className="whatsapp-redirect-btn" 
              onClick={handleStartChat}
              style={{ fontSize: '0.8rem', padding: '10px 16px', borderRadius: '8px', width: '100%', justifyContent: 'center' }}
            >
              <MessageSquare size={14} /> Iniciar Chat de Soporte
            </button>
          </div>
        </div>
      )}
      <button className="whatsapp-trigger-btn" onClick={() => setIsOpen(!isOpen)} title="WhatsApp Soporte">
        <MessageSquare size={24} />
      </button>
    </div>
  );
}

function ToastList() {
  const { toasts } = useContext(AppContext);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div className={`toast glass ${toast.type}`} key={toast.id}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'error' && <X size={18} />}
            {toast.type === 'warning' && <Sparkles size={18} />}
            {toast.type === 'info' && <Sparkles size={18} />}
          </div>
          <div className="toast-message">{toast.message}</div>
        </div>
      ))}
    </div>
  );
}

function MainAppLayout() {
  const { isAdminMode, setIsAdminMode, isAuthenticated } = useContext(AppContext);
  
  // Storefront states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(Infinity);
    setSelectedColors([]);
    setSelectedFeatures([]);
    setSearchQuery('');
  };

  return (
    <div className="app-wrapper">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {isAdminMode ? (
        isAuthenticated ? (
          <AdminDashboard />
        ) : (
          <AdminLogin onBackToStore={() => setIsAdminMode(false)} />
        )
      ) : (
        <>
          <StorefrontContent
            searchQuery={searchQuery}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            resetFilters={resetFilters}
            onCheckoutOpen={() => setIsCheckoutOpen(true)}
          />
          <Footer />
        </>
      )}

      {/* Cart Slider */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutOpen={() => setIsCheckoutOpen(true)}
      />

      {/* 3-Step Checkout Wizard Modal */}
      <CheckoutWizard
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Floating Chat Widget */}
      {!isAdminMode && <FloatingWhatsApp />}

      {/* Custom Toast System Banners */}
      <ToastList />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
