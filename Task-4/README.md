# Task 4: NovaStore — E-Commerce Product Catalog & Interactive Shopping Cart

A modern, mobile-first responsive **E-Commerce Product Catalog & Interactive Shopping Cart** web application built with semantic **HTML5**, **CSS Grid & Flexbox**, and modern **Vanilla JavaScript (ES6+)**, fetching live product telemetry from **FakeStoreAPI** (`https://fakestoreapi.com/products`).

---

## 🌐 Live Demonstration

- **Live URL:** [https://novastore-mu.vercel.app](https://novastore-mu.vercel.app)
- **Repository Path:** `./Task-4/`

---

## ✨ Features & Architecture

### 1. Product Catalog & Responsive CSS Grid
- Fetches real product data asynchronously using `fetch()`, `async/await`, and `try-catch`.
- Shimmer skeleton loading state while data loads, plus an error banner with a one-click **Retry** button.
- Responsive CSS Grid displaying product cards with image, title, category badge, star rating & review count, price, and an **"Add to Cart"** button.

### 2. Search & Category Filtering
- Real-time instant search input filtering by title, category, or description keywords.
- Category filter tabs (`All Products`, `Electronics`, `Jewelery`, `Men's Clothing`, `Women's Clothing`).
- Multi-criteria sorting options (`Featured`, `Price: Low to High`, `Price: High to Low`, `Highest Rated`).
- Active filter badge with one-click filter reset.

### 3. Slide-Out Shopping Cart Drawer
- Sticky navbar with a live cart item count badge and bump animation.
- Smooth slide-out cart drawer with backdrop blur.
- Individual cart items with thumbnails, unit price, quantity increment/decrement controls, remove button, and a **"Clear All"** action.
- Dynamic **Free Shipping Progress Bar** showing how close the customer is to unlocking free shipping ($50 threshold).
- **`localStorage` Persistence:** Cart items survive page refreshes and browser restarts.

### 4. Core Cart State & Price Calculations
- `addToCart(productId)`
- `removeFromCart(productId)`
- `updateQuantity(productId, deltaOrValue)`
- `calculateTotal()` computing `Subtotal`, `Shipping` (Free over $50 or flat $9.99), `Estimated Tax (8%)`, and `Grand Total`.

### 5. Simulated Express Checkout Modal
- Customer and shipping address form with validation.
- Live order summary and cost breakdown.
- Form submission displays an **Order Confirmation Receipt** with an Order ID (`#NOV-xxxxxx`), delivery details, and automatically clears the cart.

---

## 🛠️ Tech Stack

- **Markup:** Semantic HTML5, accessible modal dialogs, and forms.
- **Styling:** CSS Grid & Flexbox, custom properties, glassmorphism, skeleton shimmer animations.
- **Scripting:** Async/await `fetch()`, event delegation, state management, and `localStorage` API.
- **API:** FakeStoreAPI (`https://fakestoreapi.com/products`).

---

## 📂 File Structure

```
Task-4/
├── index.html   # Main application structure & modal components
├── style.css    # CSS Grid, Flexbox, drawer styles, responsive rules
├── script.js    # FakeStoreAPI fetch, cart state, checkout logic
└── README.md    # Task documentation & live link
```
