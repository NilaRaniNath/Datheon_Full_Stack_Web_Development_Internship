/**
 * TaskFlow — Dynamic Task Manager & Productivity Tracker
 * Pure Vanilla JavaScript (ES6+) with localStorage persistence,
 * full CRUD, real-time search, category & status filtering,
 * and drag-and-drop reordering.
 */

'use strict';

/* ============================================================
   State Management & Configuration
   ============================================================ */
const STORAGE_KEY = 'taskflow_tasks_v1';

/** @type {Array<{id: string, title: string, category: 'Work'|'Personal'|'Study', dueDate: string, completed: boolean, createdAt: number}>} */
let tasks = [];

let currentFilter = 'all'; // 'all' | 'active' | 'completed'
let searchQuery = '';

// Drag-and-drop state
let draggedTaskId = null;

/* ============================================================
   DOM Element Selectors
   ============================================================ */
const elements = {
  // Counters
  counterTotal: document.getElementById('counter-total'),
  counterActive: document.getElementById('counter-active'),
  counterCompleted: document.getElementById('counter-completed'),

  // Task creation form
  taskForm: document.getElementById('task-form'),
  titleInput: document.getElementById('task-title-input'),
  categorySelect: document.getElementById('task-category-select'),
  dueDateInput: document.getElementById('task-due-date-input'),

  // Search & Filter
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  clearCompletedBtn: document.getElementById('clear-completed-btn'),
  dndHint: document.getElementById('dnd-hint'),

  // List & Empty state
  taskList: document.getElementById('task-list'),
  emptyState: document.getElementById('empty-state'),
  emptyTitle: document.getElementById('empty-title'),
  emptyDesc: document.getElementById('empty-desc'),

  // Edit Modal
  editModal: document.getElementById('edit-modal'),
  editForm: document.getElementById('edit-task-form'),
  editTaskId: document.getElementById('edit-task-id'),
  editTaskTitle: document.getElementById('edit-task-title'),
  editTaskCategory: document.getElementById('edit-task-category'),
  editTaskDueDate: document.getElementById('edit-task-due-date'),
  editModalClose: document.getElementById('edit-modal-close'),
  editModalCancel: document.getElementById('edit-modal-cancel'),

  // Toast Container
  toastContainer: document.getElementById('toast-container'),
};

/* ============================================================
   LocalStorage Persistence
   ============================================================ */
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
    showToast('Failed to save changes to storage', 'error');
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        tasks = parsed;
        return;
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }

  // Initial welcome seed tasks if storage is empty
  tasks = [
    {
      id: generateId(),
      title: 'Review Task-2 deliverables & requirements',
      category: 'Work',
      dueDate: getRelativeDateString(0), // today
      completed: true,
      createdAt: Date.now() - 3600000,
    },
    {
      id: generateId(),
      title: 'Complete Dynamic Task Manager CRUD & Drag-Drop features',
      category: 'Work',
      dueDate: getRelativeDateString(1), // tomorrow
      completed: false,
      createdAt: Date.now() - 1800000,
    },
    {
      id: generateId(),
      title: 'Study Next.js App Router and TypeScript best practices',
      category: 'Study',
      dueDate: getRelativeDateString(3),
      completed: false,
      createdAt: Date.now() - 900000,
    },
    {
      id: generateId(),
      title: 'Schedule weekend family dinner & outdoor walk',
      category: 'Personal',
      dueDate: getRelativeDateString(5),
      completed: false,
      createdAt: Date.now(),
    },
  ];
  saveToLocalStorage();
}

/* ============================================================
   Helper Functions
   ============================================================ */
function generateId() {
  return 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
}

