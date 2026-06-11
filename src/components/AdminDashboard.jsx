import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Package, ShoppingBag, Plus, Trash2, Edit2, 
  Settings, DollarSign, ListOrdered, Truck, Save, 
  X, FileImage, RefreshCw 
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    products, addProduct, updateProduct, deleteProduct,
    shippingMethods, addShippingMethod, updateShippingMethod, deleteShippingMethod,
    settings, updateSettings,
    orders, updateOrderStatus, deleteOrder
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'shipping', 'settings'
  const [zoomImage, setZoomImage] = useState(null);

  // Forms states
  const [productForm, setProductForm] = useState(null); // null if closed
  const [shippingForm, setShippingForm] = useState(null); // null if closed
  
  // Settings form local state
  const [whatsappLocal, setWhatsappLocal] = useState(settings.whatsappNumber);
  const [yapeOwnerLocal, setYapeOwnerLocal] = useState(settings.yapeOwner);
  const [taglineLocal, setTaglineLocal] = useState(settings.tagline);
  const [storeNameLocal, setStoreNameLocal] = useState(settings.storeName);

  // Stats calculation: total revenue sums all orders EXCEPT cancelled ones!
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelado')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pendiente de WhatsApp' || o.status === 'Pendiente').length;
  const catalogCount = products.length;

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const formattedProduct = {
      ...productForm,
      price: parseFloat(productForm.price) || 0,
      stock: parseInt(productForm.stock) || 0,
      features: (productForm.featuresText || '').split(',').map(f => f.trim()).filter(Boolean),
      isNew: productForm.id ? productForm.isNew : true
    };

    if (productForm.id) {
      updateProduct(formattedProduct);
    } else {
      addProduct(formattedProduct);
    }
    setProductForm(null);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const formattedMethod = {
      ...shippingForm,
      price: parseFloat(shippingForm.price) || 0
    };

    if (shippingForm.id) {
      updateShippingMethod(formattedMethod);
    } else {
      addShippingMethod(formattedMethod);
    }
    setShippingForm(null);
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    updateSettings({
      whatsappNumber: whatsappLocal,
      yapeOwner: yapeOwnerLocal,
      tagline: taglineLocal,
      storeName: storeNameLocal
    });
    alert('Configuración actualizada con éxito.');
  };

  return (
    <div className="admin-container">
      {/* Admin Sidebar */}
      <div className="admin-sidebar glass">
        <div className="admin-sidebar-header">Menú Administrador</div>
        <button 
          className={`admin-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ListOrdered size={18} />
          Pedidos ({totalOrders})
        </button>
        <button 
          className={`admin-menu-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={18} />
          Productos ({catalogCount})
        </button>
        <button 
          className={`admin-menu-item ${activeTab === 'shipping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          <Truck size={18} />
          Tipos de Envío
        </button>
        <button 
          className={`admin-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} />
          Configuración
        </button>
      </div>

      {/* Admin Content Area */}
      <div className="admin-content">
        <div className="admin-content-header">
          <h2>Panel de Control - CyS solutions</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Fecha Actual: {new Date().toLocaleDateString('es-PE')}
          </span>
        </div>

        {/* Overview Stats Cards */}
        <div className="stats-grid">
          <div className="stats-card">
            <div>
              <div className="stats-card-label">Ganancias Activas</div>
              <div className="stats-card-val" style={{ color: 'var(--accent)' }}>S/. {totalRevenue.toFixed(2)}</div>
            </div>
            <div className="stats-icon-wrapper" style={{ backgroundColor: 'rgba(0, 210, 196, 0.1)', color: 'var(--accent)' }}>
              <DollarSign size={24} />
            </div>
          </div>

          <div className="stats-card">
            <div>
              <div className="stats-card-label">Pedidos Registrados</div>
              <div className="stats-card-val">{totalOrders}</div>
            </div>
            <div className="stats-icon-wrapper" style={{ backgroundColor: 'rgba(122, 25, 148, 0.1)', color: 'var(--secondary)' }}>
              <ListOrdered size={24} />
            </div>
          </div>

          <div className="stats-card">
            <div>
              <div className="stats-card-label">Pendientes de WhatsApp</div>
              <div className="stats-card-val" style={{ color: 'var(--primary)' }}>{pendingOrders}</div>
            </div>
            <div className="stats-icon-wrapper" style={{ backgroundColor: 'rgba(255, 102, 0, 0.1)', color: 'var(--primary)' }}>
              <RefreshCw size={24} />
            </div>
          </div>

          <div className="stats-card">
            <div>
              <div className="stats-card-label">Catálogo de Productos</div>
              <div className="stats-card-val">{catalogCount}</div>
            </div>
            <div className="stats-icon-wrapper" style={{ backgroundColor: 'rgba(15, 23, 42, 0.05)', color: 'var(--text-dark)' }}>
              <Package size={24} />
            </div>
          </div>
        </div>

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '16px' }}>Gestión de Pedidos</h3>
            
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--light-surface)', border: '1px solid var(--light-border)', borderRadius: '16px' }} className="glass">
                <ShoppingBag size={48} className="text-muted" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-muted)' }}>Aún no se han registrado pedidos en la tienda.</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Fecha</th>
                      <th>Cliente / Teléfono</th>
                      <th>Detalle de Compra</th>
                      <th>Comprobante Yape</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td style={{ fontSize: '0.8rem' }}>{order.date}</td>
                        <td>
                          <div><strong>{order.customerName}</strong></div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <a href={`tel:${order.customerPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              📞 {order.customerPhone}
                            </a>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 600 }}>{order.shippingMethod}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '6px' }}>
                            {order.deliveryAddress}
                          </div>
                          <ul style={{ paddingLeft: '14px', listStyleType: 'circle', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          {order.screenshot ? (
                            <div 
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', cursor: 'pointer', fontWeight: 600 }}
                              onClick={() => setZoomImage(order.screenshot)}
                            >
                              <FileImage size={16} />
                              <span>Ver captura</span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin archivo</span>
                          )}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          S/. {order.total.toFixed(2)}
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="form-input"
                            style={{ 
                              padding: '4px 8px', 
                              fontSize: '0.8rem', 
                              width: 'auto',
                              borderRadius: '4px',
                              fontWeight: 600,
                              backgroundColor: 
                                order.status === 'Completado' ? '#D1FAE5' : 
                                order.status === 'Verificado' ? '#DBEAFE' : 
                                order.status === 'Cancelado' ? '#FEE2E2' : '#FFEDD5',
                              color: 
                                order.status === 'Completado' ? '#065F46' : 
                                order.status === 'Verificado' ? '#1E40AF' : 
                                order.status === 'Cancelado' ? '#991B1B' : '#9A3412',
                              border: 'none'
                            }}
                          >
                            <option value="Pendiente de WhatsApp">Pendiente WhatsApp</option>
                            <option value="Verificado">Pago Verificado</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="btn-icon-action delete"
                            onClick={() => {
                              if(confirm('¿Seguro que deseas eliminar este pedido del historial?')) {
                                deleteOrder(order.id);
                              }
                            }}
                            title="Eliminar Pedido"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Inventario de Productos</h3>
              <button 
                className="btn-primary" 
                onClick={() => setProductForm({
                  name: '',
                  price: '',
                  description: '',
                  category: 'Over-Ear',
                  color: 'Negro',
                  featuresText: '',
                  image: '/cys_neon_wireless.png',
                  stock: '10'
                })}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Agregar Producto
              </button>
            </div>

            {/* Product form overlay */}
            {productForm && (
              <div className="modal-overlay active" style={{ zIndex: 400 }}>
                <div className="checkout-modal" style={{ width: '550px' }}>
                  <div className="cart-header" style={{ padding: '15px 25px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)' }}>
                      {productForm.id ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </h3>
                    <button className="icon-btn" onClick={() => setProductForm(null)}>
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleProductSubmit}>
                    <div className="checkout-step-content" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh' }}>
                      <div className="form-group">
                        <label>Nombre del Producto *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      
                      <div className="form-grid" style={{ gap: '12px' }}>
                        <div className="form-group">
                          <label>Precio (S/.) *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            className="form-input"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Stock *</label>
                          <input
                            type="number"
                            required
                            className="form-input"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-grid" style={{ gap: '12px' }}>
                        <div className="form-group">
                          <label>Categoría</label>
                          <select
                            className="form-input"
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          >
                            <option value="Over-Ear">Over-Ear</option>
                            <option value="In-Ear">In-Ear</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Open-Ear">Open-Ear</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Color</label>
                          <select
                            className="form-input"
                            value={productForm.color}
                            onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                          >
                            <option value="Negro">Negro</option>
                            <option value="Blanco">Blanco</option>
                            <option value="Plateado">Plateado</option>
                            <option value="Verde">Verde</option>
                            <option value="Rojo">Rojo</option>
                            <option value="Azul">Azul</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Imagen del Producto</label>
                        <select
                          className="form-input"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        >
                          <option value="/cys_neon_wireless.png">Over-Ear Neon (Pre-generado)</option>
                          <option value="/cys_sonic_buds.png">Sonic Buds (Pre-generado)</option>
                          <option value="/cys_gamer_pro.png">Gamer Pro RGB (Pre-generado)</option>
                          <option value="/cys_sport_run.png">Sport Run (Pre-generado)</option>
                        </select>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          O escribe una URL personalizada:
                        </span>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="https://ejemplo.com/audifono.png"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Características (Separadas por comas)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ej. Cancelación de Ruido, True Wireless, Batería 50h+"
                          value={productForm.featuresText}
                          onChange={(e) => setProductForm({ ...productForm, featuresText: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Descripción *</label>
                        <textarea
                          required
                          className="form-input"
                          style={{ height: '70px', resize: 'vertical' }}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="checkout-modal-footer" style={{ padding: '15px 25px' }}>
                      <button type="button" className="btn-secondary" onClick={() => setProductForm(null)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Save size={16} /> Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Table list */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Color</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#f7f9fa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyEncoding: 'center', padding: '4px' }}>
                          <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                      </td>
                      <td>
                        <div><strong>{product.name}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                          {product.description}
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.color}</td>
                      <td style={{ fontWeight: 700 }}>S/. {product.price.toFixed(2)}</td>
                      <td>{product.stock} unds</td>
                      <td>
                        <div className="btn-action-pack">
                          <button 
                            className="btn-icon-action"
                            onClick={() => setProductForm({
                              ...product,
                              featuresText: (product.features || []).join(', ')
                            })}
                            title="Editar Producto"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn-icon-action delete"
                            onClick={() => {
                              if(confirm(`¿Estás seguro que deseas eliminar "${product.name}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            title="Eliminar Producto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Shipping */}
        {activeTab === 'shipping' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Métodos de Despacho y Envío</h3>
              <button 
                className="btn-primary" 
                onClick={() => setShippingForm({
                  name: '',
                  description: '',
                  price: '',
                  type: 'delivery'
                })}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Agregar Método
              </button>
            </div>

            {/* Shipping form overlay */}
            {shippingForm && (
              <div className="modal-overlay active" style={{ zIndex: 400 }}>
                <div className="checkout-modal" style={{ width: '450px' }}>
                  <div className="cart-header" style={{ padding: '15px 25px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)' }}>
                      {shippingForm.id ? 'Editar Método de Envío' : 'Agregar Método de Envío'}
                    </h3>
                    <button className="icon-btn" onClick={() => setShippingForm(null)}>
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleShippingSubmit}>
                    <div className="checkout-step-content" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-group">
                        <label>Nombre del Método *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="Ej. Envío Express 24h"
                          value={shippingForm.name}
                          onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        />
                      </div>
                      
                      <div className="form-grid" style={{ gap: '12px' }}>
                        <div className="form-group">
                          <label>Costo (S/.) *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            className="form-input"
                            value={shippingForm.price}
                            onChange={(e) => setShippingForm({ ...shippingForm, price: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tipo de Método</label>
                          <select
                            className="form-input"
                            value={shippingForm.type}
                            onChange={(e) => setShippingForm({ ...shippingForm, type: e.target.value })}
                          >
                            <option value="delivery">Despacho Domicilio (Delivery)</option>
                            <option value="recojo">Recojo en Local (Tienda)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Descripción *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="Ej. Entregas express en menos de 24 horas laborables"
                          value={shippingForm.description}
                          onChange={(e) => setShippingForm({ ...shippingForm, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="checkout-modal-footer" style={{ padding: '15px 25px' }}>
                      <button type="button" className="btn-secondary" onClick={() => setShippingForm(null)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Save size={16} /> Guardar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Shipping options table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Costo</th>
                    <th>Detalles</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingMethods.map((method) => (
                    <tr key={method.id}>
                      <td><strong>{method.name}</strong></td>
                      <td>
                        <span className="status-badge completed" style={{ 
                          backgroundColor: method.type === 'recojo' ? '#ECFDF5' : '#EFF6FF',
                          color: method.type === 'recojo' ? '#047857' : '#1D4ED8'
                        }}>
                          {method.type === 'recojo' ? 'Recojo Local' : 'Despacho Delivery'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {method.price === 0 ? 'Gratis' : `S/. ${method.price.toFixed(2)}`}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{method.description}</td>
                      <td>
                        <div className="btn-action-pack">
                          <button 
                            className="btn-icon-action"
                            onClick={() => setShippingForm(method)}
                            title="Editar Método"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn-icon-action delete"
                            onClick={() => {
                              if(confirm(`¿Estás seguro que deseas eliminar "${method.name}"?`)) {
                                deleteShippingMethod(method.id);
                              }
                            }}
                            title="Eliminar Método"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '16px' }}>Configuración General del Comercio</h3>
            
            <form onSubmit={handleSettingsSave} className="settings-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre de la Tienda</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storeNameLocal}
                    onChange={(e) => setStoreNameLocal(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Eslogan / Mensaje Principal</label>
                  <input
                    type="text"
                    className="form-input"
                    value={taglineLocal}
                    onChange={(e) => setTaglineLocal(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Celular WhatsApp receptor de confirmaciones (+51)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={whatsappLocal}
                    onChange={(e) => setWhatsappLocal(e.target.value.replace(/\D/g, ''))}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Código QR Yape enviará los datos a este WhatsApp (+51 {whatsappLocal})
                  </span>
                </div>

                <div className="form-group">
                  <label>Titular de la cuenta Yape (Nombre Completo)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={yapeOwnerLocal}
                    onChange={(e) => setYapeOwnerLocal(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--light-border)', paddingTop: '20px' }}>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Screenshot Zoom Modal */}
      {zoomImage && (
        <div className="modal-overlay active" style={{ zIndex: 500 }} onClick={() => setZoomImage(null)}>
          <div style={{ 
            backgroundColor: 'var(--light-surface)', 
            padding: '16px', 
            borderRadius: '16px', 
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90vh'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              className="icon-btn" 
              onClick={() => setZoomImage(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.8)' }}
            >
              <X size={20} />
            </button>
            <img 
              src={zoomImage} 
              alt="Zoomed receipt" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh', 
                objectFit: 'contain', 
                borderRadius: '8px',
                marginTop: '15px'
              }} 
            />
            <div style={{ textAlign: 'center', marginTop: '10px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
              Captura de Pago Yape
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
