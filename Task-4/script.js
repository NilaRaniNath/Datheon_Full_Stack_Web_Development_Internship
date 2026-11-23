/**
 * NovaStore — E-Commerce Product Catalog & Interactive Shopping Cart
 * Pure Vanilla JavaScript (ES6+ with clean state management,
 * async/await fetch from FakeStoreAPI, and localStorage persistence)
 */

'use strict';

/* ============================================================
   Configuration & Constants
   ============================================================ */
const API_URL = 'https://fakestoreapi.com/products';
const STORAGE_CART_KEY = 'novastore_cart_v1';

// Shipping & Tax configuration
const FREE_SHIPPING_THRESHOLD = 50.0;
const FLAT_SHIPPING_FEE = 9.99;
const ESTIMATED_TAX_RATE = 0.08; // 8%

/* ============================================================
   Application State
   ============================================================ */
let products = [];           // Raw fetched catalog
let filteredProducts = [];   // Active filtered view
let cart = [];               // Array of { id, title, price, image, category, quantity }
let activeCategory = 'all';  // 'all' | 'electronics' | 'jewelery' | etc.
let activeSearchQuery = '';  // search query string
let activeSort = 'featured'; // 'featured' | 'price-asc' | 'price-desc' | 'rating'

/* ============================================================
   DOM Element Selectors
   ============================================================ */
const elements = {
  // Navigation & Search
  navSearchInput: document.getElementById('nav-search-input'),
  navClearSearchBtn: document.getElementById('nav-clear-search-btn'),
  mobileSearchInput: document.getElementById('mobile-search-input'),
  mobileClearSearchBtn: document.getElementById('mobile-clear-search-btn'),
  cartTriggerBtn: document.getElementById('cart-trigger-btn'),
  cartBadge: document.getElementById('cart-badge'),

  // Category Tabs & Sort
  categoryTabs: document.getElementById('category-tabs'),
  categoryTabBtns: document.querySelectorAll('.tab-btn'),
  sortSelect: document.getElementById('sort-select'),
  resultsCounter: document.getElementById('results-counter'),
  activeFilterBadge: document.getElementById('active-filter-badge'),
  activeFilterText: document.getElementById('active-filter-text'),
  clearFilterBtn: document.getElementById('clear-filter-btn'),

  // Products Grid & Feedback States
  productsGrid: document.getElementById('products-grid'),
  loadingState: document.getElementById('loading-state'),
  errorBanner: document.getElementById('error-banner'),
  errorTitle: document.getElementById('error-title'),
  errorMsg: document.getElementById('error-msg'),
  retryBtn: document.getElementById('retry-btn'),
  emptyState: document.getElementById('empty-state'),
  emptyDesc: document.getElementById('empty-desc'),
  resetSearchBtn: document.getElementById('reset-search-btn'),

  // Cart Drawer
  cartBackdrop: document.getElementById('cart-backdrop'),
  cartDrawer: document.getElementById('cart-drawer'),
  closeCartBtn: document.getElementById('close-cart-btn'),
  clearCartBtn: document.getElementById('clear-cart-btn'),
  cartDrawerCount: document.getElementById('cart-drawer-count'),
  cartItemsContainer: document.getElementById('cart-items-container'),
  cartEmptyView: document.getElementById('cart-empty-view'),
  btnStartShopping: document.getElementById('btn-start-shopping'),
  cartDrawerFooter: document.getElementById('cart-drawer-footer'),

  // Free Shipping Progress
  shippingProgressBanner: document.getElementById('shipping-progress-banner'),
  shippingText: document.getElementById('shipping-text'),
  shippingProgressFill: document.getElementById('shipping-progress-fill'),

  // Cart Breakdown Calculation Elements
  calcSubtotal: document.getElementById('calc-subtotal'),
  calcShipping: document.getElementById('calc-shipping'),
  calcTax: document.getElementById('calc-tax'),
  calcGrandTotal: document.getElementById('calc-grand-total'),
  proceedCheckoutBtn: document.getElementById('proceed-checkout-btn'),

  // Checkout Modal
  checkoutModal: document.getElementById('checkout-modal'),
  closeCheckoutModalBtn: document.getElementById('close-checkout-modal-btn'),
  cancelCheckoutBtn: document.getElementById('cancel-checkout-btn'),
  checkoutForm: document.getElementById('checkout-form'),
  modalItemCount: document.getElementById('modal-item-count'),
  modalSummaryItems: document.getElementById('modal-summary-items'),
  modalCalcSubtotal: document.getElementById('modal-calc-subtotal'),
  modalCalcShipping: document.getElementById('modal-calc-shipping'),
  modalCalcTax: document.getElementById('modal-calc-tax'),
  modalCalcGrandTotal: document.getElementById('modal-calc-grand-total'),

  // Confirmation View
  orderConfirmationView: document.getElementById('order-confirmation-view'),
  confirmOrderId: document.getElementById('confirm-order-id'),
  confirmCustomerName: document.getElementById('confirm-customer-name'),
  confirmDeliveryAddress: document.getElementById('confirm-delivery-address'),
  confirmTotalAmount: document.getElementById('confirm-total-amount'),
  confirmContinueShoppingBtn: document.getElementById('confirm-continue-shopping-btn'),

  // Toast Container
  toastContainer: document.getElementById('toast-container'),
};

