/**
 * DB_Store - Capa de abstracción sobre localStorage
 * Proporciona un conjunto de métodos para gestionar datos relacionales estructurados
 * con auto-inicialización y seeding de datos.
 */

class DB_Store {
  constructor() {
    this.prefix = 'ecommerce_erp_';
    this.init();
  }

  // Inicializa la base de datos con semillas si está vacía
  init() {
    if (!localStorage.getItem(this.prefix + 'initialized')) {
      this.seedData();
      localStorage.setItem(this.prefix + 'initialized', 'true');
    }
  }

  // Seed Data: Productos, categorías, clientes, órdenes
  seedData() {
    const categories = [
      { id: 'cat-1', name: 'Electrónica', slug: 'electronica', description: 'Dispositivos y gadgets' },
      { id: 'cat-2', name: 'Ropa', slug: 'ropa', description: 'Moda masculina y femenina' },
      { id: 'cat-3', name: 'Hogar', slug: 'hogar', description: 'Artículos para el hogar y decoración' }
    ];

    const products = [
      {
        id: 'prod-1',
        name: 'Smartphone Pro Max X',
        description: 'Teléfono inteligente de última generación con pantalla OLED de 6.7 pulgadas, cámara de 108MP y batería de 5000mAh.',
        price: 999.99,
        cost: 650.00,
        categoryId: 'cat-1',
        stock: 45,
        images: ['img/smartphone-1.jpg', 'img/smartphone-2.jpg'],
        variants: [{ type: 'color', value: 'Negro' }, { type: 'color', value: 'Plata' }, { type: 'capacidad', value: '256GB' }, { type: 'capacidad', value: '512GB' }],
        status: 'active',
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-2',
        name: 'Auriculares Inalámbricos Noise-Cancelling',
        description: 'Auriculares circumaurales con cancelación activa de ruido, hasta 30 horas de autonomía y sonido de alta fidelidad.',
        price: 249.99,
        cost: 120.00,
        categoryId: 'cat-1',
        stock: 12, // Stock bajo para dashboard
        images: ['img/headphones.jpg'],
        variants: [{ type: 'color', value: 'Negro' }, { type: 'color', value: 'Blanco' }],
        status: 'active',
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-3',
        name: 'Camiseta de Algodón Orgánico',
        description: 'Camiseta básica de manga corta, 100% algodón orgánico, suave al tacto y transpirable.',
        price: 29.99,
        cost: 8.50,
        categoryId: 'cat-2',
        stock: 150,
        images: ['img/tshirt.jpg'],
        variants: [{ type: 'talla', value: 'S' }, { type: 'talla', value: 'M' }, { type: 'talla', value: 'L' }, { type: 'talla', value: 'XL' }],
        status: 'active',
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-4',
        name: 'Sofá Modular Minimalista',
        description: 'Sofá de tres plazas con diseño contemporáneo, tapizado en tela antimanchas y estructura de madera maciza.',
        price: 799.00,
        cost: 350.00,
        categoryId: 'cat-3',
        stock: 0, // Agotado
        images: ['img/sofa.jpg'],
        variants: [{ type: 'color', value: 'Gris Claro' }, { type: 'color', value: 'Azul Marino' }],
        status: 'out-of-stock',
        featured: true,
        createdAt: new Date().toISOString()
      }
    ];

    const customers = [
      {
        id: 'cust-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34 600 123 456',
        address: { street: 'Calle Falsa 123', city: 'Madrid', zipCode: '28080', country: 'España' },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cust-2',
        firstName: 'María',
        lastName: 'Gómez',
        email: 'maria.gomez@example.com',
        phone: '+34 600 987 654',
        address: { street: 'Avenida de la Constitución 45', city: 'Barcelona', zipCode: '08001', country: 'España' },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const orders = [
      {
        id: 'ord-1001',
        customerId: 'cust-1',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Enviado',
        items: [
          { productId: 'prod-1', name: 'Smartphone Pro Max X', price: 999.99, quantity: 1, variant: 'Negro, 256GB' },
          { productId: 'prod-3', name: 'Camiseta de Algodón Orgánico', price: 29.99, quantity: 2, variant: 'L' }
        ],
        subtotal: 1059.97,
        tax: 222.59,
        shipping: 0,
        total: 1282.56,
        paymentMethod: 'Tarjeta de Crédito',
        shippingAddress: { street: 'Calle Falsa 123', city: 'Madrid', zipCode: '28080', country: 'España' }
      },
      {
        id: 'ord-1002',
        customerId: 'cust-2',
        date: new Date().toISOString(),
        status: 'Pendiente',
        items: [
          { productId: 'prod-2', name: 'Auriculares Inalámbricos Noise-Cancelling', price: 249.99, quantity: 1, variant: 'Blanco' }
        ],
        subtotal: 249.99,
        tax: 52.50,
        shipping: 9.99,
        total: 312.48,
        paymentMethod: 'PayPal',
        shippingAddress: { street: 'Avenida de la Constitución 45', city: 'Barcelona', zipCode: '08001', country: 'España' }
      }
    ];

    this.setAll('categories', categories);
    this.setAll('products', products);
    this.setAll('customers', customers);
    this.setAll('orders', orders);
    this.setAll('cart', []);
  }

  // Métodos CORE
  _getKey(collection) {
    return this.prefix + collection;
  }

  getAll(collection) {
    const data = localStorage.getItem(this._getKey(collection));
    return data ? JSON.parse(data) : [];
  }

  setAll(collection, data) {
    localStorage.setItem(this._getKey(collection), JSON.stringify(data));
  }

  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id) || null;
  }

  insert(collection, item) {
    const items = this.getAll(collection);
    const newItem = {
      ...item,
      id: item.id || this.generateId(collection),
      createdAt: item.createdAt || new Date().toISOString()
    };
    items.push(newItem);
    this.setAll(collection, items);
    return newItem;
  }

  update(collection, id, updates) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
      this.setAll(collection, items);
      return items[index];
    }
    return null;
  }

  delete(collection, id) {
    const items = this.getAll(collection);
    const filtered = items.filter(item => item.id !== id);
    this.setAll(collection, filtered);
    return filtered.length !== items.length;
  }

  generateId(collection) {
    const prefixMap = {
      products: 'prod',
      categories: 'cat',
      customers: 'cust',
      orders: 'ord'
    };
    const prefix = prefixMap[collection] || 'item';
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
  }

  // Métodos Específicos de Negocio
  getCart() {
    return this.getAll('cart');
  }

  addToCart(item) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(cartItem => cartItem.productId === item.productId && cartItem.variant === item.variant);
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += item.quantity || 1;
    } else {
      cart.push({ ...item, quantity: item.quantity || 1, cartId: this.generateId('cart') });
    }
    
    this.setAll('cart', cart);
  }

  removeFromCart(cartId) {
    const cart = this.getCart();
    this.setAll('cart', cart.filter(item => item.cartId !== cartId));
  }
  
  clearCart() {
    this.setAll('cart', []);
  }

  getMetrics() {
    const orders = this.getAll('orders');
    const products = this.getAll('products');
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'Cancelado' ? order.total : 0), 0);
    const validOrdersCount = orders.filter(o => o.status !== 'Cancelado').length;
    const averageTicket = validOrdersCount > 0 ? totalRevenue / validOrdersCount : 0;
    const lowStockCount = products.filter(p => p.stock < 15 && p.stock > 0).length;
    
    return {
      totalRevenue,
      averageTicket,
      ordersCount: orders.length,
      lowStockCount
    };
  }
}

// Inicializamos e instanciamos globalmente
const db = new DB_Store();
window.db = db;
