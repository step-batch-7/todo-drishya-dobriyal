const toggleStatus = () => {
  const newStatus = event.target.checked;
  const titleId = document.getElementById('details').querySelector('h2').id;
  const itemId = event.target.parentNode.id;
  const postBody = JSON.stringify({ newStatus, titleId, itemId });
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/toggleStatus');
  xhr.send(postBody);
};

const saveNewItem = () => {
  const parentNode = event.target.parentNode;
  const id = document.getElementById('details').querySelector('h2').id;
  const title = document.getElementById('details').querySelector('h2').innerText;
  const item = parentNode.querySelector('textarea').value;
  const statusCode = parentNode.querySelector('input').checked;
  const postBody = JSON.stringify({ title, task: { item, statusCode }, id });
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const todoItem = JSON.parse(xhr.responseText);
    const li = createNewItemTemplate(todoItem);
    document.getElementById('details').querySelectorAll('h2')[1].appendChild(li)
  };
  xhr.open('POST', '/saveItem');
  xhr.send(postBody);
  parentNode.parentNode.lastChild.remove();
};

const addNewItem = () => {
  const div = newItemTemplate();
  event.target.parentNode.appendChild(div);
}

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
      let html = '<h3> &nbsp  &nbsp TODO LIST\'s</h3>';
      userData.forEach(data => {
        html += `<div class = 'titles' id='${data.id}'>
        <div onclick="displayTodo()"  id='${data.id}' >${data.title}</div><div><i class="fa fa-trash-o" aria-hidden="true" id='${data.id}' onclick='deleteTitle()'></i></li></div></div>`;
      });
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
  xhr.onload = () => {
    console.log(xhr.responseText);
  };
  xhr.open('POST', '/deleteTitle');
  xhr.send(postBody);
  document.getElementById(id).remove();
};

document.onload = displayTodoList();