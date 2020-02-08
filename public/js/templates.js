const createItemTemplate = ({ id, statusCode, item }) => {
  statusCode ? statusCode = 'checked' : statusCode = '';
  return `<input type="checkBox" onclick="toggleStatus()" ${statusCode}>${item}</input>
          <div onclick="deleteItem()" class="deleteItem"  id='${id}'> - </div>`;
};

const createTodoTemplate = (todo) => {
  const { title, id, tasks } = todo;
  let todoTemplate =
    `<div id='box'>
     <div id='${id}' class='details'>
     <div class='titleHeading'><h2>${title} </h2>
     <span id='${id}'><i class="fa fa-trash-o" aria-hidden="true" id='${id}' onclick='deleteTitle()'></i></span></div>`

  todo.tasks.forEach(task => {
    todoTemplate += `<li id='id'>${createItemTemplate(task)}</li>`
  });
  todoTemplate += `</div><button onclick = "addNewItem()" id = '${id}' > Add New Item</button></div></div>`
  return todoTemplate;
};

const showTitleTemplate = () => {
  return `<label> TITLE</label> <br>
          <input type="text" name="title" id="title" required></input>
          <button onclick="saveTitle()">DONE</button>`
};

const createNewItemTemplate = (data) => {
  const li = document.createElement('li');
  li.setAttribute('id', data.id);
  li.innerHTML = createItemTemplate(data);
  return li;
};

const newItemTemplate = (id) => {
  const div = document.createElement('div');
  div.classList.add('newItem');
  div.setAttribute('id', id);
  div.innerHTML =
    `<input type="checkBox" onclick="toggleStatus"></input>
      <input id='textarea' type="text" required></input>
      <div onclick="saveNewItem()"  class="newItem" id='${id}'> + </div>
      <div onclick="deleteItem()" class="deleteItem" id='${id}'> - </div>`;
  return div;
};

const displayNewTitle = (id, title) => {
  const div = document.createElement('div');
  div.setAttribute('id', id);
  div.setAttribute('class', 'titles');
  div.innerHTML = `<div onclick="displayTodo()" id='${id}'>${title}</div>`;
  return div;
};

const todoListTemplate = (userData) => {
  let html = '<h3> &nbsp  &nbsp TODO LIST\'s</h3>';

  userData.forEach(data => {
    html += `<div class = 'titles' id='${data.id}'>
             <div onclick="displayTodo()"  id='${data.id}' >${data.title}</div>
          </div>`;
  });
  return html;
};