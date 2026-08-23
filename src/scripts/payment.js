// src/scripts/payment.js
import { store } from './store.js';
import { apiService } from './api.js';

export function setupPaymentUI() {
  const paymentForm = document.getElementById('payment-form');
  const methodRadios = document.querySelectorAll('input[name="payment-method"]');
  
  const cardFields = document.getElementById('method-card-fields');
  const paypalFields = document.getElementById('method-paypal-fields');
  const bizumFields = document.getElementById('method-bizum-fields');

  methodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const value = e.target.value;
      cardFields?.classList.toggle('hidden', value !== 'card');
      paypalFields?.classList.toggle('hidden', value !== 'paypal');
      bizumFields?.classList.toggle('hidden', value !== 'bizum');
    });
  });

  paymentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('pay-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando pago...';
    }

    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;

    const paymentPayload = {
      method: selectedMethod,
      amount: store.getCartTotal(),
      items: store.cart,
      timestamp: new Date().toISOString()
    };

    const result = await apiService.processPayment(paymentPayload);

    if (result.success) {
      alert(`¡Pago realizado con éxito! ID: ${result.transactionId}`);
      store.clearCart();
      
      document.getElementById('cart-view-checkout')?.classList.add('hidden');
      document.getElementById('cart-view-items')?.classList.remove('hidden');
    } else {
      alert(`Error en el pago: ${result.error}`);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `🔒 Pagar <span id="pay-amount">${store.getCartTotal().toFixed(2)} €</span>`;
    }
  });
}