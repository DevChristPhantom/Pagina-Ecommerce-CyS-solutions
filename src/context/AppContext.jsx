import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const defaultProducts = [
  // --- Category: Casas (6 products) ---
  {
    id: 1,
    name: "Rascador Castillo Real",
    description: "Rascador de 3 niveles con castillo superior, cueva acogedera acolchada y postes de soga sisal natural para que tu gato rasque y descanse plácidamente.",
    price: 249,
    category: "Casas",
    color: "Gris",
    features: ["Multinivel", "Postes Sisal", "Cueva Acolchada"],
    image: "/cat_house.png",
    stock: 8,
    isNew: true
  },
  {
    id: 2,
    name: "Casa Cubo Nórdica",
    description: "Casa minimalista de madera con cojín desmontable ultra suave y lavable. Su diseño moderno y sobrio combina perfectamente con cualquier sala.",
    price: 120,
    category: "Casas",
    color: "Beige",
    features: ["Madera Real", "Cojín Desmontable", "Lavable"],
    image: "/cat_house.png",
    stock: 12,
    isNew: false
  },
  {
    id: 3,
    name: "Cueva Térmica Cozy",
    description: "Cueva térmica de fieltro plegable. Mantiene a tu gatito abrigado en invierno gracias a su diseño cerrado retentor de calor corporal.",
    price: 89,
    category: "Casas",
    color: "Gris",
    features: ["Térmica", "Plegable", "Fácil Limpieza"],
    image: "/cat_house.png",
    stock: 15,
    isNew: true
  },
  {
    id: 4,
    name: "Hamaca Ventana Premium",
    description: "Hamaca flotante para instalar en ventanas. Cuenta con ventosas de grado industrial que soportan hasta 15 kg para que tu gato tome sol con seguridad.",
    price: 75,
    category: "Casas",
    color: "Azul",
    features: ["Soporta 15kg", "Ventosas Industriales", "Ahorra Espacio"],
    image: "/cat_house.png",
    stock: 10,
    isNew: false
  },
  {
    id: 5,
    name: "Tipi Cat Aventurero",
    description: "Tienda estilo tipi de lona de algodón con base súper acolchada. El refugio de descanso perfecto y privado para tu felino.",
    price: 95,
    category: "Casas",
    color: "Crema",
    features: ["Lona Algodón", "Base Acolchada", "Diseño Lindo"],
    image: "/cat_house.png",
    stock: 6,
    isNew: true
  },
  {
    id: 6,
    name: "Condominio Cat Dúplex",
    description: "Torre rascador de lujo de dos niveles con plataformas elevadas, túnel de juego colgante y rascadores laterales para múltiples gatos.",
    price: 349,
    category: "Casas",
    color: "Marrón",
    features: ["Dúplex", "Rascadores Sisal", "Para Varios Gatos"],
    image: "/cat_house.png",
    stock: 4,
    isNew: false
  },

  // --- Category: Accesorios (6 products) ---
  {
    id: 7,
    name: "Collar Reflectivo Ajustable",
    description: "Collar reflectivo con broche de seguridad antiahogo (se abre al recibir presión) y cascabel incorporado para paseos seguros.",
    price: 15,
    category: "Accesorios",
    color: "Rojo",
    features: ["Broche Antiahogo", "Reflectivo", "Cascabel Removible"],
    image: "/cys_cat_winking.png",
    stock: 50,
    isNew: false
  },
  {
    id: 8,
    name: "Suéter de Lana Gatuno",
    description: "Suéter de lana abrigador tejido a mano. Protege a tu gato del frío con un estilo adorable y gran libertad de movimiento.",
    price: 35,
    category: "Accesorios",
    color: "Amarillo",
    features: ["Tejido a Mano", "Súper Suave", "Para Invierno"],
    image: "/cys_cat_winking.png",
    stock: 20,
    isNew: true
  },
  {
    id: 9,
    name: "Pajarita Elegant Cat",
    description: "Corbatín pajarita elegante ajustable con broche de liberación rápida para que tu gato sea el centro de atención en eventos.",
    price: 18,
    category: "Accesorios",
    color: "Negro",
    features: ["Ajustable", "Estilo Pajarita", "Liberación Rápida"],
    image: "/cys_cat_winking.png",
    stock: 30,
    isNew: false
  },
  {
    id: 10,
    name: "Abrigo Térmico Impermeable",
    description: "Abrigo acolchado impermeable con forro polar interior suave. Ideal para paseos en días de llovizna o invierno húmedo.",
    price: 45,
    category: "Accesorios",
    color: "Azul",
    features: ["Impermeable", "Forro Polar", "Cierre Velcro"],
    image: "/cys_cat_winking.png",
    stock: 15,
    isNew: true
  },
  {
    id: 11,
    name: "Pañuelo Cat Bandana",
    description: "Bandana ajustable de algodón con divertidos diseños de huellas. Lavable y sumamente transpirable para uso diario sin incomodar.",
    price: 22,
    category: "Accesorios",
    color: "Naranja",
    features: ["100% Algodón", "Diseño Divertido", "Lavable"],
    image: "/cys_cat_winking.png",
    stock: 25,
    isNew: false
  },
  {
    id: 12,
    name: "Arnés y Correa de Paseo",
    description: "Arnés tipo pechera ergonómico acolchado con correa de 1.5 metros. Seguro y cómodo, evita tirones perjudiciales en el cuello.",
    price: 40,
    category: "Accesorios",
    color: "Negro",
    features: ["Ergonómico", "Correa 1.5m", "Anti-Escapes"],
    image: "/cys_cat_winking.png",
    stock: 18,
    isNew: false
  },

  // --- Category: Juguetes (6 products) ---
  {
    id: 13,
    name: "Puntero Láser USB Recargable",
    description: "Puntero láser recargable USB con 5 patrones diferentes de proyección (punto, ratón, etc.) para ejercitar a tu gato cazador.",
    price: 25,
    category: "Juguetes",
    color: "Plateado",
    features: ["USB Recargable", "5 Patrones Luz", "Estimula Caza"],
    image: "/cat_house.png",
    stock: 40,
    isNew: true
  },
  {
    id: 14,
    name: "Caña de Plumas Flexible",
    description: "Caña de pescar flexible con plumas naturales esponjosas y cascabel. Incluye ventosa para adherirse al piso si juegas solo.",
    price: 18,
    category: "Juguetes",
    color: "Multicolor",
    features: ["Flexible", "Plumas Naturales", "Cascabel Atractor"],
    image: "/cat_house.png",
    stock: 35,
    isNew: false
  },
  {
    id: 15,
    name: "Pelotas de Catnip Orgánico",
    description: "Set de 3 pelotas de hierba gatera (catnip) orgánica prensada. Promueve la actividad física y ayuda a limpiar el sarro dental.",
    price: 20,
    category: "Juguetes",
    color: "Verde",
    features: ["Catnip Orgánico", "Limpieza Dental", "Set de 3"],
    image: "/cat_house.png",
    stock: 30,
    isNew: false
  },
  {
    id: 16,
    name: "Juguete Giratorio Interactivo",
    description: "Circuito rotatorio de pelotas y pluma saltarina central que se activa con el toque de patitas. Ideal para diversión autónoma.",
    price: 49,
    category: "Juguetes",
    color: "Blanco",
    features: ["Rotación 360", "Automático", "Estimulación Mental"],
    image: "/cat_house.png",
    stock: 12,
    isNew: true
  },
  {
    id: 17,
    name: "Túnel Plegable de 3 Vías",
    description: "Túnel amplio de tres accesos con ventana superior y juguetitos colgantes. Se pliega en segundos para guardar de forma compacta.",
    price: 55,
    category: "Juguetes",
    color: "Negro",
    features: ["3 Accesos", "Plegable", "Juguetes Colgantes"],
    image: "/cat_house.png",
    stock: 15,
    isNew: false
  },
  {
    id: 18,
    name: "Pescado Danzante USB",
    description: "Pescado de felpa que salta y se mueve al tacto. Sensor de movimiento recargable con USB y bolsita interna para colocar catnip.",
    price: 39,
    category: "Juguetes",
    color: "Azul",
    features: ["Sensor de Movimiento", "USB Recargable", "Catnip Incluido"],
    image: "/cat_house.png",
    stock: 20,
    isNew: true
  },

  // --- Category: Combos (4 products) ---
  {
    id: 19,
    name: "Combo Bienvenida CatLover",
    description: "El kit de inicio perfecto. Incluye rascador básico, juguete caña con pluma, comedero doble de acero inoxidable y un snack premium.",
    price: 149,
    category: "Combos",
    color: "Celeste",
    features: ["Kit Inicial", "Ahorro 20%", "Para Cachorros"],
    image: "/cat_house.png",
    stock: 10,
    isNew: true
  },
  {
    id: 20,
    name: "Caja Sorpresa CatBox Mensual",
    description: "Nuestra caja mensual por suscripción. Contiene 2 juguetes exclusivos, 3 variedades de snacks gourmet y un accesorio sorpresa.",
    price: 99,
    category: "Combos",
    color: "Marrón",
    features: ["Sorpresa Mensual", "Snacks Importados", "Juguetes Nuevos"],
    image: "/cat_house.png",
    stock: 15,
    isNew: true
  },
  {
    id: 21,
    name: "Combo Arenero & Higiene",
    description: "Arenero cerrado anti-olores con filtro de carbón activo, pala cernidora, tapete recolector de arena y bolsa de arena biodegradable de 5kg.",
    price: 180,
    category: "Combos",
    color: "Gris",
    features: ["Anti-Olores", "Pala Incluida", "Arena Biodegradable"],
    image: "/cat_house.png",
    stock: 8,
    isNew: false
  },
  {
    id: 22,
    name: "Combo Nutrición Gourmet",
    description: "Pack alimenticio con 12 latas de comida húmeda de salmón y pollo, paquete de snacks secos de atún y un comedero doble de cerámica.",
    price: 110,
    category: "Combos",
    color: "Blanco",
    features: ["Comida Húmeda", "Cerámica Doble", "Ingredientes Naturales"],
    image: "/cat_house.png",
    stock: 11,
    isNew: false
  },

  // --- Category: Apoyo Calle (2 products) ---
  {
    id: 23,
    name: "Caja Solidaria: Alimentación",
    description: "Donación de 3 kg de comida premium para gatos directamente a albergues de rescate asociados. Recibirás un certificado y reporte de entrega.",
    price: 30,
    category: "Apoyo Calle",
    color: "Verde",
    features: ["Donación Directa", "3kg Alimento", "Reporte de Entrega"],
    image: "/cys_cat_winking.png",
    stock: 100,
    isNew: true
  },
  {
    id: 24,
    name: "Caja Solidaria: Salud y Vacuna",
    description: "Financia el tratamiento de desparasitación y la primera dosis de vacuna triple felina de un gatito rescatado en el albergue. Recibe su foto.",
    price: 60,
    category: "Apoyo Calle",
    color: "Blanco",
    features: ["Tratamiento Médico", "Vacuna Triple", "Apadrinamiento Foto"],
    image: "/cys_cat_winking.png",
    stock: 100,
    isNew: true
  }
];

