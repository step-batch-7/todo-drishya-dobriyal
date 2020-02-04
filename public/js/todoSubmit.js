const addItem = () => {
  const div = document.createElement('div');
  div.classList.add('item');
  div.innerHTML = ` <textarea rows="2" cols="105" type="text" required></textarea>
      <div onclick="deleteItem()" id="deleteItem"> - </div>`;
  event.target.parentNode.appendChild(div);
};

const deleteItem = () => {
  const itemToDelete = event.target.parentNode;
  itemToDelete.parentNode.removeChild(itemToDelete);
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
  todo.forEach(({ item }) => {
    todoTemplate += `<li>${item}</li>`;
  });
  todoTemplate += ` <button onclick="editTodo()" id="${id}">EDIT TODO</button>`
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
      titleList = createTodoListTemplate(titleList);
      document.getElementById('todoList').innerHTML = titleList;
    };
  };
  xhr.open('GET', '/todoList.json');
  xhr.send();
};

document.onload = displayTodoList();