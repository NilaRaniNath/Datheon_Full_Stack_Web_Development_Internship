# Task 2: TaskFlow — Dynamic Task Manager & Productivity Tracker (CRUD)

A sleek, responsive, zero-server-dependency **Dynamic Task Manager & Productivity Tracker** built with semantic **HTML5**, modern **CSS3** (glassmorphic dark design & smooth transitions), and pure **Vanilla JavaScript (ES6+)**.

---

## 🌐 Live Demonstration

- **Live URL:** [https://task-manager-ashen-rho.vercel.app](https://task-manager-ashen-rho.vercel.app)
- **Repository Path:** `./Task-2/`

---

## ✨ Features & Architecture

### 1. Complete CRUD Operations
- **Create:** Add new tasks with title, category (`Work`, `Personal`, `Study`), and due date via form submission or by pressing `Enter`.
- **Read:** Tasks are displayed dynamically with color-coded category badges, due date format, and overdue status highlight.
- **Update:**
  - **Status Toggle:** Mark tasks complete/active with smooth strikethrough and opacity transitions.
  - **Edit Modal:** Update existing task title, category, and due date with keyboard accessibility (`Esc` to dismiss).
- **Delete:** Individual deletion with smooth exit animation, plus a **"Clear Completed"** bulk action.

### 2. Drag-and-Drop Reordering
- Native HTML5 Drag & Drop API implementation on each task item.
- Visual drop guides (`drag-over-top`, `drag-over-bottom`) and grab handles.
- Automatically updates task order in the JavaScript state array and saves immediately to `localStorage`.

### 3. Real-Time Search & Status Filtering
- **Live Search:** Filter tasks dynamically by task title or category keywords.
- **Status Filter Tabs:** Switch instantly between `All`, `Active`, and `Completed`.
- **Live Counters:** Real-time counters showing `Total`, `Active`, and `Completed` tasks.
- **Custom Empty States:** Dynamic empty-state messages matching the active filter or search query.

### 4. LocalStorage State Persistence
- All creations, updates, deletions, and drag-and-drop reorderings persist automatically across page reloads using browser `localStorage`.
- Seed data included on initial launch for previewing features immediately.

---

## 🛠️ Tech Stack

- **Markup:** Semantic HTML5, accessible roles, form controls, and modal dialogs.
- **Styling:** CSS3 variables, glassmorphism, responsive flexbox & grid, smooth keyframe animations.
- **Scripting:** Pure Vanilla JavaScript (ES6+), DOM manipulation, Drag & Drop API, and `localStorage` API.

---

## 📂 File Structure

```
Task-2/
├── index.html   # Main application structure & accessible layout
├── style.css    # Responsive styles, glassmorphism, animations & badges
├── script.js    # Application state, CRUD, Drag & Drop, and localStorage
└── README.md    # Task documentation & live link
```
