const defaultCheckBox = () => `<input type="checkBox"></input>`

const addNewItem = (id) => {
  const div = document.createElement('div');
  div.classList.add('newItem');
  div.innerHTML =
    `${defaultCheckBox()}
      <textarea rows="2" cols="105" type="text" required></textarea>
      <div onclick="saveNewItem()" class="newItem"> - </div>
      <div onclick="deleteItem()" class="deleteItem"> - </div>`;
  event.target.parentNode.appendChild(div);
};

const saveNewItem = () => {
  const parentNode = event.target.parentNode;
  const title = document.getElementById('details').querySelector('h2').innerText;
  const item = parentNode.querySelector('textarea').value;
  const statusCode = parentNode.querySelector('input').checked;
  const postBody = `title=${title}&newItem=${item}&statusCode=${statusCode}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/saveItem');
  xhr.send(postBody);
};

const deleteItem = () => {
  const content = document.getElementById('details').querySelectorAll('h2')
  const title = content[0].innerText;
  const id = event.target.parentNode.id;
  const postBody = `title=${title}&id=${id}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/deleteItem');
  xhr.send(postBody);
  event.target.parentNode.remove();
};

const saveTitle = () => {
  const parentNode = event.target.parentNode;
  const title = parentNode.querySelector('input').value;
  const xhr = new XMLHttpRequest();
  const postBody = `title=${title}`;
  xhr.open('POST', '/saveTitle');
  xhr.send(postBody);

  document.getElementById('tasks').innerHTML =
    ` < label > TITLE</label > <br>
    <input type="text" name="title" id="title" required></input>
    <button onclick="saveTodo()">DONE</button>`;
  displayTodoList();
};

const createTodoTemplate = (id, todo) => {
  let todoTemplate = `<div id="details"><h2>${id}<h2>
        <button onclick="addNewItem()">Add New Item</button>`;
  for (const key in todo) {
    const { id, statusCode, item } = todo[key];
    if (statusCode === "true") {
      todoTemplate += `<li id='${id}'><input type="checkBox" checked>${item}<div onclick="deleteItem()" class="deleteItem" > - </div></li>`
    }
    else todoTemplate += `<li id='${id}'><input type="checkBox"> ${item}<div onclick="deleteItem()" class="deleteItem" > - </div></li>`
  };
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

document.onload = displayTodoList();