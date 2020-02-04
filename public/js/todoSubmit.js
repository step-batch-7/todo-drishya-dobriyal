const addItem = () => {
  const div = document.createElement('div');
  div.classList.add('item');
  div.innerHTML = ` <textarea rows="2" cols="105" type="text"></textarea>
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
};

const deleteItem = () => {
  const itemToDelete = event.target.parentNode;
  itemToDelete.parentNode.removeChild(itemToDelete)
};
