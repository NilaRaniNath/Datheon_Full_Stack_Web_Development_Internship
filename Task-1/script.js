/* ═══════════════════════════════════════════════
   Nila Rani Nath — Portfolio Script
   Vanilla JS (ES6+)
═══════════════════════════════════════════════ */

'use strict';

// ────────────────────────────────────────────
// Initialize Lucide Icons
// ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initTheme();
  initNavbar();
  initMobileDrawer();
  initProfileFallback();
  initRevealAnimations();
  initProjectModals();
  initContactForm();
  initBackToTop();
  initFooterYear();
});


// ────────────────────────────────────────────
// THEME TOGGLE (persisted in localStorage)
// ────────────────────────────────────────────
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Load saved theme or default to dark
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') {
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
    localStorage.setItem('portfolio-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  });
}


// ────────────────────────────────────────────
// STICKY NAVBAR WITH GLASS EFFECT
// ────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll → glass effect
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active nav link based on scroll position
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}


// ────────────────────────────────────────────
// MOBILE MENU DRAWER
// ────────────────────────────────────────────
function initMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const open = () => {
    drawer.classList.add('drawer-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    drawer.classList.remove('drawer-open');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('drawer-open')) {
      close();
    }
  });
}


// ────────────────────────────────────────────
// PROFILE IMAGE FALLBACK
// ────────────────────────────────────────────
function initProfileFallback() {
  const img = document.getElementById('profile-img');
  const fallback = document.getElementById('profile-fallback');

  if (img) {
    img.addEventListener('error', () => {
      img.classList.add('hidden');
      fallback.classList.remove('hidden');
      // Re-render the lucide icon inside fallback
      lucide.createIcons({ nodes: [fallback] });
    });
  }
}


// ────────────────────────────────────────────
// SCROLL-REVEAL ANIMATIONS
// ────────────────────────────────────────────
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}


