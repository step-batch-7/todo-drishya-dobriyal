const addItem = () => {
  const div = document.createElement('div');
  div.classList.add('item');
  div.innerHTML = ` <textarea rows="2" cols="105" type="text" required></textarea>
      <div onclick="deleteItem()" id="deleteItem"> - </div>`;
  event.target.parentNode.appendChild(div);
};

const deleteItem = () => {
  const itemToDelete = event.target.parentNode;
  itemToDelete.remove();
};

const saveTodo = () => {
  const title = document.getElementById('title').value;
  let items = Array.from(document.querySelectorAll('textarea'));
  const xhr = new XMLHttpRequest();
  items = items.map(item => item.value);
  const postBody = `title=${title}&todoItems=${items.join('\r\n')}`;
  xhr.open('POST', '/saveTodo');
  xhr.send(postBody);

  document.getElementById('tasks').innerHTML =
    ` <label>TITLE</label><br>
      <input type="text" name="title" id="title" required></input>
      <button onclick="addItem()">Add Item</button>
      <button onclick="saveTodo()">DONE</button>`;
};

const createTodoTemplate = (id, todo) => {
  let todoTemplate = `<h2>${id}<h2>`;
  for (const id in todo) {
    todoTemplate += `<li>${todo[id]}</li>`
  };
  todoTemplate += `<button onclick="editTodo()" id="${id}">EDIT TODO</button>`
  return todoTemplate;
};

const displayTodo = () => {
  const id = event.target.id;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const content = JSON.parse(xhr.responseText);
    const todo = content[id];
    const todoTemplate = createTodoTemplate(id, todo);

    document.getElementById('content').innerHTML = todoTemplate;
  };
  xhr.open('GET', '/todoList.json');
  xhr.send();
};

const createTodoListTemplate = (titleList) => {
  return titleList.map(title => `<li id='${title}' onclick="displayTodo()">${title}</li>`).join('');
};

const displayTodoList = () => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      const content = JSON.parse(xhr.responseText);
      let titleList = Object.keys(content);
      const heading = '<h3>TODO LIST\'s</h3>'
      titleList = createTodoListTemplate(titleList);
      document.getElementById('content').innerHTML = heading + titleList;
    };
  };
  xhr.open('GET', '/todoList.json');
  xhr.send();
};

const saveEditedTodo = () => {
  const parentNode = event.target.parentNode;
  const xhr = new XMLHttpRequest();
  const title = parentNode.querySelector('div input').value;
  let items = Array.from(parentNode.querySelectorAll('div textarea'));
  items = items.map(item => item.value);
  const postBody = `title=${title}&todoItems=${items.join('\r\n')}`;
  xhr.open('POST', '/saveTodo');
  xhr.send(postBody);
  displayTodoList();
};

const editTodo = () => {
  const id = event.target.id;
  const data = document.getElementById(id).parentElement;
  let items = Array.from(data.querySelectorAll('li'));

  items = items.map(item => {
    return `<div> <textarea rows="2" cols="105" type="text" required>${item.textContent}</textarea>
      <div onclick="deleteItem()" id="deleteItem"> - </div></div>`;
  }).join('');
  const headingTitle = `<input type="text" name="title" id=${id}></input>`;

  document.getElementById('content').innerHTML =
    `<div id="task">
    <div id=${id}>
    <label>TITLE</label><br>
    ${headingTitle}
    <button onclick="addItem()">Add Item</button>
    <button onclick="saveEditedTodo()">DONE</button>
    ${items}
    </div>
    </div>`;
  document.getElementById('task').querySelector('input').value = id;
};

document.onload = displayTodoList();