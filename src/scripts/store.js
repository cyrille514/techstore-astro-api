// src/scripts/store.js
import { apiService } from './api.js';

// Fonction Toast globale
function showToast(message) {
  let container = document.getElementById('toast-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 transition-all duration-300 opacity-0 translate-y-2 pointer-events-auto';
  toast.innerHTML = `
    <svg class="w-5 h-5 text-green-400 flex-shrink-0 fill-current" viewBox="0 0 20 20">
      <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"/>
    </svg>
    <span class="text-sm font-medium">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

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
    const product = this.products.find(p => String(p.id) === String(productId));
    if (!product || product.stock <= 0) {
      showToast('Stock épuisé pour ce produit.');
      return;
    }

    const existingItem = this.cart.find(item => String(item.id) === String(productId));
    const productName = product.nombre || product.name || 'Produit';

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
        showToast(`Ajouté encore un(e) ${productName} au panier`);
      } else {
        showToast('Limite de stock atteinte !');
        return;
      }
    } else {
      this.cart.push({ ...product, quantity: 1 });
      showToast(`¡${productName} ajouté au panier!`);
    }
    this.notify();
  }

  increaseQuantity(productId) {
    const item = this.cart.find(i => String(i.id) === String(productId));
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId) {
    const item = this.cart.find(i => String(i.id) === String(productId));
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(i => String(i.id) === String(productId));
    const product = this.products.find(p => String(p.id) === String(productId));

    if (quantity <= 0) {
      const removedName = item ? (item.nombre || item.name || 'Produit') : 'Produit';
      this.cart = this.cart.filter(i => String(i.id) !== String(productId));
      showToast(`${removedName} retiré du panier`);
    } else if (item && product) {
      if (quantity <= product.stock) {
        item.quantity = quantity;
      } else {
        showToast('Limite de stock atteinte !');
        return;
      }
    }
    this.notify();
  }

  clearCart() {
    if (this.cart.length > 0) {
      this.cart = [];
      showToast('Panier vidé');
      this.notify();
    }
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + ((item.precio || item.price || 0) * item.quantity), 0);
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  async addProduct(productData) {
    try {
      const created = await apiService.createProduct(productData);
      const newProduct = {
        id: String(created.id || Date.now()),
        ...productData
      };
      this.products.unshift(newProduct);
      showToast('Nouveau produit ajouté !');
      this.notify();
    } catch (error) {
      showToast("Impossible de créer le produit via l'API.");
    }
  }

  async deleteProduct(productId) {
    try {
      await apiService.deleteProduct(productId);
      this.products = this.products.filter(p => String(p.id) !== String(productId));
      this.cart = this.cart.filter(item => String(item.id) !== String(productId));
      showToast('Produit supprimé !');
      this.notify();
    } catch (error) {
      showToast("Erreur de suppression sur le serveur.");
    }
  }
}

export const store = new Store();
// Exposition globale pour simplifier l'accès depuis le HTML/onClick
window.store = store;