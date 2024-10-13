// Event listener for DOM content load, which triggers the loading of existing tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// Selecting necessary DOM elements for handling tasks
const taskForm = document.getElementById('todo-form');
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const descriptionInput = document.getElementById('description-input');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');

// Event listener to handle task submission
taskForm.addEventListener('submit', addTask);

function addTask(event) {
    event.preventDefault();

    // Create a task object with relevant details
    const task = {
        text: taskInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        completed: false
    };

    // Save and render the task
    saveTask(task);
    renderTask(task);
    taskForm.reset();
}

// Function to render a task on the UI
function renderTask(task) {
    const li = document.createElement('li');
    li.className = task.priority;

    const taskText = document.createElement('span');
    taskText.textContent = `${task.text} - Due: ${task.dueDate}`;
    taskText.addEventListener('click', () => toggleComplete(task, li));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task, li));

    li.appendChild(taskText);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}

// Function to toggle the completion status of a task
function toggleComplete(task, li) {
    task.completed = !task.completed;
    li.classList.toggle('completed');
    saveTasks();
}

// Function to delete a task from both the UI and localStorage
function deleteTask(task, li) {
    taskList.removeChild(li);
    removeTask(task);
}

// Function to save a task to localStorage
function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to save all tasks to localStorage
function saveTasks() {
    const tasks = Array.from(taskList.children).map(li => ({
        text: li.firstChild.textContent.split(' - ')[0],
        completed: li.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to retrieve tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Function to load and render tasks from localStorage on page load
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(renderTask);
}

// Function to remove a task from localStorage
function removeTask(task) {
    const tasks = getTasks().filter(t => t.text !== task.text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to filter tasks based on their status (active or completed)
function filterTasks(type) {
    const tasks = document.querySelectorAll('li');
    tasks.forEach(task => {
        task.style.display = 'block';
        if (type === 'active' && task.classList.contains('completed')) {
            task.style.display = 'none';
        } else if (type === 'completed' && !task.classList.contains('completed')) {
            task.style.display = 'none';
        }
    });
}