function getRelativeDateString(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDueDate(dateStr) {
  if (!dateStr) return { formatted: '', isOverdue: false, isToday: false };

  // Parse YYYY-MM-DD in local time
  const [y, m, d] = dateStr.split('-').map(Number);
  const dueDate = new Date(y, m - 1, d);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = dueDate.getTime() === today.getTime();
  const isOverdue = dueDate.getTime() < today.getTime();

  const options = { month: 'short', day: 'numeric' };
  if (dueDate.getFullYear() !== today.getFullYear()) {
    options.year = 'numeric';
  }
  const formatted = dueDate.toLocaleDateString(undefined, options);

  return { formatted, isOverdue, isToday };
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type = 'info') {
  if (!elements.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ============================================================
   CRUD Operations
   ============================================================ */

/** CREATE */
function handleCreateTask(e) {
  e.preventDefault();

  const title = elements.titleInput.value.trim();
  const category = elements.categorySelect.value;
  const dueDate = elements.dueDateInput.value;

  if (!title) {
    showToast('Please enter a task title', 'error');
    elements.titleInput.focus();
    return;
  }

  const newTask = {
    id: generateId(),
    title,
    category,
    dueDate,
    completed: false,
    createdAt: Date.now(),
  };

  // Add to top of task list
  tasks.unshift(newTask);
  saveToLocalStorage();
  renderTasks({ enterId: newTask.id });

  // Reset form
  elements.taskForm.reset();
  elements.titleInput.focus();

  showToast('Task added successfully!', 'success');
}

/** UPDATE: Completion Toggle */
function toggleTaskCompletion(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveToLocalStorage();
  renderTasks();

  const statusText = task.completed ? 'completed' : 'marked active';
  showToast(`Task ${statusText}!`, 'info');
}

/** UPDATE: Edit Details Modal */
function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  elements.editTaskId.value = task.id;
  elements.editTaskTitle.value = task.title;
  elements.editTaskCategory.value = task.category;
  elements.editTaskDueDate.value = task.dueDate || '';

  elements.editModal.classList.remove('hidden');
  elements.editTaskTitle.focus();
}

function closeEditModal() {
  elements.editModal.classList.add('hidden');
  elements.editForm.reset();
}

function handleSaveEdit(e) {
  e.preventDefault();

  const id = elements.editTaskId.value;
  const title = elements.editTaskTitle.value.trim();
  const category = elements.editTaskCategory.value;
  const dueDate = elements.editTaskDueDate.value;

  if (!title) {
    showToast('Task title cannot be empty', 'error');
    return;
  }

  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.title = title;
    task.category = category;
    task.dueDate = dueDate;
    saveToLocalStorage();
    renderTasks();
    showToast('Task updated successfully!', 'success');
  }

  closeEditModal();
}

/** DELETE */
function deleteTask(id) {
  const itemEl = document.querySelector(`.task-item[data-id="${id}"]`);

  const performDelete = () => {
    tasks = tasks.filter((t) => t.id !== id);
    saveToLocalStorage();
    renderTasks();
    showToast('Task deleted', 'info');
  };

  if (itemEl) {
    itemEl.classList.add('exiting');
    setTimeout(performDelete, 250);
  } else {
    performDelete();
  }
}

/** Clear Completed Tasks */
function clearCompletedTasks() {
  const completedCount = tasks.filter((t) => t.completed).length;
  if (completedCount === 0) {
    showToast('No completed tasks to clear', 'info');
    return;
  }

  tasks = tasks.filter((t) => !t.completed);
  saveToLocalStorage();
  renderTasks();
  showToast(`Cleared ${completedCount} completed task(s)!`, 'success');
}

/* ============================================================
   Filtering & Searching
   ============================================================ */
function getFilteredTasks() {
  return tasks.filter((task) => {
    // Status filter
    if (currentFilter === 'active' && task.completed) return false;
    if (currentFilter === 'completed' && !task.completed) return false;

    // Search query filter (matches title or category)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchCategory = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory) return false;
    }

    return true;
  });
}

function updateCounters() {
  const total = tasks.length;
  const active = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  if (elements.counterTotal) elements.counterTotal.textContent = total;
  if (elements.counterActive) elements.counterActive.textContent = active;
  if (elements.counterCompleted) elements.counterCompleted.textContent = completed;
}

