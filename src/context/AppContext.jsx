import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const defaultProducts = [
  // --- Category: Over-Ear (6 products) ---
  {
    id: 1,
    name: "CyS Neon Wireless Pro",
    description: "Auriculares over-ear inalámbricos con cancelación de ruido inteligente y sonido Pure Bass de alta resolución. Diadema acolchada y copas giratorias con luces de estado.",
    price: 399,
    category: "Over-Ear",
    color: "Negro",
    features: ["Cancelación de Ruido", "True Wireless", "Batería 50h+"],
    image: "/cys_neon_wireless.png",
    stock: 15,
    isNew: true
  },
  {
    id: 2,
    name: "CyS Studio Monitor Pro",
    description: "Auriculares de monitoreo profesional para estudio y mezcla. Sonido plano de referencia, diadema de metal ajustable y copas acolchadas de alta comodidad.",
    price: 450,
    category: "Over-Ear",
    color: "Negro",
    features: ["Cable Desmontable", "Sonido Plano", "Garantía 12m"],
    image: "/cys_neon_wireless.png",
    stock: 8,
    isNew: false
  },
  {
    id: 3,
    name: "CyS Pure Bass White Edition",
    description: "Auriculares over-ear bluetooth color blanco puro con bajos potentes y copas de cuero sintético acolchado con memoria para máxima comodidad durante horas.",
    price: 349,
    category: "Over-Ear",
    color: "Blanco",
    features: ["True Wireless", "Pure Bass", "Batería 40h"],
    image: "/cys_neon_wireless.png",
    stock: 12,
    isNew: true
  },
  {
    id: 4,
    name: "CyS Hifi Elite Gold",
    description: "La cumbre del audio inalámbrico. Cancelación activa de ruido híbrida de nivel audiófilo y sonido 3D envolvente con detalles dorados.",
    price: 599,
    category: "Over-Ear",
    color: "Negro",
    features: ["Sonido 3D", "Cancelación de Ruido", "Garantía 12m"],
    image: "/cys_neon_wireless.png",
    stock: 5,
    isNew: true
  },
  {
    id: 5,
    name: "CyS Solo Beats Red",
    description: "Auriculares dinámicos urbanos con bajos profundos. Ideales para el uso diario con conectividad rápida y diseño plegable.",
    price: 289,
    category: "Over-Ear",
    color: "Rojo",
    features: ["Pure Bass", "Batería 40h", "True Wireless"],
    image: "/cys_neon_wireless.png",
    stock: 10,
    isNew: false
  },
  {
    id: 6,
    name: "CyS ANC Comfort Blue",
    description: "Reducción activa de ruido premium y cojines de espuma ultra suaves. Perfecto para viajes largos y entornos de oficina.",
    price: 329,
    category: "Over-Ear",
    color: "Azul",
    features: ["Cancelación de Ruido", "Batería 50h+", "Garantía 12m"],
    image: "/cys_neon_wireless.png",
    stock: 14,
    isNew: false
  },

  // --- Category: In-Ear (6 products) ---
  {
    id: 7,
    name: "CyS Sonic Buds",
    description: "Auriculares in-ear Bluetooth ultra compactos con estuche de carga inteligente. Aislamiento de ruido pasivo y agudos ultra claros con graves profundos.",
    price: 199,
    category: "In-Ear",
    color: "Plateado",
    features: ["True Wireless", "Estuche de Carga", "Control Táctil"],
    image: "/cys_sonic_buds.png",
    stock: 25,
    isNew: false
  },
  {
    id: 8,
    name: "CyS Active Earbuds Sport",
    description: "Auriculares in-ear deportivos con ganchos de sujeción ergonómicos. Totalmente resistentes al sudor IPX7 y estuche con indicador digital de carga.",
    price: 179,
    category: "In-Ear",
    color: "Verde",
    features: ["Resistente al Agua", "Ganchos Deportivos", "Batería 24h"],
    image: "/cys_sonic_buds.png",
    stock: 20,
    isNew: false
  },
  {
    id: 9,
    name: "CyS Mini Pods White",
    description: "Auriculares ultra ligeros color blanco puro. Emparejamiento instantáneo y controles táctiles de un solo toque para música y llamadas.",
    price: 149,
    category: "In-Ear",
    color: "Blanco",
    features: ["True Wireless", "Control Táctil", "Estuche de Carga"],
    image: "/cys_sonic_buds.png",
    stock: 30,
    isNew: true
  },
  {
    id: 10,
    name: "CyS Pro Buds ANC",
    description: "Earbuds con cancelación activa de ruido y modo de transparencia. Altavoces dinámicos para una nitidez sonora inigualable.",
    price: 299,
    category: "In-Ear",
    color: "Negro",
    features: ["Cancelación de Ruido", "True Wireless", "Control Táctil"],
    image: "/cys_sonic_buds.png",
    stock: 15,
    isNew: true
  },
  {
    id: 11,
    name: "CyS Carbon Earbuds",
    description: "Diseño elegante con textura estilo fibra de carbono. Altamente resistentes al agua y sudor, ideales para entrenamientos.",
    price: 229,
    category: "In-Ear",
    color: "Negro",
    features: ["True Wireless", "Estuche de Carga", "Resistente al Agua"],
    image: "/cys_sonic_buds.png",
    stock: 18,
    isNew: false
  },
  {
    id: 12,
    name: "CyS Aura Pink Buds",
    description: "Auriculares in-ear ligeros de ajuste seguro. Estilo moderno, sonido equilibrado y duración de batería extendida para todo el día.",
    price: 159,
    category: "In-Ear",
    color: "Blanco",
    features: ["True Wireless", "Control Táctil", "Batería 24h"],
    image: "/cys_sonic_buds.png",
    stock: 22,
    isNew: false
  },

  // --- Category: Gaming (6 products) ---
  {
    id: 13,
    name: "CyS Gamer Pro RGB",
    description: "Auriculares gamer de alto rendimiento con micrófono boom desmontable con cancelación de ruido. Sonido envolvente 7.1 para escuchar cada detalle de la partida.",
    price: 299,
    category: "Gaming",
    color: "Negro",
    features: ["Gaming Headset", "Micrófono Desmontable", "Sonido 3D"],
    image: "/cys_gamer_pro.png",
    stock: 10,
    isNew: true
  },
  {
    id: 14,
    name: "CyS Alpha Gaming Wireless",
    description: "Libertad inalámbrica para jugadores exigentes. Audio de latencia cero, almohadillas de tela transpirable y sonido envolvente cinematográfico.",
    price: 379,
    category: "Gaming",
    color: "Negro",
    features: ["Gaming Headset", "True Wireless", "Sonido 3D"],
    image: "/cys_gamer_pro.png",
    stock: 8,
    isNew: true
  },
  {
    id: 15,
    name: "CyS Arena RGB Stereo",
    description: "Estilo gaming clásico con espectro completo de iluminación RGB en las copas. Cable trenzado de alta resistencia y micrófono flexible.",
    price: 189,
    category: "Gaming",
    color: "Negro",
    features: ["Gaming Headset", "Micrófono Desmontable", "Sonido 3D"],
    image: "/cys_gamer_pro.png",
    stock: 15,
    isNew: false
  },
  {
    id: 16,
    name: "CyS Titan Gamer Headset",
    description: "Diadema reforzada en acero y copas acolchadas sobredimensionadas. Parlantes de 50mm que entregan bajos explosivos para máxima inmersión.",
    price: 249,
    category: "Gaming",
    color: "Negro",
    features: ["Gaming Headset", "Micrófono Desmontable", "Pure Bass"],
    image: "/cys_gamer_pro.png",
    stock: 12,
    isNew: false
  },
  {
    id: 17,
    name: "CyS Rogue Red Gaming",
    description: "Detalles en rojo agresivo y micrófono omnidireccional. Construcción ergonómica y sonido de alta fidelidad optimizado para eSports.",
    price: 219,
    category: "Gaming",
    color: "Rojo",
    features: ["Gaming Headset", "Micrófono Desmontable", "Sonido 3D"],
    image: "/cys_gamer_pro.png",
    stock: 14,
    isNew: false
  },
  {
    id: 18,
    name: "CyS Blizzard Gaming White",
    description: "Elegancia en color blanco ártico con iluminación azul helado. Audio premium inalámbrico y cancelación pasiva de ruido exterior.",
    price: 319,
    category: "Gaming",
    color: "Blanco",
    features: ["Gaming Headset", "True Wireless", "Sonido 3D"],
    image: "/cys_gamer_pro.png",
    stock: 7,
    isNew: true
  },

  // --- Category: Open-Ear (6 products) ---
  {
    id: 19,
    name: "CyS Sport Run",
    description: "Auriculares deportivos ligeros de conducción ósea. Permiten escuchar el entorno mientras entrenas. Totalmente resistentes al sudor y lluvia leve.",
    price: 249,
    category: "Open-Ear",
    color: "Verde",
    features: ["Open-Ear", "Resistente al Agua", "Batería 10h"],
    image: "/cys_sport_run.png",
    stock: 18,
    isNew: false
  },
  {
    id: 20,
    name: "CyS Aero Flow Bone",
    description: "Diseño ergonómico de titanio para conducción ósea. Sonido premium sin tapar los oídos, ideal para ciclistas y corredores urbanos.",
    price: 320,
    category: "Open-Ear",
    color: "Negro",
    features: ["Open-Ear", "Resistente al Agua", "Batería 10h"],
    image: "/cys_sport_run.png",
    stock: 10,
    isNew: true
  },
  {
    id: 21,
    name: "CyS Fit Run Sport",
    description: "Auriculares abiertos con enganche seguro de silicona suave. No ejercen presión en el canal auditivo y resisten chorros de agua IPX6.",
    price: 269,
    category: "Open-Ear",
    color: "Azul",
    features: ["Open-Ear", "Resistente al Agua", "Batería 24h"],
    image: "/cys_sport_run.png",
    stock: 11,
    isNew: false
  },
  {
    id: 22,
    name: "CyS Trek Bone Conduction",
    description: "Estructura flexible de titanio súper liviana. Batería de carga rápida y sonido dinámico a prueba de sudor para maratones.",
    price: 299,
    category: "Open-Ear",
    color: "Negro",
    features: ["Open-Ear", "Resistente al Agua", "Batería 10h"],
    image: "/cys_sport_run.png",
    stock: 15,
    isNew: false
  },
  {
    id: 23,
    name: "CyS Hydro Bone Pro",
    description: "Audífonos de conducción ósea premium 100% sumergibles IPX8. Cuentan con almacenamiento MP3 integrado para nadar sin celular.",
    price: 350,
    category: "Open-Ear",
    color: "Blanco",
    features: ["Open-Ear", "Resistente al Agua", "Batería 24h"],
    image: "/cys_sport_run.png",
    stock: 9,
    isNew: true
  },
  {
    id: 24,
    name: "CyS Lite Run Open",
    description: "La alternativa abierta más económica. Cómodos, ligeros, con botones de control integrados y gran claridad en llamadas.",
    price: 189,
    category: "Open-Ear",
    color: "Verde",
    features: ["Open-Ear", "Batería 10h", "Control Táctil"],
    image: "/cys_sport_run.png",
    stock: 20,
    isNew: false
  }
];

