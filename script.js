// ================================
// DOM ELEMENT REFERENCES
// ================================
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const activeTasksEl = document.getElementById('activeTasks');
const completedTasksEl = document.getElementById('completedTasks');

// ================================
// APP STATE
// ================================
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ================================
// INITIALIZE APP
// ================================
function init() {
    renderTasks();
    updateStats();
}

// ================================
// ADD A NEW TASK
// ================================
function addTask() {
    const text = taskInput.value.trim();

    // Validate input
    if (text === '') {
        taskInput.style.borderColor = '#f44336';
        taskInput.placeholder = 'Please enter a task!';
        setTimeout(() => {
            taskInput.style.borderColor = '#e0e0e0';
            taskInput.placeholder = 'Enter a new task...';
        }, 2000);
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text: text,
        priority: prioritySelect.value,
        completed: false,
        createdAt: new Date().toLocaleDateString()
    };

    // Add to array
    tasks.push(task);

    // Save, render, and reset
    saveTasks();
    renderTasks();
    updateStats();

    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// ================================
// RENDER TASKS TO THE DOM
// ================================
function renderTasks() {
    // Clear current list
    taskList.innerHTML = '';

    // Filter tasks based on current filter
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    // Show/hide empty state
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // Show/hide clear completed button
    const hasCompleted = tasks.some(task => task.completed);
    if (hasCompleted) {
        clearCompletedBtn.classList.remove('hidden');
    } else {
        clearCompletedBtn.classList.add('hidden');
    }

    // Create list items
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
            >
            <span class="task-text">${escapeHTML(task.text)}</span>
            <span class="priority-badge ${task.priority}">${task.priority}</span>
            <button class="delete-btn" title="Delete task">✕</button>
        `;

        taskList.appendChild(li);
    });
}

// ================================
// TOGGLE TASK COMPLETION
// ================================
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// ================================
// DELETE A TASK
// ================================
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// ================================
// CLEAR ALL COMPLETED TASKS
// ================================
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
}

// ================================
// UPDATE STATISTICS
// ================================
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    totalTasksEl.textContent = total;
    activeTasksEl.textContent = active;
    completedTasksEl.textContent = completed;
}

// ================================
// SET ACTIVE FILTER
// ================================
function setFilter(filter) {
    currentFilter = filter;

    // Update active button style
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });

    renderTasks();
}

// ================================
// SAVE TASKS TO LOCAL STORAGE
// ================================
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ================================
// UTILITY: Escape HTML to prevent XSS
// ================================
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// ================================
// EVENT LISTENERS
// ================================

// Add task button click
addTaskBtn.addEventListener('click', addTask);

// Enter key to add task
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Task list click delegation (checkbox & delete)
taskList.addEventListener('click', function(e) {
    const li = e.target.closest('.task-item');
    if (!li) return;

    const id = Number(li.getAttribute('data-id'));

    if (e.target.classList.contains('task-checkbox')) {
        toggleTask(id);
    }

    if (e.target.classList.contains('delete-btn')) {
        deleteTask(id);
    }
});

// Filter button clicks
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        setFilter(this.getAttribute('data-filter'));
    });
});

// Clear completed button
clearCompletedBtn.addEventListener('click', clearCompleted);

// ================================
// START THE APP
// ================================
init();