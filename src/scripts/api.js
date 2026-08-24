// src/scripts/api.js

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// LISTE MANUELLE DE VOS PRODUITS
const MANUAL_PRODUCTS = [
  {
    name: 'laptop Pro',
    price: 450.99,
    stock: 5,
    category: 'Portátiles',
    image: '/images/laptop.jpg'
  },
  {
    name: 'ordenador Pro',
    price: 675.99,
    stock: 5,
    category: 'Portátiles',
    image: '/images/ordenador.avif'
  },
  {
    name: 'Ratón Inalámbrico Pro',
    price: 29.99,
    stock: 12,
    category: 'Periféricos',
    image: '/images/Raton.jpg'
  },
  {
    name: 'mousse Pro',
    price: 12.99,
    stock: 66,
    category: 'Periféricos',
    image: '/images/mousse.jpg'
  },
  {
    name: 'kit-completo Pro',
    price: 45.99,
    stock: 31,
    category: 'Periféricos',
    image: '/images/kit.jpg'
  },
  {
    name: 'Ecouchador Pro',
    price: 18.99,
    stock: 7,
    category: 'Periféricos',
    image: '/images/ecouchador.jpg'
  },
  {
    name: 'teclado pro',
    price: 29.99,
    stock: 12,
    category: 'Periféricos',
    image: '/images/teclado.avif'
  },
  {
    name: 'Pack Accesorios Complet',
    price: 49.50,
    stock: 8,
    category: 'Accesorios',
    image: '/images/complet.jpg'
  },
  {
    name: 'grande Frigo',
    price: 79.90,
    stock: 3,
    category: 'Accesorios',
    image: '/images/frigo.avif'
  },
  {
    name: 'Refrigerador Gaming',
    price: 35.00,
    stock: 10,
    category: 'Accesorios',
    image: '/images/refrigerateur.avif'
  },
  {
    name: 'Ventilador Silencioso 1',
    price: 22.99,
    stock: 12,
    category: 'Accesorios',
    image: '/images/ventilador1.jpg'
  },
  {
    name: 'Menage-complet',
    price: 94.99,
    stock: 2,
    category: 'Accesorios',
    image: '/images/menager.avif'
  },
  {
    name: 'Ventilador Turbo RGB',
    price: 24.99,
    stock: 6,
    category: 'Accesorios',
    image: '/images/ventilador.avif'
  }
];

export const apiService = {
  async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?_limit=${MANUAL_PRODUCTS.length}`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();

      return MANUAL_PRODUCTS.map((product, index) => ({
        id: String(data[index] ? data[index].id : index + 1),
        name: product.name,
        nombre: product.name,
        price: Number(product.price),
        precio: Number(product.price),
        stock: Number(product.stock),
        category: product.category,
        image: product.image,
        imagen: product.image
      }));
    } catch (error) {
      console.error('Erreur getProducts API:', error);
      return MANUAL_PRODUCTS.map((product, index) => ({
        id: String(index + 1),
        ...product,
        nombre: product.name,
        precio: Number(product.price),
        imagen: product.image
      }));
    }
  },

  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Erreur lors de la création du produit');
      return await response.json();
    } catch (error) {
      console.error('Erreur createProduct API:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      return true;
    } catch (error) {
      console.error('Erreur deleteProduct API:', error);
      throw error;
    }
  },

  async processPayment(paymentPayload) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload)
      });
      if (!response.ok) throw new Error('Échec du paiement');
      return { success: true, transactionId: `TX-${Date.now()}` };
    } catch (error) {
      console.error('Erreur processPayment API:', error);
      return { success: false, error: error.message };
    }
  }
};