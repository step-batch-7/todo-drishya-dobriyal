const toggleStatus = () => {
  const newStatus = event.target.checked;
  const titleId = event.target.parentNode.parentNode.id;
  const itemId = event.target.parentNode.id;
  const postBody = JSON.stringify({ newStatus, titleId, itemId });
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/toggleStatus');
  xhr.send(postBody);
};

const saveNewItem = () => {
  const id = event.target.parentNode.id;
  const statusCode = document.querySelector('.newItem input').checked;
  const item = document.querySelector('.newItem .textarea').value;
  const postBody = JSON.stringify({ task: { item, statusCode }, id });
  const callback = item => {
    const todoItem = JSON.parse(item);
    const li = createNewItemTemplate(todoItem);
    document.querySelector(`.details`).appendChild(li);
    document.querySelector('.newItem').remove();
  };
  sendNewRequest('POST', '/saveItem', postBody, callback);
};

const addNewItem = () => {
  const id = event.target.id;
  const div = newItemTemplate(id);
  document.querySelector(`.details#${id}`).appendChild(div);
};

const deleteItem = () => {
  const titleId = event.target.parentNode.parentNode.id;
  const itemId = event.target.id;
  const postBody = JSON.stringify({ titleId, itemId });
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/deleteItem');
  xhr.send(postBody);
  event.target.parentNode.remove();
};

const saveTitle = () => {
  const parentNode = event.target.parentNode;
  const title = parentNode.querySelector('input').value;
  const postBody = JSON.stringify({ title });
  const callback = todo => {
    const { title, id, tasks } = JSON.parse(todo);
    const li = displayNewTitle(id, title);
    document.getElementById('todoList').appendChild(li);
    document.getElementById('tasks').innerHTML = showTitleTemplate();
  };
  sendNewRequest('POST', '/saveTitle', postBody, callback);
};

const displayTodo = () => {
  const id = event.target.id;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const content = JSON.parse(xhr.responseText);
    const userData = content;
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
  const callback = list => {
    const content = JSON.parse(list);
    const userData = content;
    const html = todoListTemplate(userData);
    document.getElementById('todoList').innerHTML = html;
  };
  sendNewRequest('GET', '/todoList.json', undefined, callback);
};

const deleteTitle = () => {
  const xhr = new XMLHttpRequest();
  const id = event.target.id;
  postBody = JSON.stringify({ id });
  xhr.open('POST', '/deleteTitle');
  xhr.send(postBody);
  document.querySelector(`.box`).remove();
  document.querySelector(`#todoList #${id}`).remove();
};

const changeTitle = id => {
  const xhr = new XMLHttpRequest();
  const newTitle = event.target.value;
  document.querySelector(`.titles#${id}`).innerText = newTitle;
  const postBody = JSON.stringify({ id, newTitle });
  xhr.open('POST', '/changeTitle');
  xhr.send(postBody);
};

const changeItem = (itemId, titleId) => {
  const xhr = new XMLHttpRequest();
  const newItem = event.target.value;
  const postBody = JSON.stringify({ titleId, itemId, newItem });
  xhr.open('POST', '/changeItem');
  xhr.send(postBody);
};

const displayMatch = search => {
  const xhr = new XMLHttpRequest();
  const content = event.target.value;
  xhr.onload = () => {
    const content = JSON.parse(xhr.responseText);
    let allTodo = '';
    content.forEach(todo => {
      allTodo += createTodoTemplate(todo);
    });
    document.getElementById('content').innerHTML = allTodo;
  };
  xhr.open('POST', '/findGivenContent');
  xhr.send(JSON.stringify({ content, search }));
};

const sendNewRequest = function(method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    callback(xhr.responseText);
  };
  xhr.open(method, url);
  xhr.send(data);
};

document.onload = displayTodoList();
