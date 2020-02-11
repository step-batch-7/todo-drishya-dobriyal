const toggleStatus = () => {
  const titleId = event.target.parentNode.parentNode.id;
  const itemId = event.target.parentNode.id;
  const postBody = JSON.stringify({ titleId, itemId });
  const callback = () => {};
  sendNewRequest('POST', '/toggleStatus', postBody, callback);
};

const saveNewItem = () => {
  const id = event.target.parentNode.id;
  const statusCode = document.querySelector('.newItem input').checked;
  const item = document.querySelector('.newItem .textarea').value;
  const postBody = JSON.stringify({ task: { item, statusCode }, id });
  const callback = item => {
    const todoItem = JSON.parse(item);
    const li = createNewItemTemplate(todoItem, id);
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
  const callback = (item, responseText) => {
    item.remove();
  };
  sendNewRequest(
    'POST',
    '/deleteItem',
    postBody,
    callback.bind(null, event.target.parentNode)
  );
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
  const callback = allTodo => {
    const userData = JSON.parse(allTodo);
    const todo = userData.find(data => {
      return data.id === id;
    });
    const todoTemplate = createTodoTemplate(todo);
    document.getElementById('content').innerHTML = todoTemplate;
  };
  sendNewRequest('GET', '/todoList.json', undefined, callback);
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
  const postBody = JSON.stringify({ id });
  const callback = () => {
    document.querySelector(`.box`).remove();
    document.querySelector(`#todoList #${id}`).remove();
  };
  sendNewRequest('POST', '/deleteTitle', postBody, callback);
};

const changeTitle = id => {
  const newTitle = event.target.value;
  const postBody = JSON.stringify({ id, newTitle });
  const callback = () => {
    document.querySelector(`.titles#${id}`).innerText = newTitle;
  };
  sendNewRequest('POST', '/changeTitle', postBody, callback);
};

const changeItem = (itemId, titleId) => {
  const newItem = event.target.value;
  const postBody = JSON.stringify({ titleId, itemId, newItem });
  const callback = () => {};
  sendNewRequest('POST', '/changeItem', postBody, callback);
};

const displayMatch = search => {
  const content = event.target.value;
  const postBody = JSON.stringify({ content, search });
  const callback = searchedTodo => {
    const content = JSON.parse(searchedTodo);
    let allTodo = '';
    content.forEach(todo => {
      allTodo += createTodoTemplate(todo);
    });
    document.getElementById('content').innerHTML = allTodo;
  };
  sendNewRequest('POST', '/findGivenContent', postBody, callback);
};

const sendNewRequest = function(method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.open(method, url);
  xhr.send(data);
};

document.onload = displayTodoList();
