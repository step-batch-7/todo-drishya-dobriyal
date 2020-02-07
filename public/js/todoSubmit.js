const defaultCheckBox = () => `<input type="checkBox" onclick="toggleStatus"></input>`;

const toggleStatus = () => {
  const newStatus = event.target.checked;
  const titleId = document.getElementById('details').querySelector('h2').id;
  const itemId = event.target.parentNode.id;
  const postBody = JSON.stringify({ newStatus, titleId, itemId });
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/toggleStatus');
  xhr.send(postBody);
};

const addNewItem = (id) => {
  const div = document.createElement('div');
  div.classList.add('newItem');
  div.innerHTML =
    `${defaultCheckBox()}
      <textarea rows="2" cols="105" type="text" required></textarea>
      <div onclick="saveNewItem()" class="newItem"> + </div>
      <div onclick="deleteItem()" class="deleteItem"> - </div>`;
  event.target.parentNode.appendChild(div);
};

const saveNewItem = () => {
  const parentNode = event.target.parentNode;
  const id = document.getElementById('details').querySelector('h2').id;
  const title = document.getElementById('details').querySelector('h2').innerText;
  const item = parentNode.querySelector('textarea').value;
  const statusCode = parentNode.querySelector('input').checked;
  const postBody = JSON.stringify({ title, task: { item, statusCode }, id });
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/saveItem');
  xhr.send(postBody);
  parentNode.parentNode.lastChild.remove();
  // document.getElementById('content').innerHTML = ''
};

const deleteItem = () => {
  const titleId = document.getElementById('details').querySelector('h2').id;
  const itemId = event.target.parentNode.id;
  const postBody = JSON.stringify({ titleId, itemId });
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/deleteItem');
  xhr.send(postBody);
  event.target.parentNode.remove();
};

const saveTitle = () => {
  const parentNode = event.target.parentNode;
  const title = parentNode.querySelector('input').value;
  const xhr = new XMLHttpRequest();
  const postBody = JSON.stringify({ title });
  xhr.open('POST', '/saveTitle');
  xhr.send(postBody);

  document.getElementById('tasks').innerHTML =
    `<label> TITLE</label> <br>
    <input type="text" name="title" id="title" required></input>
    <button onclick="saveTitle()">DONE</button>`;
  displayTodoList();
};

const createTodoTemplate = (todo) => {
  let todoTemplate = `<div id="details">
  <h2 id="${todo.id}">${todo.title}<h2>
  <button onclick="addNewItem()">Add New Item</button>`;

  todo.tasks.forEach(task => {
    const { id, statusCode, item } = task;
    if (statusCode) {
      todoTemplate += `<li id='${id}'>
                        <input type="checkBox" onclick="toggleStatus()" checked>
                        ${item}
                        <div onclick="deleteItem()" class="deleteItem" style='display: flex; justify-content: space-evenly' > - </div>
                      </li>`
    }
    else todoTemplate += `<li id='${id}'>
                            <input type="checkBox" onclick="toggleStatus()"> 
                            ${item}
                            <div onclick="deleteItem()" class="deleteItem" style='display: flex; justify-content: space-evenly' > - </div>
                          </li>`;
  });
  return todoTemplate;
};

const displayTodo = () => {
  const id = event.target.id;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const content = JSON.parse(xhr.responseText);
    const userData = content.userName;
    const todo = userData.find(data => {
      return data.id === id;
    });
    const todoTemplate = createTodoTemplate(todo);
    document.getElementById('content').innerHTML = todoTemplate;
  };
  xhr.open('GET', '/todoList.json');
  xhr.send();
};

const displayTodoList = () => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      const content = JSON.parse(xhr.responseText);
      const userData = content.userName;
      let html = '<h3> &nbsp  &nbsp TODO LIST\'s</h3>'
      userData.forEach(data => {
        html += `<li id='${data.id}' onclick="displayTodo()">${data.title}</li>`;
      });
      document.getElementById('todoList').innerHTML = html;
    };
  };
  xhr.open('GET', '/todoList.json');
  xhr.send();
};

document.onload = displayTodoList();