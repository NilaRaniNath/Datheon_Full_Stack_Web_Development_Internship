# Task 1: Personal Developer Portfolio Website

A sleek, modern, mobile-first responsive **Personal Developer Portfolio Website** built with semantic **HTML5**, **Tailwind CSS** (via CDN), and **Vanilla JavaScript (ES6+)**.

---

## 🌐 Live Demonstration

- **Live URL:** [https://datheon-portfolio.vercel.app](https://datheon-portfolio.vercel.app)
- **Repository Path:** `./Task-1/`

---

## ✨ Features & Architecture

### 1. Sticky Navigation & Glassmorphic Header
- Glass-blur effect on page scroll with active link highlighting.
- Responsive mobile slide-in drawer menu with backdrop blur.
- Functional **Dark / Light theme toggle** with automatic persistence in `localStorage` (defaults to dark mode).

### 2. Hero Section & Personal Branding
- Animated gradient typography with continuous background flow.
- Availability badge with live pulsing beacon.
- Glowing profile frame with a fallback SVG avatar for resilient asset loading.
- Direct CTA buttons: **"View Projects"** and **"Download Resume"** (linked to `./assets/resume.pdf`).
- Social links to GitHub, LinkedIn, and Email.

### 3. About Me & Academic Credentials
- Background overview of academic journey (Final-year B.Sc. Honours student in Chemistry at Murarichand College, MC College, Sylhet).
- Web development background focusing on full-stack web engineering and teaching experience.
- Interactive credential showcase cards (Education, Specialization, Teaching, Focus).

### 4. Categorized Tech Stack Grid
- Categorized CSS Grid displaying:
  - **Frontend:** HTML5, CSS3, Tailwind CSS, JavaScript ES6+, TypeScript, React.js, Next.js.
  - **Backend & Database:** Node.js, Express.js, MongoDB, REST APIs, JWT.
  - **Tools & Platforms:** Git, GitHub, Vercel, AI APIs.

### 5. Featured Projects Showcase with Interactive Modal Popups
Includes 4 detailed project cards with a **"View Details"** button opening an interactive modal popup with full features, tech stack tags, and repository/live demo links:
- **BoiBondhu:** Full-stack book buy, sell, and exchange platform with JWT authentication and Next.js.
- **GhorBazar:** Agentic AI real estate marketplace integrated with Google Gemini API, TanStack Query, and interactive analytics charts.
- **LegalEase:** Premium on-demand legal service platform built with Next.js, Better-Auth, and Stripe payment integration.
- **FoodFlow:** Real-time multi-vendor food delivery platform with Google Gemini AI chatbot, Socket.io tracking, and role-based access.

### 6. Interactive Contact Form & Footer
- Interactive contact form with real-time validation and toast notifications.
- Direct contact cards for GitHub, LinkedIn, and Email.
- Back-to-top floating button and dynamic copyright year.

---

## 🛠️ Tech Stack

- **Markup:** Semantic HTML5
- **Styling:** Tailwind CSS (CDN), Custom CSS animations, transitions & scrollbar
- **Icons:** Official vector SVGs & Lucide Icons
- **Scripting:** Pure Vanilla JavaScript (ES6+)

---

## 📂 File Structure

```
Task-1/
├── assets/
│   ├── profile.jpg    # Profile picture
│   └── resume.pdf     # Resume PDF document
├── index.html         # Main portfolio layout
├── style.css          # Custom scrollbar, animations & styling
├── script.js          # Theme toggle, drawer, modal & validation logic
└── README.md          # Task documentation & live link
```
