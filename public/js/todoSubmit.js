const addItem = () => {
  const div = document.createElement('div');
  div.classList.add('item');
  div.innerHTML = ` <textarea rows="2" cols="105" type="text" required></textarea>
   <div onclick="deleteItem()" id="deleteItem">-</div>`;
  document.getElementById('tasks').appendChild(div);
};

const addTodo = () => {
  const title = document.getElementById('title').value;

  let items = Array.from(document.querySelectorAll('textarea'));
  items = items.map(item => item.value);
  const xhr = new XMLHttpRequest();
  const postBody = `title=${title}&todoItems=${items.join('\r\n')}`;

  xhr.open('POST', '/saveTodo');
  xhr.send(postBody);

  document.getElementById('tasks').innerHTML = '';
  document.getElementById('title').value = '';
  addItem();
  displayTodo();
};

const deleteItem = () => {
  const itemToDelete = event.target.parentNode;
  itemToDelete.parentNode.removeChild(itemToDelete);
};

const getItemsHtml = items => {
  return items.map(item => {
    return `<li>${++item.id}: ${item.item}  ${item.taskStatus}</li>`;
  }).join('<br>');
};

const getTemplate = list => {
  let items = list.todoItems;
  itemsHtml = getItemsHtml(items);
  return `<div class="template">
  <h2>${list.title}</h2>
  <div>${itemsHtml}</div><br>
  <h3 onclick='editTodo()' class="editTodo">Edit Todo</h3>
  </div>`;
};

const displayTodo = () => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      const content = JSON.parse(xhr.responseText);
      const template = content.map(getTemplate).join('');
      document.getElementById('content').innerHTML = template;
    };
  };
  xhr.open('GET', '/todoList.json');
  xhr.send();
};

document.onload = displayTodo();