const defaultShippingMethods = [
  {
    id: 1,
    name: "Recojo en Tienda (CyS Surco)",
    description: "Recoge tu pedido gratis en nuestro local de Santiago de Surco. Listo en 4 horas.",
    price: 0,
    type: "recojo"
  },
  {
    id: 2,
    name: "Envío Regular (Lima Metropolitana)",
    description: "Entrega a domicilio en un plazo de 24 a 48 horas.",
    price: 15,
    type: "delivery"
  },
  {
    id: 3,
    name: "Envío Express Premium",
    description: "Entrega prioritaria el mismo día para compras realizadas antes de la 1:00 PM.",
    price: 30,
    type: "delivery"
  }
];

const defaultSettings = {
  whatsappNumber: "924278597",
  yapeQr: "/yape_qr.png",
  yapeOwner: "Christian Wilber Atamari Hancco",
  bannerImage: "/cys_banner.png",
  storeName: "CyS solutions",
  tagline: "Descubre el Sonido del Futuro"
};

export const AppProvider = ({ children }) => {
  // Load initial data from localStorage or fallback to defaults
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('cys_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [shippingMethods, setShippingMethods] = useState(() => {
    const saved = localStorage.getItem('cys_shipping_methods');
    return saved ? JSON.parse(saved) : defaultShippingMethods;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cys_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cys_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cys_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminMode, setIsAdminMode] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = sessionStorage.getItem('cys_admin_auth');
    return saved === 'true';
  });

  // Custom Toast Notification State
  const [toasts, setToasts] = useState([]);

  // Sync state with localStorage on changes
  useEffect(() => {
    localStorage.setItem('cys_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cys_shipping_methods', JSON.stringify(shippingMethods));
  }, [shippingMethods]);

  useEffect(() => {
    localStorage.setItem('cys_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cys_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cys_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast Function
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Auth Functions
  const login = (username, password) => {
    if (username === 'admin' && password === 'cysadmin2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('cys_admin_auth', 'true');
      showToast('Sesión de administrador iniciada correctamente.', 'success');
      return true;
    }
    showToast('Credenciales incorrectas.', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cys_admin_auth');
    setIsAdminMode(false);
    showToast('Sesión cerrada.', 'info');
  };

  // Cart Functions
  const addToCart = (product) => {
    const existingItem = cart.find((item) => Number(item.id) === Number(product.id));
    if (existingItem) {
      showToast(`Cantidad de "${product.name}" incrementada en el carrito.`, 'success');
      setCart((prevCart) =>
        prevCart.map((item) =>
          Number(item.id) === Number(product.id) ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      showToast(`"${product.name}" agregado al carrito.`, 'success');
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const item = cart.find(i => Number(i.id) === Number(productId));
    if (item) {
      showToast(`"${item.name}" eliminado del carrito.`, 'info');
    }
    setCart((prevCart) => prevCart.filter((item) => Number(item.id) !== Number(productId)));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        Number(item.id) === Number(productId) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Product CRUD
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map(p => Number(p.id))) + 1 : 1,
      stock: parseInt(product.stock) || 10,
      price: parseFloat(product.price) || 0
    };
    setProducts([...products, newProduct]);
    showToast(`Producto "${product.name}" agregado al catálogo.`, 'success');
  };

  const updateProduct = (updatedProduct) => {
    setProducts(
      products.map((p) => (Number(p.id) === Number(updatedProduct.id) ? updatedProduct : p))
    );
    showToast(`Producto "${updatedProduct.name}" actualizado.`, 'success');
  };

  const deleteProduct = (id) => {
    const product = products.find(p => Number(p.id) === Number(id));
    setProducts(products.filter((p) => Number(p.id) !== Number(id)));
    showToast(`Producto "${product?.name}" eliminado del catálogo.`, 'warning');
  };

  // Shipping Methods CRUD
  const addShippingMethod = (method) => {
    const newMethod = {
      ...method,
      id: shippingMethods.length > 0 ? Math.max(...shippingMethods.map(m => Number(m.id))) + 1 : 1,
      price: parseFloat(method.price) || 0
    };
    setShippingMethods([...shippingMethods, newMethod]);
    showToast(`Método de envío "${method.name}" agregado.`, 'success');
  };

  const updateShippingMethod = (updatedMethod) => {
    setShippingMethods(
      shippingMethods.map((m) => (Number(m.id) === Number(updatedMethod.id) ? updatedMethod : m))
    );
    showToast(`Método de envío "${updatedMethod.name}" actualizado.`, 'success');
  };

  const deleteShippingMethod = (id) => {
    const method = shippingMethods.find(m => Number(m.id) === Number(id));
    setShippingMethods(shippingMethods.filter((m) => Number(m.id) !== Number(id)));
    showToast(`Método de envío "${method?.name}" eliminado.`, 'warning');
  };

  // Settings Update
  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
    showToast('Configuraciones generales guardadas.', 'success');
  };

  // Order CRUD
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: orderData.orderId,
      date: new Date().toLocaleString('es-PE'),
      status: 'Pendiente de WhatsApp'
    };
    setOrders([newOrder, ...orders]);
    showToast(`Pedido #${newOrder.id} registrado con éxito.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Estado del pedido #${orderId} cambiado a "${status}".`, 'success');
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
    showToast(`Pedido #${id} eliminado del registro.`, 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        shippingMethods,
        settings,
        orders,
        cart,
        isAdminMode,
        setIsAdminMode,
        isAuthenticated,
        login,
        logout,
        toasts,
        showToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
        addShippingMethod,
        updateShippingMethod,
        deleteShippingMethod,
        updateSettings,
        addOrder,
        updateOrderStatus,
        deleteOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
