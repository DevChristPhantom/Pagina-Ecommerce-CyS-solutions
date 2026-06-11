import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, ArrowRight, ArrowLeft, Upload, Check, AlertCircle, Phone, Timer } from 'lucide-react';

export default function CheckoutWizard({ isOpen, onClose }) {
  const { cart, shippingMethods, settings, addOrder, clearCart, showToast } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState('');

  // Step 1: Customer & Delivery Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState('delivery'); // 'recojo' or 'delivery'
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryReference, setDeliveryReference] = useState('');
  const [errors, setErrors] = useState({});

  // Step 2: Timer
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  // Step 3: Screenshot Upload
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const activeMethods = shippingMethods.filter(m => m.type === deliveryType);
  const selectedMethod = shippingMethods.find(m => m.id === parseInt(selectedMethodId)) || activeMethods[0];
  const shippingCost = selectedMethod ? selectedMethod.price : 0;
  const grandTotal = subtotal + shippingCost;

  // Initialize selected shipping method
  useEffect(() => {
    if (activeMethods.length > 0) {
      setSelectedMethodId(activeMethods[0].id.toString());
    }
  }, [deliveryType, shippingMethods]);

  // Handle countdown timer in Step 2
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Start timer when entering Step 2
  useEffect(() => {
    if (currentStep === 2) {
      setTimeLeft(60);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [currentStep]);

  if (!isOpen) return null;

  // Handle image upload and convert to base64
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
      showToast('Comprobante de Yape cargado con éxito.', 'success');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Form validation
      const newErrors = {};
      if (!customerName.trim()) newErrors.customerName = 'El nombre es obligatorio';
      if (!customerPhone.trim()) {
        newErrors.customerPhone = 'El teléfono es obligatorio';
      } else if (!/^\d{9}$/.test(customerPhone.trim())) {
        newErrors.customerPhone = 'El teléfono debe tener 9 dígitos';
      }
      if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
        newErrors.deliveryAddress = 'La dirección de entrega es obligatoria';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        showToast('Por favor, completa los campos obligatorios.', 'error');
        return;
      }

      setErrors({});
      // Generate order ID
      setOrderId(`CYS-${Date.now().toString().slice(-6)}`);
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const restartTimer = () => {
    setTimeLeft(60);
    setTimerActive(true);
    showToast('Temporizador Yape reiniciado a 1 minuto.', 'info');
  };

  // Compile message text for WhatsApp API
  const generateWhatsAppMessage = () => {
    const productsText = cart.map(item => `• ${item.quantity}x ${item.name} (S/. ${item.price.toFixed(2)} c/u)`).join('\n');
    const addressText = deliveryType === 'delivery' 
      ? `📍 *Dirección:* ${deliveryAddress}\n🔍 *Referencia:* ${deliveryReference || 'Ninguna'}` 
      : '🏪 *Entrega:* Recojo en tienda Surco';

    const text = `¡Hola *CyS solutions Animals*! 🐱
\nQuiero confirmar mi compra y adjuntar mi recibo de pago Yape:

📦 *Pedido:* #${orderId}
👤 *Cliente:* ${customerName}
📞 *Celular:* ${customerPhone}
🚚 *Método:* ${selectedMethod ? selectedMethod.name : 'Envío'}
${addressText}

🛒 *Productos:*
${productsText}

💰 *Subtotal:* S/. ${subtotal.toFixed(2)}
📦 *Costo de Envío:* S/. ${shippingCost.toFixed(2)}
💵 *TOTAL A PAGAR:* S/. ${grandTotal.toFixed(2)}

_He adjuntado la captura del yapeo a esta conversación._`;

    return encodeURIComponent(text);
  };

  const handleFinishOrder = () => {
    // Save order in context / localStorage
    const orderData = {
      orderId: orderId,
      customerName,
      customerPhone,
      deliveryType,
      shippingMethod: selectedMethod ? selectedMethod.name : 'Envío',
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : 'Recojo en tienda',
      deliveryReference: deliveryReference,
      items: cart,
      subtotal,
      shippingCost,
      total: grandTotal,
      screenshot: screenshotPreview // base64 string
    };
    
    addOrder(orderData);
    clearCart();
    
    // Compile and open WhatsApp URL
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/51${settings.whatsappNumber}?text=${message}`;
    
    // Copy order text to clipboard
    try {
      const plainText = `Pedido #${orderId}\nCliente: ${customerName}\nCelular: ${customerPhone}\nTotal: S/. ${grandTotal.toFixed(2)}\nAdjunto mi comprobante Yape.`;
      navigator.clipboard.writeText(plainText);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
    
    // Redirect to WhatsApp
    window.open(url, '_blank');
    
    showToast('¡Redireccionando a WhatsApp! Envía el mensaje y adjunta tu comprobante.', 'success');
    
    // Reset states
    setCurrentStep(1);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setDeliveryReference('');
    setScreenshot(null);
    setScreenshotPreview(null);
    onClose();
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cart-header" style={{ padding: '20px 30px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>Proceso de Compra</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Wizard Steps */}
        <div className="wizard-steps">
          <div className={`wizard-step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <span className="step-num">{currentStep > 1 ? <Check size={12} strokeWidth={3} /> : '1'}</span>
            <span>Datos de Envío</span>
          </div>
          <div className={`wizard-step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <span className="step-num">{currentStep > 2 ? <Check size={12} strokeWidth={3} /> : '2'}</span>
            <span>Pago por QR Yape</span>
          </div>
          <div className={`wizard-step ${currentStep === 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span>Confirmación</span>
          </div>
        </div>

        {/* Wizard Body */}
        <div className="checkout-step-content">
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>1. Datos del Cliente y Envío</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Nombre Completo *</label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    placeholder="Ej. Juan Pérez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  {errors.customerName && (
                    <span style={{ fontSize: '0.8rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <AlertCircle size={12} /> {errors.customerName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Celular (WhatsApp) *</label>
                  <input
                    id="phone"
                    type="tel"
                    maxLength={9}
                    className="form-input"
                    placeholder="Ej. 987654321"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.customerPhone && (
                    <span style={{ fontSize: '0.8rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <AlertCircle size={12} /> {errors.customerPhone}
                    </span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label>Tipo de Entrega</label>
                  <div className="delivery-options-grid">
                    <div 
                      className={`delivery-type-card ${deliveryType === 'delivery' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('delivery')}
                    >
                      <input 
                        type="radio" 
                        name="deliv_type" 
                        checked={deliveryType === 'delivery'} 
                        onChange={() => setDeliveryType('delivery')}
                        style={{ accentColor: 'var(--primary)', marginTop: '4px' }}
                      />
                      <div className="delivery-card-info">
                        <h4>Despacho a Domicilio</h4>
                        <p>Enviamos tus productos directamente a tu dirección.</p>
                      </div>
                    </div>

                    <div 
                      className={`delivery-type-card ${deliveryType === 'recojo' ? 'active' : ''}`}
                      onClick={() => setDeliveryType('recojo')}
                    >
                      <input 
                        type="radio" 
                        name="deliv_type" 
                        checked={deliveryType === 'recojo'}
                        onChange={() => setDeliveryType('recojo')}
                        style={{ accentColor: 'var(--primary)', marginTop: '4px' }}
                      />
                      <div className="delivery-card-info">
                        <h4>Recojo en Tienda</h4>
                        <p>Recoge gratis en nuestro local (Santiago de Surco, Lima).</p>
                      </div>
                    </div>
                  </div>
                </div>

                {deliveryType === 'delivery' ? (
                  <>
                    <div className="form-group full-width">
                      <label htmlFor="address">Dirección de Envío (Calle, Número, Dpto) *</label>
                      <input
                        id="address"
                        type="text"
                        className="form-input"
                        placeholder="Ej. Av. Larco 456, Dpto 301, Miraflores"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                      />
                      {errors.deliveryAddress && (
                        <span style={{ fontSize: '0.8rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <AlertCircle size={12} /> {errors.deliveryAddress}
                        </span>
                      )}
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="reference">Referencia de Entrega</label>
                      <input
                        id="reference"
                        type="text"
                        className="form-input"
                        placeholder="Ej. Frente al Parque Kennedy, portón negro"
                        value={deliveryReference}
                        onChange={(e) => setDeliveryReference(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="form-group full-width" style={{
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    border: '1px solid var(--light-border)'
                  }}>
                    <strong style={{ color: 'var(--primary)' }}>Dirección de Recojo:</strong>
                    <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                      Av. Primavera 1230, Santiago de Surco. Horario: Lunes a Sábado de 10:00 AM a 7:00 PM.
                    </p>
                  </div>
                )}

                {activeMethods.length > 0 && (
                  <div className="form-group full-width">
                    <label htmlFor="shippingMethod">Opciones de Entrega Disponibles</label>
                    <select
                      id="shippingMethod"
                      className="form-input"
                      value={selectedMethodId}
                      onChange={(e) => setSelectedMethodId(e.target.value)}
                    >
                      {activeMethods.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} - S/. {m.price.toFixed(2)} ({m.description})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Order Mini Summary */}
              <div style={{
                marginTop: '10px',
                borderTop: '1px dashed var(--light-border)',
                paddingTop: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', margin: '4px 0' }}>
                  <span className="text-muted">Subtotal de Compra:</span>
                  <span>S/. {subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', margin: '4px 0' }}>
                  <span className="text-muted">Costo de Envío:</span>
                  <span>S/. {shippingCost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', margin: '8px 0 0', color: 'var(--primary)' }}>
                  <span>Total a Pagar:</span>
                  <span>S/. {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="yape-payment-container">
              <div className="yape-brand-header">
                <span>📱 Paga con Yape</span>
              </div>
              <div className="yape-info-body">
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Escanea el siguiente código QR desde tu app Yape y realiza la transferencia.
                </p>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-dark)',
                  margin: '8px 0'
                }}>
                  Monto a Yapear: <span style={{ color: 'var(--primary)' }}>S/. {grandTotal.toFixed(2)}</span>
                </div>

                <div className="yape-qr-image-wrapper">
                  <img src={settings.yapeQr} alt="Yape QR Code" />
                </div>

                <div className="yape-owner-name">
                  {settings.yapeOwner}
                </div>

                {timeLeft > 0 ? (
                  <div className="yape-timer-box">
                    <Timer size={20} />
                    <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="timer-expired-alert">
                      ⚠️ ¡El temporizador de pago ha expirado!
                    </div>
                    <button className="btn-secondary" onClick={restartTimer} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Timer size={14} /> Reiniciar 1 Minuto
                    </button>
                  </div>
                )}
                
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Una vez realizado el pago, procede al siguiente paso para adjuntar tu captura y confirmar.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="confirmation-container">
              <div className="success-badge">
                <Check size={36} strokeWidth={2.5} />
              </div>
              
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem' }}>
                ¡Último Paso para Confirmar!
              </h3>
              
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
                Para completar tu compra, debes subir la captura del yapeo realizado. Al hacer clic en completar, te abriremos WhatsApp para que envíes el mensaje.
              </p>

              {/* Upload screenshot */}
              <div className="screenshot-upload-area" onClick={() => document.getElementById('screenshot-file').click()}>
                <input
                  id="screenshot-file"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  style={{ display: 'none' }}
                />
                <Upload size={32} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {screenshot ? '¡Captura seleccionada!' : 'Sube la Foto del Yapeo (Comprobante) *'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Haga clic para seleccionar archivo
                </span>

                {screenshotPreview && (
                  <img src={screenshotPreview} alt="Receipt preview" className="screenshot-preview" />
                )}
              </div>

              {screenshot && (
                <div style={{
                  backgroundColor: 'rgba(0, 210, 196, 0.05)',
                  border: '1px dashed var(--accent)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  maxWidth: '480px',
                  color: 'var(--text-dark)'
                }}>
                  💡 <strong>Nota Importante:</strong> El sistema copiará los datos del pedido a tu portapapeles y te redirigirá a WhatsApp. En el chat, presiona <strong>Ctrl+V</strong> para pegar los detalles de compra y adjunta la foto de tu comprobante.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="checkout-modal-footer">
          {currentStep > 1 ? (
            <button className="btn-secondary" onClick={handlePrevStep} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Atrás
            </button>
          ) : (
            <div></div> // empty spacer
          )}

          {currentStep < 3 ? (
            <button className="btn-primary" onClick={handleNextStep} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Siguiente <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              className="btn-primary" 
              onClick={handleFinishOrder} 
              disabled={!screenshot}
              style={{ 
                backgroundColor: screenshot ? 'var(--accent)' : 'var(--text-muted)',
                cursor: screenshot ? 'pointer' : 'not-allowed',
                boxShadow: screenshot ? '0 4px 15px rgba(0, 210, 196, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Phone size={16} /> Completar y Enviar por WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