/* ============================================================
   Helper Functions
   ============================================================ */
function formatCurrency(num) {
  return `$${Number(num).toFixed(2)}`;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getCategoryBadgeClass(category) {
  const norm = String(category).toLowerCase();
  if (norm.includes('electronic')) return 'badge-electronics';
  if (norm.includes('jewel')) return 'badge-jewelery';
  if (norm.includes("men's")) return 'badge-mens-clothing';
  if (norm.includes("women's")) return 'badge-womens-clothing';
  return 'badge-electronics';
}

function showToast(message, type = 'info') {
  if (!elements.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2900);
}

/* ============================================================
   Cart LocalStorage Persistence
   ============================================================ */
function saveCartToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

function loadCartFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cart = parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    cart = [];
  }
}

/* ============================================================
   1. Asynchronous FakeStoreAPI Integration
   ============================================================ */
async function fetchProducts() {
  showLoading(true);
  hideError();

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`FakeStoreAPI returned status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No product records returned from catalog.');
    }

    products = data;
    applyFiltersAndRender();
  } catch (err) {
    console.error('Error fetching product catalog:', err);
    showError(
      'Unable to connect to FakeStoreAPI',
      err.message || 'Please check your internet connection and try again.'
    );
  } finally {
    showLoading(false);
  }
}

function showLoading(isLoading) {
  if (isLoading) {
    elements.loadingState.classList.remove('hidden');
    elements.productsGrid.classList.add('hidden');
    elements.emptyState.classList.add('hidden');
  } else {
    elements.loadingState.classList.add('hidden');
    elements.productsGrid.classList.remove('hidden');
  }
}

function showError(title, message) {
  elements.errorTitle.textContent = title;
  elements.errorMsg.textContent = message;
  elements.errorBanner.classList.remove('hidden');
  elements.productsGrid.classList.add('hidden');
}

function hideError() {
  elements.errorBanner.classList.add('hidden');
}

/* ============================================================
   2. Search, Category Filtering & Sorting
   ============================================================ */
function applyFiltersAndRender() {
  let list = [...products];

  // 1. Category Filter
  if (activeCategory !== 'all') {
    list = list.filter(
      (p) => String(p.category).toLowerCase() === activeCategory.toLowerCase()
    );
  }

  // 2. Search Query Filter (Title or Description)
  if (activeSearchQuery) {
    const q = activeSearchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        String(p.title).toLowerCase().includes(q) ||
        String(p.category).toLowerCase().includes(q) ||
        String(p.description).toLowerCase().includes(q)
    );
  }

  // 3. Sorting
  if (activeSort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (activeSort === 'rating') {
    list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
  }

  filteredProducts = list;
  renderProductGrid(filteredProducts);
  updateResultsSummary();
}

function updateResultsSummary() {
  const count = filteredProducts.length;
  elements.resultsCounter.textContent = `Showing ${count} product${count === 1 ? '' : 's'}`;

  // Filter badge
  if (activeCategory !== 'all' || activeSearchQuery) {
    elements.activeFilterBadge.classList.remove('hidden');
    const label = activeCategory !== 'all' ? activeCategory : `Search: "${activeSearchQuery}"`;
    elements.activeFilterText.textContent = label;
  } else {
    elements.activeFilterBadge.classList.add('hidden');
  }

  // Empty state toggle
  if (count === 0) {
    elements.emptyState.classList.remove('hidden');
    elements.productsGrid.classList.add('hidden');
    if (activeSearchQuery) {
      elements.emptyDesc.textContent = `No items match "${activeSearchQuery}" under this category.`;
    } else {
      elements.emptyDesc.textContent = 'No products are currently available in this category.';
    }
  } else {
    elements.emptyState.classList.add('hidden');
    elements.productsGrid.classList.remove('hidden');
  }
}

/* ============================================================
   3. Product Catalog Grid Rendering
   ============================================================ */
function renderProductGrid(items) {
  elements.productsGrid.innerHTML = items
    .map((product) => {
      const badgeClass = getCategoryBadgeClass(product.category);
      const rating = product.rating?.rate || 4.5;
      const reviews = product.rating?.count || 120;

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-image-wrap">
            <span class="card-category-badge ${badgeClass}">${escapeHtml(product.category)}</span>
            <img 
              src="${escapeHtml(product.image)}" 
              alt="${escapeHtml(product.title)}" 
              class="product-img" 
              loading="lazy"
            >
          </div>

          <div class="card-body">
            <div class="rating-row">
              <span class="rating-stars" aria-hidden="true">★</span>
              <span class="rating-score">${rating.toFixed(1)}</span>
              <span class="rating-count">(${reviews})</span>
            </div>

            <h3 class="product-title" title="${escapeHtml(product.title)}">
              ${escapeHtml(product.title)}
            </h3>

            <div class="card-footer">
              <span class="product-price">${formatCurrency(product.price)}</span>
              <button 
                type="button" 
                class="btn-add-cart" 
                data-id="${product.id}" 
                aria-label="Add ${escapeHtml(product.title)} to cart"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

/* ============================================================
   4. Core Cart State Operations & Calculations
   ============================================================ */

/**
 * Add a product to the cart by Product ID
 * @param {number|string} productId
 */
function addToCart(productId) {
  const pId = Number(productId);
  const existing = cart.find((item) => item.id === pId);

  if (existing) {
    existing.quantity += 1;
    showToast(`Updated quantity for "${existing.title.slice(0, 24)}..."`, 'info');
  } else {
    const product = products.find((p) => p.id === pId);
    if (!product) return;

    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
    });

    showToast(`Added "${product.title.slice(0, 24)}..." to cart!`, 'success');
  }

  saveCartToLocalStorage();
  updateCartUI();
  bumpCartBadge();
}

/**
 * Remove an item completely from the cart
 * @param {number|string} productId
 */
function removeFromCart(productId) {
  const pId = Number(productId);
  const item = cart.find((i) => i.id === pId);

  cart = cart.filter((item) => item.id !== pId);
  saveCartToLocalStorage();
  updateCartUI();

  if (item) {
    showToast(`Removed "${item.title.slice(0, 24)}..." from cart`, 'info');
  }
}

/**
 * Update quantity by delta (+1 / -1) or direct integer value
 * @param {number|string} productId
 * @param {number} deltaOrValue
 * @param {boolean} isAbsolute
 */
function updateQuantity(productId, deltaOrValue, isAbsolute = false) {
  const pId = Number(productId);
  const item = cart.find((i) => i.id === pId);
  if (!item) return;

  if (isAbsolute) {
    item.quantity = Math.max(1, parseInt(deltaOrValue, 10) || 1);
  } else {
    item.quantity += deltaOrValue;
  }

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCartToLocalStorage();
  updateCartUI();
}

/**
 * Calculate totals: Subtotal, Shipping, Tax, and Grand Total
 */
function calculateTotal() {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Free shipping rule: free if subtotal >= $50, flat $9.99 otherwise (if cart has items)
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = subtotal > 0 && !isFreeShipping ? FLAT_SHIPPING_FEE : 0.0;

  // Estimated Tax: 8% on subtotal
  const tax = subtotal * ESTIMATED_TAX_RATE;
  const grandTotal = subtotal + shipping + tax;

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return {
    subtotal,
    shipping,
    tax,
    grandTotal,
    totalItemsCount,
    isFreeShipping,
  };
}

/* ============================================================
   5. Cart UI & Slide-Out Drawer Rendering
   ============================================================ */
function updateCartUI() {
  const { subtotal, shipping, tax, grandTotal, totalItemsCount } = calculateTotal();

  // 1. Update Navbar Badge
  elements.cartBadge.textContent = totalItemsCount;
  elements.cartDrawerCount.textContent = totalItemsCount;

  // 2. Shipping Progress Bar
  if (subtotal === 0) {
    elements.shippingText.innerHTML = `Add <strong>${formatCurrency(FREE_SHIPPING_THRESHOLD)}</strong> for <strong>Free Shipping!</strong>`;
    elements.shippingProgressFill.style.width = '0%';
  } else if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    elements.shippingText.innerHTML = `🎉 You have unlocked <strong>Free Standard Shipping!</strong>`;
    elements.shippingProgressFill.style.width = '100%';
  } else {
    const diff = FREE_SHIPPING_THRESHOLD - subtotal;
    const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    elements.shippingText.innerHTML = `Add <strong>${formatCurrency(diff)}</strong> more for <strong>Free Shipping!</strong>`;
    elements.shippingProgressFill.style.width = `${pct}%`;
  }

  // 3. Render Cart Items List or Empty View
  if (cart.length === 0) {
    elements.cartItemsContainer.innerHTML = '';
    elements.cartItemsContainer.classList.add('hidden');
    elements.cartEmptyView.classList.remove('hidden');
    elements.cartDrawerFooter.classList.add('hidden');
  } else {
    elements.cartEmptyView.classList.add('hidden');
    elements.cartItemsContainer.classList.remove('hidden');
    elements.cartDrawerFooter.classList.remove('hidden');

    elements.cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-img-wrap">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="cart-item-img">
          </div>

          <div class="cart-item-details">
            <h4 class="cart-item-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h4>
            <span class="cart-item-price-unit">${formatCurrency(item.price)} each</span>

            <div class="cart-item-controls">
              <div class="qty-btn-group">
                <button type="button" class="qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>

              <button type="button" class="cart-item-remove-btn btn-item-remove" data-id="${item.id}" aria-label="Remove item" title="Remove item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="cart-item-total">
            ${formatCurrency(item.price * item.quantity)}
          </div>
        </div>
      `
      )
      .join('');
  }

  // 4. Update Price Calculations in Drawer Footer
  elements.calcSubtotal.textContent = formatCurrency(subtotal);
  elements.calcShipping.textContent = shipping === 0 ? 'FREE' : formatCurrency(shipping);
  elements.calcTax.textContent = formatCurrency(tax);
  elements.calcGrandTotal.textContent = formatCurrency(grandTotal);
}

