const createItemTemplate = ({ id, statusCode, item }, titleId) => {
  statusCode ? (statusCode = 'checked') : (statusCode = '');
  return `<input type="checkBox"  onclick="toggleStatus()" ${statusCode} title="toggle status"></input>
            <input value='${item}' type='text' onchange="changeItem('${id}','${titleId}')"  class="inputTask"></input>
          <div onclick="deleteItem()" class="deleteItem"  id='${id}' title="delete item"> - </div>`;
};

const createTodoTemplate = todo => {
  const { title, id, tasks } = todo;
  let todoTemplate = `<div class='box'>
     <div class='titleHeading'>
     <input value='${title}' type='text' onchange="changeTitle('${id}')"></input>
     <span id='${id}'><i class="fa fa-trash-o" aria-hidden="true" id='${id}' onclick='deleteTitle()' title="delete Title"></i></span>
     </div>
     <div id='${id}' class='details'>`;
  todo.tasks.forEach(task => {
    todoTemplate += `<li id='${task.id}'>${createItemTemplate(task, id)}</li>`;
  });
  todoTemplate += `</div><div  class="addNewItem"><button onclick = "addNewItem()" id='${id}'> Add New Item</button></div></div>`;
  return todoTemplate;
};

const showTitleTemplate = () => {
  return `<label> TITLE</label> <br>
          <input type="text" name="title" class="title" required></input>
          <button onclick="saveTitle()">DONE</button>`;
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
  div.innerHTML = `<input type="checkBox" onclick="toggleStatus()"></input>
      <input class='textarea' type="text" required></input>
      <div onclick="saveNewItem()"  id='${id}' title="save task"> + </div>
      <div onclick="deleteItem()"  id='${id}' title="delete task"> - </div>`;
  return div;
};

const displayNewTitle = (id, title) => {
  const div = document.createElement('div');
  div.setAttribute('id', id);
  div.setAttribute('class', 'titles');
  div.innerHTML = `<div onclick="displayTodo()" id='${id}'>${title}</div>`;
  return div;
};

const todoListTemplate = userData => {
  let html = "<h3> &nbsp  &nbsp TODO LIST's</h3>";

  userData.forEach(data => {
    html += `<div class = 'titles' id='${data.id}'>
             <div onclick="displayTodo()"  id='${data.id}' >${data.title}</div>
          </div>`;
  });
  return html;
};
