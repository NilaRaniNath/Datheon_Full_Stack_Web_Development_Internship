# Datheon Full-Stack Web Development Internship

This repository contains the projects and assignments completed during the **Datheon Full-Stack Web Development Internship**.

---

## 🌐 Live Demonstrations (All Tasks)

| Task | Project Title | Live Deployment Link | Source Code |
|:---:|:---|:---:|:---:|
| **Task 1** | **Personal Developer Portfolio Website** | [🔗 datheon-portfolio.vercel.app](https://datheon-portfolio.vercel.app) | [`./Task-1/`](./Task-1/) |
| **Task 2** | **TaskFlow — Dynamic Task Manager & Productivity Tracker (CRUD)** | [🔗 task-manager-ashen-rho.vercel.app](https://task-manager-ashen-rho.vercel.app) | [`./Task-2/`](./Task-2/) |
| **Task 3** | **AuraCast — Real-Time Weather Forecast & Climate Telemetry** | [🔗 weather-update-plum.vercel.app](https://weather-update-plum.vercel.app) | [`./Task-3/`](./Task-3/) |
| **Task 4** | **NovaStore — E-Commerce Product Catalog & Interactive Cart** | [🔗 novastore-mu.vercel.app](https://novastore-mu.vercel.app) | [`./Task-4/`](./Task-4/) |

---

## 📂 Repository Structure

```
Datheon_Full_Stack_Web_Development_Internship/
├── Task-1/       # Task 1: Personal Developer Portfolio Website
│   ├── assets/   # Profile image & resume document
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md # Task-1 overview & live link
│
├── Task-2/       # Task 2: Dynamic Task Manager & Productivity Tracker (CRUD)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md # Task-2 overview & live link
│
├── Task-3/       # Task 3: Real-Time Weather Forecast & Climate Telemetry
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md # Task-3 overview & live link
│
├── Task-4/       # Task 4: E-Commerce Product Catalog & Interactive Shopping Cart
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md # Task-4 overview & live link
│
└── README.md     # Main repository overview with all 4 live links
```

---

## 🚀 Tasks Overview

### [Task 1: Personal Developer Portfolio Website](./Task-1/)
- **Live Demo:** [https://datheon-portfolio.vercel.app](https://datheon-portfolio.vercel.app)
- **Tech Stack:** Semantic HTML5, Tailwind CSS (via CDN), Vanilla JavaScript (ES6+)
- **Key Features:**
  - Responsive mobile-first developer portfolio with dark/light theme switcher (persisted in `localStorage`).
  - Hero section featuring animated typography, role badge, social links, glowing profile frame, and resume download.
  - Interactive project showcase cards with modal popups (BoiBondhu, GhorBazar, LegalEase, FoodFlow) displaying live URLs and client/server GitHub repositories.
  - Real-time validated contact form with custom toast confirmation alerts.

---

### [Task 2: TaskFlow — Dynamic Task Manager & Productivity Tracker](./Task-2/)
- **Live Demo:** [https://task-manager-ashen-rho.vercel.app](https://task-manager-ashen-rho.vercel.app)
- **Tech Stack:** HTML5, CSS3 (Modern Glassmorphic Dark UI), Vanilla JavaScript (ES6+)
- **Key Features:**
  - **Full CRUD Operations:** Create tasks with categories (`Work`, `Personal`, `Study`) and due dates, toggle completion status with smooth strikethrough animations, edit via modal, and delete.
  - **HTML5 Drag-and-Drop Reordering:** Drag tasks to reorder manually with visual drop cues and automatic array re-indexing.
  - **Zero-Server Persistence:** Automatically saves all state, edits, reordering, and deletions to browser `localStorage`.
  - **Real-Time Filtering & Search:** Instant search by title or category keywords, combined with status filter tabs (`All`, `Active`, `Completed`) and live counters (`Total`, `Active`, `Completed`).

---

### [Task 3: AuraCast — Real-Time Weather Forecast & Climate Telemetry](./Task-3/)
- **Live Demo:** [https://weather-update-plum.vercel.app](https://weather-update-plum.vercel.app)
- **Tech Stack:** HTML5, CSS Flexbox (Dynamic Weather Themes & Gradients), Vanilla JavaScript (ES6+ `fetch`, `async/await`, `Array.map()`, `try-catch`), OpenWeatherMap API
- **Key Features:**
  - **Search & Telemetry Dashboard:** Global city search, quick-select chips (*Sylhet*, *Dhaka*, *London*, *Tokyo*, *New York*), and instant **°C / °F unit toggle**.
  - **Climate Telemetry Metrics:** Real-time temperature, condition badge, humidity (%), wind speed with compass heading, atmospheric pressure (hPa), visibility, and High/Low ranges.
  - **5-Day Forecast via `Array.map()`:** Responsive daily forecast cards rendered dynamically with condition icons and min/max temperatures.
  - **Dynamic Background Gradients:** Automatically transitions between clear day, clear night, clouds, rain, thunderstorm, and mist themes.
  - **Robust Error & Loading States:** Smooth loading spinner, user-friendly error banners, and zero-config mock fallback.

---

### [Task 4: NovaStore — E-Commerce Product Catalog & Interactive Shopping Cart](./Task-4/)
- **Live Demo:** [https://novastore-mu.vercel.app](https://novastore-mu.vercel.app)
- **Tech Stack:** HTML5, CSS Grid & Flexbox, Vanilla JavaScript (ES6+ `async/await`, `localStorage`), FakeStoreAPI
- **Key Features:**
  - **Live Product Catalog:** Asynchronous fetch from FakeStoreAPI with skeleton loading and retry banner.
  - **CSS Grid Showcase:** Responsive card layout featuring category badges, star ratings with review counts, price, and "Add to Cart" triggers.
  - **Real-Time Search & Filters:** Live search input, category tabs (`All`, `Electronics`, `Jewelery`, `Men's Clothing`, `Women's Clothing`), and multi-criteria sorting.
  - **Slide-Out Cart Drawer & Persistence:** Live navbar badge, quantity controls, remove buttons, clear cart, free shipping progress bar, and full `localStorage` persistence.
  - **Simulated Checkout Modal:** Form validation, order summary breakdown, and order confirmation receipt with generated order ID.

---

## 👩‍💻 Author

**Nila Rani Nath**
- **Role:** Full-Stack Web Developer (MERN & Next.js) | AI-Driven Web Engineer
- **Location:** Sylhet, Bangladesh
- **GitHub:** [@NilaRaniNath](https://github.com/NilaRaniNath)
- **LinkedIn:** [nilaraninath](https://www.linkedin.com/in/nilaraninath)
- **Email:** [nilaraninath03@gmail.com](mailto:nilaraninath03@gmail.com)