/* ============================================================
   Rendering Function
   ============================================================ */
function renderTasks(options = {}) {
  updateCounters();

  const filteredTasks = getFilteredTasks();
  elements.taskList.innerHTML = '';

  // Update empty state visibility
  if (filteredTasks.length === 0) {
    elements.emptyState.classList.remove('hidden');

    if (searchQuery) {
      elements.emptyTitle.textContent = 'No matching tasks';
      elements.emptyDesc.textContent = `No tasks match your search "${searchQuery}".`;
    } else if (currentFilter === 'active') {
      elements.emptyTitle.textContent = 'No active tasks';
      elements.emptyDesc.textContent = 'Great job! You have cleared all your active tasks.';
    } else if (currentFilter === 'completed') {
      elements.emptyTitle.textContent = 'No completed tasks';
      elements.emptyDesc.textContent = 'Tasks you complete will show up here.';
    } else {
      elements.emptyTitle.textContent = 'No tasks yet';
      elements.emptyDesc.textContent = 'Create your first task above to start tracking your productivity!';
    }
  } else {
    elements.emptyState.classList.add('hidden');
  }

  // Populate Task Items
  filteredTasks.forEach((task) => {
    const li = createTaskElement(task);
    if (options.enterId && options.enterId === task.id) {
      li.classList.add('entering');
    }
    elements.taskList.appendChild(li);
  });

  // Toggle DnD hint: drag-and-drop is natural in 'all' view with no active search
  const isFiltered = currentFilter !== 'all' || searchQuery.length > 0;
  if (elements.dndHint) {
    if (tasks.length > 1 && !isFiltered) {
      elements.dndHint.classList.remove('hidden');
    } else {
      elements.dndHint.classList.add('hidden');
    }
  }
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'is-completed' : ''}`;
  li.dataset.id = task.id;
  li.setAttribute('draggable', 'true');

  const { formatted, isOverdue, isToday } = formatDueDate(task.dueDate);
  const overdueHighlight = isOverdue && !task.completed;

  // Category Icon & styling
  const categoryClass = `category-${task.category.toLowerCase()}`;
  let categoryIcon = '💼';
  if (task.category === 'Personal') categoryIcon = '🏡';
  if (task.category === 'Study') categoryIcon = '📚';

  let dueHtml = '';
  if (task.dueDate) {
    let dueLabel = formatted;
    if (isToday) dueLabel = 'Today';
    dueHtml = `
      <span class="due-badge ${overdueHighlight ? 'overdue' : ''}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        ${dueLabel}${overdueHighlight ? ' (Overdue)' : ''}
      </span>
    `;
  }

  li.innerHTML = `
    <!-- Drag Handle -->
    <div class="drag-handle" title="Drag to reorder" aria-label="Drag handle">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="6" r="1"></circle>
        <circle cx="9" cy="12" r="1"></circle>
        <circle cx="9" cy="18" r="1"></circle>
        <circle cx="15" cy="6" r="1"></circle>
        <circle cx="15" cy="12" r="1"></circle>
        <circle cx="15" cy="18" r="1"></circle>
      </svg>
    </div>

    <!-- Checkbox -->
    <div class="checkbox-wrapper" role="checkbox" aria-checked="${task.completed}" tabindex="0" title="Toggle complete">
      <div class="custom-checkbox">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div class="task-content">
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-meta">
        <span class="category-badge ${categoryClass}">
          <span>${categoryIcon}</span>
          <span>${task.category}</span>
        </span>
        ${dueHtml}
      </div>
    </div>

    <!-- Actions -->
    <div class="task-actions">
      <button type="button" class="action-btn edit-btn" title="Edit task" aria-label="Edit task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </button>
      <button type="button" class="action-btn delete-btn" title="Delete task" aria-label="Delete task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  `;

  // Attach Item Event Listeners
  const checkboxWrapper = li.querySelector('.checkbox-wrapper');
  checkboxWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  });
  checkboxWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTaskCompletion(task.id);
    }
  });

  const editBtn = li.querySelector('.edit-btn');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openEditModal(task.id);
  });

  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });

  // Attach Drag-and-Drop Listeners
  setupDragAndDrop(li);

  return li;
}

