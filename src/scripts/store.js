// src/scripts/store.js
import { apiService } from './api.js';

class Store {
  constructor() {
    this.products = [];
    this.cart = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }

  async init() {
    this.products = await apiService.getProducts();
    this.notify();
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const existingItem = this.cart.find(item => item.id === productId);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
      }
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.notify();
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.cart = this.cart.filter(item => item.id !== productId);
    } else {
      const item = this.cart.find(i => i.id === productId);
      const product = this.products.find(p => p.id === productId);
      if (item && product && quantity <= product.stock) {
        item.quantity = quantity;
      }
    }
    this.notify();
  }

  clearCart() {
    this.cart = [];
    this.notify();
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  async addProduct(productData) {
    try {
      const created = await apiService.createProduct(productData);
      const newProduct = {
        id: created.id || Date.now(),
        ...productData
      };
      this.products.unshift(newProduct);
      this.notify();
    } catch (error) {
      alert("Impossible de créer le produit via l'API.");
    }
  }

  async deleteProduct(productId) {
    try {
      await apiService.deleteProduct(productId);
      this.products = this.products.filter(p => p.id !== productId);
      this.cart = this.cart.filter(item => item.id !== productId);
      this.notify();
    } catch (error) {
      alert("Erreur de suppression sur le serveur.");
    }
  }
}

export const store = new Store();