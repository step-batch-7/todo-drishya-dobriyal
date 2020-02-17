const logout = function() {
  const callback = response => {
    const { location } = JSON.parse(response);
    window.location.href = location;
  };
  sendNewRequest('GET', '/logout', undefined, callback);
};

const toggleStatus = (titleId, itemId) => {
  const postBody = JSON.stringify({ titleId, itemId });
  const callback = () => {};
  sendNewRequest('POST', '/toggleStatus', postBody, callback);
};

const saveNewItem = id => {
  const statusCode = document.querySelector('.newItem input').checked;
  const item = document.querySelector('.newItem .textarea').value;
  const postBody = JSON.stringify({ task: { item, statusCode }, id });
  const callback = item => {
    const todoItem = JSON.parse(item);
    const li = createNewItemTemplate(todoItem, id);
    document.querySelector('.details').appendChild(li);
    document.querySelector('.newItem').remove();
  };
  if (item) {
    sendNewRequest('POST', '/saveItem', postBody, callback);
  }
};

const addNewItem = () => {
  const id = event.target.id;
  const div = newItemTemplate(id);
  document.querySelector(`.details#${id}`).appendChild(div);
  div.firstChild.focus();
};

const deleteItem = itemId => {
  const titleId = event.target.parentNode.parentNode.id;
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
    document.getElementById('title').value = '';
  };
  if (title) {
    sendNewRequest('POST', '/saveTitle', postBody, callback);
  }
};

const displayTodoList = () => {
  const callback = list => {
    const content = JSON.parse(list);
    const userData = content;
    const html = todoListTemplate(userData);
    document.getElementById('todoList').innerHTML = html;
  };
  sendNewRequest('GET', '/todoStore.json', undefined, callback);
};

const deleteTitle = id => {
  const postBody = JSON.stringify({ id });
  const callback = () => {
    document.querySelector('.box').remove();
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

const highlightTitles = function() {
  const todoList = document.getElementById('todoList');

  const previouslySelectedIds = Array.from(
    todoList.querySelectorAll('.selectedTitle')
  ).map(todo => todo.id);
  previouslySelectedIds.forEach(titleId => {
    todoList.querySelector(`#${titleId}`).classList.remove('selectedTitle');
  });

  const todoIds = Array.from(document.getElementsByClassName('details')).map(
    todo => todo.id
  );
  todoIds.forEach(titleId => {
    todoList.querySelector(`#${titleId}`).classList.add('selectedTitle');
  });
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
    highlightTitles();
  };
  sendNewRequest('POST', '/findGivenContent', postBody, callback);
};

const displayTodo = id => {
  const callback = allTodo => {
    const userData = JSON.parse(allTodo);
    const todo = userData.find(data => {
      return data.id === id;
    });
    const todoTemplate = createTodoTemplate(todo);
    document.getElementById('content').innerHTML = todoTemplate;
    highlightTitles();
  };
  sendNewRequest('GET', '/todoStore.json', undefined, callback);
};

const sendNewRequest = function(method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    // eslint-disable-next-line no-magic-numbers
    if (xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.open(method, url);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('Set-Cookie', document.cookie);
  xhr.send(data);
};

window.onload = displayTodoList();