/* ============================================================
   Drag-and-Drop Reordering Logic
   ============================================================ */
function setupDragAndDrop(itemEl) {
  itemEl.addEventListener('dragstart', (e) => {
    draggedTaskId = itemEl.dataset.id;
    itemEl.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', draggedTaskId);
    } catch (err) {
      // safe fallback
    }
  });

  itemEl.addEventListener('dragend', () => {
    itemEl.classList.remove('dragging');
    cleanupDragClasses();
    draggedTaskId = null;
  });

  itemEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (!draggedTaskId || draggedTaskId === itemEl.dataset.id) return;

    const rect = itemEl.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;

    cleanupDragClasses();
    if (e.clientY < midY) {
      itemEl.classList.add('drag-over-top');
    } else {
      itemEl.classList.add('drag-over-bottom');
    }
  });

  itemEl.addEventListener('dragleave', () => {
    itemEl.classList.remove('drag-over-top', 'drag-over-bottom');
  });

  itemEl.addEventListener('drop', (e) => {
    e.preventDefault();
    cleanupDragClasses();

    const targetId = itemEl.dataset.id;
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const rect = itemEl.getBoundingClientRect();
    const dropBefore = e.clientY < rect.top + rect.height / 2;

    reorderTasks(draggedTaskId, targetId, dropBefore);
  });
}

function cleanupDragClasses() {
  document.querySelectorAll('.task-item').forEach((el) => {
    el.classList.remove('drag-over-top', 'drag-over-bottom');
  });
}

function reorderTasks(sourceId, targetId, dropBefore) {
  const sourceIndex = tasks.findIndex((t) => t.id === sourceId);
  const targetIndex = tasks.findIndex((t) => t.id === targetId);

  if (sourceIndex === -1 || targetIndex === -1) return;

  const [movedTask] = tasks.splice(sourceIndex, 1);

  // Recalculate target position after removal
  const newTargetIndex = tasks.findIndex((t) => t.id === targetId);
  const insertIndex = dropBefore ? newTargetIndex : newTargetIndex + 1;

  tasks.splice(insertIndex, 0, movedTask);

  saveToLocalStorage();
  renderTasks();
  showToast('Task order updated', 'info');
}

/* ============================================================
   Event Listeners Initialization
   ============================================================ */
function initEvents() {
  // Add task form submit
  elements.taskForm.addEventListener('submit', handleCreateTask);

  // Search input live filtering
  elements.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (searchQuery) {
      elements.searchClearBtn.classList.remove('hidden');
    } else {
      elements.searchClearBtn.classList.add('hidden');
    }
    renderTasks();
  });

  // Clear search button
  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    searchQuery = '';
    elements.searchClearBtn.classList.add('hidden');
    elements.searchInput.focus();
    renderTasks();
  });

  // Filter tabs
  elements.filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      elements.filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Clear completed button
  elements.clearCompletedBtn.addEventListener('click', clearCompletedTasks);

  // Edit Modal Form & Close
  elements.editForm.addEventListener('submit', handleSaveEdit);
  elements.editModalClose.addEventListener('click', closeEditModal);
  elements.editModalCancel.addEventListener('click', closeEditModal);

  // Close modal on background click
  elements.editModal.addEventListener('click', (e) => {
    if (e.target === elements.editModal) {
      closeEditModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.editModal.classList.contains('hidden')) {
      closeEditModal();
    }
  });
}

/* ============================================================
   Application Bootstrapper
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  initEvents();
  renderTasks();
});
