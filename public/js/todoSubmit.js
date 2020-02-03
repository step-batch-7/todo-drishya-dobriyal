const addItem = () => {
  const textarea = document.createElement('textarea');
  textarea.rows = '2';
  textarea.cols = '105';
  textarea.type = 'text';
  document.getElementById('tasks').appendChild(textarea);
};

const addTodo = () => {
  const title = document.getElementById('title').value;
  let items = Array.from(document.querySelectorAll('textarea'));
  items = items.map(item => item.value);
  const xhr = new XMLHttpRequest();
  const postBody = `title=${title}&todoItems=${items.join('\r\n')}`
  xhr.open('POST', '/saveTodo');
  xhr.send(postBody);
  document.getElementById('tasks').innerHTML = '';
  document.getElementById('title').value = '';
  addItem();
};
