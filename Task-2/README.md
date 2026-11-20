# TaskFlow — Dynamic Task Manager & Productivity Tracker (CRUD)

A sleek, responsive, zero-server-dependency **Dynamic Task Manager & Productivity Tracker** built with semantic **HTML5**, modern **CSS3** (glassmorphic dark design & smooth transitions), and pure **Vanilla JavaScript (ES6+)**.

---

## ✨ Features

### 1. Complete CRUD Operations
- **Create:** Add new tasks with title, category (`Work`, `Personal`, `Study`), and due date via form submission or by pressing `Enter`.
- **Read:** Tasks are displayed dynamically with color-coded category badges, due date format, and overdue status highlight.
- **Update:**
  - **Status Toggle:** Mark tasks complete/active with smooth strikethrough and opacity transitions.
  - **Edit Modal:** Update existing task title, category, and due date with keyboard accessibility (`Esc` to dismiss).
- **Delete:** Individual deletion with smooth exit animation, plus a **"Clear Completed"** bulk action.

### 2. Drag-and-Drop Reordering
- Reorder tasks easily by dragging the grab handle.
- Displays drop indicators above or below items.
- Automatically updates task order in the JavaScript state array and saves immediately to `localStorage`.

### 3. Real-Time Search & Status Filtering
- **Live Search:** Filter tasks dynamically by task title or category.
- **Status Filter Tabs:** Switch instantly between `All`, `Active`, and `Completed`.
- **Live Counters:** Real-time counters showing `Total`, `Active`, and `Completed` tasks.
- **Custom Empty States:** Dynamic empty-state messages matching the active filter or search query.

### 4. LocalStorage Persistence
- State is preserved automatically across page reloads using browser `localStorage`.
- Seed data included on first launch for previewing features immediately.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic markup, accessible roles, form controls, and modal dialogs.
- **CSS3:** Custom properties (CSS variables), glassmorphism, responsive flexbox & grid, smooth keyframe animations.
- **JavaScript (ES6+):** Modular DOM manipulation, Drag & Drop API, event delegation, and `localStorage` API.

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser:

```bash
# Option 1: Directly double click index.html in the task-2 folder
# Option 2: Run via VS Code Live Server extension
```

---

## 📂 File Structure

```
task-2/
├── index.html   # Main application structure & accessible layout
├── style.css    # Responsive styles, glassmorphism, animations & badges
├── script.js    # Application state, CRUD, Drag & Drop, and localStorage
└── README.md    # Task documentation
```
