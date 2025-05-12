const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    li.innerHTML = `
      <div>
        <strong>${todo.text}</strong><br />
        <small>Priority: ${todo.priority}${todo.time ? ` | Time: ${todo.time}` : ''}</small>
      </div>
      <div class="todo-actions">
        <button onclick="toggleTodo(${index})">${todo.completed ? 'Undo' : 'Done'}</button>
        <button onclick="deleteTodo(${index})">Delete</button>
      </div>
    `;
    todoList.appendChild(li);
  });
}


function addTodo() {
  const text = todoInput.value.trim();
  const priority = document.getElementById('priority-select').value;
  const time = document.getElementById('time-input').value;

  if (text === '') return;

  todos.push({ text, completed: false, priority, time });
  todoInput.value = '';
  document.getElementById('priority-select').value = 'Medium';
  document.getElementById('time-input').value = '';
  saveTodos();
  renderTodos();
}


function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

renderTodos();
