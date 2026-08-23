// src/scripts/templates.js

/**
 * Génère le HTML d'une carte produit avec son image locale
 */
export function createProductCardHTML(product) {
  const isOutOfStock = product.stock === 0;
  const imageUrl = product.image || '/images/default.jpg';
  
  return `
    <div class="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div class="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
          <span class="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm z-10">
            ${product.category}
          </span>
          <img src="${imageUrl}" alt="${product.name}" class="w-full h-full object-cover" />
        </div>

        <h4 class="font-bold text-slate-800 text-xs mb-1 line-clamp-1">${product.name}</h4>
        <div class="flex items-center justify-between mb-3">
          <span class="font-black text-indigo-600 text-sm">${product.price.toFixed(2)} €</span>
          <span class="text-[10px] font-bold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-500'}">
            ${isOutOfStock ? 'Agotado' : `Stock: ${product.stock}`}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <button 
          onclick="window.addToCart(${product.id})"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
          ${isOutOfStock ? 'disabled' : ''}
        >
          🛒 Añadir
        </button>
        <button 
          onclick="window.deleteProduct(${product.id})"
          class="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2 rounded-xl text-xs transition-colors"
          title="Eliminar producto"
        >
          🗑️
        </button>
      </div>
    </div>
  `;
}

/**
 * Génère le HTML d'un élément du panier
 */
export function createCartItemHTML(item) {
  return `
    <div class="flex items-center justify-between bg-white/80 p-2 rounded-xl border border-emerald-100 text-xs">
      <div class="flex-1 min-w-0 pr-2">
        <p class="font-bold text-slate-800 truncate">${item.name}</p>
        <p class="text-[10px] text-slate-500">${item.price.toFixed(2)} € x ${item.quantity}</p>
      </div>
      <div class="flex items-center gap-1">
        <button 
          onclick="window.updateQuantity(${item.id}, ${item.quantity - 1})" 
          class="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-bold flex items-center justify-center text-[10px]"
        >
          -
        </button>
        <span class="font-bold text-slate-700 px-1 text-[11px]">${item.quantity}</span>
        <button 
          onclick="window.updateQuantity(${item.id}, ${item.quantity + 1})" 
          class="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-bold flex items-center justify-center text-[10px]"
        >
          +
        </button>
      </div>
    </div>
  `;
}