function bumpCartBadge() {
  elements.cartBadge.classList.add('bump');
  setTimeout(() => {
    elements.cartBadge.classList.remove('bump');
  }, 300);
}

function openCartDrawer() {
  elements.cartBackdrop.classList.remove('hidden');
  elements.cartDrawer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  elements.cartBackdrop.classList.add('hidden');
  elements.cartDrawer.classList.add('hidden');
  document.body.style.overflow = '';
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  saveCartToLocalStorage();
  updateCartUI();
  showToast('Shopping cart cleared', 'info');
}

/* ============================================================
   6. Simulated Checkout Modal & Order Confirmation
   ============================================================ */
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }

  closeCartDrawer();

  const { subtotal, shipping, tax, grandTotal, totalItemsCount } = calculateTotal();

  // Populate Modal Summary
  elements.modalItemCount.textContent = `${totalItemsCount} item${totalItemsCount === 1 ? '' : 's'}`;
  elements.modalSummaryItems.innerHTML = cart
    .map(
      (item) => `
      <div class="modal-summary-item">
        <span class="modal-item-name">${item.quantity}x ${escapeHtml(item.title)}</span>
        <span class="modal-item-price">${formatCurrency(item.price * item.quantity)}</span>
      </div>
    `
    )
    .join('');

  elements.modalCalcSubtotal.textContent = formatCurrency(subtotal);
  elements.modalCalcShipping.textContent = shipping === 0 ? 'FREE' : formatCurrency(shipping);
  elements.modalCalcTax.textContent = formatCurrency(tax);
  elements.modalCalcGrandTotal.textContent = formatCurrency(grandTotal);

  // Reset form views
  elements.checkoutForm.classList.remove('hidden');
  elements.orderConfirmationView.classList.add('hidden');

  elements.checkoutModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  elements.checkoutModal.classList.add('hidden');
  document.body.style.overflow = '';
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('checkout-name');
  const cityInput = document.getElementById('checkout-city');
  const countryInput = document.getElementById('checkout-country');

  const customerName = nameInput.value.trim() || 'Valued Customer';
  const deliveryAddress = `${cityInput.value.trim() || 'Sylhet'}, ${countryInput.value.trim() || 'Bangladesh'}`;
  const { grandTotal } = calculateTotal();

  // Generate simulated Order ID: #NOV-xxxxxx
  const randomId = Math.floor(100000 + Math.random() * 900000);
  const orderId = `#NOV-${randomId}`;

  // Populate Confirmation Details
  elements.confirmOrderId.textContent = orderId;
  elements.confirmCustomerName.textContent = customerName;
  elements.confirmDeliveryAddress.textContent = deliveryAddress;
  elements.confirmTotalAmount.textContent = formatCurrency(grandTotal);

  // Clear Cart State & LocalStorage
  cart = [];
  saveCartToLocalStorage();
  updateCartUI();

  // Swap to Confirmation View
  elements.checkoutForm.classList.add('hidden');
  elements.orderConfirmationView.classList.remove('hidden');

  showToast(`Order ${orderId} confirmed successfully!`, 'success');
}