// ────────────────────────────────────────────
// PROJECT DATA & MODAL
// ────────────────────────────────────────────
const projectData = [
  {
    title: 'BoiBondhu',
    subtitle: 'Full-Stack Book Buy, Sell & Exchange Platform',
    icon: 'book-open',
    iconBg: 'bg-brand-500/10',
    iconColor: 'text-brand-400',
    description:
      'A full-stack book buy, sell, and exchange platform where users can list their books, browse available titles, and securely transact. Features robust JWT-based authentication, role-based access, and a clean, intuitive UI built with Next.js and TypeScript.',
    tech: ['Next.js', 'TypeScript', 'Express.js', 'MongoDB', 'JWT', 'Tailwind CSS'],
    features: [
      'User registration & JWT authentication',
      'Book listing with full CRUD operations',
      'Buy, sell, and exchange workflow',
      'Responsive UI with Next.js App Router',
      'RESTful API with Express.js backend',
    ],
    demo: 'https://nila-rani-nath-webdeveloper.vercel.app',
    githubClient: 'https://github.com/NilaRaniNath',
    githubServer: null,
  },
  {
    title: 'GhorBazar',
    subtitle: 'Agentic AI Real Estate Marketplace',
    icon: 'home',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    description:
      'An intelligent real estate marketplace powered by Agentic AI and Google Gemini API. Integrated personalized property recommendations with a context-aware chat assistant, multi-criteria filtering, full CRUD, cloud image uploads, and interactive analytics dashboards using Recharts.',
    tech: ['Next.js 14', 'TypeScript', 'Google Gemini API', 'TanStack Query', 'Express.js', 'MongoDB', 'Recharts'],
    features: [
      'Google Gemini API integration for personalized AI property recommendations & assistant',
      'Advanced multi-criteria filtering with TanStack Query',
      'Interactive analytics dashboard using Recharts',
      'Secure JWT and Google OAuth 2.0 authentication',
      'Dynamic property listings with cloud image uploading',
    ],
    demo: 'https://ghorbazar-online-platform.vercel.app',
    githubClient: 'https://github.com/NilaRaniNath/ghorbazar-client',
    githubServer: 'https://github.com/NilaRaniNath/ghorbazar-server',
  },
  {
    title: 'LegalEase',
    subtitle: 'Premium On-Demand Legal Services Platform',
    icon: 'scale',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    description:
      'A premium on-demand legal marketplace connecting clients with vetted attorneys. Implemented Better-Auth authentication, seamless Stripe checkout for service bookings, a self-service lawyer dashboard for real-time service listings, ImgBB API for cloud uploads, and optimized MongoDB connection pooling.',
    tech: ['Next.js', 'Better-Auth', 'Stripe', 'HeroUI', 'Tailwind CSS', 'Node.js', 'MongoDB'],
    features: [
      'Secure Better-Auth authentication',
      'Integrated Stripe checkout for seamless lawyer service bookings',
      'Self-service dashboard for legal experts to publish and manage listings',
      'ImgBB API integration for instant cloud image uploads',
      'Optimized MongoDB connection pooling for high performance',
    ],
    demo: 'https://legal-ease-two-silk.vercel.app',
    githubClient: 'https://github.com/NilaRaniNath/legalease-client',
    githubServer: 'https://github.com/NilaRaniNath/legalease-server',
  },
  {
    title: 'FoodFlow',
    subtitle: 'Real-Time Multi-Vendor Food Delivery Platform',
    icon: 'utensils',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-400',
    description:
      'A comprehensive full-stack food delivery platform built in a collaborative team environment. Features separate workflows for customers, restaurants, delivery riders, and administrators, real-time order tracking and logistics via Socket.io, and responsive food ordering, cart, and reviews interfaces.',
    tech: ['Next.js', 'React', 'TypeScript', 'Socket.io', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    features: [
      'Collaborative full-stack team project with multi-role workflows (Customer, Restaurant, Rider, Admin)',
      'Real-time order tracking and logistics powered by Socket.io',
      'Comprehensive restaurant management, food ordering, and review systems',
      'Secure authentication and role-based access control (RBAC)',
      'Responsive, high-performance UI across desktop and mobile devices',
    ],
    demo: 'https://fooddeliveryplatform.vercel.app/',
    githubClient: 'https://github.com/khalid66527/food_flow-client',
    githubServer: 'https://github.com/khalid66527/food_flow-server',
  },
];


function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');

  const openModal = (index) => {
    const project = projectData[index];
    if (!project) return;

    // Fill content
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-subtitle').textContent = project.subtitle;
    document.getElementById('modal-description').textContent = project.description;

    // Icon
    const iconEl = document.getElementById('modal-icon');
    iconEl.className = `w-12 h-12 rounded-xl flex items-center justify-center ${project.iconBg}`;
    iconEl.innerHTML = `<i data-lucide="${project.icon}" class="w-6 h-6 ${project.iconColor}"></i>`;

    // Tech tags
    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = project.tech
      .map((t) => `<span class="skill-tag">${t}</span>`)
      .join('');

    // Features
    const featuresContainer = document.getElementById('modal-features');
    featuresContainer.innerHTML = project.features
      .map(
        (f) =>
          `<li class="modal-feature-item"><span class="modal-feature-dot"></span><span>${f}</span></li>`
      )
      .join('');

    // Action Buttons
    const demoBtn = document.getElementById('modal-demo-btn');
    demoBtn.href = project.demo;

    const githubBtn = document.getElementById('modal-github-btn');
    githubBtn.href = project.githubClient;
    githubBtn.innerHTML = `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>${project.githubServer ? 'Client Code' : 'GitHub Repo'}`;

    const serverBtn = document.getElementById('modal-server-btn');
    if (project.githubServer) {
      serverBtn.href = project.githubServer;
      serverBtn.classList.remove('hidden');
    } else {
      serverBtn.classList.add('hidden');
    }

    // Re-render icons
    lucide.createIcons({ nodes: [iconEl, githubBtn, serverBtn, demoBtn] });

    // Show modal
    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.classList.add('pointer-events-auto', 'opacity-100');
    content.classList.remove('scale-90');
    content.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-90');

    setTimeout(() => {
      modal.classList.remove('pointer-events-auto', 'opacity-100');
      modal.classList.add('pointer-events-none');
      document.body.style.overflow = '';
    }, 300);
  };

  // Event delegation for "View Details" buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-details-btn');
    if (btn) {
      const index = parseInt(btn.dataset.project, 10);
      openModal(index);
    }
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('pointer-events-auto')) {
      closeModal();
    }
  });
}


// ────────────────────────────────────────────
// CONTACT FORM (Frontend Validation + Toast)
// ────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name
    const name = form.querySelector('#name');
    if (!name.value.trim()) {
      setError(name, true);
      isValid = false;
    } else {
      setError(name, false);
    }

    // Email
    const email = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      setError(email, true);
      isValid = false;
    } else {
      setError(email, false);
    }

    // Subject
    const subject = form.querySelector('#subject');
    if (!subject.value.trim()) {
      setError(subject, true);
      isValid = false;
    } else {
      setError(subject, false);
    }

    // Message
    const message = form.querySelector('#message');
    if (!message.value.trim()) {
      setError(message, true);
      isValid = false;
    } else {
      setError(message, false);
    }

    if (isValid) {
      showToast('Message sent successfully! I\'ll get back to you soon. 🎉');
      form.reset();
      // Clear all error states
      form.querySelectorAll('.form-input').forEach((input) => setError(input, false));
    }
  });

  // Real-time validation — clear error on input
  form.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('input', () => setError(input, false));
  });
}

function setError(input, show) {
  const errorMsg = input.parentElement.querySelector('.error-msg');
  if (show) {
    input.classList.add('input-error');
    if (errorMsg) errorMsg.classList.remove('hidden');
  } else {
    input.classList.remove('input-error');
    if (errorMsg) errorMsg.classList.add('hidden');
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  toastMsg.textContent = message;

  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 4000);
}


// ────────────────────────────────────────────
// BACK TO TOP BUTTON
// ────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 500) {
        btn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        btn.classList.add('opacity-100', 'translate-y-0');
      } else {
        btn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        btn.classList.remove('opacity-100', 'translate-y-0');
      }
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ────────────────────────────────────────────
// FOOTER YEAR
// ────────────────────────────────────────────
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
