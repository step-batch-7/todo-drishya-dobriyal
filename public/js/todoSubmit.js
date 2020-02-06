const addItem = (id) => {
  const div = document.createElement('div');
  div.classList.add('item');
  div.innerHTML = `<textarea rows="2" cols="105" type="text" required></textarea>
      <div onclick="deleteItem()" class="deleteItem"> - </div>`;
  event.target.parentNode.appendChild(div);
};

const deleteItem = () => {
  const itemToDelete = event.target.parentNode;
  itemToDelete.remove();
};

const saveTitle = () => {
  const parentNode = event.target.parentNode;
  const title = parentNode.querySelector('input').value;
  const xhr = new XMLHttpRequest();
  const postBody = `title=${title}`
  xhr.open('POST', '/saveTitle');
  xhr.send(postBody);

  document.getElementById('tasks').innerHTML =
    ` <label>TITLE</label><br>
      <input type="text" name="title" id="title" required></input>
      <button onclick="saveTodo()">DONE</button>`;
  displayTodoList();
};

const createTodoTemplate = (id, todo) => {
  let todoTemplate = `<div id="details"><h2>${id}<h2>`;
  for (const id in todo) {
    const { statusCode, item } = todo[id];
    if (statusCode) {
      todoTemplate += `<li><input type="checkBox" checked>${item}</li>`
    };
    todoTemplate += `<li><input type="checkBox"> ${item}</li>`
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
  let editedItems = Array.from(parentNode.querySelectorAll('div textarea'));
  let statusCodes = Array.from(parentNode.querySelectorAll('div input'));
  statusCodes.shift();

  const items = {};
  editedItems.forEach(todoItem => {
    items[todoItem.id] = { item: todoItem.value }
  });
  statusCodes.forEach(statusCode => {
    items[statusCode.id][statusCode.id] = statusCode.checked
  });

  const postBody = `title=${title}&editedItems=${JSON.stringify(items)}`;
  xhr.open('POST', '/saveEditedTodo');
  xhr.send(postBody);
  displayTodoList();
};

const editTodoTemplate = (todo, id) => {

  let template = '';
  for (const id in todo) {
    const { statusCode, item } = todo[id];
    statusCode ? checkBox = `<input type="checkBox" id="${id}" checked></input>` : checkBox = `<input type="checkBox" id="${id}" ></input>`
    template += `<div style='display:flex'>
      ${checkBox}
      <textarea id="${id}" rows="2" cols="105" type="text">${item}</textarea>`;
    template += `<div onclick="deleteItem()" class="deleteItem" > - </div></div> `
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

const defaultCheckBox = (id) => `<input type="checkBox" id="${id}" ></input>`

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