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
  const statusCode = document.getElementById('content').querySelector('.newItem input').checked;
  const item = document.getElementById('content').querySelector('.newItem textarea').value;
  const postBody = JSON.stringify({ task: { item, statusCode }, id });
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const todoItem = JSON.parse(xhr.responseText);
    const li = createNewItemTemplate(todoItem);
    document.querySelector(`#${id} #${id}`).appendChild(li);
  };
  xhr.open('POST', '/saveItem');
  xhr.send(postBody);
  document.querySelector('.newItem').remove();
};

const addNewItem = () => {
  const id = event.target.id;
  const div = newItemTemplate(id);
  console.log(div, '===========');
  document.querySelector(`#${id} #${id}`).appendChild(div);
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
  const xhr = new XMLHttpRequest();
  const postBody = JSON.stringify({ title });
  xhr.onload = () => {
    const { title, id, tasks } = JSON.parse(xhr.responseText)
    const li = displayNewTitle(id, title);
    document.getElementById('todoList').appendChild(li);
  };
  xhr.open('POST', '/saveTitle');
  xhr.send(postBody);
  document.getElementById('tasks').innerHTML = showTitleTemplate();
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
      const html = todoListTemplate(userData);
      document.getElementById('todoList').innerHTML = html;
    };
  };
  xhr.open('GET', '/todoList.json');
  xhr.send();
};

const deleteTitle = () => {
  const xhr = new XMLHttpRequest();
  const id = event.target.id;
  postBody = JSON.stringify({ id });
  xhr.open('POST', '/deleteTitle');
  xhr.send(postBody);
  document.querySelector(`#content #${id}`).remove();
  document.querySelector(`#todoList #${id}`).remove();
};

document.onload = displayTodoList();