/* ============================================================
   7. Event Listeners & Bootstrapping
   ============================================================ */
function initEventListeners() {
  // Sync Search Inputs (Desktop Nav & Mobile Bar)
  const handleSearch = (query) => {
    activeSearchQuery = query.trim();
    if (elements.navSearchInput.value !== query) elements.navSearchInput.value = query;
    if (elements.mobileSearchInput.value !== query) elements.mobileSearchInput.value = query;

    const hasQuery = activeSearchQuery.length > 0;
    elements.navClearSearchBtn.classList.toggle('hidden', !hasQuery);
    elements.mobileClearSearchBtn.classList.toggle('hidden', !hasQuery);

    applyFiltersAndRender();
  };

  elements.navSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  elements.mobileSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));

  elements.navClearSearchBtn.addEventListener('click', () => handleSearch(''));
  elements.mobileClearSearchBtn.addEventListener('click', () => handleSearch(''));

  // Reset filter button
  elements.clearFilterBtn.addEventListener('click', () => {
    activeCategory = 'all';
    elements.categoryTabBtns.forEach((b) => b.classList.toggle('active', b.dataset.category === 'all'));
    handleSearch('');
  });

  elements.resetSearchBtn.addEventListener('click', () => {
    activeCategory = 'all';
    elements.categoryTabBtns.forEach((b) => b.classList.toggle('active', b.dataset.category === 'all'));
    handleSearch('');
  });

  // Category Tab Toggles
  elements.categoryTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    elements.categoryTabBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    activeCategory = btn.dataset.category;

    applyFiltersAndRender();
  });

  // Sort Select
  elements.sortSelect.addEventListener('change', (e) => {
    activeSort = e.target.value;
    applyFiltersAndRender();
  });

  // Products Grid Click Event Delegation ("Add to Cart")
  elements.productsGrid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-cart');
    if (addBtn) {
      const pId = addBtn.dataset.id;
      addToCart(pId);
    }
  });

  // Cart Drawer Trigger & Close
  elements.cartTriggerBtn.addEventListener('click', openCartDrawer);
  elements.closeCartBtn.addEventListener('click', closeCartDrawer);
  elements.cartBackdrop.addEventListener('click', closeCartDrawer);
  elements.btnStartShopping.addEventListener('click', closeCartDrawer);
  elements.clearCartBtn.addEventListener('click', clearCart);

  // Cart Items Controls Delegation (+, -, remove)
  elements.cartItemsContainer.addEventListener('click', (e) => {
    const plusBtn = e.target.closest('.btn-qty-plus');
    if (plusBtn) {
      updateQuantity(plusBtn.dataset.id, 1);
      return;
    }

    const minusBtn = e.target.closest('.btn-qty-minus');
    if (minusBtn) {
      updateQuantity(minusBtn.dataset.id, -1);
      return;
    }

    const removeBtn = e.target.closest('.btn-item-remove');
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.id);
      return;
    }
  });

  // Checkout Modal Events
  elements.proceedCheckoutBtn.addEventListener('click', openCheckoutModal);
  elements.closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);
  elements.cancelCheckoutBtn.addEventListener('click', closeCheckoutModal);
  elements.checkoutModal.addEventListener('click', (e) => {
    if (e.target === elements.checkoutModal) {
      closeCheckoutModal();
    }
  });

  // Payment radio option styling toggle
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Checkout Form Submission
  elements.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  elements.confirmContinueShoppingBtn.addEventListener('click', closeCheckoutModal);

  // Retry API Fetch
  elements.retryBtn.addEventListener('click', fetchProducts);

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!elements.checkoutModal.classList.contains('hidden')) {
        closeCheckoutModal();
      } else if (!elements.cartDrawer.classList.contains('hidden')) {
        closeCartDrawer();
      }
    }
  });
}

/* ============================================================
   Application Bootstrapper
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromLocalStorage();
  initEventListeners();
  updateCartUI();
  fetchProducts();
});
