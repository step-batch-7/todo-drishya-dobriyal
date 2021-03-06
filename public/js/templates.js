/* eslint-disable max-len */
const createItemTemplate = ({ id, statusCode, item }, titleId) => {
  let isDone;
  statusCode ? (isDone = 'checked') : (isDone = '');
  return `<input class="checkbox" type="checkBox"  onclick="toggleStatus('${titleId}','${id}')" ${isDone} title="toggle status"></input>
            <input value='${item}' type='text' onchange="changeItem('${id}','${titleId}')"  class="inputTask"></input>
          <i class="fa fa-trash-o" aria-hidden="true" onclick="deleteItem('${id}')" title="delete item"></i>`;
};

const createTodoTemplate = todo => {
  const { title, id, tasks } = todo;
  let todoTemplate = `<div class='box'>
      <div class='titleHeading'>
      <input value='${title}' type='text' onchange="changeTitle('${id}')"></input>
      <span id='${id}'><i class="fa fa-trash-o" aria-hidden="true" onclick="deleteTitle('${id}')" title="delete Title"></i></span>
      </div>
      <div id='${id}' class='details'>`;
  tasks.forEach(task => {
    todoTemplate += `<li id='${task.id}'>${createItemTemplate(task, id)}</li>`;
  });
  todoTemplate += `</div><div  class="addNewItem"><button onclick = "addNewItem()" id='${id}'> Add New Item</button></div></div>`;
  return todoTemplate;
};

const createNewItemTemplate = (data, id) => {
  const li = document.createElement('li');
  li.setAttribute('id', data.id);
  li.innerHTML = createItemTemplate(data, id);
  return li;
};

const newItemTemplate = id => {
  const div = document.createElement('div');
  div.classList.add('newItem');
  div.setAttribute('id', id);
  div.innerHTML = `<input class='textarea' type="text" required></input>
      <div onclick="saveNewItem('${id}')" title="save task"> + </div>
      <div onclick="deleteItem('${id}')" title="delete task"> x </div>`;
  return div;
};

const displayNewTitle = (id, title) => {
  const div = document.createElement('div');
  div.setAttribute('id', id);
  div.setAttribute('class', 'titles');
  div.innerHTML = `<div onclick="displayTodo('${id}')">${title}</div>`;
  return div;
};

const todoListTemplate = userData => {
  let html = "<h3> &nbsp  &nbsp TODO LIST's</h3>";

  userData.forEach(data => {
    html += `<div class = 'titles' id='${data.id}'>
             <div onclick="displayTodo('${data.id}')" >${data.title}</div>
          </div>`;
  });
  return html;
};