const defaultShippingMethods = [
  {
    id: 1,
    name: "Recojo en Oficina CyS Animals",
    description: "Recoge gratis tus artículos en nuestro local de mascotas en Santiago de Surco. Listo en 3 horas.",
    price: 0,
    type: "recojo"
  },
  {
    id: 2,
    name: "Envío Regular Delivery (Lima Metropolitana)",
    description: "Entrega a domicilio para tus productos en un plazo de 24 a 48 horas.",
    price: 15,
    type: "delivery"
  },
  {
    id: 3,
    name: "Envío Express a Provincias (Olva Courier / Shalom)",
    description: "Envío seguro de tus artículos a nivel nacional mediante agencia en un plazo de 3 a 5 días hábiles.",
    price: 25,
    type: "delivery"
  }
];

const defaultSettings = {
  whatsappNumber: "924278597",
  yapeQr: "/yape_qr.png",
  yapeOwner: "Christian Wilber Atamari Hancco",
  bannerImage: "/cys_cat_winking.png",
  storeName: "CyS solutions Animals",
  tagline: "El Paraíso de tu Compañero Felino"
};

export const AppProvider = ({ children }) => {
  // Load initial data from localStorage or fallback to defaults
  // Plus auto-cleaning logic for cache migrations
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('cys_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasOldCategory = parsed.some(p => p.category === 'Over-Ear' || p.name.toLowerCase().includes('neon') || p.name.toLowerCase().includes('buds'));
      if (hasOldCategory) {
        localStorage.setItem('cys_products', JSON.stringify(defaultProducts));
        return defaultProducts;
      }
      return parsed;
    }
    return defaultProducts;
  });

  const [shippingMethods, setShippingMethods] = useState(() => {
    const saved = localStorage.getItem('cys_shipping_methods');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasOldShipping = parsed.some(m => m.name.includes('Surco') || m.name.includes('Regular'));
      if (hasOldShipping) {
        localStorage.setItem('cys_shipping_methods', JSON.stringify(defaultShippingMethods));
        return defaultShippingMethods;
      }
      return parsed;
    }
    return defaultShippingMethods;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cys_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasOldSettings = parsed.storeName === 'CyS solutions' || parsed.tagline.includes('Sonido');
      if (hasOldSettings) {
        localStorage.setItem('cys_settings', JSON.stringify(defaultSettings));
        return defaultSettings;
      }
      return parsed;
    }
    return defaultSettings;
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
