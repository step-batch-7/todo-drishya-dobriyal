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
  let todoTemplate = `<div id="details"><h2>${id}<h2>`;
  for (const id in todo) {
    todoTemplate += `<li>${todo[id]}</li>`
  };
  todoTemplate += `<button onclick="editTodo()" id="${id}">EDIT TODO</button></div>`
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
      const heading = '<h3> &nbsp  &nbsp TODO LIST\'s</h3>'
      titleList = createTodoListTemplate(titleList);
      document.getElementById('todoList').innerHTML = heading + titleList;
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

const editTodoTemplate = (items, id) => {
  let template = '';
  for (const key in items) {
    template += `<div> <textarea id="${key}" rows="2" cols="105" type="text">${items[key]}</textarea>`;
    template += `<div onclick="deleteItem()" id="deleteItem"> - </div></div> `
  };
  return `<div id="task">
        <div id=${id}>
          <label>TITLE</label><br>
            <input type="text" name="title" id="${id}"></input >
            <button onclick="addItem()">Add Item</button>
            <button onclick="saveEditedTodo()">DONE</button>
            ${template}
        </div >
      </div >`;
}

const editTodo = () => {
  const id = event.target.id;
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    const content = JSON.parse(xhr.responseText);
    const template = editTodoTemplate(content[id], id);
    document.getElementById('content').innerHTML = template;
    document.getElementById('content').querySelector('input').value = id;
  };

  xhr.open('GET', '/todoList.json');
  xhr.send();
};

document.onload = displayTodoList();